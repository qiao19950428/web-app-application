/**
* 将服务器时间格式转化为本地显示格式，例：20160105转换为2016-01-05
*/
String.prototype.changeServerToLocalFormat = function () {
    const str = this || '';

    const pattern = /(\d{4})(\d{2})(\d{2})/;
    const formatedDateString = str.replace(pattern, '$1-$2-$3');

    return formatedDateString;
};

/**
* 将服务器时间格式转化为本地显示格式，例：14043302转换为14:04:33、1404转换为14:04
* bHHMM：YES：显示小时分钟；NO：显示小时分钟秒
*/
String.prototype.changeTimeToLocalFormat = function (bHHMM) {
    let str = this || '';

    if (str.length == 7 || str.length == 5) { // 例如9304023转换为09304023
        str = `0${str}`;
    }
    let bNum = 6; // 6位以下补成 时:分:秒
    if (bHHMM) { // 4位以下补成 时:分
        bNum = 4;
    }
    for (let i = str.length; i < bNum; i++) {
        str = `0${str}`;
    }

    if (bHHMM) {
        if (str.length > 4) {
            str = str.substr(0, 4);
        }
    } else if (str.length > 6) {
        str = str.substr(0, 6);
    }
    let pattern;
    let formatedDateString;
    if (str.length === 4) {
        pattern = /(\d{2})(\d{2})/;
        formatedDateString = str.replace(pattern, '$1:$2');
    } else {
        pattern = /(\d{2})(\d{2})(\d{2})/;
        formatedDateString = str.replace(pattern, '$1:$2:$3');
    }
    return formatedDateString;
};

/**
* 去除时间中的微秒
*/
String.prototype.removeMicrosecond = function () {
    let str = this || '';

    if (str.indexOf('.') >= 0) {
        str = str.substr(0, str.indexOf('.'));
    }

    return str;
};
/**
* 用特殊符号（如*）替换字符串中的除设定位之外的其他字符
*/
String.prototype.changeStr = function (allstr, start, end, type) {
    if (!allstr) {
        return;
    }
    if (!type) {
        type = '•';
    }
    if (allstr.length < start) {
        return allstr;
    }
    // 若end小于0，则表示结束位置为从结尾数的倒数第几位
    if (end < 0) {
        end = allstr.length - Math.abs(end);
    }
    return allstr.split('').reduce(
        // eslint-disable-next-line no-return-assign
        (str, char, index) => str += (start - 1 <= index && index <= end - 1) ? type : char, ''
    );
};

const StringFunc = {
    /**
     * 用特殊符号（如*）替换字符串中的除设定位之外的其他字符
     */
    changeStr(allstr, start, end, type) {
        if (!allstr) {
            return;
        }
        if (!type) {
            type = '•';
        }
        if (allstr.length < start) {
            return allstr;
        }
        // 若end小于0，则表示结束位置为从结尾数的倒数第几位
        if (end < 0) {
            end = allstr.length - Math.abs(end);
        }
        return allstr.split('').reduce(
            // eslint-disable-next-line no-return-assign
            (str, char, index) => str += (start - 1 <= index && index <= end - 1) ? type : char, ''
        );
    },
};

export default StringFunc;
