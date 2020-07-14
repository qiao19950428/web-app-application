import { Storage, JSBridge, Env } from '@libs/h5-libs';
import Common from '../common';
// eslint-disable-next-line import/no-cycle
import Auth from '../auth';

const { send } = JSBridge;
const Bridge = {
    /* --------------------Begin: H5调用原生的请求--------------------*/
    /**
     *    URL 跳转界面
     *    @param url    url地址
     *    @param hasRefresh    标识有无刷新按钮 0：显示，4：隐藏(占空间),8:隐藏(不占空间)
     *    @param direction    1：下一级界面；-1：返回上一级界面  0：在原生覆盖掉当前页面  -100：直接成为顶层页面 -2：返回上一级页面且不刷新上一个页面的数据
     */
    switchWebView(url, hasRefresh, direction, handlePageBack) {
        console.log('Env.platform.isBrower', Env.platform.isBrower);
        if (handlePageBack) {
            window.handlePageBack = handlePageBack;
        }
        if (Env.platform.isMobile) {
            // 未传第2个参数时默认为0
            hasRefresh = hasRefresh === undefined ? 0 : hasRefresh;
            // 未传第3个参数时默认为1
            direction = direction === undefined ? 1 : direction;
            // hasRefresh 参数值不是数字，使用默认值 0
            hasRefresh = !Number.isNaN(hasRefresh) ? parseInt(hasRefresh) : 0;
            // direction 参数值不是数字，使用默认值 1
            direction = !Number.isNaN(direction) ? parseInt(direction) : 1;

            send('switchWebView', [ url, hasRefresh, direction ]);
        } else {
            // 开发模式只需要html名字即可完成跳转
            url = url.substring(url.indexOf('views/') + 6);
            console.log(`跳转地址${url}`);
            // 平级页面之间的跳转
            if (direction === 0) {
                // eslint-disable-next-line no-restricted-globals
                location.replace(url);
            } else if (direction === -1) {
                // eslint-disable-next-line no-restricted-globals
                history.back();
            } else {
                // eslint-disable-next-line no-restricted-globals
                location.href = url;
            }
        }
    },

    /**
     *    显示键盘
     *    @param        id    触发显示键盘事件的文本框ID
     *    @param        type    键盘类型    1.纯数字键盘,2.带小数点的数字键盘,3.数字字母切换键盘,4.纯字母键盘,10.键盘精灵 ;
     */
    showKeyBoard(id, type, handleKeyBoardClick) {
        window.handleKeyboard = handleKeyBoardClick;
        if (id === undefined) {
            console.log('文本输入框 id 不能为空!');
            return;
        }
        // const inputObj = {$(`[id='${id}']`)};
        const inputObj = {};
        if (inputObj.length === 0) {
            console.log(`文本输入框 id 不存在! id=${id}`);
            return;
        }
        console.log(`文本输入框 id=${id}`);

        inputObj.focus();
        if (type === undefined) {
            console.log('键盘类型不存在!');
            return;
        }
        // const X = inputObj.offset().left;
        let Y = inputObj.offset().top;
        Y += inputObj.height(); // 加上文本框高度
        Y += 80; // 额外加 80 像素, 可以显示出下一个输入框或按钮
        // 系数 = 输入框底部到页面顶部的高度 / 页面可见区域高度
        if (Env.platform.isAndroid) {
            const { clientHeight } = window.document.body;
            const { availHeight } = window.screen;
            console.log(`Y:${Y} clientHeight:${clientHeight} availHeight:${availHeight}`);
            let height = clientHeight;
            // 屏幕高度取两者最大值
            if (clientHeight < availHeight) {
                height = availHeight;
            }
            Y /= height;
        }
        send('showKeyBoard', [ type, Y ]);
    },

    showKeyBoard2(type = 1, y = -1, handleKeyboardClick) {
        window.handleKeyboard = handleKeyboardClick;
        send('showKeyBoard', [ Number.parseInt(type), y ]);
    },

    // 隐藏自定义键盘
    hideKeyBoard() {
        send('hideKeyBoard');
    },

    // 自助开户功能
    selfserviceAccountJSBridge() {
        send('selfserviceAccount');
    },

    // 新股日历 ywlx: 0 普通交易 1 融资融券
    jumpXGRLInterfaceJSBridge(ywlx) {
        send('JumpXGRLInterface', [ ywlx ]);
    },

    jumpNewStockDetailInterfaceJSBridge(sgdm, sgdmmc, jysdm) {
        send('JumpNewStockDetailInterface', [ sgdm, sgdmmc, jysdm ]);
    },

    // 资金账号绑定
    backZjzhBindJSBridge(zjzh) {
        send('backZjzhBind', [ zjzh ]);
    },

    // 调用手机号码注册界面
    showRegisterViewJSBridge() {
        send('ShowRegisterView');
    },

    // 添加自选股
    addUserStockJSBridge(stockName, stockCode, marketId) {
        send('addUserStock', [ stockName, stockCode, marketId ]);
    },

    // 锁屏计时器操作
    timerAction(timerName, actionType) {
        send('timerAction', [ timerName, actionType ]);
    },

    // 保存数据到本地
    saveOrUpdateLocalDataJSBridge(key, value) {
        send('saveOrUpdateLocalData', [ key, value ]);
    },

    // 设置当前使用的交易地址
    setTradeUrlJSBridge(url) {
        send('setTradeUrl', [ url ]);
    },

    // 返回当前登录的资金账号
    onLoginAccountJSBridge(loginAccount) {
        send('onLoginAccount', [ loginAccount ]);
    },

    // 记录日志
    // 提示：由于IOS平台限制，该方法需在页面跳转之后调用，否则会阻止页面跳转
    logJSBridge(content) {
        send('log', [ content ]);
    },

    // 显示日期控件
    showDateDialogJSBridge(time, min, max, method) {
        send('showDateDialog', [ time, min, max, method ]);
    },

    // 跳转至相应的个股详情页面
    jumpStockDetailInterfaceJSBridge(stockCode, marketId) {
        send('JumpStockDetailInterface', [ stockCode, marketId ]);
    },

    /* ========================================
     函数功能：传递用户普通交易登录信息给原生"我的界面使用"   [与APP交互使用,函数名不能随意修改]
     交易登录后，会将登录参数传递给原生(json格式:{name:"凯特琳",tel:"5252522"})
     ========================================= */
    onLoginTrade(json = {}) {
        if (json.ywlx === 'ptjy' && Storage.get('fpFlag')) {
            json.fpFlag = true;
        }
        json = JSON.stringify(json);
        send('onLoginTrade', [ json ]);
    },

    /**
     * 根据板块代码，市场代码，商品类型跳转至相应的板块页面
     * @param callBackMethod 供原生的回调方法
     * @param blockId 板块代码
     * @param marketId 市场代码
     * @param productType 商品类型
     * @param blockName 板块名称
     */
    gotoBlockJSBridge(callBackMethod, blockId, marketId, productType, blockName) {
        let mehtodName = '';

        if (callBackMethod) {
            mehtodName = 'callBackMethod';
            window.callBackMethod = callBackMethod;
        }

        send('gotoBlock', [ mehtodName, blockId, marketId, productType, blockName ]);
    },

    /**
    * 跳转至个股期权T型报价页面
    */
    jumpTXBJPageJSBridge() {
        send('JumpTXBJPage');
    },

    /**
    * 跳转至掌上营业厅
    */
    goToOnlineHallJSBridge(khdm, key) {
        send('goToOnlineHall', [ khdm, key ]);
    },

    /**
    * 重置密码
    */
    forgetPasswordJSBridge() {
        send('forgetPassword');
    },

    /**
    * 找回客户号
    */
    findClientNumberJSBridge() {
        send('findClientNumber');
    },

    /**
    * 退出登录
    * @param  {String} ywlx 业务类型（ptjy、rzrq）
    */
    onLogout(ywlx) {
        send('onLogout', [ ywlx ]);
    },

    /**
     * 函数功能：调用原生方法进行加密或解密（与原生进行交互）
     * isEncrypt     0是加密，1是解密
     * encryptType   0：不加解密，2：SM4_ECB加解密，3：SM4_CBC加解密
     * encryptOrDecryptData     加密或解密后的内容
     * encryptKEY    标识
     */
    getSM4Encrypt(isEncrypt, type, data, url) {
        data = JSON.stringify(data);
        const encryptKEY = url + window.handleEncryptKey.getKey();
        return new Promise((resolve) => {
            window.handleEncryptKey.addKey(encryptKEY, resolve);
            send('getSM4Encrypt', [ isEncrypt, type, encryptKEY, data ]);
        });
    },

    /**
     * 函数功能：回调 APP 方法（与原生进行交互）
     * 这是一个通用方法，根据 functionKey 来区分功能，jsonStr 动态传参
     * @param  {[type]} functionKey [功能KEY]
     * @param  {[type]} jsonStr     [JSON 字符串对象]
     */
    callbackTradeFunctionJSBridge(functionKey, jsonStr) {
        console.log([ 'callbackTradeFunction', functionKey, jsonStr ].join(','));
        send('callbackTradeFunction', [ functionKey, jsonStr ]);
    },

    /**
     * 当调用 jumpToView 时，传入的 KEY 值是闪电买卖值，登录完成后，则回调该方法（与原生进行交互）
     * @param  {[type]} functionKey [功能 KEY 值]
     */
    callbackJumpToViewJSBridge(functionKey) {
        send('callbackJumpToView', [ functionKey ]);
    },

    /**
     * 在快捷入口进入的H5页面解锁超时弹框后通知原生重刷交易模块（与原生进行交互）
     * @param  {[type]} functionKey [功能 KEY 值]
     */
    unlockTrade(ywlx) {
        send('unlockTrade', [ ywlx ]);
    },

    /**
     * 函数功能：从原生获取某功能需要的参数（与原生进行交互）
     * 这是一个通用方法，根据 functionKey 来区分功能，jsonStr 动态传参
     * @param  {[type]} functionKey [功能KEY]
     * @param  {[type]} jsonStr     [JSON 字符串对象]
     */
    getNativeFunction(functionKey, jsonStr) {
        send('getNativeFunction', [ functionKey, jsonStr ]);
    },

    /**
     * 页面滑动时，获取滑动停止后当前页面的标志
     * @param page,页面标志-和原生约定好
     * "wtmr", "wtmc", "wtcd", "cccx", "wtcjcx"分别表示买入 卖出 撤单 持仓和查询页面
     */
    getCurrentPageJSBridge(page) {
        try {
            send('getCurrentPage', [ page ]);
        } catch (e) {
            console.log('调用getCurrentPage出错');
        }
    },

    /**
     * 设置原生actionbar的图标模式，如列表或者卡片
     * @param ywlx 业务类型，普通交易或者融资融券
     * @param modeObj json字符串如{"wtcd":"card","cccx":"list"}
     */
    setShowModeJSBridge(ywlx, modeObj) {
        try {
            send('setShowMode', [ ywlx, modeObj ]);
        } catch (e) {
            console.log('调用setShowMode出错');
        }
    },

    /**
    *函数功能： openAppService 调用原生方法跳转到其他第三方（与原生进行交互）
    * openSource    业务源，记录跳转的来源，方便追踪业务调试及权限控制，要求字母全大写
    * openType      业务跳转或交互类型 （）
    * functionCode  确认原生跳转类型的业务跳转页面
    * param         给三方业务传参，不需要时可以传””。值的格式为json如：{“stockCode”:”000728”}
    * 新协议
    * */
    openAppService(openSource, openType, functionCode, param) {
        send('openService', [ openSource, openType, functionCode, param ]);
    }
    /* --------------------End: H5调用原生的请求--------------------*/
};

/* --------------------Begin: 原生调用H5的请求--------------------*/
// 当前页面类型：普通交易/融资融券，默认为普通交易
window.type = document.body === undefined ? '' : (document.body.getAttribute('data-ywlx') || 'ptjy');

// 需要保存到 APP 里的本地存储的键
window.appKey = [ 'ptjyLszhList', 'rzrqLszhList', 'ptjyJZZH', 'rzrqJZZH', 'trade_login_default_key' ];

/**
 * 设置App的主题皮肤    [与APP交互使用,函数名不能随意修改]
 * @param {String} name 主题的名称（暂只支持 black和white）
 */
window.setAppTheme = function (name) {
    document.documentElement.setAttribute('apptheme', name);
    Storage.set('AppTheme', name);
};

/**
 * 设置注册 [与APP交互使用,函数名不能随意修改]
 * @param {String} phone 手机号码
 */
window.setIsRegister = (phone) => {
    Storage.set('cellPhoneNumber', phone);
};

/**
 * 设置行情服务器地址   [与APP交互使用,函数名不能随意修改]
 * @param {String} hqUrl 行情服务器地址
 */
window.setHQUrl = function (hqUrl) {
    Storage.set('HQUrl', hqUrl);
    Auth.clearLoginInfo(window.type);
};

/**
 * 设置交易服务器地址   [与APP交互使用,函数名不能随意修改]
 * @param {String} apiUrl 交易服务器地址
 */
window.setApiUrl = function (apiUrl) {
    Storage.set('apiUrl', apiUrl);
    Auth.clearLoginInfo(window.type);
};

/**
 * 设置资讯服务器地址   [与APP交互使用,函数名不能随意修改]
 * @param {String} apiUrlNews 资讯服务器地址
 */
window.setApiUrlNews = (apiUrlNews) => { Storage.set('apiUrlNews', apiUrlNews); };

/**
 * 设置留痕信息 [与APP交互使用,函数名不能随意修改]
 * @param {String} obj 留痕信息
 * @param {String} objNew V2.0新增留痕信息
 */
window.setMarkInfo = function (obj, objNew) {
    Storage.set('lhxx', obj);
    Storage.set('lhxxn', objNew);
};

/**
 * 清除登录信息 [与APP交互使用,函数名不能随意修改]
 */
window.ClearLoginInfo = function (ywlx) {
    if (ywlx === undefined || ywlx === null) {
        ywlx = window.type;
    }
    Auth.clearLoginInfo(ywlx);
};

/**
 *设置本地存储数据  [与APP交互使用,函数名不能随意修改]
 * @param {String} key   键名
 * @param {String} value 键值
 * @param {Number} from  来源 0: android 1: ios
 */
window.setLocalData = function (key, value, from) {
    value = typeof (value) === 'string' ? value : JSON.stringify(value);
    Storage.set(key, value);
    // 非 APP 调用该接口时, 需要把特殊键值保存到APP里去.
    if (from === undefined && window.appKey.indexOf(key) > -1) {
        Storage.saveOrUpdateLocalData(key, value);
    }
};

/**
 * 键盘回调方法     [与APP交互使用,函数名不能随意修改]
 * @param {String} data  回显的文字
 * @param {String} jysdm 交易所代码（键盘精灵回传）
 */
window.fillInputContent = function (data, jysdm) {
    console.log(`fillInputContent >> stockCode=${data} jysdm=${jysdm}`);
    window.handleKeyboard(data, jysdm);
};


window.handlePageBack = null;

window.handleKeyBoard = null;

/* 国密算法存放标识 */
window.handleEncryptKey = Common.HandleKey();

/**
 * 原生回传给H5加密解密后的内容  [与APP交互使用,函数名不能随意修改]
 * @param {String} isEncrypt                0是加密，1是解密
 * @param {String} encryptOrDecryptData     加密解密后的内容
 * @param {String} encryptKEY               标识
 */
window.getSM4DecryptData = function (isEncrypt, encryptOrDecryptData, encryptKEY) {
    const callBack = window.handleEncryptKey.getCallBack(encryptKEY);
    callBack(encryptOrDecryptData);
    window.handleEncryptKey.delKey(encryptKEY);
};
/* --------------------Begin: 原生调用H5的请求--------------------*/

export default Bridge;
