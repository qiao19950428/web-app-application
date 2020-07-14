# 组件库在npm私服，使用npm install的方式安装

# ！！！！！！
# 组件库在私服时，需要在package.json中手动添加依赖，例如
# "@libs/h5-libs": "0.0.5",
#！！！！！！
#
# echo STEP-1: 安装依赖模块...
# npm install

# echo STEP-2: 打包编译资源
# npm run devNew

# echo STEP-3: 编译，生成上线包
# npm run build

# echo STEP-4: 生成config.txt文件
# cd h5-trade
# echo '{"version":"1.0.0'$(date +%Y%m%d%H%M%S)'","codeVersion":"'$(git describe --always --tags)'"}' > config.txt

# echo STEP-5: 打包结束


# 组件库在gitLab，使用子模块嵌入的方式
echo STEP-1: gyzq-trade初始化子模块...
git submodule init
git submodule update --remote

echo STEP-2: gyzq-trade进入子模块目录，编译组件库，生成 h5-libs.tar.gz 文件
cd h5-libs
sh build.sh
cd -

echo STEP-3: 复制h5-libs.tar.gz到当前目录下
cp -R h5-libs/h5-libs.tar.gz ./

echo STEP-4：编译gyzq-trade，安装依赖模块，打包编译资源， 生成h5-trade
npm install
npm install ./h5-libs.tar.gz --save
npm run devNew
npm run build

echo STEP-5: 生成config.txt文件
cd h5-trade
echo '{"version":"1.0.0'$(date +%Y%m%d%H%M%S)'","codeVersion":"'$(git describe --always --tags)'"}' > config.txt

echo STEP-6: 打包结束
