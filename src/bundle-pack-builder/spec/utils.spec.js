const {asyncExec} = require('../utils') ;

describe('When calling async exec', () => {
    it('should wait until execution is done and return the result', async () => {
        const command = 'node -v';
        const expected = 'v12.13.1';
        const res = await asyncExec(command);
        expect(res.trim()).toBe(expected);
    });
});
