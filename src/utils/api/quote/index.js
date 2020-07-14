import ProtoBuf from '../../axios/quote/protobuf_pb';
import { QuoteRequest } from '../../axios';

/**
 * 获取排序的选项
 */
const getRankOption = (wType, bSort, bDirect, wFrom, wCount, fields_bitMap) => {
    const rankOption = new ProtoBuf.rank_option();

    rankOption.setWtype(wType);
    rankOption.setBsort(bSort);
    rankOption.setBdirect(bDirect);
    rankOption.setWfrom(wFrom);
    rankOption.setWcount(wCount);
    rankOption.setFieldsBitmap(fields_bitMap);

    return rankOption;
};

/**
 * 获取股票排序请求
 */
const getStockRankReq = (options, wMarketID, sBKCode) => {
    const stockRankReq = new ProtoBuf.stockRank_req();
    stockRankReq.setOptions(options);
    stockRankReq.setWmarketid(wMarketID);
    stockRankReq.setSbkcode(sBKCode);

    return stockRankReq;
};

const getStockDetailReq = (market, code, type, params) => {
    const stock_united_req = new ProtoBuf.stock_united_req();
    stock_united_req.setWmarketid(market);// 市场代码
    stock_united_req.setSpszcode(code);// 股票代码
    stock_united_req.setWtype(type);// 股票类型

    let fieldmap = 0;
    if (params) {
        fieldmap = params.fieldmap || 0;

        if (params.kline) {
            const stock_kline_req = new ProtoBuf.stock_kline_req();
            stock_kline_req.setWkxtype(params.kline.wKXType);// k线类型
            stock_kline_req.setDwkxdate(params.kline.dwKXDate);// 0当前日期
            stock_kline_req.setDwkxtime(params.kline.dwKXTime);// 0当前时间
            stock_kline_req.setWkxcount(params.kline.wKXCount);// k线数据从dwKXDate,dwKXTime开始往前下发wKXCount个(不包含dwKXDate,dwKXTime时的k线数据)
            stock_kline_req.setWfqtype(params.kline.wFQType);// 复权类型
            stock_united_req.setKlineReq(stock_kline_req);// k线请求
        }

        if (params.fenshi) {
            const stock_timeDivision_req = new ProtoBuf.stock_timeDivision_req();
            stock_timeDivision_req.setDwfsdate(params.fenshi.dwFSDate);// 分时日期
            stock_timeDivision_req.setDwfstime(params.fenshi.dwFSTime);// 分时时间
            stock_timeDivision_req.setTimelineNhg(params.fenshi.timelineNhg); // 逆回购标识
            stock_united_req.setTimedivisionReq(stock_timeDivision_req);// 分时请求
        }

        if (params.detail) {
            const stock_tradeDetail_req = new ProtoBuf.stock_tradeDetail_req();
            stock_tradeDetail_req.setCount(params.detail.count);// 分笔个数
            stock_united_req.setTradedetailReq(stock_tradeDetail_req);// 分笔请求
        }
    }

    stock_united_req.setFieldsBitmap(fieldmap);

    return stock_united_req;
};

const QuoteApi = {
    /**
     * 排序请求
     * @param  {Object}   param    排序参数
     * @param  {Function} callback 请求成功后的回调
     */
    send(param) {
        if (param) {
            param.market = parseInt(param.market) || 3;
            param.stockType = parseInt(param.stockType || 0);
            param.fieldmap = param.fieldmap || 0;
            param.sBKCode = param.sBKCode || '';// 板块代码(请求板块中的证券代码排行时用)

            const rankOption = getRankOption(param.wType, param.rankfield, param.direct, param.from, param.count, param.fieldmap);
            const stockRankReq = getStockRankReq(rankOption, param.market, param.sBKCode);

            const multiStockRankReq = new ProtoBuf.multi_stockRank_req();
            multiStockRankReq.setReqsList([ stockRankReq ]);

            const MultiStockRankRep = ProtoBuf.multi_stockRank_rep;
            return QuoteRequest('pb_stockRank', multiStockRankReq, MultiStockRankRep);
        }
    },
    /**
     * 发送涨幅榜，跌幅榜请求
     * @param  {[type]}   from     起始位置
     * @param  {[type]}   count    个数
     * @param  {Function} callback 回调函数
     */
    sendTopDatas(from, count) {
        // 涨幅榜
        const rankAsc = getRankOption(0, 8, false, from, count, 4096);
        // 跌幅榜
        const rankDes = getRankOption(0, 8, true, from, count, 4096);
        // 换手率
        const rankHSL = getRankOption(0, 10, true, from, count, 36864);
        // 5分钟涨速榜
        const rankFiveUp = getRankOption(0, 14, true, from, count, 4096);
        // 振幅榜
        const rankZF = getRankOption(0, 9, true, from, count, 4160);
        // 量比榜
        const rankLB = getRankOption(0, 13, true, from, count, 12288);

        const stockRankAscReq = getStockRankReq(rankAsc, 3, '');
        const stockRankDesReq = getStockRankReq(rankDes, 3, '');
        const stockRankHSLReq = getStockRankReq(rankHSL, 3, '');
        const stockRankFiveUp = getStockRankReq(rankFiveUp, 3, '');
        const stockRankZF = getStockRankReq(rankZF, 3, '');
        const stockRankLB = getStockRankReq(rankLB, 3, '');

        const multiBlankRankReq = new ProtoBuf.multi_stockRank_req();
        multiBlankRankReq.setReqsList([ stockRankAscReq, stockRankDesReq, stockRankHSLReq, stockRankFiveUp, stockRankZF, stockRankLB ]);

        const MultiStockRankRep = ProtoBuf.multi_stockRank_rep;
        return QuoteRequest('pb_stockRank', multiBlankRankReq, MultiStockRankRep);
    },

    /**
     * 获取特定的股票数据
     * @codes   股票代码，使用','分隔，或者为数组
     * @markets 市场代码，使用','分隔，或者为数组
     */
    sendSelectedStocks(codes, markets, fieldmap, callback) {
        const requests = [];

        if (codes instanceof Array) {
            for (let i = 0; i < codes.length; i++) {
                const length = (codes[i].match(/,/g) || []).length + 1;
                const rankOption = getRankOption(0, 0, true, 0, length, fieldmap);
                const selectedStocks_req = new ProtoBuf.selectedStocks_req();
                selectedStocks_req.setPszcodes(codes[i]);
                selectedStocks_req.setMarketlist(markets[i]);
                selectedStocks_req.setOptions(rankOption);

                requests.push(selectedStocks_req);
            }
        } else {
            const length = (codes.match(/,/g) || []).length + 1;
            const rankOption = getRankOption(0, 0, true, 0, length, fieldmap);
            const selectedStocks_req = new ProtoBuf.selectedStocks_req();
            selectedStocks_req.setPszcodes(codes);
            selectedStocks_req.setMarketlist(markets);
            selectedStocks_req.setOptions(rankOption);

            requests.push(selectedStocks_req);
        }

        console.log(codes, markets);

        const multi_selectedStocks_req = new ProtoBuf.multi_selectedStocks_req();
        multi_selectedStocks_req.setReqsList(requests);

        return QuoteRequest('pb_selected', multi_selectedStocks_req, ProtoBuf.multi_selectedStocks_rep);
    },

    /**
     * 获取个股综合数据
     * @param {Number} 市场代码
     * @param {String} code 证券代码
     * @param {Number} type 股票类型
     * @param {Object} params 请求入参
     *                        fieldmap
     *                        kline
     *                        fenshi
     *                        detail
     *
     * @param {Function} callback 请求返回
     *
     */
    sendStockDetail(market, code, type, params, callback) {
        const result = [];
        market = parseInt(market);
        type = parseInt(type);
        if (params instanceof Array) {
            for (let i = 0; i < params.length; i++) {
                result.push(getStockDetailReq(market, code, type, params[i]));
            }
        } else {
            result.push(getStockDetailReq(market, code, type, params));
        }

        const multi_stock_united_req = new ProtoBuf.multi_stock_united_req();
        multi_stock_united_req.setReqsList(result);

        return QuoteRequest('pb_stockUnited', multi_stock_united_req, ProtoBuf.multi_stock_united_rep);
    },
};

export default QuoteApi;
