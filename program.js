#!/usr/bin/env node

const yParser = require('yargs-parser');
const semver = require('semver');
const { existsSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');
const run = require('./lib/run');
const commander = require('commander');
const envinfo = require('envinfo');

const debug = existsSync(join(__dirname, '.local')); // determine if it is in the local debug state
const packageJson = require('./package.json');

const args = yParser(process.argv.slice(2));

let projectName;

const program = new commander.Command(packageJson.name)
  .version(`${packageJson.version}\n${debug ? chalk.cyan('@local') : ''}`)
  .arguments('<project-name>')
  .usage(`${chalk.green('<project-name>')} [options]`)
  .action(name => {
    projectName = name;
  })
  .option('--verbose', 'print additional logs')
  .option('--info', 'print environment debug info')
  .option('--type', 'set generator type')
  .option('--title', 'set web title')
  .option(
    '--umi-version <alternative-package>',
    'use a non-standard version of umijs',
  )
  /*  .option(
      '--template <path-to-template>',
      'specify a template for the created project'
    )*/
  .allowUnknownOption()
  .on('--help', () => {
    console.log(`    Only ${chalk.green('<project-name>')} is required.`);
    console.log();
    console.log(
      `    A custom ${chalk.cyan('--umi-version')} can be one of:`,
    );
    console.log(`      - a specific npm version: ${chalk.green('0.8.2')}`);
    console.log(`      - a specific npm tag: ${chalk.green('@next')}`);
    console.log(
      `      - a custom fork published on npm: ${chalk.green(
        'my-umijs',
      )}`,
    );
    console.log(
      `      - a local path relative to the current working directory: ${chalk.green(
        'file:../my-umijs',
      )}`,
    );
    console.log(
      `      - a .tgz archive: ${chalk.green(
        'https://mysite.com/my-umijs-0.8.2.tgz',
      )}`,
    );
    console.log(
      `      - a .tar.gz archive: ${chalk.green(
        'https://mysite.com/my-umijs-0.8.2.tar.gz',
      )}`,
    );
    console.log(
      `    It is not needed unless you specifically want to use a fork.`,
    );
    console.log();
    /*   console.log(`    A custom ${chalk.cyan('--template')} can be one of:`);
       console.log(
         `      - a custom fork published on npm: ${chalk.green(
           'cra-template-typescript'
         )}`
       );
       console.log(
         `      - a local path relative to the current working directory: ${chalk.green(
           'file:../my-custom-template'
         )}`
       );
       console.log(
         `      - a .tgz archive: ${chalk.green(
           'https://mysite.com/my-custom-template-0.8.2.tgz'
         )}`
       );
       console.log(
         `      - a .tar.gz archive: ${chalk.green(
           'https://mysite.com/my-custom-template-0.8.2.tar.gz'
         )}`
       );
       console.log();
       console.log(
         `    If you have any problems, do not hesitate to file an issue:`
       );
       console.log(
         `      ${chalk.cyan(
           'https://github.com/facebook/create-react-app/issues/new'
         )}`
       );
       console.log();*/
  })
  .parse(process.argv);


if (program.info) {
  console.log(chalk.bold('\nEnvironment Info:'));
  return envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
        npmPackages: ['react', 'react-dom', 'umi', 'dva'],
        npmGlobalPackages: ['create-app', 'create-umi'],
      },
      {
        duplicates: true,
        showNotFound: true,
      },
    )
    .then(console.log);
}

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-name>')}`,
  );
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`,
  );
  process.exit(1);
}

if(projectName === "init"){
  // init project by ./app.json


  process.exit(1);
}


// --type type
const name = args._[0] || '';
const { type } = args;
delete args.type;
run({
  name,
  type,
  args,
});
