const Builder = require('../builder') ;
const InstallPackage = require('../installPackage') ;
const rimraf = require('rimraf');
const fs = require('fs');

describe('When preparing the package to be bundled', () => {
    it('should create the file, require the package and return the entrypoint', async () => {
        const entryPoint = Builder.prepareRequire('test', './');
        const expected = 'index.js';
        expect(entryPoint).toBe(expected);
        rimraf(expected, () => {});
    });
});

describe('When bundling the package', () => {
    it('should return the stats', async () => {
        const packageName = './utils';
        const path = await InstallPackage.prepareWorkspace(packageName);
        fs.copyFileSync('utils.js', `${path}/utils.js`);
        fs.copyFileSync('spec/fakePackage.json', `${path}/package.json`);
        const stats = await Builder.bundlePackage(packageName, path);
        const result = stats.toJson({
            assets: true,
            modules: false,
            source: false,
            providedExports: false,
            chunks: false,
        });
        const expectedSize = 1087;
        expect(result.assets[0].size).toBe(expectedSize);
    });
});
