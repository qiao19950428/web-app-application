const entryBuild = require('../entry/entry');

const entry = {};
entryBuild.map((data) => {
    entry[data.name] = [ `./entryBuild/${data.name}.js`, data.name, data.title ];
});
module.exports = entry;
