import React, { Component } from 'react';
import {
    
    Storage, MenuImg, MenuCardImg, MenuListTitle, SeparateLine, AlertCheckAccount, AlertDialog
} from '@libs/h5-libs';
import {
    NewsApi, QuoteApi,TDFunc, Auth, Bridge, DateFunc, TFloat, StorageList
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

const menuImgData = [
    { image: buyImg, title: '买入' },
    { image: sellImg, title: '卖出' },
    { image: removeImg, title: '撤单' },
    { image: queryImg, title: '查询' },
    { image: positionImg, title: '持仓' },
];

const menuImgCardData = [
    {
        title: '新股申购', dec: '今日新股', value: '2只', style: {
            // eslint-disable-next-line global-require
            backgroundImage: `url(${require('../../../assets/img/home/backgroundImage_xgsg.png').default})`
        },
    },
    {
        title: '国债理财', dec: '14天期', value: 'xxxx', style: {
            // eslint-disable-next-line global-require
            backgroundImage: `url(${require('../../../assets/img/home/backgroundImage_gzlc.png').default})`
        },
    }
]

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

let context = null;
/**
 * 设置未登录页面头部头像（与原生保持一致） [与APP交互使用,函数名不能随意修改]
 * @param {String} phone 头像图片名
 */
window.setHeaderPageAvatar = function (imageName) {
    Storage.set(StorageList.HEADER_PHOTO, imageName);
    context.setPhotoName(imageName)
}

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // defaultPhoto的图像编码
            imgUrl: '/df398ab89fd140a37ca1ef46b923a7fe.png',
            xgsl: '--',
            gzlc: {
                name: '--',
                value: '--'
            }
        };
        this.XGSG = this.XGSG.bind(this);
        this.GZLC = this.GZLC.bind(this)
        this.setPhotoName = this.setPhotoName.bind(this);
        this.onLogin = this.onLogin.bind(this)
    }

    componentWillMount() {
        this.setPhotoName();
    }

    componentDidMount() {
        context = this;
        this.XGSG();
        this.GZLC();
    }
    
    XGSG() {
        NewsApi.XGSG.ipo().then((res) => {
            const todayDate = new Date().Format('yyyyMMdd');
            const { stock } = res;
            let xgsl = 0;
            // 对发行日期是否是当日进行筛选
            for(let key in stock) {
                if(todayDate === stock[key].fxrq) {
                    xgsl++;
                }
            }
            this.setState({
                xgsl: `${xgsl}只`
            });
        })
    }

    GZLC() {
        var paramsSZ = {
            market: '1',
            stockType: 0,
            fieldmap: 2061584302080,
            sBKCode: "",
            wType: 530,
            rankfield: 21,
            direct: false, //0升序，1降序
            from: 0, //起始位置
            count: 100, //请求数量
            wTotalCount: null,
        };
        var paramsSH = {
            market: '2',
            stockType: 0,
            fieldmap: 2061584302080,
            sBKCode: "",
            wType: 530,
            rankfield: 21,
            direct: false, //0升序，1降序
            from: 0, //起始位置
            count: 100, //请求数量
            wTotalCount: null,
        };
        Promise.all([
            QuoteApi.send(paramsSZ),
            QuoteApi.send(paramsSH)
        ]).then((result)=> {
            // 1. 合并深圳/上海数据
            let gznhg = result.map((item)=> {
                item = item.getRepsList();
                if(item && item.length > 0) {
                    item = item[0].toObject().rep.dataarrList;
                }
                return item
            }).flat(Infinity);
            // 2. 分析数据
            gznhg = gznhg.map((item)=> {
                return this.analyGznhg(item, item.marketid);
            })
            // 3. 排序
            gznhg.sort(this.compareSth('rate', 'deadLine', 'market'))
            // 4. 赋值
            this.setState({
                gzlc: {
                    name: gznhg[0].deadLine,
                    value: gznhg[0].rate
                }
            })
        })
    }

    /**
     * 国债行情数据处理
     */
    analyGznhg(item, market) {
        var nhsylNum = TFloat.convert(item.apy);
        var nhsyl = nhsylNum.toFixed(3) + '%';
        var earningsNew = '--';
        if (item.earningsNew != undefined) {
            earningsNew = TFloat.convert(item.earningsNew).toFixed(3);
        }
        var zkts = item.ad.zkts;
        if (market == '1') {
            var mswyrsy = 1000 * (nhsylNum / 100.0) / 365.0;
            var dic = { market: 1, code: item.stockCode, deadLine: item.repurchaseName, jysdm: item.marketid, rate: nhsyl, mswyrsy: mswyrsy.toFixed(3), mwydqsy: earningsNew, zjzyts: zkts, flag: item.stockName };
        } else if (market == '2') {
            var mswyrsy = 100000 * (nhsylNum / 100.0) / 365.0;
            var dic = { market: 2, code: item.stockCode, deadLine: item.repurchaseName, jysdm: item.marketid, rate: nhsyl, mswyrsy: mswyrsy.toFixed(3), mwydqsy: earningsNew, zjzyts: zkts, flag: item.stockName };
        }
        for (var key in dic) {
            if (dic[key] == null) {
                dic[key] = '--';
            }
        }
        return dic;
    }

    /**
     * 国债理财行情数据排序
     */
    compareSth(item1, item2, item3) {
        return function (obj1, obj2) {
            if (obj1[item1] < obj2[item1]) {
                return 1;
            } else if (obj1[item1] > obj2[item1]) {
                return -1;
            } else {
                if (parseInt(obj1[item2]) < parseInt(obj2[item2])) {
                    return -1;
                } else if (parseInt(obj1[item2]) > parseInt(obj2[item2])) {
                    return 1;
                } else {
                    if (obj1[item3] < obj2[item3]) {
                        return -1;
                    } else if (obj1[item3] > obj2[item3]) {
                        return 1;
                    }
                }
            }
        }
    }

    setPhotoName(photoName) {
        photoName = photoName || Storage.get(StorageList.HEADER_PHOTO) || 'defaultPhoto';
        const img = import(`../../../assets/img/home/${photoName}.png`);
        img.then((res) => {
            this.setState({
                imgUrl: res.default
            })
        });
    }

    onLogin() {
        Auth.isRegister().then(() => {
            // 如果存在快捷跳转, 就删除快捷跳转标识
            if (Storage.get("quickJump")) {
                Storage.remove("quickJump");
            }
            Bridge.switchWebView('ptjy-login.html', 8, 1);
        }).catch(() => {
            AlertDialog.alert('提示信息', ['请先进行手机号码注册'], '确认', () => {
                Bridge.showRegisterViewJSBridge();
            }, '取消');
        });
        //如果存在智能语音跳转信息MM_INFO则清除
        if (Storage.get("MM_INFO")) {
            Storage.remove("MM_INFO");
        }
        
        //添加立即登录的点击事件的埋点
        TDFunc.onEvent("c_stli_01");
    }

    render() {
        const { imgUrl, xgsl, gzlc } = this.state;
        menuImgCardData[0].value = xgsl;
        menuImgCardData[1].dec = gzlc.name;
        menuImgCardData[1].value = gzlc.value;
        
        return (
            <div className='header'>
                <div className='no-login' onClick={this.onLogin}>
                    <div className='img-container'>
                        <img src={imgUrl} />
                    </div>
                    <p className='title'>{'交易登录>'}</p>
                </div>
                <MenuImg data={menuImgData} onClickItem={this.onLogin} />
                <MenuCardImg data={menuImgCardData} onClickItem={this.onLogin} />
                <SeparateLine />
                <MenuListTitle value='常用' image={commonTitleIcon} data={commonTitle} onClickItem={this.onLogin} />
                <SeparateLine />
                <MenuListTitle value='交易' image={tradeTitleIcon} data={tradeTitle} onClickItem={this.onLogin} />
                <SeparateLine />
                <MenuListTitle value='基金' image={fundTitleIcon} data={fundTitle} onClickItem={this.onLogin} />
                <SeparateLine />
                <MenuListTitle value='理财' image={manageMoneyTitleIcon} data={manageMoneyTitle} onClickItem={this.onLogin} />
                <SeparateLine />
                <MenuListTitle value='其他' image={otherTitleIcon} data={otherTitle} onClickItem={this.onLogin} />
            </div>
        );
    }
}
