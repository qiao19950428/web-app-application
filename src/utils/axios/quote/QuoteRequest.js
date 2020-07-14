import { Request, Env } from '@libs/h5-libs';
import System from '../../system';

const plugin = {
    responseType: 'arraybuffer',
    headers: {
        'Content-Type': 'application/octet-stream; charset=utf-8',
        'Cache-Control': 'no-cache'
    }
};

const QuoteRequest = function (url, params, decoder, options = {
    showLoading: true,
    loadMask: false,
    resend: false,
    netErrCallback: false,
    KDMIDErrCallback: false,
}) {
    url = `api/quote/${url}`;
    if (Env.platform.isMobile) {
        url = System.getQuoteUrl() + url;
    }
    params = Buffer.from(params.serializeBinary());
    return new Promise((resolve, reject) => {
        Request('post', plugin)(url, params, options).then((res) => {
            const { data } = res;
            console.log(`[出参] ${data}`);
            if (data) {
                resolve(decoder.deserializeBinary(new Uint8Array(data)));
            } else {
                resolve(data);
            }
        }).catch((err) => {
            reject(err);
        });
    });
};


export default QuoteRequest;
