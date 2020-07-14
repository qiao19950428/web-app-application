var isWebviewFlag = true;

function setWebViewFlag() {
    isWebviewFlag = true;
};

function loadURL(url) {
    var iFrame;
    iFrame = document.createElement("iframe");
    iFrame.setAttribute("src", url);
    iFrame.setAttribute("style", "display:none;");
    iFrame.setAttribute("height", "0px");
    iFrame.setAttribute("width", "0px");
    iFrame.setAttribute("frameborder", "0");
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
};

function exec(funName, args) {
    var commend = {
        functionName:funName,
        arguments:args
    };
    var jsonStr = JSON.stringify(commend);
    var url = "talkingdata:" + jsonStr;
    loadURL(url);
};

var TalkingData = {

    // 触发自定义事件
    // eventId   : 自定义事件的 eventId
   onEvent:function(eventId) {
        if (isWebviewFlag) {
            exec("onEvent", [eventId]);
        }
    },

    // 触发自定义事件
    // eventId   : 自定义事件的 eventId
    // eventLabel: 自定义事件的事件标签
    onEventWithLabel:function(eventId, eventLabel) {
        if (isWebviewFlag) {
            exec("onEventWithLabel", [eventId, eventLabel]);
        }
    },

    // 触发自定义事件
    // eventId   : 自定义事件的 eventId
    // eventLabel: 自定义事件的事件标签
    // eventData : 自定义事件的数据，Json 对象格式
    onEventWithParameters:function(eventId, eventLabel, eventData) {
        if (isWebviewFlag) {
            exec("onEventWithParameters", [eventId, eventLabel, eventData]);
        }
    },

    // 触发页面事件，在页面加载完毕的时候调用，记录页面名称和使用时长，一个页面调用这个接口后就不用再调用 onPageBegin 和 onPageEnd 接口了
    // pageName  : 页面自定义名称
    onPage:function(pageName) {
        if (isWebviewFlag) {
            exec("onPage", [pageName]);
        };
    },

    // 触发页面事件，在页面加载完毕的时候调用，用于记录页面名称和使用时长，和 onPageEnd 配合使用
    // pageName  : 页面自定义名称
    onPageBegin:function(pageName) {
        if (isWebviewFlag) {
            exec("onPageBegin", [pageName]);
        }
    },

    // 触发页面事件，在页面加载完毕的时候调用，用于记录页面名称和使用时长，和 onPageBegin 配合使用
    // pageName  : 页面自定义名称
    onPageEnd:function(pageName) {
        if (isWebviewFlag) {
            exec("onPageEnd", [pageName]);
        }
    },

    // 设置位置经纬度
    // latitude  : 纬度
    // longitude : 经度
    setLocation:function(latitude, longitude) {
        if (isWebviewFlag) {
            exec("setLocation", [latitude, longitude]);
        }
    },

    // 获取 TalkingData Device Id，并将其作为参数传入 JS 的回调函数
    // callBack  : 处理 deviceId 的回调函数
    getDeviceId:function(callBack) {
        if (isWebviewFlag) {
            exec("getDeviceId", [callBack.name]);
        }
    }
};
module.exports = TalkingData;