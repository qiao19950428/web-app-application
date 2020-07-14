import React, { Component } from 'react';
import {
    Storage,
    AssetsCard,
    MenuImg,
    MenuCardImg,
    MenuListTitle,
    SeparateLine,
    SubmitButton,
    AlertDialog
} from '@libs/h5-libs';
import { CheckAccountDialog } from '../../../components';
import {
    StringFunc, Auth, TradeApi, Common
} from '../../../utils';
import './index.less';

import buyImg from '../../../assets/img/home/ptjy_buy.png';
import sellImg from '../../../assets/img/home/ptjy_sell.png';
import removeImg from '../../../assets/img/home/ptjy_remove.png';
import queryImg from '../../../assets/img/home/ptjy_query.png';
import positionImg from '../../../assets/img/home/ptjy_position.png';
import commonTitleIcon from '../../../assets/img/home/icon_common.svg';
import tradeTitleIcon from '../../../assets/img/home/icon_trade.svg';
import fundTitleIcon from '../../../assets/img/home/icon_fund.svg';
import manageMoneyTitleIcon from '../../../assets/img/home/icon_manageMoney.svg';
import otherTitleIcon from '../../../assets/img/home/icon_other.svg';

import '../../../utils/timeout';

const menuImgData = [
    { image: buyImg, title: '买入', },
    { image: sellImg, title: '卖出' },
    { image: removeImg, title: '撤单' },
    { image: queryImg, title: '查询' },
    { image: positionImg, title: '持仓' },
];

const commonTitle = [
    { title: '交割单查询' },
    { title: '资金流水' },
    { title: '银证转账' },
    { title: '资金调度' },
];

const tradeTitle = [
    { title: '约定购回' },
    { title: '可转债可交换债' },
    { title: '债券回购' },
    { title: '股份转让' },
    { title: '港股通' },
    { title: '要约收购' },
    { title: '科创板盘后申报' },
];

const fundTitle = [
    { title: '货币基金' },
    { title: '开放式基金' },
    { title: 'ETF基金' },
    { title: 'LOF基金' },
    { title: '分级基金' },
];

const manageMoneyTitle = [
    { title: '元添利' },
    { title: '元增利' },
];

const otherTitle = [
    { title: '电子签约' },
    { title: '网络投票' },
    { title: '交易密码修改' },
    { title: '限售股查询' },
];
const { PTJY, } = TradeApi;

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '--',
            uesrAccount: '--',
            allAsset: {
                title: '--',
                value: '--',
            },
            data: [
                { title: '总市值', value: '--' },
                { title: '盈亏', value: '--' },
                { title: '可用', value: '--' },
                { title: '可取', value: '--' },
            ],

        };
        this.assets = [];
        this.onInit = this.onInit.bind(this);
        this.ZJCX = this.ZJCX.bind(this);
        this.ZJCXResponse = this.ZJCXResponse.bind(this);
        this.jumpToPage = this.jumpToPage.bind(this);
        this.checkAccount = this.checkAccount.bind(this);
    }

    componentDidMount() {
        this.onInit();
    }

    componentWillUnmount() {
    }

    /**
     * 初始化账号相关信息
     */
    onInit() {
        Auth.getTradeAccount('ptjy').then((user) => {
            if (user) {
                user = typeof user === 'object' ? user : JSON.parse(user);
                const userName = user.body.dlxx[0].khxm;
                const uesrAccount = user.body.dlxx[0].zjzh;
                this.setState({
                    userName, uesrAccount
                });
                this.ZJCX();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    /*
        资金查询
    */
    ZJCX() {
        PTJY.zjcx().then((res) => {
            const { zjlb } = res;
            if (zjlb) {
                this.assets = zjlb;
                this.ZJCXResponse();
            }
        });
    }

    /*
        资金查询回调，切换币种
    */
    ZJCXResponse() {
        const { assets } = this;
        const { active } = this.assetsCardRef.state;
        const { id, dec } = active;
        const title = `总资产（${dec}）`;
        for (let i = 0; i < assets.length; i++) {
            const { hbdm } = assets[i];
            if (id === hbdm) {
                const {
                    zzc, zsz, yk, zjkys, zjkqs
                } = assets[i] || '--';
                this.setState({
                    allAsset: {
                        title,
                        value: zzc,
                    },
                    data: [
                        { title: '总市值', value: zsz },
                        { title: '盈亏', value: yk },
                        { title: '可用', value: zjkys },
                        { title: '可取', value: zjkqs },
                    ],
                });
                return;
            }
        }
        this.reset(title);
    }

    reset(title) {
        this.setState({
            allAsset: {
                title,
                value: '--',
            },
            data: [
                { title: '总市值', value: '--' },
                { title: '盈亏', value: '--' },
                { title: '可用', value: '--' },
                { title: '可取', value: '--' },
            ],
        });
    }

    /*
        切换账户
    */
    checkAccount() {
        CheckAccountDialog.show('ptjy');
    }

    jumpToPage(title) {
        console.log(title);
    }

    showLogoutDialog() {
        AlertDialog.alert('退出确认', [ '确定要退出当前交易账号？' ], '确认', () => {
            Auth.logout();
            Auth.clearLoginInfo('ptjy');
            if (KmcLocalStorageFunction.getLocalData('ptjyMultiAccountLogin')) { // 清除多账号跳转标记
                KmcLocalStorageFunction.removeLocalData('ptjyMultiAccountLogin');
            }
            if (KmcLocalStorageFunction.getLocalData('rzrqMultiAccountLogin')) { // 清除多账号跳转标记
                KmcLocalStorageFunction.removeLocalData('rzrqMultiAccountLogin');
            }
            KmcInteraction.onLogout('ptjy');
            KmcCommonFunction.jumpHeaderPage('ptjy');
        });
    }

    render() {
        const trade = tradeTitle;
        trade[1].value = 'xiaoxiao';
        const {
            userName, uesrAccount, allAsset, data
        } = this.state;
        return (
            <div className='home'>
                <AssetsCard
                    ref={(ele) => { this.assetsCardRef = ele; }}
                    name={userName}
                    account={StringFunc.changeStr(uesrAccount, 3, -4, '*')}
                    allAsset={allAsset}
                    data={data}
                    onClickAccount={this.checkAccount}
                    onClickCurrency={this.ZJCXResponse}
                />
                <SeparateLine />
                <MenuImg data={menuImgData} onClickItem={this.jumpToPage} />
                <MenuCardImg onClickItem={this.jumpToPage} />
                <SeparateLine />
                <MenuListTitle value='常用' image={commonTitleIcon} data={commonTitle} onClickItem={this.jumpToPage} />
                <SeparateLine />
                <MenuListTitle value='交易' image={tradeTitleIcon} data={trade} onClickItem={this.jumpToPage} />
                <SeparateLine />
                <MenuListTitle value='基金' image={fundTitleIcon} data={fundTitle} onClickItem={this.jumpToPage} />
                <SeparateLine />
                <MenuListTitle value='理财' image={manageMoneyTitleIcon} data={manageMoneyTitle} onClickItem={this.jumpToPage} />
                <SeparateLine />
                <MenuListTitle value='其他' image={otherTitleIcon} data={otherTitle} onClickItem={this.jumpToPage} />
                <SeparateLine />
                <SubmitButton onClickButton={this.showLogoutDialog} />
                <SeparateLine />
            </div>
        );
    }
}
