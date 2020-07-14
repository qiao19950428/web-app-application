// 自动生成src/utils/viewList.js
const fs = require('fs');
const path = require('path');
const entry = require('./entry');

const entryBuildPath = path.resolve(__dirname, '../../src/utils');

let viewContent = `
/* 页面列表文件。此文件为自动生成文件，使用如下：
    1. 新增页面时，在config/entry/entry.js增加页面配置
    2. 重新运行npm run devNew即可
*/
const ViewList = {
};

export default ViewList;
`;

/* 生成webpack entry 入口文件 */
entry.map((data) => {
    const key = data.name.replace(/-/g, '_').toUpperCase();
    const value = `views/${data.name}.html`;
    const desc = data.description;

    viewContent = viewContent.replace('};', `    ${key}: '${value}', // ${desc}
};`);
});
fs.writeFile(`${entryBuildPath}/viewList.js`, viewContent, 'utf8', (err) => {
    if (err) {
        return console.log(err);
    }
});
