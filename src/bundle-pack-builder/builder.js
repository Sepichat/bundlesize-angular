const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const prepareWebpackConfig = require('./webpack.config');

const Builder = {
    prepareRequire(packageName, installPath) {
        const content = `const package = require('${packageName}');`;
        const entryPoint = path.join(installPath, 'index.js');
        try {
            fs.writeFileSync(entryPoint, content, 'utf-8')
            return entryPoint
        } catch (err) {
            console.log(err)
        }
    },
    bundlePackage(packageName, installPath) {
        const entryPoint = Builder.prepareRequire(packageName, installPath);
        const webpackCompiler = webpack(prepareWebpackConfig(entryPoint))
        return new Promise((resolve, reject) => {
            webpackCompiler.run((err, stats) => {
                resolve(stats);
            });
        })
    },
}

module.exports = Builder; 