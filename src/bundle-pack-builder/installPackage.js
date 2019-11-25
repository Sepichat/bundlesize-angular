const rimraf = require('rimraf');
const path = require('path');
const mkdir = require('mkdir-promise');
const { exec } = require('child_process');
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
        exec(installCommand, {
                cwd: InstallPackage.getPath(packageName)
            },
            (err, stdout, stderr) => {
                if(err) {
                    console.log(stderr);
                    InstallPackage.cleanUpPostBuild(packageName);
                } else {
                    console.log('Result command: ', stdout);
                    Builder.bundlePackage(packageName, InstallPackage.getPath(packageName));
                }
            }
        );
    },
}

module.exports = InstallPackage;

// InstallPackage.installPackage('mukiyodaplop'); // fail
InstallPackage.installPackage('react'); // OK
