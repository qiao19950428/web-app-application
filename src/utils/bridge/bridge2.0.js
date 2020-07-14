import { Toast, JSBridge } from '@libs/h5-libs';
import { FN_H_OTHER_ENCRYPTCALL } from './functionCode';

const context = null;
const setTradeOpenState = (functionCode, parameters) => {
    switch (functionCode) {
    // 加解密回调
    case FN_H_OTHER_ENCRYPTCALL:
        console.log('加解密回调');
            // ContextReplacementPlugin.
        // case:
        // case:
    }
};

window.setOpenState = function (parameters) {
    if (JSON.parse(parameters) && Object.prototype.toString.call(JSON.parse(parameters)) === '[object Object]') {
        parameters = JSON.parse(parameters);
        const { state, functionCode, result } = parameters;
        switch (state) {
        case '1':
            console.log('success: 成功');
            setTradeOpenState(functionCode, result);
            break;
        case '2':
            Toast.alert('error: 功能号不存在');
            break;
        case '3':
            Toast.alert('error: 传参错误');
            console.log('error: 传参错误');
            break;
        case '4':
            Toast.alert('error: 其他异常错误');
            break;
        default:
            Toast.alert(`error: 状态码${state}未定义`);
            break;
        }
    }
};

const Bridge = {
    /**
    *函数功能： openService 调用原生方法跳转到其他第三方（与原生进行交互）
    * @param {String} openType      业务跳转或交互类型
    * openType参数说明
    *   “1”：点金原生跳转
    *   “2”：三方原生跳转
    *   “3”：三方H5跳转
    *   “4”：点金H5跳转
    *   “5”：三方H5与原生参数交互（非跳转）
    *   “6”：点金H5与原生参数交互（非跳转）
    *   “7”：三方原生与点金原生参数交互（非跳转）
    * @param {String} functionCode  确认原生跳转类型的业务跳转页面
    * @param {String} param         给三方业务传参，不需要时可以传””。值的格式为json如：{“stockCode”:”000728”}
    * */
    openAppService(openType, functionCode, param) {
        if (Object.prototype.toString.call(param) === '[object Object]') {
            param = JSON.stringify(param);
        }
        JSBridge.openService('TRADE_H5', openType, functionCode, param);
    }
};
