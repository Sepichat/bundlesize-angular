const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const Builder = {
    prepareRequire(packageName, installPath) {
        const content = `const ${packageName} = require('${packageName}');`;
        const entryPoint = path.join(installPath, 'index.js');
        try {
            fs.writeFileSync(entryPoint, content, 'utf-8')
            return entryPoint
        } catch (err) {
            console.log(err)
        }
    },
    bundlePackage(packageName, installPath) {
        Builder.prepareRequire(packageName, installPath).split('/').slice(2).join('/');
        const bundleCommand = `npx webpack index=${installPath} --config src/bundle-pack-builder/webpack.config.js`;
        exec(bundleCommand, {}, (err, stdout, stderr) => {
            if (err) {
                console.log('Failure: ', stderr);
            } else {
                console.log('Success: ', stdout);
            }
        })
    },
}

module.exports = Builder; 