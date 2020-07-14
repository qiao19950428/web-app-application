import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
    AlertDialog, InputBasic, Toast, Storage
} from '@libs/h5-libs';
import { Auth, Bridge, TradeApi } from '../../utils';
import './style';

class LockDialog extends React.Component {
    /**
     * 解锁
     */
    handleUnlock() {
        const { type, onClose } = this.props;
        const jymm = this.pwd.getValue();
        if (!jymm) {
            Toast.alert('请输入交易密码');
            return;
        }
        TradeApi[type.toLocaleUpperCase()].login({ jymm }).then(() => {
            if (type === 'ptjy') {
                Storage.remove('PTJYTimeOut');
            } else {
                Storage.remove('RZRQTimeOut');
            }
            Bridge.unlockTrade(type);
            Bridge.timerAction(type, 'start');
            if (onClose) {
                onClose();
            }
        }).catch(() => {});
    }

    /**
     * 注销
     */
    handleLogout() {
        const { type, onClose } = this.props;
        Bridge.hideKeyBoard();
        Auth.clearLoginInfo(type);

        Bridge.onLogout(type);
        if (type === 'ptjy') {
            Storage.remove('PTJYTimeOut');
            Bridge.switchWebView('ptjy-header.html', 4, -100);
        } else if (type === 'rzrq') {
            Storage.remove('RZRQTimeOut');
            Bridge.switchWebView('ptjy-header.html', 4, -100);
        }
        if (onClose) {
            onClose();
        }
    }

    render() {
        const { type, visible, account } = this.props;
        const title = type === 'rzrq' ? '信用账号' : '普通账号';
        return (
            <AlertDialog
                title={title}
                visible={visible}
                confirm='解锁'
                cancel='注销'
                onConfirm={() => this.handleUnlock()}
                onCancel={() => this.handleLogout()}
            >
                <div className='lock-wrapper'>
                    <div className='item'>
                        <div className='item-title'>
                            <span>锁定账号</span>
                        </div>
                        <div className='item-value'>
                            <span>{account}</span>
                        </div>
                    </div>
                    <div className='item'>
                        <div className='item-title'>
                            <span>交易密码</span>
                        </div>
                        <div className='item-value'>
                            <InputBasic
                                className='lock-pwd'
                                ref={(e) => { this.pwd = e; }}
                                placeholder='请输入交易密码'
                                type='password'
                                nativeKeyboard
                                keyboardType={3}
                            />
                        </div>
                    </div>
                </div>
            </AlertDialog>
        );
    }
}

LockDialog.defaultProps = {
    type: 'ptjy',
    account: '',
    visible: false,
    onClose: () => {},
};

LockDialog.propTypes = {
    type: PropTypes.oneOf([ 'ptjy', 'rzrq' ]),
    account: PropTypes.string,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
};

LockDialog.show = (type) => {
    Auth.getTradeAccount(type).then((user) => {
        if (type === 'ptjy' || type === 'kfsjj') {
            Storage.set('PTJYTimeOut', 'true');
        } else {
            Storage.set('RZRQTimeOut', 'true');
        }
        const account = user ? user.head.khbz : '';

        let div = document.getElementById(`lock-dialog-${type}`);
        function close() {
            ReactDOM.unmountComponentAtNode(div);
            if (div && div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }
        if (div) {
            close();
        }
        div = document.createElement('div');
        div.setAttribute('id', `lock-dialog-${type}`);
        document.body.appendChild(div);

        ReactDOM.render(
            <LockDialog
                type={type}
                account={account}
                visible
                onClose={() => close()}
            />,
            div
        );
    }).catch((err) => {
        Toast.alert('当前用户信息不存在');
    });
};

LockDialog.hide = (type) => {
    const div = document.getElementById(`lock-dialog-${type}`);
    if (div && div.parentNode) {
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
    }
};

export default LockDialog;
