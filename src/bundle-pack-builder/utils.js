const { exec } = require('child_process');

function asyncExec(command, options = {}) {
    return new Promise((resolve, reject) => {
        exec(command, options, (err, stdout, stderr) => {
            if (err) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        })
    });
}

module.exports = {
    asyncExec
}