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
        return installPath;
    },

    async installPackage(packageName) {
        const bundles = {}
        const listToInstall = await InstallPackage.getVersionsToCompare(packageName);
        for(const version of listToInstall) {
            const path = await InstallPackage.prepareWorkspace(`${packageName}@${version}`);
            const installCommand = `npm install ${packageName}@${version}`;
            try {
                asyncExec(installCommand, {cwd: path});
            } catch (err) {
                console.log('Error status: ', err);
                console.log('Starting cleanup');
                InstallPackage.cleanUpPostBuild(packageName);
            }
            const stats =  await Builder.bundlePackage(packageName, path);
            bundles[version] = stats;
        }
        return bundles;

    },

    async getVersionsToCompare(packageName) {
        const command = `npm view ${packageName} versions --json`;
        try {
            const listVersionsString = await asyncExec(command);
            const listVersions = JSON.parse(listVersionsString);
            const latestVersion = listVersions[listVersions.length - 1];
            const latestMajor = Number(latestVersion.split('.')[0]);
            const latestMinor = Number(latestVersion.split('.')[1]);
            const previousMajors = listVersions.filter((version) => {
                return Number(version.split('.')[0]) === (latestMajor - 1);
            });
            const previousMajor = previousMajors.pop();
            const lastMinors = listVersions.filter((version) => {
                return (
                    Number(version.split('.')[0]) === (latestMajor) &&
                    Number(version.split('.')[1]) === (latestMinor - 1)
                );
            });
            const lastMinor = lastMinors.pop();
            const nextToLastMinors = listVersions.filter((version) => {
                return (
                    Number(version.split('.')[0]) === (latestMajor) &&
                    Number(version.split('.')[1]) === (latestMinor - 2)
                );
            });
            const nextToLastMinor = nextToLastMinors.pop();
            return  [latestVersion, lastMinor, nextToLastMinor, previousMajor];
        } catch (err) {
            console.log('Error retrieving package versions: ', err);
        }
    },



    async getBundleSize(packageName) {
        const data = [];
        const statsList = await InstallPackage.installPackage(packageName);
        for(const version in statsList) {
            const result = statsList[version].toJson({
                assets: true,
                modules: false,
                source: false,
                providedExports: false,
                chunks: false,
            });
            const mainAsset = result.assets.find((asset) => asset.name === 'main.js');
            data.push({
                name: packageName,
                version: version,
                size: mainAsset.size,
                gzippedSize: mainAsset.size / 10,
                asset: mainAsset
            });

        }
        return {
            name: packageName,
            listPackages: data
        };
    },
}

module.exports = InstallPackage;

// InstallPackage.installPackage('mukiyodaplop'); // fail
InstallPackage.getBundleSize('react'); // OK
