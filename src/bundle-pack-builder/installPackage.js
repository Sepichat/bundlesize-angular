const rimraf = require('rimraf');
const path = require('path');
const mkdir = require('mkdir-promise');
const { asyncExec } = require('./utils');
const { workspacePath } = require('./config');
const Builder = require('./builder');

const InstallPackage = {
    getPath(packageName) {
        return path.join(workspacePath, packageName);
    },

    cleanUpPostBuild(packageName) {
        const installPath = InstallPackage.getPath(packageName);
        rimraf(installPath, () => {});
    },

    async prepareWorkspace(packageName) {
        const installPath = InstallPackage.getPath(packageName);
        await mkdir(installPath);
        console.log('workspace created');
    },

    async installPackage(packageName) {
        await InstallPackage.prepareWorkspace(packageName);
        const installCommand = `npm install ${packageName}`;
        try {
            asyncExec(installCommand, {cwd: InstallPackage.getPath(packageName)});
        } catch (err) {
            console.log('Error status: ', err);
            console.log('Starting cleanup');
            InstallPackage.cleanUpPostBuild(packageName);
        }
        return await Builder.bundlePackage(packageName, InstallPackage.getPath(packageName));
    },

    async getBundleSize(packageName) {
        const stats = await InstallPackage.installPackage(packageName);
        const result = stats.toJson({
            assets: true,
            modules: false,
            source: false,
            providedExports: false,
            chunks: false,
        });
        const mainAsset = result.assets.find((asset) => asset.name === 'main.js');
        return {
            name: packageName,
            size: mainAsset.size,
            gzippedSize: 5125478
        };
    },
}

module.exports = InstallPackage;

// InstallPackage.installPackage('mukiyodaplop'); // fail
InstallPackage.getBundleSize('react'); // OK
