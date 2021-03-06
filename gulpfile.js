const { series, src, dest, watch } = require ('gulp');
const chalk = require('chalk');
const del = require('del');
const exec = require('child_process').exec;
const keywords = chalk.magentaBright;
const path = require('path');
const tscConfig = require('./tsconfig.json');
const webPackConfig = require('./webpack.config');
const pkg = require('./package.json');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const PATHS = {
    BUNDLE: {
        OUTDIR: path.basename(webPackConfig.output.path)
    },
    COMPILE: {
        OUTDIR: tscConfig.compilerOptions.outDir
    }
}

const _copy = () => {
    return src(['src/shebang.js'])
    .pipe(dest(PATHS.BUNDLE.OUTDIR))
}
_copy.description = `Copies any neccessary auxillary files to "${keywords(PATHS.BUNDLE.OUTDIR)}".`
exports.copy = _copy;

const _clean = () => {
    return del([PATHS.COMPILE.OUTDIR, PATHS.BUNDLE.OUTDIR])
}
_clean.description = `Cleans the output directories "${keywords(PATHS.BUNDLE.OUTDIR)}" & "${keywords(PATHS.COMPILE.OUTDIR)}."`
exports.clean = _clean;

const _compile = () => {
    return exec(`tsc`, (err, stdout, stdin) => {
        if(err) { console.error(err); } 
        else { console.log(stdout) }        
    })
}   
_compile.description = `Runs the ${keywords("TypeScript")} compiler against the project and outputs to "${keywords(PATHS.COMPILE.OUTDIR)}.".`;
exports.compile = _compile;

const _bundle = () => {
    return exec(`webpack-cli`, (err, stdout, stdin) => {
        if (err) { console.error(err); }
        else { console.log(stdout) }
    });
}
_bundle.description = `Runs the ${keywords("WebPack")} bundler against the project and outputs to "${keywords(PATHS.BUNDLE.OUTDIR)}".`
exports.bundle = _bundle;

const _build = series([_clean, _copy, _compile, _bundle]);
_build.description = `Builds the entire project.`
exports.build = _build;

const _watch = () => {
    return watch(['src/**/*.*'], _build)
}
_watch.description = `Watches over files and runs ${keywords("build")} when they change.`
exports.watch = _watch;

const _publish = () => {
    return exec(`npm version patch`, (err, stdout, stdin) => {
        if (err) { console.error(err); return; }
        else { 
            console.log(stdout);
        }

        return readline.question(`Please enter your one time passcode:`, (otp) => {
            return exec(`npm publish --otp ${otp}`, (err, stdout, stderr) => {
                if (err) { console.error(err); }
                else { console.log(stdout); }
            });
        })
    });
}
_publish.description = `Rev's the version patch level, and publishes the package to the NPM repository.`
exports.publish = _publish;

const _uninstall = (done) => {
    return exec(`npm uninstall -g ${pkg.name}`, (err, stdout, stdin) => {
        if (err) { console.error(err); }
        else { console.log(stdout) }
    });
}
exports.uninstall = _uninstall;