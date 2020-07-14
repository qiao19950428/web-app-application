// 加减天数
Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
};

// 加减星期
Date.prototype.addWeeks = function (w) {
    this.addDays(w * 7);
};

// 加减月份
Date.prototype.addMonths = function (m) {
    const d = this.getDate();
    this.setMonth(this.getMonth() + m);

    if (this.getDate() < d) {
        this.setDate(0);
    }
};

// 加减年份
Date.prototype.addYears = function (y) {
    const m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);

    if (m < this.getMonth()) {
        this.setDate(0);
    }
};

// 时间日期格式化
Date.prototype.Format = function (fmt) {
    const o =
    {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds(), // 毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }

    return fmt;
};

const DateFunc = {
    period: {
        qsrq: '',
        zzrq: '',
    },

    /*
    函数功能:      获取起始终止时间段
    @backDate:      向前倒退的周期数
    @interval:      向前倒退的间隔（默认为月）
    函数功能  ：  period----过去到现在的时间段
    修改备注：
    日期：2017.7.21
    内容：查询最近一周内数据包含当天的，查询最近一个月内数据不包含当天的
    */
    getStartEndPeroid(backMonth, interval, fromServerTime) {
        let now = new Date();
        switch (interval) {
        case 'day':
            if (fromServerTime) {
                this.period.zzrq = fromServerTime;
                this.period.qsrq = fromServerTime;
            } else {
                this.period.zzrq = now.Format('yyyyMMdd');
                now = new Date();
                now.addDays(backMonth);
                this.period.qsrq = now.Format('yyyyMMdd');
            }
            break;
        case 'week':
            // 查询最近一周内数据包含当天的
            if (fromServerTime) {
                this.period.zzrq = fromServerTime;
                const ksrq = new Date(fromServerTime.slice(0, 4) + '/' + fromServerTime.slice(4, 6) + '/' + fromServerTime.slice(6, 8));
                ksrq.addWeeks(-1);
                this.period.qsrq = ksrq.Format('yyyyMMdd');
            } else {
                this.period.zzrq = now.Format('yyyyMMdd');
                now = new Date();
                now.addWeeks(backMonth);
                this.period.qsrq = now.Format('yyyyMMdd');
            }
            break;
        case 'month':
            // 查询最近一个月数据包含当天的
            if (fromServerTime) {
                this.period.zzrq = fromServerTime;
                const ksrq = new Date(fromServerTime.slice(0, 4) + '/' + fromServerTime.slice(4, 6) + '/' + fromServerTime.slice(6, 8));
                ksrq.addMonths(backMonth);
                this.period.qsrq = ksrq.Format('yyyyMMdd');
            } else {
                this.period.zzrq = now.Format('yyyyMMdd');
                now = new Date();
                now.addMonths(backMonth);
                this.period.qsrq = now.Format('yyyyMMdd');
            }
            break;
        default:
            // 一个月内的记录不包含当日的记录，几个月内的记录包含当月的记录
            backMonth === -1 ? now.addDays(-1) : null;

            if (backMonth < -1) {
                now.addMonths(-1);
            }

            this.period.zzrq = now.Format('yyyyMMdd');

            if (backMonth === 'week') {
                now.addWeeks(-1);
            } else {
                now.addMonths(backMonth);
            }

            this.period.qsrq = now.Format('yyyyMMdd');
        }
        return this.period;
    },

    /*
    函数功能:      获取起始终止时间段  当前时间往前推的时间段
    @backDay:      向前倒退的天数
    函数功能  ：  period----过去到现在的时间段
    */
    getStartEndPeroidWithDay(backDay) {
        const now = new Date();

        this.period.zzrq = now.Format('yyyyMMdd');
        now.addDays(-backDay + 1); // 起始日期需要再加一天，才是实际的间隔天数
        this.period.qsrq = now.Format('yyyyMMdd');

        return this.period;

    },


    /*
    函数功能:      获取起始终止时间段
    @backMonth:      向前前进的月份
    函数功能  ：  period----过去到现在的时间段
    */
    getAheadStartEndPeroid(aheadMonth) {
        const now = new Date();

        // 一个月内的记录不包含当日的记录，几个月内的记录不包含当月的记录
        aheadMonth === 1 ? now.addDays(1) : null;

        if (aheadMonth > 1) {
            now.addMonths(1);
        }

        this.period.zzrq = now.Format('yyyyMMdd');

        if (aheadMonth === 'week') {
            now.addWeeks(1);
        } else {
            now.addMonths(aheadMonth);
        }

        this.period.qsrq = now.Format('yyyyMMdd');

        return this.period;

    },

    /**
    * 获取交易日期的时间格式，例如20151014
    * @date 传入的时间值，类型为Date
    */
    getJiaoYiDateFormat(date) {
        return date.Format('yyyyMMdd');
    },

    /*
    函数功能:     获取当天日期 格式YYYY-MM-DD
    函数功能  ：  period----过去到现在的时间段
    */
    getToday() {
        const myDate = new Date();
        const month = myDate.getMonth() + 1;
        const Day = myDate.getDate();
        let today = '';

        if (month < 10) {
            if (Day < 10) {
                today = myDate.getFullYear() + '0' + month + '0' + Day;
            } else {
                today = myDate.getFullYear() + '0' + month + '' + Day;
            }
        } else {
            if (Day < 10) {
                today = myDate.getFullYear() + '' + month + '0' + Day;
            } else {
                today = myDate.getFullYear() + '' + month + '' + Day;
            }
        }

        return today;
    },

    getDefaultYear(y) {
        let year = '';
        const myDate = new Date();
        const month = myDate.getMonth() + 1;
        const Day = myDate.getDate();

        const future = parseInt(myDate.getFullYear()) + y;


        if (month < 10) {
            if (Day < 10) {
                year = future + '0' + month + '0' + Day;
            } else {
                year = future + '0' + month + '' + Day;
            }
        } else {
            if (Day < 10) {
                year = future + '' + month + '0' + Day;
            } else {
                year = future + '' + month + '' + Day;
            }
        }

        return year;
    },

    /*
     函数功能：格式化字符串日期
     入参说明：data   字符串日期
     format 格式
    */
    formatDate(date, format) {
        if (date === undefined || date == null || date === '') return;

        format = format === undefined || format == null ? 'yyyyMMdd' : format;

        date = date.split('');
        format = format.split('');

        let newdate = [];
        for (var key in format) {
            if (key > date.length - 1){
                break;
            }
            if (!(format[key] == 'y' || format[key] == 'M' || format[key] == 'd' || format[key] == 'H' || format[key] == 'h' || format[key] == 'm' || format[key] == 's')) {
                date.splice(key, 0, format[key]);
            }

            newdate[key] = date[key];
        }

        // 数组日期转为字符串
        newdate = newdate.join('');

        return newdate;
    },

    getDayInWeek(date) {
        const weekday = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];
        const day = (date || new Date()).getDay();
        return weekday[day];
    }
};

export default DateFunc;
