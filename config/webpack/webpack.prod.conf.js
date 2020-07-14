/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cssProcessor = require('cssnano');
const baseWebpackConfig = require('./webpack.base.conf');
const webpackFile = require('./webpack.file.conf');
const entry = require('./webpack.entry.conf');

const config = merge(baseWebpackConfig, {
    /* 设置生产环境 */
    mode: 'production',
    output: {
        path: path.resolve(webpackFile.proDirectory),
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js',
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
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash:8].css'
        }),
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor,
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true
            },
            canPrint: true
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(css|pcss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            modifyVars: { }
                        }
                    }
                ],
            },
            {
                test: /\.(jpg|png|gif|bmp|ttf|eot|svg|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:8].[ext]',
                            publicPath: `${webpackFile.resourcePrefix}/`,
                            outputPath: `${webpackFile.resource}`
                        }
                    }
                ]
            },
            {
                test: /\.swf$/,
                use: [ 'file?name=js/[name].[ext]' ]
            }
        ]
    }
});
const pages = entry;
for (const chunkName in pages) {
    const conf = {
        filename: `views/${pages[chunkName][1]}.html`,
        template: 'index.html',
        inject: true,
        title: pages[chunkName][2],
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        },
        chunks: [ 'manifest', 'vendor', 'common', chunkName ],
        hash: false,
        chunksSortMode: 'dependency'
    };
    config.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = config;
