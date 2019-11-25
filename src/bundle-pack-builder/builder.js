const fs = require('fs');
const path = require('path');
const { asyncExec } = require('./utils');

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
    async bundlePackage(packageName, installPath) {
        Builder.prepareRequire(packageName, installPath).split('/').slice(2).join('/');
        const bundleCommand = `npx webpack index=${installPath} --config src/bundle-pack-builder/webpack.config.js`;
        await asyncExec(bundleCommand)
    },
}

module.exports = Builder; 