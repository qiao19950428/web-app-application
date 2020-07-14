const webpack = require('webpack');// 引入webpack
const opn = require('opn');// 打开浏览器
const merge = require('webpack-merge');// webpack配置文件合并
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');// 基础配置
const webpackFile = require('./webpack.file.conf');// 一些路径配置

const config = merge(baseWebpackConfig, {
    /* 设置开发环境 */
    mode: 'development',
    output: {
        path: path.resolve(webpackFile.devDirectory),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: '/'
    },
    optimization: {
        // 包清单
        runtimeChunk: {
            name: 'manifest'
        },
        // 拆分公共包
        splitChunks: {
            cacheGroups: {
                // 项目公共组件
                common: {
                    chunks: 'initial',
                    name: 'common',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                // 第三方组件
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        /* 设置热更新 */
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'cache-loader',
                    'babel-loader',
                ],
                include: [
                    path.resolve(__dirname, '../../src'),
                    path.resolve(__dirname, '../../entryBuild')
                ],
                exclude: [
                    path.resolve(__dirname, '../../node_modules')
                ],
            },
            {
                test: /\.(css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(less)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            modifyVars: { }
                        }
                    },
                ],
            },
            {
                test: /\.(jpg|png|gif|bmp|ttf|eot|svg|swf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // esModule: false,
                            // limit: 2,
                            // name: '[name].[ext]',
                            // outputPath: `${webpackFile.resource}/`,
                        }
                    }
                ]
            },

        ]
    },
    devtool: 'source-map',
    /* 设置api转发 */
    devServer: {
        host: '0.0.0.0',
        port: 2020,
        hot: true,
        inline: true,
        contentBase: path.resolve(webpackFile.devDirectory),
        historyApiFallback: true,
        disableHostCheck: true,
        proxy: [
            {
                context: '/api/trade',
                target: 'https://60.173.222.42:51900/',
                changeOrigin: true,
                secure: false
            },
            {
                context: '/api/news',
                target: 'http://60.173.222.42:51800/',
                changeOrigin: true,
                secure: false
            },
            {
                context: '/api/quote',
                target: 'http://60.173.222.42:51800/',
                changeOrigin: true,
                secure: false
            },
        ],
        /* 打开浏览器 并打开本项目网址 */
        after() {
            opn(`http://localhost:${this.port}/ptjy-index.html`);
        }
    }
});
module.exports = config;
