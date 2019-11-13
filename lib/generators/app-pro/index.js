const BasicGenerator = require('create-umi/lib/generators/app/index');
const umi = require('create-umi');
const fs = require('fs-extra');
const sortPackage = require('sort-package-json');
const path = require('path');
const chalk = require('chalk');
const prettier = require('prettier');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const extend = require('extend2');


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

function isJsFile(f) {
    return f.endsWith('.js') || f.endsWith('.jsx');
    // return f.endsWith('.js') || f.endsWith('.jsx') || !!/(tsconfig\.json|tslint\.yml)/g.test(f);
}

function isTsFile(f) {
    return f.endsWith('.ts') || f.endsWith('.tsx') || !!/(tsconfig\.json|tslint\.yml|typings\.d\.ts)/g.test(f);
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
                    message: `Do you want to use typescript？ ${chalk.blue('default:N')}`,
                    default: false,
                },
                {
                    name: 'reactFeatures',
                    message: 'What functionality do you want to enable?',
                    type: 'checkbox',
                    pageSize: 8,
                    choices: [
                        { name: 'antd', value: 'antd' },
                        { name: 'ant-design-pro', value: 'ant-design-pro' },
                        { name: 'dva', value: 'dva' },
                        { name: 'scope', value: 'scope' },
                        { name: 'locale', value: 'locale' },
                        { name: 'dll', value: 'dll' },
                        { name: 'code splitting', value: 'dynamicImport' },
                        { name: 'internationalization', value: 'locale' },
                    ],
                }, {
                    name: 'proxy',
                    message: `Which proxy url you want to rewrite？ ${chalk.blue('default:none')}`,
                    type: 'input',
                }, {
                    name: 'ssr',
                    message: `Do you want to use ssr render？ ${chalk.blue('default:N')}`,
                    type: 'confirm',
                    default: false,
                },
            ];
            return this.prompt(prompts).then(props => {
                this.prompts = props;
            });
        }
    }

    async writing() {
        const projectName = this.opts.name || this.opts.env.cwd;
        const projectPath = path.resolve(projectName);
        // create-umi generator
        await umi.run(Object.assign({}, this.opts, {
            args: Object.assign({}, this.opts.args, this.prompts),
        }, { type: 'app' }));


        const {isTypeScript,reactFeatures,ssr} = this.prompts;

        console.log(chalk.blue("生成umi配置文件..."));
        const configPath = path.resolve(projectPath, `config/config.${isTypeScript?"ts":"js"}`);
        const configTemplate = path.resolve(__dirname, `template/config/config.${isTypeScript ? 'ts' : 'js'}`);
        fs.removeSync(path.resolve(projectPath, `.umirc.${isTypeScript?"ts":"js"}`));
        fs.removeSync(configPath);


        // 需要waiting生成
        this.fs.copyTpl(
            configTemplate,
            path.resolve(projectPath, `${ssr?"app/web/":""}config/config.${isTypeScript?"ts":"js"}`),
            Object.assign({
                name: this.name,
                ...this.prompts,
            })
        );

        console.log(chalk.blue("Clean Up..."));
        ['.eslintrc', '.prettierrc'].map((fileName) => {
            const webProjFilePath = path.resolve(projectPath, fileName);
            if (fs.existsSync(webProjFilePath)) {
                fs.removeSync(webProjFilePath);
            }
        });
        fs.copySync(path.resolve(__dirname, 'copy'), path.resolve(projectPath, ''), {
            filter: (src, dest) => {
                if(/service-worker\.js/.test(src)) return true;
                // serviceworker.js放过
                if (isTypeScript) {
                    if (isJsFile(src)) return false;
                } else {
                    if (isTsFile(src)||/enumes|interface/.test(src)) return false;
                }
                return true;
            },
        });

        console.log(chalk.blue("生成package.json..."));

        const packageJsonPath = path.resolve(projectPath, 'package.json');
        const pkg = require(packageJsonPath);
        // web package.json template
        const webPkgJson = require("./template/package.json");
        let projectPkg = {
            name: this.name,
            ...pkg,
            scripts:webPkgJson.scripts,
            dependencies: {
                ...pkg.dependencies,
            },
            devDependencies: {
                ...pkg.dependencies,
                '@types/react': '^16.8.6',
                '@types/react-dom': '^16.9.4',
                'umi': '^2.11.3',
                'umi-plugin-react': '^1.8.0',
                'umi-types': '^0.2.0',
                '@typescript-eslint/eslint-plugin': '^1.11.0',
                '@typescript-eslint/parser': '^1.11.0',
                '@types/node': '^12.0.12',
                'babel-eslint': '^9.0.0',
            },
        };
        if (reactFeatures.includes('ant-design-pro')) {
            projectPkg.dependencies['@ant-design/pro-layout'] = '^4.5.16';
        }


        if (ssr) {// ssr
            ['.eslintrc', '.prettierrc', '.editorconfig', '.env', '.gitignore', '.prettierignore', 'package.json', 'tsconfig.json', 'tslint.yml', 'typings.d.ts'].map((fileName) => {
                const webProjFilePath = path.resolve(projectPath,fileName);
                if (fs.existsSync(webProjFilePath)) {
                    fs.removeSync(webProjFilePath);
                }
            });
            // rewrite umijs
            const dirName = isTypeScript ? 'typescript' : 'javascript';
            fs.removeSync(path.resolve(__dirname, '.ssr'));
            fs.moveSync(path.resolve(projectPath, ''), path.resolve(__dirname, '.ssr'));
            fs.copySync(path.resolve(__dirname, `ssr/${dirName}`), path.resolve(projectPath, ''));
            fs.copySync(path.resolve(__dirname, '.ssr'), path.resolve(projectPath, 'app/web'));
            const _pkg = require(`./ssr/${dirName}/package.json`);
            let result = extend(true, {}, _pkg, projectPkg);
            result.scripts = _pkg.scripts;
            projectPkg=result;
        }

        fs.writeFileSync(
            path.resolve(projectPath, 'package.json'),
            prettier.format(JSON.stringify(sortPackage(projectPkg)), {
                parser: 'json',
            }),
        );

        fs.copySync(path.resolve(__dirname, 'config'), path.resolve(projectPath, ''));

        // clean
        fs.removeSync(path.resolve(__dirname, '.ssr'));
        fs.removeSync(path.resolve(__dirname, '.template'));


        // install
        /*    const useYarn = shouldUseYarn();
            await install(
              projectPath,
              useYarn,
              false,
            );*/
    }
}

module.exports = AntDesignProGenerator;
