import { NewsRequest } from '../../axios';

const XGSG = {
    ipo(params = {}, options) {
        return NewsRequest('ipo/ipo.json', params, options);
    }
};

export default {
    XGSG
};
