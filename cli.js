#!/usr/bin/env node

// 第一行必须存在，否则安装后.bin中可执行脚本会报错
'use strict';

const semver = require('semver');

if (!semver.satisfies(process.version, '>= 8.0.0')) {
  console.error(chalk.red('✘ You are running Node ' + process.versions.node + '.\n' + 'The generator will only work with Node v8.0.0 and up!'));
  process.exit(1);
}

require('./program');
