import Base64 from 'js-base64';
import {
    AlertDialog, Env, Bridge, Storage, Request
} from '@libs/h5-libs';
import System from '../../system';


const plugin = {
    method: 'post',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
    }
};

const encryptPlugin = {
    method: 'post',
    responseType: 'text',
    headers: {
        kds_is_encrypt: '3',
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache'
    }
};

const Params = {
    // 服务器响应正确返回码
    code: [ 0, 'MP1B000000' ],
    baseURL: 'https://60.173.222.42:51900/api/trade/',
};

/*
* 获取固定参数（用户信息、留痕、手机号等）
*/
const getParams = () => {
    let key;
    const type = document.body.getAttribute('data-ywlx');
    if (type === 'ptjy') {
        key = 'ActivePTJYUser';
    } else if (type === 'rzrq') {
        key = 'ActiveRZRQUser';
    }
    const activeUser = Storage.get(key);
    const { head, body } = activeUser;
    // 客户代码登录
    head.khbz = head.khbzlx === 'C' ? body.dlxx[0].khdm : head.khbz;
    const { token } = body.dlxx[0];
    head.token = (token || token === '') ? token : '0';
    head.yybdm = body.dlxx[0].yybdm;
    return head;
};

const getLoginParams = () => {
    const a = {
        khbzlx: 'Z',
        khbz: '1818232708',
        jymm: '111111',
        sessionid: '0',
        yybdm: '5042',
        token: '0',
        lhxx: '18166091158,,1.0.4.20161018+3.0.3.20161018010651,,C8:2A:14:3C:11:4C,DCFC9D96-DF9F-4392-B088-4330CB0B537C,192.168.210.22',
        lhxxn: 'aaaaaa',
        rzfs: '1',
        rzxx: '',
        rznr: ''
    };
    return a;
};
/*
* 过滤过失败信息中不需要显示的内容
* @param message 失败信息的内容
*/
const filterMessage = (message) => {
    const paramIndex0 = message.indexOf('流水号');
    if (paramIndex0 >= 0) {
        message.replace('流水号', '');
    }
    // 相关参数出现的位置
    const paramIndex1 = message.indexOf('[相关参数');
    // 只有当相关参数出现的位置不在第首位才过滤相关参数
    if (paramIndex1 > 0) {
        message = message.substring(0, paramIndex1);
    }
    return message;
};

// 不加密
const noEntryptRequest = (url, params, options) => {
    const { KDMIDErrCallback } = options;
    return new Promise((resolve, reject) => {
        Request('post', plugin)(url, params, options).then((res) => {
            const { data } = res;
            console.log(`[出参] ${JSON.stringify(data)}`);
            const { cljg } = data;
            const { code } = cljg[0];
            let { message } = cljg[0];
            // 请求正常（柜台正常）
            if (Params.code.indexOf(code) !== -1) {
                resolve(data);
                return;
            }
            // 请求异常（柜台异常）
            // 是否使用业务中重新封装的柜台错误回调
            if (!KDMIDErrCallback) {
                message = filterMessage(message);
                AlertDialog.error('提示信息', [ message ], '确定', () => {});
                return;
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

// 加密
const entryptRequest = (url, params, options) => {
    const { KDMIDErrCallback } = options;
    Bridge.getSM4Encrypt(0, '3', params, url).then(encryptParams => new Promise((resolve, reject) => {
        Request('post', encryptPlugin)(url, encryptParams, options).then((res) => {
            const { data } = res;
            console.log(`[出参] ${data}`);
            return Base64.decode(Bridge.getSM4Encrypt(1, '3', data, url));
        }).then((decryptParams) => {
            const data = decryptParams;
            console.log(`[出参] ${JSON.stringify(data)}`);
            const { cljg } = data;
            const { code } = cljg[0];
            let { message } = cljg[0];
            // 请求正常（柜台正常）
            if (Params.code.indexOf(code) !== -1) {
                resolve(data);
                return;
            }
            // 请求异常（柜台异常）
            // 是否使用业务中重新封装的柜台错误回调
            if (!KDMIDErrCallback) {
                message = filterMessage(message);
                AlertDialog.error('提示信息', [ message ], '确定', () => {});
                return;
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    }));
};

const TradeRequest = (url, params, options = {
    showLoading: true,
    loadMask: false,
    resend: false,
    netErrCallback: false,
    KDMIDErrCallback: false,
}) => {
    // 组装参数;
    if (url !== 'ptjy/ptyw/login') {
        params = { ...params, ...getParams() };
    }
    url = `api/trade/${url}`;

    // 移动端
    if (Env.platform.isMobile) {
        url = System.getTradeUrl() + url;
        return entryptRequest(url, params, options);
    }

    return noEntryptRequest(url, params, options);
};
export default TradeRequest;
