const Common = {
    /**
     * 函数防抖 (只执行最后一次点击)
     * @param fn
     * @param delay
     * @returns {Function}
     */
    debounce: (fn, t) => {
        const delay = t || 500;
        let timer;
        return function () {
            const args = arguments;
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                timer = null;
                fn.apply(this, args);
            }, delay);
        };
    },

    /**
     * 函数节流（每隔一段时间执行）
     * @param fn
     * @param interval
     * @returns {Function}
     */
    throttle: (fn, t) => {
        let last;
        let timer;
        const interval = t || 500;
        return function () {
            const args = arguments;
            const now = +new Date();
            if (last && now - last < interval) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    last = now;
                    fn.apply(this, args);
                }, interval);
            } else {
                last = now;
                fn.apply(this, args);
            }
        };
    },

    /**
     * Map池，用于临时存储数据
     */
    HandleKey: () => {
        const keyMap = {};

        return {
            // 获取时间戳key值
            getKey() {
                const key = (new Date()).valueOf();
                return key;
            },

            // 向keyMap中添加键值对
            addKey(key, callBack) {
                keyMap[key] = callBack;
            },

            // 获取keyMap中键值对的value值
            getCallBack(key) {
                return keyMap[key];
            },

            // 删除键值对
            delKey(key) {
                delete keyMap[key];
            }
        };
    },

    /**
     * 单属性排序
     * @param data 原数组
     * @param field 排序关键字 'khdm'：正序  '-khdm': 倒序
     */
    dynamicSort: (field) => {
        // 排序顺序 1：正序  -1：倒序
        let sortOrder = 1;
        if (field[0] === '-') {
            sortOrder = -1;
            field = field.substr(1);
        }
        return function (a, b) {
            let result = 0;
            if (a[field] < b[field]) {
                result = -1;
            } else if (a[field] > b[field]) {
                result = 1;
            }
            return result * sortOrder;
        };
    },

    /**
     * 多属性排序
     * @param data 原数组
     * @param field 排序关键字 'khdm'：正序  '-khdm': 倒序
     */
    dynamicSortMultiple: (...args) => {
        /*
         * 保存args对象，因为它将被覆盖
         * 注意args对象是一个类似数组的对象
         * 由要排序的属性的名称组成
         */
        const props = args;
        return function (obj1, obj2) {
            let i = 0;
            let result = 0;
            const numberOfProperties = props.length;
            // 从0开始获取不同的结果，因为有多个属性需要比较
            while (result === 0 && i < numberOfProperties) {
                result = Common.dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        };
    },

    /**
     * 数组排序
     * @param data 原数组
     * @param field 排序关键字 'khdm'：正序  '-khdm': 倒序
     * 调用 sortTheList(array, 'khdm', '-ksrq',...)
     */
    sortTheList: (array, ...args) => array.sort(Common.dynamicSortMultiple(...args)),

};

export default Common;
