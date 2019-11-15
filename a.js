const fs = require("fs");
const path = require("path");
const pkg = require('./package.json');
const { version } = pkg;
const readMeFile = path.join(__dirname,"README.md");
fs.writeFileSync(readMeFile,fs.readFileSync(readMeFile,"utf-8").replace(/(npm-v)[\d\.]+(-blue)/,`$1${version}$2`));