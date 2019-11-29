const rimraf = require('rimraf');
const path = require('path');
const mkdir = require('mkdir-promise');
const gzipSize = require('gzip-size');
const fs = require('fs');
const { asyncExec } = require('./utils');
const { workspacePath } = require('./config');
const Builder = require('./builder');

const InstallPackage = {
    getPath(packageName) {
        return path.join(workspacePath, packageName);
    },

    cleanUpPostBuild(packageName, version) {
        const installPath = path.join(
            `${InstallPackage.getPath(packageName)}@${version}`
        );
        const assetPath = path.join(
            process.cwd(),
            'src',
            'bundle-pack-builder',
            'dist',
            '*'
        );
        rimraf(assetPath, () => {});
        rimraf(installPath, () => {});
    },

    async prepareWorkspace(packageName) {
        const installPath = InstallPackage.getPath(packageName);
        await mkdir(installPath);
        return installPath;
    },

    async installPackage(packageName) {
        const bundles = {};
        const listToInstall = await InstallPackage.getVersionsToCompare(packageName);
        for(const version of listToInstall) {
            let stats = await InstallPackage.build(packageName, version);
            const errorObject = stats.toJson('errors-only');
            const missingModules = InstallPackage.parseErrors(errorObject, packageName);
            if (missingModules.length) {
                stats = await InstallPackage.build(packageName, version, missingModules);
            }
            const gzippedSize = InstallPackage.getGzippedSize();
            bundles[version] = {stats, gzippedSize};
            InstallPackage.cleanUpPostBuild(packageName, version);
        }
        return bundles;
    },

    async build(packageName, version, missingModules = []) {
        const path = await InstallPackage.prepareWorkspace(`${packageName}@${version}`);
        const installCommand = `npm install ${packageName}@${version}`;
        try {
            await asyncExec(installCommand, {cwd: path});
        } catch (err) {
            console.log('Error status: ', err);
            console.log('Starting cleanup');
            InstallPackage.cleanUpPostBuild(packageName, version);
        }
        const stats =  await Builder.bundlePackage(packageName, path, missingModules);
        return stats;
    },

    parseErrors(errorObject) {
        const missingModules = [];
        const regex = /Can't resolve '([\S]*?)'/
        errorObject.errors.forEach(error => {
            const missingModule = error.match(regex)[1];
                missingModules.push(missingModule)
        });
        return missingModules;
    },

    getGzippedSize() {
        const assetPath = path.join(
            process.cwd(),
            'src',
            'bundle-pack-builder',
            'dist',
            'main.js'
        );
        if (fs.existsSync(assetPath)) {
            const data = fs.readFileSync(assetPath);
            return gzipSize.sync(data);
        }
        return null;
    },

    getMinorVersions (listVersions, latestMajor, latestMinor, offset = 1) {
        return listVersions.filter((version) => {
            return (
                Number(version.split('.')[0]) === (latestMajor) &&
                Number(version.split('.')[1]) === (latestMinor - offset)
            );
        });
    },

    async getVersionsToCompare(packageName) {
        const command = `npm view ${packageName} versions --json`;
        try {
            let missingVersion = false;
            const listVersionsString = await asyncExec(command);
            const listVersions = JSON.parse(listVersionsString);
            switch (listVersions.length) {
                case 1:
                case 2:
                case 3:
                case 4:
                    return listVersions;
                default:
                    const latestVersion = listVersions[listVersions.length - 1];
                    const latestMajor = Number(latestVersion.split('.')[0]);
                    const latestMinor = Number(latestVersion.split('.')[1]);
                    const previousMajors = listVersions.filter((version) => {
                        return Number(version.split('.')[0]) === (latestMajor - 1);
                    });
                    const previousMajor = previousMajors.pop();
                    let lastMinors = this.getMinorVersions(listVersions, latestMajor, latestMinor);
                    let lastMinor;
                    if (!lastMinors.length) {
                        lastMinors = this.getMinorVersions(listVersions,
                            Number(previousMajor.split('.')[0]),
                            Number(previousMajor.split('.')[1])
                        );
                        missingVersion = true;
                    }
                    lastMinor = lastMinors.pop();
                    let nextToLastMinors = listVersions.filter((version) => {
                        return (
                            Number(version.split('.')[0]) === (latestMajor) &&
                            Number(version.split('.')[1]) === (latestMinor - 2)
                        );
                    });
                    if (!nextToLastMinors.length) {
                        nextToLastMinors = this.getMinorVersions(listVersions,
                            Number(previousMajor.split('.')[0]),
                            Number(previousMajor.split('.')[1]),
                            2
                            );
                            if (!nextToLastMinors.length) {
                            nextToLastMinors = listVersions.filter((version) => {
                                return Number(version.split('.')[0]) === (latestMajor - 2);
                            });
                        }
                        missingVersion = true;
                    }
                    nextToLastMinor = nextToLastMinors.pop();
                    if (!missingVersion) {
                        return  [latestVersion, lastMinor, nextToLastMinor, previousMajor];
                    }
                    return  [latestVersion, previousMajor, lastMinor, nextToLastMinor];
            }
        } catch (err) {
            console.log('Error retrieving package versions: ', err);
        }
    },

    async getBundleSize(packageName) {
        const data = [];
        const bundlesData = await InstallPackage.installPackage(packageName);
        for(const version in bundlesData) {
            const bundle = bundlesData[version];
            const result = bundle.stats.toJson({
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
                gzippedSize: bundle.gzippedSize,
                asset: mainAsset
            });
            console.log(mainAsset.size, bundle.gzippedSize);
        }
        return {
            name: packageName,
            listPackages: data
        };
    },
}

module.exports = InstallPackage;
