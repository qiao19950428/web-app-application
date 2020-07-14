/*
    name:   导出的js的文件名 ptjy-login.js
    path:   jsx路径
    title:  html标题
    type:   业务类型（ptjy/rzrq）
    keywords:       关键字
    description:    描述
*/
module.exports = [
    {
        name: 'ptjy-login',
        path: 'views/ptjy/login',
        title: '登录',
        type: 'ptjy',
        keywords: 'login',
        description: '普通交易登录页面'
    },
    {
        name: 'ptjy-index',
        path: 'views/ptjy/index',
        title: '普通交易',
        type: 'ptjy',
        keywords: 'index',
        description: '普通交易首页（已登录）'
    },
    {
        name: 'ptjy-header',
        path: 'views/ptjy/header',
        title: '普通交易',
        type: 'ptjy',
        keywords: 'header',
        description: '普通交易（未登录）'
    },
    {
        name: 'rzrq-login',
        path: 'views/rzrq/login',
        title: '登录',
        type: 'rzrq',
        keywords: 'login',
        description: '融资融券登录页面'
    },
    {
        name: 'rzrq-index',
        path: 'views/rzrq/index',
        title: '融资融券',
        type: 'rzrq',
        keywords: 'index',
        description: '融资融券首页（已登录）'
    },
    {
        name: 'rzrq-header',
        path: 'views/rzrq/header',
        title: '融资融券',
        type: 'rzrq',
        keywords: 'header',
        description: '融资融券（未登录）'
    },
];
