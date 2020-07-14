import { Storage } from '@libs/h5-libs';
// eslint-disable-next-line import/no-cycle
import Bridge from './bridge';
import ViewList from './viewList';
import {
    PTJY_ACCOUNT_ACTIVE,
    RZRQ_ACCOUNT_ACTIVE,
    PTJY_ACCOUNT_LIST,
    RZRQ_ACCOUNT_LIST,
    PTJY_MULTI_ACCOUNT_LOGIN_FLAG,
    RZRQ_MULTI_ACCOUNT_LOGIN_FLAG,
    CELL_PHONE_NUMBER,
    QUICK_JUMP,
} from './storageList';

const {
    PTJY_HEADER,
    RZRQ_HEADER,
    PTJY_INDEX,
    RZRQ_INDEX,
    RZRQ_LOGIN,
    PTJY_LOGIN,
} = ViewList;

export default {
    /**
     * 获取当前登录的交易账号/数据(如没有则返回空"")
     * @param {string} type 登录类型(phone: 手机号、ptjy：普通交易、rzrq：融资融券、ggqq：个股期权、tradeMark：交易留痕等)
     */
    async getTradeAccount(type = 'ptjy') {
        const account = await new Promise((resolve) => {
            if (type === 'ptjy') {
                resolve(Storage.get(PTJY_ACCOUNT_ACTIVE));
            } else if (type === 'rzrq') {
                resolve(Storage.get(RZRQ_ACCOUNT_ACTIVE));
            }
        });
        return account;
    },

    /**
     * 设置当前登录的交易账号/数据
     * @param {string} type 登录类型(phone: 手机号、ptjy：普通交易、rzrq：融资融券、ggqq：个股期权、tradeMark：交易留痕等)
     * @param {Object} data
     */
    async setTradeAccount(type = 'ptjy', data = {}) {
        const account = await new Promise((resolve) => {
            if (type === 'ptjy') {
                resolve(Storage.set(PTJY_ACCOUNT_ACTIVE, data));
            } else if (type === 'rzrq') {
                resolve(Storage.set(RZRQ_ACCOUNT_ACTIVE, data));
            }
        });
        return account;
    },


    /**
     * 获取多账号登录列表
     * @param {string} type 登录类型(ptjy：普通交易、rzrq：融资融券、ggqq：个股期权)
     */
    async getMultiAccount(type = 'ptjy') {
        const userlist = await new Promise((resolve) => {
            if (type === 'ptjy') {
                resolve(Storage.get(PTJY_ACCOUNT_LIST));
            } else if (type === 'rzrq') {
                resolve(Storage.get(RZRQ_ACCOUNT_LIST));
            }
        });
        return userlist;
    },

    /**
     * 设置多账号登录列表
     * @param {string} type 登录类型(ptjy：普通交易、rzrq：融资融券、ggqq：个股期权)
     */
    async setMultiAccount(type = 'ptjy', list = []) {
        const userlist = await new Promise((resolve) => {
            if (type === 'ptjy') {
                resolve(Storage.set(PTJY_ACCOUNT_LIST, list));
            } else if (type === 'rzrq') {
                resolve(Storage.set(RZRQ_ACCOUNT_LIST, list));
            }
        });
        return userlist;
    },

    /**
     * 设置多账号登录的标识
     * @param {string} type 登录类型(ptjy：普通交易、rzrq：融资融券、ggqq：个股期权)
     */
    async setMultiAccountLoginFlag(type = 'ptjy') {
        const flag = await new Promise((resolve) => {
            if (type === 'ptjy') {
                resolve(Storage.set(PTJY_MULTI_ACCOUNT_LOGIN_FLAG, 'true'));
            } else if (type === 'rzrq') {
                resolve(Storage.set(RZRQ_MULTI_ACCOUNT_LOGIN_FLAG, 'true'));
            }
        });
        return flag;
    },

    /**
     * 获取多账号登录的标识
     * @param {string} type 登录类型(ptjy：普通交易、rzrq：融资融券、ggqq：个股期权)
     */
    async getMultiAccountLoginFlag(type = 'ptjy') {
        const flag = await new Promise((resolve) => {
            if (type === 'ptjy') {
                resolve(Storage.get(PTJY_MULTI_ACCOUNT_LOGIN_FLAG));
            } else if (type === 'rzrq') {
                resolve(Storage.get(RZRQ_MULTI_ACCOUNT_LOGIN_FLAG));
            }
        });
        return flag;
    },

    /**
     * 是否手机号码注册
     */
    async isRegister() {
        const phone = await new Promise((resolve, reject) => {
            if (Storage.get(CELL_PHONE_NUMBER)) {
                resolve();
            } else {
                reject();
            }
        });
        return phone;
    },

    /**
     * 登录
     * @param {string} type 交易类型（ptjy：普通交易、rzrq：融资融券、ggqq：个股期权）
     * @param {Object} data 登录后的信息data = {head: {}, body: {}}
     */
    login(type, data = {}) {
        this.setTradeAccount(type, data);
        // 多账户登录
        this.getMultiAccountLoginFlag(type).then(() => {
            this.getMultiAccount(type).then((list) => {
                list = JSON.parse(list);
                const len = list.length;
                const { khdm } = data.dlxx[0];
                for (let i = 0; i < len; i++) {
                    if (list[i].body.dlxx[0].khdm === khdm) {
                        return;
                    }
                }
                list[len] = data;
                this.setMultiAccount(type, list);
            });
        }).catch(() => {
            this.setMultiAccount(type, [ data ]);
        });

        if (Storage.get(QUICK_JUMP)) {
            Bridge.switchWebView();
        } else {
            this.jumpToIndex(type);
        }
    },

    /**
     * 退出登录状态
     * @param {string} type 交易类型（ptjy：普通交易、rzrq：融资融券、ggqq：个股期权）
     */
    logout(type = 'ptjy') {
        Bridge.onLogout(type);
        this.clearLoginInfo(type);
        this.jumpToHeader(type);
    },

    /**
     * 是否登录
     * @param {string} type 交易类型（ptjy：普通交易、rzrq：融资融券、ggqq：个股期权）
     */
    isLogin(type) {
        this.getTradeAccount(type).then(() => true).catch(() => false);
    },

    /**
    * 清除用户信息
    */
    clearLoginInfo(type) {
        Storage.remove('page');
        Storage.remove('zqdm');
        Storage.remove('jysdm');

        if (type === 'rzrq') {
            Storage.remove(RZRQ_ACCOUNT_ACTIVE);
            Storage.remove(RZRQ_ACCOUNT_LIST);
            Storage.remove(RZRQ_MULTI_ACCOUNT_LOGIN_FLAG);
        } else if (type === 'ptjy') {
            Storage.remove(PTJY_ACCOUNT_ACTIVE);
            Storage.remove(PTJY_ACCOUNT_LIST);
            Storage.remove(PTJY_MULTI_ACCOUNT_LOGIN_FLAG);
        }
        this.jumpToHeader(type);
    },

    /**
    * 跳转至未登录首页
    */
    jumpToHeader(type = 'ptjy') {
        Bridge.timerAction(type, 'stop');
        if (type === 'rzrq') {
            Bridge.switchWebView(RZRQ_HEADER, 4, -100);
        } else if (type === 'ptjy') {
            Bridge.switchWebView(PTJY_HEADER, 4, -100);
        }
    },

    /**
    * 跳转至已登录首页
    */
    jumpToIndex(type = 'ptjy') {
        Bridge.timerAction(type, 'start');
        if (type === 'rzrq') {
            Storage.remove(RZRQ_MULTI_ACCOUNT_LOGIN_FLAG);
            Bridge.switchWebView(RZRQ_INDEX, 8, -100);
        } else if (type === 'ptjy') {
            Storage.remove(PTJY_MULTI_ACCOUNT_LOGIN_FLAG);
            Bridge.switchWebView(PTJY_INDEX, 8, -100);
        }
    },
    /**
    * 跳转至登录页面
    */
    jumpToLogin(type) {
        if (type === 'rzrq') {
            Bridge.switchWebView(RZRQ_LOGIN, 8, 1);
        } else if (type === 'ptjy') {
            Bridge.switchWebView(PTJY_LOGIN, 8, 1);
        }
    }
};
