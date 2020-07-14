import { Storage } from '@libs/h5-libs';
import { LockDialog } from '../components';
import Bridge from './bridge';

window.TimeoutHandler = function (type = '') {
    Bridge.hideKeyBoard();
    LockDialog.show(type);
};

window.RestoreTimeOut = function () {
    if (Storage.get('PTJYTimeOut') === 'true') {
        if (document.location.href.indexOf('ptjy-login.html') > 0 || document.location.href.indexOf('ptjy-header.html') > 0) {
            Storage.remove('PTJYTimeOut');
            Storage.remove('ActivePTJYUser');
        } else {
            window.TimeoutHandler(window.type);
        }
    }

    // 融资融券首页,登录页不弹出锁定框
    if (Storage.get('RZRQTimeOut') === 'true') {
        if (document.location.href.indexOf('rzrq-login.html') > 0 || document.location.href.indexOf('rzrq-header.html') > 0) {
            Storage.remove('RZRQTimeOut');
            Storage.remove('ActiveRZRQUser');
        } else {
            window.TimeoutHandler(window.type);
        }
    }
};

export default LockDialog;
