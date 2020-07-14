import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AlertDialog } from '@libs/h5-libs';
import { Auth, Bridge } from '../../utils';
import checkImg from '../../assets/img/home/icon_select.svg';
import delImg from '../../assets/img/home/icon_delete.svg';
import './style';

class CheckAccountDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            userList: props.userList
        };
        this.checkUser = this.checkUser.bind(this);
        this.delUser = this.delUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.getChilden = this.getChilden.bind(this);
        this.changeAccount = this.changeAccount.bind(this);
    }

    /*
        获取弹窗内部子元素
    */
    getChilden() {
        const { onClose } = this.props;
        const { userList, user } = this.state;
        const account = user.body.dlxx[0].zjzh;
        const name = user.body.dlxx[0].khxm;
        return userList.map((child) => {
            const { zjzh, khxm } = child.body.dlxx[0];
            if (zjzh === account && khxm === name) {
                return (
                    <li id='active-account' onClick={onClose}>
                        <label>{khxm}</label>
                        <label>{this.changeAccount(zjzh)}</label>
                        <label>
                            <img src={checkImg} />
                        </label>
                    </li>
                );
            }
            return (
                <li onClick={this.checkUser.bind(this, child)}>
                    <label>{khxm}</label>
                    <label>{this.changeAccount(zjzh)}</label>
                    <label className='del' onClick={this.delUser.bind(this, child)}>
                        <img className='del' src={delImg} />
                    </label>
                </li>
            );
        });
    }

    /*
        切换用户
    */
    checkUser(user, e) {
        // 阻止删除用户的事件冒泡
        if (e.target && e.target.className === 'del') {
            return;
        }
        const { userList } = this.state;
        const { type, onClose, onSwitch } = this.props;
        const account = user.body.dlxx[0].zjzh;
        const name = user.body.dlxx[0].khxm;
        const len = userList.length;
        for (let i = 0; i < len; i++) {
            const child = userList[i];
            const {
                zjzh,
                khxm,
                yybdm,
                khdm
            } = child.body.dlxx[0];
            const { jymm } = child.head;
            if (zjzh === account && khxm === name) {
                Auth.setTradeAccount(type, user);
                const info = {
                    ywlx: type,
                    password: jymm,
                    code: yybdm,
                    name: khxm,
                    login: zjzh,
                    customerCode: khdm,
                };
                Bridge.onLoginTrade(info);
                break;
            }
        }
        if (onSwitch) {
            onSwitch();
        }
        if (onClose) {
            onClose();
        }
    }

    /*
        删除用户
    */
    delUser(user) {
        const { userList } = this.state;
        const { type } = this.props;
        const account = user.body.dlxx[0].zjzh;
        const name = user.body.dlxx[0].khxm;
        const len = userList.length;
        for (let i = 0; i < len; i++) {
            const child = userList[i];
            const {
                zjzh,
                khxm,
            } = child.body.dlxx[0];
            if (zjzh === account && khxm === name) {
                userList.splice(i, 1);
                Auth.setMultiAccount(type, userList);
                break;
            }
        }
        this.setState({
            userList
        });
    }

    /*
        添加用户
    */
    addUser() {
        const { type, onClose } = this.props;

        Bridge.timerAction(type, 'stop');
        Auth.setMultiAccountLoginFlag(type);
        Auth.jumpToLogin(type);
        if (onClose) {
            onClose();
        }
    }

    /*
        将账号进行加密
    */
    changeAccount(account) {
        return `${account.substr(0, 2)}****${account.substr(account.length - 4, account.length)}`;
    }

    render() {
        const {
            visible,
        } = this.props;
        return (
            <AlertDialog
                ref={(ele) => { this.dailog = ele; }}
                visible={visible}
                title='账号切换'
                confirm='添加账号'
                cancel='关闭'
                onConfirm={this.addUser}
            >
                <div className='check-account-wrapper'>
                    <ul>
                        {
                            this.getChilden()
                        }
                    </ul>
                </div>
            </AlertDialog>
        );
    }
}

CheckAccountDialog.defaultProps = {
    type: 'ptjy',
    userList: [],
    user: {},
    visible: false,
    onClose: () => {},
    onSwitch: () => {},
};

CheckAccountDialog.propTypes = {
    type: PropTypes.oneOf([ 'ptjy', 'rzrq' ]),
    userList: PropTypes.array,
    user: PropTypes.object,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onSwitch: PropTypes.func,
};

CheckAccountDialog.show = (type, options = {}) => {
    Promise.all([
        Auth.getTradeAccount(type),
        Auth.getMultiAccount(type)
    ]).then(([ user, userList ]) => {
        if (userList) {
            userList = (typeof userList === 'object' ? userList : JSON.parse(userList)) || [];
        }
        if (user) {
            user = typeof user === 'object' ? user : JSON.parse(user);
        }
        let div = document.getElementById(`check-account-dialog-${type}`);
        function close() {
            ReactDOM.unmountComponentAtNode(div);
            if (div && div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }
        if (div) {
            close();
        }
        const { onSwitch } = options;
        div = document.createElement('div');
        div.setAttribute('id', `check-account-dialog-${type}`);
        document.body.appendChild(div);

        ReactDOM.render(
            <CheckAccountDialog
                type={type}
                visible
                user={user}
                userList={userList}
                onClose={() => close()}
                onSwitch={onSwitch}
            />,
            div
        );
    });
};

export default CheckAccountDialog;
