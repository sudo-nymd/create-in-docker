const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    externals: [nodeExternals()], // removes node_modules from your final bundle
    entry: {
        "index": "./build/index.js",
        "mongodb": "./build/mongodb/index.js"
    }, // make sure this matches the main root of your code 
    output: {
        path: path.join(__dirname, 'bin'), // this can be any path and directory you want
        filename: '[name].js',
    },
    optimization: {
        minimize: false, // enabling this reduces file size and readability
    },
};