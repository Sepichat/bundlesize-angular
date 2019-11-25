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
        await Builder.bundlePackage(packageName, InstallPackage.getPath(packageName));
    },

    async getBundleSize(packageName) {
        await InstallPackage.installPackage(packageName);
        return {size: 512123}
    },
}

module.exports = InstallPackage;

// InstallPackage.installPackage('mukiyodaplop'); // fail
InstallPackage.installPackage('react'); // OK
