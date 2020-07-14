# 项目名称

## 概述

- 本项目开发环境采用 [NodeJS](https://nodejs.org/en/) 搭建，你的电脑上必须先要安装 NodeJS。
- [NPM](https://www.npmjs.com/) 是 NodeJS 的模块管理系统，本项目所有依赖的第三方模块都通过 NPM 来进行安装。

## 关键词

`react`
`eslint`
`px转vw/vm`
`babel转换`
`postcss使用`
`换肤`
`多页面应用`
`与原生APP交互使用`

## 安装开发环境

### 安装 vscode
- 下载地址：https://code.visualstudio.com/Download
- 必备插件：Babel、eslint、CSScomb
- 关键配置

```json
    {
        "eslint.enable": true,
        "eslint.alwaysShowStatus": true,
        "eslint.validate": [
                "javascript",
            "javascriptreact",
            {
                "language": "vue", 
                "autoFix": true},
                {
                "language": "html",
                "autoFix": true
            },
            {
                "language": "javascript",
                "autoFix": true
            },
            {
                "language": "javascriptreact",
                "autoFix": true
            }
        ],
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true
        },
    }
```

### 安装 NodeJS

- MAC

    - 方法1: 推荐通过 `brew install node` 命令来安装

    - 方法2: 下载 [NodeJS 的 Mac 安装包](https://nodejs.org/en/)

- Windows：下载 [NodeJS 的 Windows 安装包](https://nodejs.org/en/)

- 通常安装完 NodeJS 就意味着已经安装了 NPM。

### 准备开发环境

- 在源代码目录执行以下命令，下载依赖包

`npm install`

将会自动安装所有依赖的第三方开发包。注意只有首次运行这份源代码时才需要执行这个命令。

## 开发

- 开发工具推荐使用 [VSCode](https://code.visualstudio.com/Download)
- 编写 js/jsx 代码请遵循 eslint 检查规范
- 编写 css/less 代码后请使用 CSScomb 进行格式化

## 运行

要构建项目，首先需要执行下列命令

`npm run devNew`
`npm run dev `

该命令会自动打包项目，并开启一个开发环境的服务器，每当文件发送变化，页面将自动刷新

## 打包
* 执行以下命令
`npm run devNew`
`npm run build`

该命令执行成功后，打好的包将生成在 h5-trade 目录中, 访问 h5-trade/views 即可查看所有页面。

## 提交代码

从 develop 新开一个分支开发

```bash
git checkout -b feature/***
```

开发完成后。

```bash
$ git add .
$ git commit -m "描述"
$ git pull --rebase origin develop
# 解决冲突
$ git push origin feature/***:feature/***
```

提交 PR，指定相应人员 review，根据反馈进一步修改提交。

由 review 人合并进主干后

```bash
$ git checkout develop
$ git pull
```

## 应用结构

项目使用到的库与框架主要有:
- [react](https://github.com/facebook/react)
- [webpack](https://github.com/webpack/webpack)
- [babel](https://github.com/babel/babel)
- [eslint](http://eslint.cn/)
- [csscomb](http://csscomb.com/)


```
│  .eslintignore        	eslint检测忽略文件
│  .eslintrc.js         	eslint配置文件
│  .gitignore           	git提交忽略文件
│  .gitlab-ci.yml       	gitlab构建文件
│  .gitmodules          	git子模块
│  babel.config.js      	babel配置文件
│  build.sh             	构建脚本
│  index.html           	html模板
│  package.json         	package文件
│  postcss.config.js    	postcss配置文件
│  README.md            	README
│
├─config                	公共配置
│  ├─entry                  
│  │      entry.js              所有页面入口
│  │      entryBuild.js         构建js模板
│  │
│  └─webpack
│          webpack.base.conf.js         webpack entry及resolve
│          webpack.dev.conf.js          开发环境
│          webpack.devBuildHtml.conf.js webpack打包html
│          webpack.entry.conf.js        webpack entery 
│          webpack.file.conf.js         资源路径
│          webpack.prod.conf.js         生产环境
│
├─devBuild                      开发环境html文件的集合
│  └─views                      开发环境html文件的集合
│
├─h5-trade                          生产环境包
│  ├─css                        生产环境css
│  ├─js                         生产环境js
│  ├─resource                   生产环境资源文件
│  └─views                      生产环境html
│
├─entryBuild                    开发环境js集合
├─libs                          组件库
└─src                           源文件
​    ├─assets                   资源文件
​    │  ├─css                   公共css
​    │  ├─img                   公共img
​    │  └─js                    公共js（引用外部）
​    ├─utils                    工具类
​    └─views                    页面jsx
```

## 新增业务

- 添加html

在congig/entry/entry.js中新增对应的页面对象

```json
{
    htmName: 'login',               // 导出的html文件名ptjy/login/login.html
    jsName: 'ptjy-login',           // 导出的js的文件名 ptjy-login.js
    path: 'views/ptjy/login',       // 导入jsx的路径和导出html的路径
    title: '登录',                  // html标题
    type: 'ptjy',                   // 业务类型（ptjy/rzrq）
    keywords: 'login',              // 关键字
    description: '普通交易-登录'    // 描述
},
```

- 添加jsx方法

在src/views下面业务文件夹中新增jsx文件，例如rzrq/dbpmr/index.jsx
业务路径必须为两级，命名必须为index

- 添加less

在src/views下面业务文件夹中新增less文件，例如rzrq/dbpmr/index.less
业务路径必须为两级，命名必须为index

- 添加img方法

按照业务，放置在assets/img文件夹下

- 在jsx中使用img

使用import在文件起始位置引入，在jsx中使用{}加载

```javascript
    import ImgSrc from 'src/assets/img/common/icon_arrow_up.png'

    render() {
        return (
            <img src={ImgSrc}/>
        )
    }
```

- 在less中使用img

正常使用相对路径即可

```css
    .home {
        height: 500px;
        background-image: url('../../../assets/img/home/backgroundImage_gzlc.png');
    }
```

- 注意事项

**在开发环境中，运行`npm run dev`后会自动打开loacahost:8080/，查看页面需要在路径后面手动输入页面，例如ptjy-login.html**

**在开发环境中，每次新增html或jsx需要重新执行`npm run devNew`和`npm run dev`进行编译**


## React 编码规范


### 基础规范
1. 统一采用 ES6
2. 参考 [Airbnb React/JSX 编码规范](https://github.com/JasonBoy/javascript/tree/master/react)


### 命名规范
1. 文件名：
2. 类名：大驼峰式。如 Button、AlertDialog
3. 函数名：小驼峰式。如 format、formatDate
4. 变量名：小驼峰式。如 height、curHeight
5. 常量名：全部大写并单词间用下划线分隔。如 NODE_ENV


### 组件结构
- 总体规则：stateless(Function) 优先于 ES6 class
- ES6 class 定义顺序规范：static 方法 > constructor > componentWillMount > componentDidMount > componentWillReceiveProps > shouldComponentUpdate > componentWillUpdate > componentDidUpdate > componentWillUnmount > clickHandlers + eventHandlers 如 onClickSubmit() 或 onChangeDescription() > getter methods for render 如 getSelectReason() 或 getFooterContent() > render methods 如 renderNavigation() 或 renderProfilePicture() > render
- 示例

```javascript
import React from 'react';
import PropTypes from 'prop-types';

const defaultProps = {
    name: 'Guest'
};
const PropTypes = {
    name: PropTypes.string
};
class Person extends React.Component {

    // 构造函数
    constructor (props) {
        super(props);
        // 定义 state
        this.state = { smiling: false };
        // 定义 eventHandler
        this.handleClick = this.handleClick.bind(this);
  }

    // 生命周期方法
    componentWillMount () {},
    componentDidMount () {},
    componentWillUnmount () {},

    // getters and setters
    get attr() {}

    // handlers
    handleClick() {},

    // render
    renderChild() {},
    render () {},

}

/**
 * 类变量定义
 */
Person.defaultProps = defaultProps;

/**
 * 统一都要定义 PropTypes
 * @type {Object}
 */
Person.PropTypes = PropTypes;
```
