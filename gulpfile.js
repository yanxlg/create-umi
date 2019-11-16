const gulp = require('gulp');
const shelljs = require('shelljs');
const pkg = require('./package.json');
const fs = require("fs");
const path = require("path");

const argv = require('minimist')(process.argv.slice(2));

gulp.task(
    'publish',
    gulp.series(done => {
        console.log('publishing');
        // const { version } = pkg;
        // const readMeFile = path.join(__dirname,"README.md");
        // fs.writeFileSync(readMeFile,fs.readFileSync(readMeFile,"utf-8").replace(/(npm-v)[\d\.]+(-blue)/,`$1${version}$2`));

        const npm = argv.tnpm ? 'tnpm' : 'npm';
        const beta = !pkg.version.match(/^\d+\.\d+\.\d+$/);
        let args = [npm, 'publish'];
        if (beta) {
            args = args.concat(['--tag', 'beta']);
        } else if (argv.tag) {
            args = args.concat(['--tag', argv.tag]);
        }
        if (pkg.scripts['pre-publish']) {
            shelljs.exec(`npm run pre-publish`);
        }
        console.log(args.join(' '));
        let ret = shelljs.exec(args.join(' ')).code;
        console.log('published');
        if (!ret) {
            ret = undefined;
        }
        done(ret);
    })
);

gulp.task(
    'pub',
    gulp.series('publish', done => {
        const { version } = pkg;
        shelljs.cd(process.cwd());
        shelljs.exec(`git add -A`);
        shelljs.exec(`git commit -m "update version"`);
        shelljs.exec('git push origin master:master');
        console.log("update version");
        shelljs.exec(`git tag ${version}`);
        shelljs.exec(`git push origin ${version}:${version}`);
        shelljs.exec('git push origin master:master');
        console.log('tagged');
        done();
    })
);