import { TradeRequest } from '@libs/h5-libs';

export default {
    cpgqpd(params) {
        params = {
            ...{
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
            },
            ...params
        };
        return TradeRequest('ptjy/ptyw/login', params);
    }
};
