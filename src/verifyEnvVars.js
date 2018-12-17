/**
 * Verifies if the given environment variables are set.
 * @param {string[]} keys the environment variables to verify
 */
function verify(keys) {
    for(var key of keys) {
        if(!process.env[key]) {
            throw Error(key + " environment variable not set!");
        }
    }
};

module.exports = verify;
