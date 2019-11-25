const rimraf = require('rimraf');
const path = require('path')
const mkdir = require('mkdir-promise')
const {workspacePath} = require('./config');

const InstallPackage = {
    cleanUpPostBuild(packageName) {
        const installPath = path.join(workspacePath, packageName);
        rimraf(installPath, () => {});
    },

    async prepareWorkspace(packageName) {
        const installPath = path.join(workspacePath, packageName);
        await mkdir(installPath);
        console.log('workspace created')
    }
}

module.export = InstallPackage;

InstallPackage.prepareWorkspace('test');
InstallPackage.cleanUpPostBuild('test')