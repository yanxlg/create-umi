const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const clipboardy = require('clipboardy');

const umi = require("create-umi");

// 获取模块所在地址
const umi_generators = fs
  .readdirSync(path.join(require.resolve(`create-umi`),"../lib/generators"))
  .filter(f => !f.startsWith('.'))
  .map(f => {
    return {
      name: `${f.padEnd(15)} - ${chalk.gray(require(`create-umi/lib/generators/${f}/meta.json`).description)}`,
      value: f,
      short: f,
    };
  });

const generators = fs
  .readdirSync(`${__dirname}/generators`)
  .filter(f => !f.startsWith('.'))
  .map(f => {
    return {
      name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
      value: f,
      short: f,
    };
  });

const runGenerator = async (generatorPath, { name = '', cwd = process.cwd(), args = {} }) => {
  return new Promise(resolve => {
    if (name) {
      mkdirp.sync(name);
      cwd = path.join(cwd, name);
    }

    const Generator = require(generatorPath);
    const generator = new Generator({
      name,
      env: {
        cwd,
      },
      resolved: require.resolve(generatorPath),
      args,
    });

    return generator.run(() => {
      if (name) {
        if (process.platform !== `linux` || process.env.DISPLAY) {
          clipboardy.writeSync(`cd ${name}`);
          console.log('📋 Copied to clipboard, just use Ctrl+V');
        }
      }
      console.log('✨ File Generate Done');
      resolve(true);
    });
  });
};

const run = async config => {
  process.send && process.send({ type: 'prompt' });
  process.emit('message', { type: 'prompt' });

  let { type } = config;
  if (!type) {
    const answers = await inquirer.prompt([
      {
        name: 'type',
        message: 'Select the boilerplate type',
        type: 'list',
        choices: generators.concat(umi_generators),
      },
    ]);
    type = answers.type;
  }

  // 文件夹判断
  if(fs.existsSync(config.name)&&fs.readdirSync(config.name).length>0){
    // 文件夹已存在并存在文件
    console.error(chalk.yellowBright(`warning：`), "destination path 'a1' already exists and is not an empty directory");
    const clean = await inquirer.prompt([
      {
        name: 'type',
        message: `Do you want to empty the directory？${chalk.blue('default:N')}`,
        type: 'confirm',
        default:false
      },
    ]);
    if(clean.type){
      require("fs-extra").emptyDirSync(config.name);
    }else{
      process.exit(1);
    }
  }

  try {
    // 判断是扩展还是默认
    if(generators.find(item=>item.value===type)){
      return runGenerator(`./generators/${type}`, config);
    }
    return umi.run(Object.assign({},config,{type:type}));
  } catch(e) {
    console.error(chalk.red(`> Generate failed`), e);
    process.exit(1);
  }
};

module.exports = run;
