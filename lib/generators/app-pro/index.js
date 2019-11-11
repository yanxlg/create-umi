const BasicGenerator = require('create-umi/lib/generators/app/index');
const umi = require('create-umi');
const fs = require('fs-extra');
const sortPackage = require('sort-package-json');
const path = require('path');
const chalk = require('chalk');
const prettier = require('prettier');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');

function log(...args) {
  console.log(`${chalk.gray('>')}`, ...args);
}

function install(root, useYarn, usePnp) {
  return new Promise((resolve, reject) => {
    let command;
    let args;
    if (useYarn) {
      command = 'yarn';
      args = ['install', '--exact'];
      args.push('--cwd');
      args.push(root);
    } else {
      command = 'npm';
      args = [
        'install',
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
      ];
    }
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

class AntDesignProGenerator extends BasicGenerator {
  prompting() {
    if (this.opts.args && 'isTypeScript' in this.opts.args && 'reactFeatures' in this.opts.args) {
      this.prompts = {
        isTypeScript: this.opts.args.isTypeScript,
        reactFeatures: this.opts.args.reactFeatures,
      };
    } else {
      const prompts = [
        {
          name: 'isTypeScript',
          type: 'confirm',
          message: 'Do you want to use typescript?',
          default: false,
        },
        {
          name: 'reactFeatures',
          message: 'What functionality do you want to enable?',
          type: 'checkbox',
          choices: [
            { name: 'ant-design-pro', value: 'ant-design-pro' },
            { name: 'locale', value: 'locale' },
            { name: 'antd', value: 'antd' },
            { name: 'dva', value: 'dva' },
            { name: 'code splitting', value: 'dynamicImport' },
            { name: 'dll', value: 'dll' },
            { name: 'internationalization', value: 'locale' },
          ],
        },
      ];
      return this.prompt(prompts).then(props => {
        this.prompts = props;
      });
    }
  }

  async writing() {
    await umi.run(Object.assign({}, this.opts, {
      args: Object.assign({}, this.opts.args, this.prompts),
    }, { type: 'app' }));
    const projectName = this.opts.name || this.opts.env.cwd;
    const projectPath = path.resolve(projectName);

    log('Clean Up...');
    // clear
    if (this.prompts.reactFeatures.includes('ant-design-pro')) {
      const packageJsonPath = path.resolve(projectPath, 'package.json');
      const pkg = require(packageJsonPath);
      const projectPkg = {
        ...pkg,
        dependencies: {
          ...pkg.dependencies,
          '@ant-design/pro-layout': '^4.5.16',
        },
        devDependencies: {
          ...pkg.dependencies,
          '@types/react': '^16.8.6',
          '@types/react-dom': '^16.9.4',
          'slash2':"^2.0.0",
          'umi':"^2.11.3",
          "umi-plugin-react": "^1.8.0",
          "umi-types": "^0.2.0",
          "@typescript-eslint/eslint-plugin": "^1.11.0",
          "@typescript-eslint/parser": "^1.11.0",
          "@types/node": "^12.0.12",
          "babel-eslint": "^9.0.0",

        },
      };
      // 添加ant-design-pro 依赖
      fs.writeFileSync(
        path.resolve(projectPath, 'package.json'),
        // 删除一个包之后 json会多了一些空行。sortPackage 可以删除掉并且排序
        // prettier 会容忍一个空行
        prettier.format(JSON.stringify(sortPackage(projectPkg)), {
          parser: 'json',
        }),
      );
    }

    fs.copySync(path.resolve(__dirname, 'copy'), path.resolve(projectPath, ''));
    fs.copySync(path.resolve(__dirname, this.prompts.isTypeScript?'typescript':"javascript"), path.resolve(projectPath, ''));

    fs.writeFileSync(path.resolve(projectPath, this.prompts.isTypeScript?'.umirc.ts':'.umirc.js'),
      fs.readFileSync(path.resolve(projectPath, this.prompts.isTypeScript?'.umirc.ts':'.umirc.js'),'utf-8')
        .replace("\"<%= dva%>\"",this.prompts.reactFeatures.includes("dva"))
        .replace("\"<%= locale%>\"",this.prompts.reactFeatures.includes("locale"))
        .replace("\"<%= dll%>\"",this.prompts.reactFeatures.includes("dll"))
        .replace("\"<%= title%>\"","\""+(this.opts.args.title||this.opts.name)+"\""));

     if(this.prompts.isTypeScript){
        // d.ts 修改
      fs.writeFileSync(path.resolve(projectPath, 'typings.d.ts'),
        fs.readFileSync(path.resolve(projectPath, 'typings.d.ts'),'utf-8')+
        "\ndeclare module 'slash2';\ndeclare const __IS_BROWSER:'true'|'false'|undefined;");
    }


    // install
    const useYarn = shouldUseYarn();
    install(
      projectPath,
      useYarn,
      false,
    ).then(() => ({
    }));

  }
}

module.exports = AntDesignProGenerator;
