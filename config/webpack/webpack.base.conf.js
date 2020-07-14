// webpack entry及resolve
const entry = require('./webpack.entry.conf');

const newEntry = {};
for (const name in entry) {
    newEntry[name] = entry[name][0];
}
const config = {
    entry: newEntry,
    resolve: {
        extensions: [ '.js', '.json', '.jsx', '.css', '.less' ],
    }
};
module.exports = config;
