const InstallPackage = require('../installPackage') ;
const fs = require('fs');
const config = require('../config');

describe('When preparing the workspace', () => {
    it('should create the workspace and return the path', async () => {
        const packageName = 'test'
        const path = await InstallPackage.prepareWorkspace(packageName);
        const expected = `${config.workspacePath}/${packageName}`;
        expect(path).toBe(expected);
    });
});
