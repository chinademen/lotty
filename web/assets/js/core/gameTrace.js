(function(host, name, $, Event) {
    var defConfig = {
            id: -1,
            //游戏名称
            name: '',
            //文件名前缀
            jsNameSpace: '',
            //添加事件代理的主面板
            eventProxyPanel: 'body',

            sameTimesSetting: $('.J-trace-tongbei-times-filter a'), //同倍期数setting  
            sameTimesPeriods: $('#J-trace-tongbei-times'), //同倍期数
            sameTimesMultiple: $('#J-trace-tongbei-multiple-select'), //同期倍数

            doubledStartMultiple: $('#J-trace-fanbei-multiple'), //翻倍起始倍数
            doubledJump: $('#J-trace-fanbei-jump'), //翻倍 相隔
            doubledMultiple: $('#J-trace-fanbei-num'), //翻倍倍数
            doubledPeriods: $('#J-trace-fanbei-times'), //翻倍追号期数

            profitMinimumYield: $('#J-trace-lirunlv-num'), //利润率 最低收益率
            profitTraceTimes: $('#J-trace-lirunlv-times'), //利润率 追号期数
            profitStartTimes: $('#J-trace-lirunlv-multiple-select'), //利润率 起始倍数

            traceTimes: $('#J-trace-statistics-times'), //追号期数
            traceNum: $('#J-trace-statistics-lotterys-num'), //追号注数
            traceAmount: $('#J-trace-statistics-amount'), //追号方案总金额(元)
            availableBalance: $('#J-trace-statistics-balance'), //账户可用余额(元)

            winStopTrace: $('#J-trace-iswintimesstop'), //中奖后停止追号 

            scriptTmpl: {
                oneTrace: '#oneTraceTmpl',
                oneProfit: '#oneProfitTmpl'
            },
            container: {
                sameTimesTable: $('#tongbei-table'),
                profitTable: $('#lirunlv-table'),
                doubledTable: $('#fanbei-table')
            },
            buttonSameTimes: $('#buttonSameTimes'),
            buttonProfit: $('#buttonProfit'),
            buttonDoubled: $('#buttonDoubled'),
            traceStatisticsCountdown:$('#J-trace-statistics-countdown')
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            Games.setCurrentTrace(that);
            // console.log('GameTrace init');
            that.events();
        },
        //events here
        events: function() {
            var that = this;
            var cfg = that.defConfig;

            that.initTracePanel();
            that.initTracePeriods();
            that.initLimitNumberInput();
            that.initButtonSameTimes();
            that.initButtonDoubled();
            that.initButtonProfit();
            that.initCheckboxAndInput();

            //更新追号面板数据
            that.addEvent('updateTraceStatistics', function(e) {
                // console.log('trace  updateTraceStatistics >>>>')
                Games.getCurrentGame().defConfig.buttonTraceConfirm.removeClass('btn-disable');
                var currentGame = Games.getCurrentGame();;
                currentGame.compose(that.updateTraceStatistics, that.getUpdateTraceStatisics)();
            });

        },
        updateBalance: function() {
            //availableBalance
            var that = this;
            var cfg = that.defConfig;
            var data = {
                token:token,
            }
            var   postdata = urlEncode(data);
            ajaxData({
                url: baseUrl + "/game/current_user_info.do",
                data:{
                    params:postdata,
                    // merchant_identity:merchant_identity,
                },
                successCallback: function(msg) {
                    // console.log('updateBalance===>'+JSON.stringify(msg));
                    cfg.availableBalance.html(formatMoney(msg.available));
                    $(".top-money").text(formatMoney(msg.available));
                }
            });
        },
        initTracePanel: function() {
            var that = this;
            //追号类型切换
            $('#J-trace-panel .trace-radio a').on('click', function() {
                //chase-tab-content
                if ($(this).hasClass('current')) return;
                var index = $(this).data('index');
                $('#J-trace-panel .trace-radio a.current').removeClass('current');
                $(this).addClass('current');
                $('#J-trace-panel .chase-tab-content').removeClass('chase-tab-content-current');
                $('#J-trace-panel .chase-tab-content:eq(' + index + ')').addClass('chase-tab-content-current');
                that.fireEvent('updateTraceStatistics');//翻倍追号投注金额添加刷新功能JPG-1896
            });

        },

        initCheckboxAndInput: function() {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            //checkbox
            $(document).on('click', '.trace-table-list table .checkbox', function() {
                if (!this.checked) {
                    $(this).parents('tr').find('.input').attr('disabled', 'disabled');
                } else {
                    $(this).parents('tr').find('.input').removeAttr('disabled');
                }
                that.fireEvent('updateTraceStatistics');
            });

            $(document).on('keyup', '.trace-table-list table .input', function() {
                var order = gameOrder.getOrder(gameOrder.getBalls());
                var TMoney = 0;
                for(var i=0;i<order.balls.length;i++){
                    TMoney+=order.balls[i].moneyunit*2*$(this).val()*order.balls[i].num;
                }
                var oneMultiplePriceObj = gameOrder.getOneMultiplePrice();
                var onePrice = oneMultiplePriceObj.onePrice;
                var amount = Number($(this).val());
                $(this).parents('tr').find('.trace-row-money').html(gagame.util.formatMoney(TMoney));
                that.fireEvent('updateTraceStatistics');
            });

            // checkAll checkbox
            $(document).on('click', '.chase-tab-content-current .checkedAll', function() {
                var checkboxs = $('.chase-tab-content-current .trace-table-list .checkbox');
                if (this.checked) {
                    checkboxs.prop('checked', 'checked');
                } else {
                    checkboxs.prop('checked', false);
                }
                that.fireEvent('updateTraceStatistics');
            });

        },
        //更新追号面板数据
        updateTraceStatistics: function(obj) {
            var moneySpans = $('#J-trace-panel').find("span.trace-row-money");
            var totalMoney = 0;
            for(var i=0;i<moneySpans.length;i++){
                totalMoney+=parseFloat(moneySpans[i].innerHTML.replace(/,/g,''));
            }
            var that = Games.getCurrentTrace();
            var cfg = that.defConfig;
            cfg.traceTimes.html(obj.traceTimes);
            cfg.traceNum.html(obj.traceNum);
            cfg.traceAmount.html(gagame.util.formatMoney(totalMoney, 3));
            var amount = cfg.traceAmount.html();
            amount = amount.replace(/,/g,'');
            if(parseFloat(amount)<=0){
                $("#J-button-trace-confirm").addClass('btn-disable');
            }
            //cfg.availableBalance.html(obj.availableBalance);
        },
        getUpdateTraceStatisics: function() {
            var that = Games.getCurrentTrace();
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            var oneMultiplePriceObj = gameOrder.getOneMultiplePrice();
            var onePrice = oneMultiplePriceObj.onePrice;
            var num = oneMultiplePriceObj.num;
            var table = $('.chase-tab-content-current .trace-table-list table');
            var period = table.find('input[type=checkbox]:checked').size();
            var amount = 0;

            var orders = {};
            table.find('input[type=checkbox]:checked').each(function(index, item) {
                amount += Number($(this).parents('tr').find('.input').val()) * onePrice;
                var period = $.trim($(this).next().html());
                var multiple = $(this).parents('tr').find('.input').val();
                orders[period] = multiple;
            });

            return {
                traceTimes: period,
                traceNum: num * period,
                amount: amount,
                //availableBalance: 1000,
                orders: orders
            };
        },
        getTraceSumitData: function() {
            var that = this;
            var obj = that.getUpdateTraceStatisics();
            var winStopTrace = that.getWinStopTrace();
            return {
                traceTimes:obj.traceTimes,
                amount: obj.amount.toFixed(4),
                orders: obj.orders,
                isTrace: 1
            };
        },
        initButtonProfit: function() {
            var that = this;
            var cfg = that.defConfig;
            cfg.buttonProfit.on('click', function() {
                var data = that.getButtonProfitData();
                // console.log(data)
                var gameOrder = Games.getCurrentGameOrder();
                var balls = gameOrder.getBalls();
                if(balls.length>0){
                    for(var i=1;i<balls.length;i++){
                        if(balls[0].typeCN!=balls[i].typeCN || balls[0].moneyunit!= balls[i].moneyunit){
                            $("#J-trace-panel").hide();
                            Games.getCurrentMessage().show('normal',{error:'利润率追号不支持混投。' + '请确保您的投注都为同一玩法类型。' + '且元角模式一致。'});
                        }
                    }
                }
                if (data.length > 0) {
                    Games.getCurrentGame().render({
                        container: cfg.container.profitTable,
                        data: {
                            data: data
                        },
                        tmplObj: cfg.scriptTmpl.oneProfit,
                        needClear: true
                    });
                    // var money = 0;
                    // for(var i=0;i<data.length;i++){
                    //     money+=parseFloat(data[i].amount);
                    // }
                    // cfg.traceAmount.html(gagame.util.formatMoney(money, 3));
                    that.fireEvent('updateTraceStatistics');
                }else{
                    Games.getCurrentMessage().show('normal',{error:'您设置的参数无法达到盈利，请重新设置'});

                }
            });
        },
        //profitMinimumYield 盈利率
        //prize 所有注单的单倍价格
        //onePrice 单注单价
        //profitTraceTimes 需要运行的期数
        //multiple 起始倍数
        //maxnum 最大可设的倍数
        getButtonProfitData: function() {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();

            var profitMinimumYield = Number(cfg.profitMinimumYield.val()) / 100; // 最低收益率
            var profitTraceTimes = Number(cfg.profitTraceTimes.val()); // 追号期数
            var profitStartTimes = Number(cfg.profitStartTimes.val()); // 起始倍数

            var currentGame = Games.getCurrentGame();
            var currentGameConfig = Games.getCurrentGameConfig();
            var gameNumbers = currentGameConfig.getGameNumbers();
            if(profitTraceTimes>gameNumbers.length){
                profitTraceTimes = gameNumbers.length;
                cfg.profitTraceTimes.val(profitTraceTimes);
            }
            if(profitTraceTimes>360){
                profitTraceTimes = 360;
                $("#J-trace-tongbei-times").val(profitTraceTimes);
            }
            var gameCfg = Games.getCurrentGameConfig();
            var lotteryNumber = gameCfg.getCurrentGameNumber();
            for(var j=0;j<gameNumbers.length;j++){
                if(lotteryNumber ==gameNumbers[j].number){
                    gameNumbers=gameNumbers.slice(j);
                }
            }
            var order = gameOrder.getOrder(gameOrder.getBalls());


            var oneMultiplePriceObj = gameOrder.getOneMultiplePrice();
            var onePrice = oneMultiplePriceObj.onePrice;
            var prize = oneMultiplePriceObj.userGroupMoney;


            var multiple = profitStartTimes;
            var maxnum = currentGame.getMaxMultiple();
            var data = [];
            var a = 1;
            var i = 1;
            //当期倍数＝ceil((总花销*(1+盈利率)/(单倍奖金-单倍成本*(1+盈利率)))
            while (i<=profitTraceTimes){

                var gameData = gameNumbers[i];
                var winAmountAll, amount, allBetAmount = 0;

                // multiple = Math.ceil(amountAll * (1 + profitMinimumYield) / (prize - onePrice * (1 + profitMinimumYield))) + profitStartTimes;
                if (multiple < 1) {
                    break;
                }
                if (i == 0) {
                    multiple = multiple > maxnum ? maxnum : profitStartTimes;
                } else {
                    multiple = multiple > maxnum ? maxnum : multiple;

                }
                var amountAll = multiple * prize; // 奖金
                amount = onePrice * multiple; // 金额

                allBetAmount = amount

                for(var j = 0; j<data.length;j++){
                    allBetAmount = parseFloat((data[j].amount).replace(/,/g,'')) + allBetAmount

                }

                winAmountAll = amountAll - allBetAmount;  // 预期盈利金额

                if(multiple == maxnum){
                    if((winAmountAll / allBetAmount)<profitMinimumYield ){
                        Games.getCurrentMessage().show('normal',{error:'您设置的参数无法达到盈利，请重新设置'});
                        break;
                    }
                }
                if((winAmountAll / allBetAmount)>=profitMinimumYield ){

                    data.push({
                        index: i,
                        period: gameData.number,
                        multiple: multiple,                                                            // 倍数
                        amount: gagame.util.formatMoney(amount, 3),                                    // 金额
                        amountAll: gagame.util.formatMoney(amountAll, 3),                              // 奖金
                        winAmountAll: gagame.util.formatMoney(winAmountAll, 3),                        // 预期盈利金额
                        expectedProfitability: ((winAmountAll / allBetAmount) * 100).toFixed(2) + '%'  // 预期盈利率
                    });
                    i ++
                }else{
                    multiple += 1;

                }
            }
            return data;
        },
        clearTableData: function() {
            var that = this;
            var cfg = that.defConfig;
            cfg.container.sameTimesTable.html('');
            cfg.container.profitTable.html('');
            cfg.container.doubledTable.html('');
            cfg.traceTimes.html(0);
            cfg.traceNum.html(0);
            cfg.traceAmount.html(0.00);
            $("#J-button-trace-confirm").addClass('btn-disable');
        },
        initButtonDoubled: function() {
            var that = this;
            var cfg = that.defConfig;
            cfg.buttonDoubled.on('click', function() {
                var data = that.getButtonDoubledData();
                if (data.length > 0) {
                    Games.getCurrentGame().render({
                        container: cfg.container.doubledTable,
                        data: {
                            data: data
                        },
                        tmplObj: cfg.scriptTmpl.oneTrace,
                        needClear: true
                    });
                    var money = 0;
                    for(var i=0;i<data.length;i++){
                        money+=parseFloat(data[i].amount);
                    }
                    cfg.traceAmount.html(gagame.util.formatMoney(money, 3));
                    that.fireEvent('updateTraceStatistics');
                }
            });
        },
        getButtonDoubledData: function() {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();

            var doubledStartMultiple = cfg.doubledStartMultiple.val();
            var multiple = doubledStartMultiple;
            var doubledJump = cfg.doubledJump.val();
            var jump = doubledJump;

            var doubledMultiple = cfg.doubledMultiple.val();
            var doubledPeriods = cfg.doubledPeriods.val();

            var currentGameConfig = Games.getCurrentGameConfig();
            var gameNumbers = currentGameConfig.getGameNumbers();
            if(doubledPeriods>gameNumbers.length){
                doubledPeriods = gameNumbers.length;
                cfg.doubledPeriods.val(doubledPeriods);
            }
            if(doubledPeriods>360){
                doubledPeriods = 360;
                $("#J-trace-tongbei-times").val(doubledPeriods);
            }
            var gameCfg = Games.getCurrentGameConfig();
            var lotteryNumber = gameCfg.getCurrentGameNumber();
            for(var j=0;j<gameNumbers.length;j++){
                if(lotteryNumber ==gameNumbers[j].number){
                    gameNumbers=gameNumbers.slice(j);
                }
            }
            var order = gameOrder.getOrder(gameOrder.getBalls());

            var oneMultiplePriceObj = gameOrder.getOneMultiplePrice();
            var onePrice = oneMultiplePriceObj.onePrice;
            var data = [];
            for (var i = 0; i < doubledPeriods; i++) {
                var gameData = gameNumbers[i];
                if (jump < 1) {
                    jump = doubledJump;
                    multiple *= doubledMultiple;
                }
                data.push({
                    index: i + 1,
                    period: gameData.number,
                    multiple: multiple,
                    amount: gagame.util.formatMoney(onePrice * multiple, 3),
                    publishTime: gameData.time
                });
                jump--;
            }
            return data;
        },
        initButtonSameTimes: function() {
            var that = this;
            var cfg = that.defConfig;
            cfg.buttonSameTimes.on('click', function() {
                var data = that.getSameTimesData();
                if (data.length > 0) {
                    Games.getCurrentGame().render({
                        container: cfg.container.sameTimesTable,
                        data: {
                            data: data
                        },
                        tmplObj: cfg.scriptTmpl.oneTrace,
                        needClear: true
                    });
                    // if(data.length > 0) {
                    //     var lotterys_num, amount;
                    //     lotterys_num = $("#J-trace-statistics-lotterys-num").html();
                    //     amount = $("#J-trace-statistics-amount").html();
                    //     $("#J-gameOrder-lotterys-num").html(lotterys_num);
                    //     $("#J-gameOrder-amount").html(amount);
                    // }
                    that.fireEvent('updateTraceStatistics');
                    var money = 0;
                    for(var i=0;i<data.length;i++){
                        money+=parseFloat(data[i].amount);
                    }
                    cfg.traceAmount.html(gagame.util.formatMoney(money, 3));
                    // that.fireEvent('updateTraceStatistics');
                    Games.getCurrentGame().defConfig.buttonTraceConfirm.removeClass('btn-disable');
                }
            });
        },
        getSameTimesData: function() {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            var sameTimesPeriods = cfg.sameTimesPeriods.val();
            var multiple = cfg.sameTimesMultiple.val();
            var currentGameConfig = Games.getCurrentGameConfig();

            if(currentGameConfig.defConfig.data.gameNameEn.indexOf('MMC')!=-1){
                var num = $("#J-trace-tongbei-times").val();
                num = parseInt(num);
                var gameNumbers = [];
                for(var i=1;i<=num;i++){
                    gameNumbers.push(i);
                }
            }else {
                gameNumbers = currentGameConfig.getGameNumbers();
                if(sameTimesPeriods>gameNumbers.length){
                    sameTimesPeriods = gameNumbers.length;
                    $("#J-trace-tongbei-times").val(sameTimesPeriods);
                }
                if(sameTimesPeriods>360){
                    sameTimesPeriods = 360;
                    $("#J-trace-tongbei-times").val(sameTimesPeriods);
                }
                var gameCfg = Games.getCurrentGameConfig();
                var lotteryNumber = gameCfg.getCurrentGameNumber();
                for(var j=0;j<gameNumbers.length;j++){
                    if(lotteryNumber == gameNumbers[j].number){
                        gameNumbers=gameNumbers.slice(j);
                    }
                }
            }

            var order = gameOrder.getOrder(gameOrder.getBalls());
            var TMoney = 0;
            for(var i=0;i<order.balls.length;i++){
                TMoney+=order.balls[i].moneyunit*2*order.balls[i].num;
            }
            var oneMultiplePriceObj = gameOrder.getOneMultiplePrice();
            var onePrice = oneMultiplePriceObj.onePrice;
            var data = [];
            for (var i = 0; i < sameTimesPeriods; i++) {
                var gameData = gameNumbers[i];
                data.push({
                    index: i + 1,
                    period: gameData.number,
                    multiple: multiple,
                    amount: gagame.util.formatMoney(TMoney),
                    publishTime: gameData.time
                });
            }
            return data;
        },

        //同倍期数设置
        initTracePeriods: function() {
            var that = this;
            var cfg = that.defConfig;
            cfg.sameTimesSetting.on('click', function() {
                if ($(this).hasClass('current')) return;
                cfg.sameTimesSetting.removeClass('current');
                $(this).addClass('current');
                var value = $(this).data('value');
                cfg.sameTimesPeriods.val(value);
            });
        },
        // 中奖后停止追号
        getWinStopTrace: function() {
            var that = this;
            var cfg = that.defConfig;
            var data = {
                traceWinStop: 0
            };
            if (cfg.winStopTrace[0].checked ) {
                data = {
                    traceWinStop: 1
                }
            }

            return data;
        },
        // 中奖后停止追号
        getWinStopTrace_mmc: function(num) {
            var that = this;
            var cfg = that.defConfig;
            var data = {
                traceWinStop: 0
            };
            var lottery_num = $("#J-trace-statistics-lotterys-num").html();
            lottery_num  = parseInt(lottery_num);
            if (cfg.winStopTrace[0].checked && num>0 && lottery_num) {
                // console.log(1111);
                data = {
                    traceWinStop: 1
                }
            }
            // console.log(data);
            return data;
        },

        //数字输入限制
        initLimitNumberInput: function() {
            $(document).on('keydown', '#J-trace-panel .input', function(event) {

                if (!(event.keyCode == 35) && !(event.keyCode == 36) && !(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39)) {
                    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
                        return false;
                    }
                    if ($.trim($(this).val()).length > 6) {
                        return false;
                    }
                }
            }).on('keyup', function() {
                var v = parseInt($.trim(this.value));
                if (v <= 1) {
                    this.value = 1;
                }
                //todo 
            });
        }

    };



    var Main = host.ExtendClass(pros, Event);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;
})(gagame, 'GameTrace', jQuery, gagame.Event);