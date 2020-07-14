import { Request, AlertDialog, Env } from '@libs/h5-libs';
import System from '../../system';

const plugin = {
    method: 'post',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
    }
};

const codeIsValid = (code) => {
    if (code === 0 || code === undefined || code.length <= 0 || code === '0') {
        return true;
    }
};

const NewsRequest = (url, params, options = {
    showLoading: true,
    loadMask: false,
    resend: false,
    netErrCallback: false,
    KDMIDErrCallback: false,
}) => {
    url = `api/news/${url}`;
    if (Env.platform.isMobile) {
        url = System.getNewsUrl() + url;
    }
    const { KDMIDErrCallback } = options;
    return new Promise((resolve, reject) => {
        Request('post', plugin)(url, params, options).then((res) => {
            const { data } = res;
            console.log(`[入参] ${JSON.stringify(data)}`);
            const { code } = data;
            let { message } = data;
            // 请求正常（柜台正常）
            if (codeIsValid(code)) {
                resolve(data);
                return;
            }

            // 请求异常（柜台异常）
            // 使用默认的柜台错误回调
            if (!KDMIDErrCallback) {
                message = message || '资讯请求数据错误';
                AlertDialog.error('提示信息', [ message ], '确定', () => {});
                return;
            }
            resolve(data);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
};

export default NewsRequest;
