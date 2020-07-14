const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const webpackFile = require('./webpack.file.conf');
const entryBuild = require('../entry/entry');
/* 删除开发目录 */
rimraf.sync(webpackFile.devDirectory);

/* 创建开发目录 */
fs.mkdirSync(`${webpackFile.devDirectory}`);
/* 生成HTML */
let htmlCont = fs.readFileSync('index.html', 'utf-8');
const scriptInsert = `  <script type='text/javascript' src='../js/manifest.js'></script>
    <script type='text/javascript' src='../js/vendor.js'></script>
    <script type='text/javascript' src='../js/common.js'></script>
    <script type='text/javascript' src='../js/key.js'></script>
`;
htmlCont = htmlCont.replace('</body>', `${scriptInsert}</body>`);
entryBuild.map((data) => {
    const {
        name, title, type
    } = data;
    fs.writeFile(`${webpackFile.devDirectory}/${name}.html`,
        htmlCont.replace('js/key.js', `../js/${name}.js`)
            .replace('<%= htmlWebpackPlugin.options.title %>', title)
            .replace('<%= htmlWebpackPlugin.options.type %>', type),
        'utf8',
        (err) => {
            if (err) {
                return console.log(err);
            }
        });
});
