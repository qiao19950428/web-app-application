import { Storage } from '@libs/h5-libs';
import {
    TRADE_API_URL,
    QUOTE_API_URL,
    NEWS_API_URL,
    QUOTE_REFRESH_INTERNAL,
    APP_THEME,
    APP_FONT_SIZE,
} from './storageList';

const System = {
    /**
     * 设置交易服务器请求ip
     */
    setTradeUrl(apiUrl) {
        Storage.set(TRADE_API_URL, apiUrl);
    },

    /**
     * 获取交易服务器请求ip
     */
    getTradeUrl() {
        const apiUrl = Storage.get(TRADE_API_URL);
        const { testurl, urllist, index } = apiUrl;

        let url = '';
        if (apiUrl) {
            url = testurl || urllist[index];
        }
        return url;
    },

    /**
     * 设置行情服务器请求ip
     */
    setQuoteUrl(hqUrl) {
        Storage.set(QUOTE_API_URL, hqUrl);
    },

    /**
     * 获取行情服务器请求ip
     */
    getQuoteUrl() {
        const hqUrl = Storage.get(QUOTE_API_URL);
        const { testurl, urllist, index } = hqUrl;
        let url = '';

        if (hqUrl) {
            url = testurl || urllist[index];
        }
        return url;
    },

    /**
     * 设置资讯服务器请求ip
     */
    setNewsUrl(apiUrlNews) {
        Storage.set(NEWS_API_URL, apiUrlNews);
    },

    /**
     * 获取资讯服务器请求ip
     */
    getNewsUrl() {
        const newsUrl = Storage.get(NEWS_API_URL);
        let url = '';
        if (newsUrl) {
            url = newsUrl;
        }
        return url;
    },

    /*
    * 当前是否处于自动刷新时间
    */
    isRefresh() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();

        // 9:05-12:15
        // 12:55-16:15
        if ((h === 9 && m > 4) || (h === 10) || (h === 11) || (h === 12 && m < 16) || (h === 12 && m > 54) || (h === 13) || (h === 14) || (h === 15) || (h === 16 && m < 16)) {
            return true;
        }
        return false;
    },

    /**
    * 设置行情自动刷新时间间隔
    */
    setInteraval(time) {
        time = typeof time === 'number' ? time : parseInt(time);
        Storage.set(QUOTE_REFRESH_INTERNAL, time);
    },

    /**
    * 获取行情自动刷新时间间隔
    */
    getInterval() {
        const time = Storage.get(QUOTE_REFRESH_INTERNAL);

        if (time) {
            return parseInt(time) * 1000;
        }
        return 10 * 1000;
    },

    /**
    * 设置APP主题
    */
    setTheme(theme) {
        Storage.set(APP_THEME, theme);
        document.body.className = `${theme}`;
    },

    /**
    * 初始化APP主题
    */
    getTheme() {
        const theme = Storage.get(APP_THEME);
        document.body.className = `${theme}`;
        document.getElementsByTagName('body')[0].className = `${theme}`;
        document.documentElement.setAttribute(APP_THEME, theme);
    },

    /**
    * 设置APP字体
    */
    setFontSize(size) {
        Storage.set(APP_FONT_SIZE, size);
        document.documentElement.setAttribute(APP_FONT_SIZE, size);
    },

    /**
    * 获取APP字体
    */
    getFontSize() {
        const size = Storage.get(APP_FONT_SIZE);
        document.body.className = `${size}`;
    },
};
export default System;
