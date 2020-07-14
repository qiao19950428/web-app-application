// 智能语音标识
export const MM_INFO = 'MM_INFO';
// 当前正在活动的普通交易账户
export const PTJY_ACCOUNT_ACTIVE = 'ActivePTJYUser';
// 当前正在活动的融资融券账户
export const RZRQ_ACCOUNT_ACTIVE = 'ActiveRZRQUser';
// 将要进行普通交易多账户登录的标识
export const PTJY_MULTI_ACCOUNT_LOGIN_FLAG = 'ptjyMultiAccountLogin';
// 将要进行融资融券多账户登录的标识
export const RZRQ_MULTI_ACCOUNT_LOGIN_FLAG = 'rzrqMultiAccountLogin';
// 已经登录过的所有普通交易账户
export const PTJY_ACCOUNT_LIST = 'ptjyAccount';
// 已经登录过的所有融资融券账户
export const RZRQ_ACCOUNT_LIST = 'rzrqAccount';
// 历史登录过的普通交易账户
export const PTJY_ACCOUNT_HISTORY = 'ptjyLszhList';
// 历史登录过的融资融券账户
export const RZRQ_ACCOUNT_HISTORY = 'rzrqLszhList';
// 用户手机号码
export const CELL_PHONE_NUMBER = 'cellPhoneNumber';
// 快捷跳转
export const QUICK_JUMP = 'quickJump';
// 交易服务器环境
export const TRADE_API_URL = 'apiUrl';
// 行情服务器环境
export const QUOTE_API_URL = 'hqUrl';
// 资讯服务器环境
export const NEWS_API_URL = 'apiUrlNews';
// 行情自动刷新时间间隔
export const QUOTE_REFRESH_INTERNAL = 'hqtime';
// APP主题
export const APP_THEME = 'theme';
// APP字体大小
export const APP_FONT_SIZE = 'fontSize';
// 交易/两融首页头像
export const HEADER_PHOTO = 'headerPhoto';

const StorageList = {
    MM_INFO,
    PTJY_ACCOUNT_ACTIVE,
    RZRQ_ACCOUNT_ACTIVE,
    PTJY_MULTI_ACCOUNT_LOGIN_FLAG,
    RZRQ_MULTI_ACCOUNT_LOGIN_FLAG,
    PTJY_ACCOUNT_LIST,
    RZRQ_ACCOUNT_LIST,
    PTJY_ACCOUNT_HISTORY,
    RZRQ_ACCOUNT_HISTORY,
    CELL_PHONE_NUMBER,
    QUICK_JUMP,
    TRADE_API_URL,
    QUOTE_API_URL,
    NEWS_API_URL,
    QUOTE_REFRESH_INTERNAL,
    APP_THEME,
    APP_FONT_SIZE,
    HEADER_PHOTO,
};

export default StorageList;
