import { Storage } from '@libs/h5-libs';
import TalkingData from '../assets/js/TalkingData';

export default {
    /**
     * 数据区间，用于埋点时数据分档
     * @type
     */
    InterValMap() {
        return {
            interval1: [ 0, 50000, 100000, 300000, 500000, 1000000 ],
            interval2: [ 0, 5, 10, 30, 50, 100 ],
            interval3: [ 0, 10000, 100000, 300000 ],
            interval4: [ 0, 1000, 3000, 5000, 10000 ],
            interval5: [ 0, 10, 30, 50, 100 ],
            interval6: [ 0, 100000, 300000, 500000, 1000000 ],
            interval7: [ 0, 1000, 3000, 5000, 8000, 10000 ],
            interval8: [ 0, 10, 30, 50, 80, 100 ],
            interval9: [ 0, 100000, 300000, 500000, 800000, 1000000 ],
        };
    },


    /**
     * 带参数的自定义事件埋点
     * @param eventId string 自定义事件ID，不要加空格或其他的转义字符
     * @param label string 一个事件的子分类
     * @param mapKv 事件的参数信息，描绘发生事件时的属性和场景。
     * mapKv中的Value 仅支持字符串（string）和数字（number）类型，每一次事件数据支持 10 对不同参数传入
     */
    onEventWithParameters(eventId, label, mapKv) {
        if (this.getIsTrack(eventId)) {
            // console.log("onEventWithParameters-eventId:" + TdConstant.TdKeyMap[eventId] + ":" + eventId);
            // console.log("onEventWithParameters-label:" + TdConstant.TdKeyMap[label] + ":" + label);
            // for (var key in mapKv) {
            //     console.log("onEventWithParameters-mapKv:" + key + ":" + TdConstant.TdKeyMap[key] + ":" + mapKv[key]);
            // }
            TalkingData.onEventWithParameters(eventId, label, mapKv);
        }
    },

    /**
     *带label的自定义事件埋点
     * @param eventId string 自定义事件ID，不要加空格或其他的转义字符
     * @param label string 一个事件的子分类
     */
    onEventWithLabel(eventId, label) {
        if (this.getIsTrack(eventId)) {
            // console.log("onEventWithLabel-eventId:" + TdConstant.TdKeyMap[eventId] + ":" + eventId);
            // console.log("onEventWithLabel-label:" + TdConstant.TdKeyMap[label] + ":" + label);
            TalkingData.onEventWithLabel(eventId, label);
        }
    },

    /**
     *自定义事件埋点
     *
     * @param eventId string 自定义事件ID，不要加空格或其他的转义字符
     */
    onEvent(eventId) {
        if (this.getIsTrack(eventId)) {
            // console.log("onEvent-eventId:" + TdConstant.TdKeyMap[eventId]);
            TalkingData.onEvent(eventId);
        }
    },

    /**
     * 页面埋点开始
     * @param pagename
     */
    onPageBegin(pagename) {
        if (this.getIsTrack(pagename)) {
            // console.log("TDLog::onPageBegin:" + TdConstant.TdKeyMap[pagename]);
            TalkingData.onPageBegin(pagename);
        }
    },


    /**
     * 页面埋点结束
     * @param pagename
     */
    onPageEnd(pagename) {
        if (this.getIsTrack(pagename)) {
            // console.log("TDLog::onPageEnd:" + TdConstant.TdKeyMap[pagename]);
            TalkingData.onPageEnd(pagename);
        }
    },

    /**
     * 判断埋点开关是否打开
     * @returns {boolean}
     */
    getIsTrack(param) {
        const isTrack = Storage.get('isTrackData');
        if ((isTrack != null && isTrack === 'true') && param) { // 打开
            return true;
        }
        return false;
    },


    /**
     * 数据分档
     * @param num 传入的数据
     * @param interval 传入的数据区间如[0,5,10,30]
     * @returns 对应的分档
     *
     */
    evaluateNum(num, interval) {
        if (!num) { // 输入为空的时候返回0--需求
            return 0;
        }
        if (!interval || interval.length === 0) { // 未指定区间
            return num;
        }
        if (isNaN(num)) { // 不是数字，则先转为数字
            num = parseFloat(num);
        }

        for (let i = 0; i < interval.length - 1; i++) {
            if (num <= interval[i + 1] && num >= interval[i]) {
                return (`(${interval[i]},${interval[i + 1]}]`);
            }
        }
        if (num > interval[interval.length - 1]) {
            return (`(${interval[interval.length - 1]},` + '+∞' + ']');
        }
        return num;
    },

    /**
     * 根据网络请求的返回状态获取错误信息
     * @param request 网络请求的返回状态
     * @returns {string} 错误信息
     */
    getErrorText(request) {
        let errorText = '';
        if (request) {
            if (request.status === 0) {
                if (request.statusText === 'timeout') {
                    errorText = '您的网络不给力，请稍后再试。';
                } else {
                    errorText = '网络请求失败，请稍后再试。';
                }
            } else if (request.status === 400) {
                errorText = '网络连接失败。';
            } else if (request.status === 404) {
                errorText = '网络连接失败。';
            } else if (request.status === 500) {
                errorText = '服务器繁忙，请稍后再试。';
            } else if (request.status === 502) {
                errorText = '服务器繁忙，请稍后再试。';
            } else {
                errorText = '网络请求失败，请稍后再试。';
            }
        }
        return errorText;
    }
};
