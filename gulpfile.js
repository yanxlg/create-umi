const gulp = require('gulp');
const shelljs = require('shelljs');
const pkg = require('./package.json');

const argv = require('minimist')(process.argv.slice(2));

gulp.task(
    'publish',
    gulp.series(done => {
        console.log('publishing');
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
        shelljs.exec(`git tag ${version}`);
        shelljs.exec(`git push origin ${version}:${version}`);
        shelljs.exec('git push origin master:master');
        console.log('tagged');
        done();
    })
);