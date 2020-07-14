const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const entry = require('./entry');

// 定义entryBuild
const entryBuildPath = path.resolve(__dirname, '../../entryBuild');
// 删除entryBuild
rimraf.sync(entryBuildPath);
// 创建entryBuild
fs.mkdirSync(entryBuildPath);
const entryContent = data => `
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { System } from '../src/utils'
import Index from '../src/${data.path}';
import '../src/assets/css/main.less';

class Root extends Component {
    componentDidMount() {
        FastClick.attach(document.body);
        System.getTheme();
        console.log(document.body)
        System.getFontSize();
    }

    render() {
        return (
            <Index key='Index' />
        );
    }
}
ReactDOM.render(<Root />, document.getElementById('root'));
`;
/* 生成webpack entry 入口文件 */
entry.map((data) => {
    fs.writeFile(`${entryBuildPath}/${data.name}.js`, entryContent(data), 'utf8', (err) => {
        if (err) {
            return console.log(err);
        }
    });
});
