(function(host, name, $, Event) {
    var Games = host.Games;
    var defConfig = {
        id: -1,
        debug: true,
        //游戏名称
        name: '',
        //文件名前缀
        jsNameSpace: '',
        //添加事件代理的主面板
        eventProxyPanel: 'body',
        scriptTmpl: {
            gameTypes: '#D-panel-gameTypes', //游戏玩法群
            games: '#D-gametyes-menu-panel' //游戏玩法
        },
        container: {
            gameTypes: $('#J-panel-gameTypes'), //玩法类型
            games: $('#J-gametyes-menu-panel'), //具体玩法
            gamesHistory: $('#J-minitrend-cont'), //游戏开奖历史列表
            ballSection: $('.ball-section'), //选球区域
            pickRule: $('.pick-rule .ui-tip-text'), //选号规则
            winInfo: $('.win-info .ui-tip-text'), //中奖说明
            moneyunit: $('#J-balls-statistics-moneyUnit'), //元角模式
            multipleNum: $('#J-balls-statistics-multipleNum'), //倍数
            multipleInput: $('.multiple-choose .input'),
            tracemultipleInput: $('.trace-row-multiple input')
        },
        lastestLotteryNumer: $('#J-ernie-issue'), //当前开奖期号
        headerCurrentNumber: $('#J-header-currentNumber'), //最新开奖期
        buttonAddOrder: $('#J-add-order'), //添加号码  

        buttonImmediatelyBetting: $('#J-fast-submit'), //立即投注
        buttonConfirmBet: $('#buttonConfirmBet'), //确认投注
        buttonTraceConfirm: $('#J-button-trace-confirm'), //确认追号投注

        buttonTraceBet: $('#buttonTraceBet'), //追号投注 
        tracePanel: $('#J-trace-panel'), //追号层 
        smallMoneyTip: $('#smallMoneyTip'),
        //倍数 
        //奖金组组件
        prizeSlider: {
            prizeGroupParent: $('.J-prize-group-slider'),
            prizeGroupInput: $('#J-bonus-select-value'),
            prizeGroupPercent: $('.J-prize-group-slider').find('[data-slider-percent]'),
            prizeGroupValue: $('.J-prize-group-slider').find('[data-slider-value]')
        },
        mask: $('#maskOfXGAME'),
        shoppingCart: $('.J-cart-empty'),
        lotteryLogo: $('#J-lottery-logo')
    };


    var pros = {
        //初始化
        moneyunit: null,
        init: function (options) {
            var that = this;
            var cfg = that.defConfig;

            Games.setCurrentGame(that);
            //单式投注选球长度
            this.singleBallNumbers = 5;
            this.singleBallRules = [];
            this.singleBallsLimit = null;
            //任选数
            this.renxuanNum = null;
            this.switchOddEven = false;

            this.orderNotLimited = false;
            this.ballArraySplit = '|';
            this.printData = null;
            this.collectionData = null;

            // console.log('game.js init');

            that.loadingComponents();
            that.events();

            //延迟0.3秒执行页面上滚定位到投注区
            setTimeout(function () {
                $('html,body').animate({
                    scrollTop: 150
                }, 400);
            }, 300);
            // cfg.lotteryLogo.prop('src','/images/game/logo/'+options.lotteryLogoName+'.png');

            document.title += Games.getCurrentGameConfig().getGameNameCn();
        },
        //events here
        events: function () {
            var that = this;
            var cfg = that.defConfig;
            var gameCfg = Games.getCurrentGameConfig();
            //切换玩法群

            $(document).on('click', '#J-panel-gameTypes li', function () {
                var gamesLi = that.switchGameTypes(this);
                //默认加载当前玩法群 第一个玩法
                if (gamesLi) {
                    gamesLi.find('.types-item:eq(0)').click();
                }
            });
            //切换玩法
            $(document).on('click', '#J-gametyes-menu-panel .types-item', function () {
                that.switchGames(this, $(this).attr('data-id'));
            });

            that.addEvent('afterOperationBall', function () {
                //1.如果选球中元角分模式值为厘，则追号功能不能使用  秒秒彩的连头除外
                var gameOrder = Games.getCurrentGameOrder();
                var gameCfg = Games.getCurrentGameConfig();
                var balls = gameOrder.getBalls();
                var unitType = false;
                for (var i = 0, len = balls.length; i < len; i++) {
                    if (balls[i].moneyunit == 0.001 && gameCfg.defConfig.data.gameNameEn.indexOf("MMC") == -1) {
                        unitType = true;
                        break;
                    }
                }
                if (unitType) {
                    cfg.buttonTraceBet.addClass('btn-disable');
                    cfg.buttonConfirmBet.removeClass('btn-disable');
                } else {
                    if (len > 0) {
                        cfg.buttonTraceBet.removeClass('btn-disable');
                        cfg.buttonConfirmBet.removeClass('btn-disable');
                    }

                }
            });

            //投注总价小于0.02时弹出提示
            that.addEvent('smallMoneyAttention', function () {
                var cfg = that.defConfig;
                var gameOrder = Games.getCurrentGameOrder();
                var num = Number(gameOrder.defConfig.statistics.lotteryNum.html());
                var statistics = gameOrder.getUpdateStatistics(num);
                if (!(statistics.moneyunit == 0.001 && statistics.totalMoney < 0.02)) {
                    cfg.smallMoneyTip.hide();
                    if (cfg.buttonImmediatelyBetting.hasClass('btn-disable')) {

                        cfg.buttonImmediatelyBetting.removeClass('btn-disable');
                    }
                    cfg.buttonAddOrder.removeClass('btn-disable');
                } else {
                    cfg.smallMoneyTip.show();
                    cfg.buttonImmediatelyBetting.addClass('btn-disable');
                    cfg.buttonAddOrder.addClass('btn-disable');
                }
            });

            //提交成功
            that.addEvent('afterSubmitSuccess', function (event, res) {
                $(".content-textarea-balls").val('')
                $('.content-textarea-balls').blur();
                that.afterSubmitSuccess(res);
            });

            //提交失败
            that.addEvent('afterSubmitError', function (event, response) {
                Games.getCurrentMessage().show('normal', response);
            });

            that.initBonusGroup();
            that.initMoneyUnit();
            that.initTips();
            that.initMultiple(gameCfg.getDefaultMultiple());
            that.initSelectBalls();
            that.initButtonAddOrder();
            that.initDeleteOrder();
            that.initTraceButton();
            that.initButtonBets();
            that.initReverseSelection();
            that.loadDefaultGame();
            that.updateLotteryPeriod();
            that.initRenxuanCheckbox();
            that.initSelfMessage();
            that.initCollection();
        },
        getDebug: function () {
            return this.defConfig.debug;
        },
        afterSubmitSuccess: function (res) {

            this.animateLottery(res);
            this.renderGamesHistory(res);
        },
        initCollection: function () {
            var that = this;
            var gameOrder = Games.getCurrentGameOrder();
            var balls = gameOrder.getBalls();
            var gameMessage = Games.getCurrentMessage();
            $(document).on('click', '.collection-box', function () {
                gameMessage.show('collection', balls);
            });

            $(document).on('click', '.collectionBom', function () {
                var jsId = $(this).data('order');
                var ball = that.getCollectionClickOrder(jsId);
                //Games.getCurrentGameOrder().reverseSelection(null,1,ball);
                $('.j-ui-miniwindow .closeBtn').click();
            });

        },
        getCollectionClickOrder: function (jsId) {
            var ball = null;
            for (var i = 0, len = this.collectionData.length; i < len; i++) {
                if (this.collectionData[i].jsId == jsId) {
                    ball = this.collectionData[i];
                    break;
                }
            }
            return ball;
        },
        initSelfMessage: function () {
            var that = this;
            //closeBtn 
            $(document).on('click', '.j-ui-miniwindow .closeBtn,.j-ui-miniwindow .close', function () {
                var currentGame = Games.getCurrentGame();
                //$(this).parents('.j-ui-miniwindow').hide();
                $('.j-ui-miniwindow').hide();
                currentGame.defConfig.mask.hide();
            });
            //betPrint
            $(document).on('click', '.j-ui-miniwindow #betPrint', function () {
                var currentGame = Games.getCurrentGame();
                var bet_record_id = $(this).data('print');
                that.loadOrdersId(bet_record_id);
            });

            /*$(document).on('click', '#gagamePrintwindow .J-ptint', function() {
             var oid = $(this).data('id');
             var tmpl = $('#gagamePrintTmpl').html();
             var data;
             for (var i = 0, len = that.printData.length; i < len; i++) {
             if (that.printData[i].id == oid) {
             data = that.printData[i];
             break;
             }
             }
             if (data.is_trace == 0) {
             data.trace = '否';
             } else {
             data.trace = '是';
             }
             // var content = me.formatHtml(tmpl, data);

             var doTtmpl = doT.template(tmpl);
             var content = doTtmpl(data);

             var oPop = window.open('', 'oPop');
             oPop.document.write(content);
             oPop.print();
             oPop.close(); 
             });*/

        },
        loadOrdersId: function (bet_record_id) {
            //getGameId
            var me = this;
            var data = {
                "bet_record_id": bet_record_id,
                "token": token,
            }
            var postData = urlEncode(data);
            ajaxData({
                type: 'post',
                data: {
                    'params': postData
                },
                url: getWebsiteOfHost() + "/public/print_projects.do",
                successCallback: function (response) {
                    me.printData = response;
                    var html = me.getPrintWindow(response);
                    $('body').append(html);
                }
            });

        },
        getPrintList: function (data) {
            var html = '';
            for (var i = 0, len = data.length; i < len; i++) {
                // var print = '    <td><span class="btn J-ptint" data-id="'+data[i].id+'" style="background-color: #F1F1F1;color: #444;border: 1px solid #e1e1e1;">打印注单</span></td>';
                //if(!!window.attachEvent){
                var printUrl = location.protocol + '//' + location.host + "/view/page/print.shtml?project_id=" + data[i].id;
                var print = '    <td><a href="' + printUrl + '" target="blank" class="btn" style="background-color: #F1F1F1;background-image:none;color:#444;border: 1px solid #e1e1e1;text-decoration:none">打印注单</a></td>';
                //}
                var tmp = [
                    '<tr>',
                    '    <td>' + data[i].serial_number + '</td>',
                    '    <td>' + data[i].way + '</td>',
                    '    <td>' + data[i].amount + '元</td>',
                    print,
                    '</tr>'];
                html += tmp.join('');
            }
            return html;
        },
        getPrintWindow: function (data) {
            var printwindow = [
                '<div class="j-ui-miniwindow pop pop w-12" style="z-index: 700; position: fixed; left: 50%; top: 50%;margin:-126px 0 0 -301px; opacity: 1; display: block;" id="gagamePrintwindow">',
                '    <div class="pop-hd"><i class="pop-close closeBtn" ></i><span class="pop-title">注单打印</span></div>',
                '    <div class="pop-bd">',
                '        <div style="height:176px; overflow-y:auto;">',
                '            <table class="table">',
                '                <tbody>',
                this.getPrintList(data),
                '                </tbody>',
                '            </table>',
                '       </div>',
                '    </div>',
                '</div>'];

            return printwindow.join('');
        },
        //更新期号
        updateLotteryPeriod: function () {
            var cfg = this.defConfig
            var gameCfg = Games.getCurrentGameConfig();
            cfg.headerCurrentNumber.html(gameCfg.getCurrentGameNumber());
            if (gameCfg.defConfig.data.gameNameEn != "PGMMC" && gameCfg.defConfig.data.gameNameEn != "PG115MMC") {//add by ivan，苹果秒秒彩不需要获取上期期号
                cfg.lastestLotteryNumer.html(gameCfg.getLastGameNumber());
            }
            Games.getCurrentTrace().updateBalance();
            Games.getCurrentTrace().clearTableData();
        },
        //任选玩法
        initRenxuanCheckbox: function () {
            var that = this;
            var gameSelfCfg = that.getGameConfig().getInstance();
            $(document).on('click', '.balls-import-positionOption input[type=checkbox]', function () {
                var isSingleBet = $(this).parents('.balls-import-positionOption').prop('id') == '';
                var renxuanNum = that.getRenxuanNum();
                if ($(this).parent().hasClass('current')) {
                    if ($('.balls-import-positionOption label.current').size() == renxuanNum) {
                        return false;
                    } else {
                        $(this).parent().removeClass('current');
                        $(this).prop('checked', false);
                        if (isSingleBet) {
                            Games.getCurrentSingleBet().updateData();
                        } else {
                            gameSelfCfg.algorithmInjection();
                        }

                    }
                } else {
                    $(this).parent().addClass('current');
                    $(this).prop('checked', true);
                    if (isSingleBet) {
                        Games.getCurrentSingleBet().updateData();
                    } else {
                        gameSelfCfg.algorithmInjection();
                    }
                }
            });


        },
        //投注按钮
        initButtonBets: function () {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            var gameCfg = Games.getCurrentGameConfig();
            var compress = gameCfg.getSubmitCompress();
            var gameTrace = Games.getCurrentTrace();
            var gameMessage = Games.getCurrentMessage();
            var submitData = null;
            //立即投注
            cfg.buttonImmediatelyBetting.on('click', function () {
                if ($(this).hasClass('btn-disable')) return;
                var blance = $(".top-money").html();
                blance = parseFloat(blance.replace(/,/g, ''));
                var data = gameOrder.getOrder([gameOrder.createBall()]);
                if (blance < parseFloat(data.amount)) {
                    Games.getCurrentMessage().show('normal', {error: '余额不足！'});
                    return;
                }
                gameOrder.submitOrder(compress, data);

            });
            //确认投注
            cfg.buttonConfirmBet.on('click', function () {
                if ($(this).hasClass('btn-disable')) return;
                var balls = gameOrder.getBalls();
                if (balls.length <= 0) {
                    Games.getCurrentMessage().show('normal', {error: '请至少选择一注投注号码！'});
                    return;
                }
                submitData = gameOrder.getOrder(balls);
                //信息确认
                gameMessage.show('checkLotters', submitData);
            });
            //点击确认提交
            $(document).on('click', '#checkLottersMSG .confirm', function () {
                //var balls = gameOrder.getBalls();
                //var data = gameOrder.getOrder(balls);
                var blance = $(".top-money").html();
                blance = parseFloat(blance.replace(/,/g, ''));
                var data = gameOrder.getOrder([gameOrder.createBall()]);
                if (blance < parseFloat(submitData.amount)) {
                    $('.xGame-message').hide();
                    Games.getCurrentMessage().show('normal', {error: '余额不足！'});
                } else {
                    if (submitData.isTrace > 0) {
                        for (var i = 0; i < submitData.balls.length; i++) {
                            submitData.balls[i].multiple = 1;
                        }
                    }
                    // console.log(submitData);
                    gameOrder.submitOrder(compress, submitData);
                    $('.xGame-message').hide();
                }
            });

            cfg.buttonTraceConfirm.on('click', function () {
                if ($(this).hasClass('btn-disable')) return;
                var balls = gameOrder.getBalls();

                if (balls.length <= 0) {
                    Games.getCurrentMessage().show('normal', {error: '请至少选择一注投注号码！'});
                    return;
                }
                //信息确认
                submitData = gameOrder.getOrder(balls);
                var traceData = gameTrace.getTraceSumitData();
                submitData = $.extend(submitData, traceData);
                //信息确认
                // console.log(submitData);
                gameMessage.show('checkLotters', submitData);
                //gameOrder.submitOrder(compress, data);
            });
        },
        //追号投注
        initTraceButton: function () {
            var that = this;
            var cfg = that.defConfig;
            cfg.buttonTraceBet.on('click', function () {
                if ($(this).hasClass('btn-disable')) return;
                cfg.mask.show();
                Games.getCurrentTrace().updateBalance();
                Games.getCurrentTrace().clearTableData();
                cfg.tracePanel.show();
            });
        },

        //添加号码
        initButtonAddOrder: function () {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            //1.生成order
            //2.添加order
            that.defConfig.buttonAddOrder.on('click', function () {
                if ($(this).hasClass('btn-disable')) return;
                gameOrder.fireEvent('beforeAdd');
                var ball = gameOrder.createBall();
                gameOrder.addBall(ball);
                if (ball.num) {
                    gameOrder.basketBoxAdd(ball);
                }
                gameOrder.fireEvent('updateSectionBill');
                gameOrder.fireEvent('resetSelectBalls', true);
                that.fireEvent('afterOperationBall');
                Games.getCurrentSingleBet().reset();
            });
        },
        //删除号码
        initDeleteOrder: function () {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            $(document).on('click', '#J-balls-order-container .delete', function (event) {
                var ballId = $(this).data('ball');
                $(this).parent().remove();
                gameOrder.deleteBall(ballId);
                if (gameOrder.isBasketBoxEmpty()) {
                    cfg.shoppingCart.show();
                    cfg.buttonTraceBet.addClass('btn-disable');
                    cfg.buttonConfirmBet.addClass('btn-disable');
                }
                gameOrder.fireEvent('updateSectionBill');
                that.fireEvent('afterOperationBall');
                event.stopPropagation();
            });
        },
        //反向选球
        initReverseSelection: function () {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            $(document).on('click', '#J-balls-order-container li', function (e) {
                var ballId = $(this).data('ball');
                var ballPosition = ($(this).index());
                gameOrder.reverseSelection(ballId, ballPosition);
            });
        },
        //选球有效后，执行操作
        doneAlgorithmInjection: function (num) {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            var statistics = gameOrder.getUpdateStatistics(num);
            gameOrder.updateStatistics(statistics);
            //使用厘模式进行投注，单注注单最小金额为0.02元
            that.fireEvent('smallMoneyAttention');

        },
        triggerControl: function (target) {
            var control = $(target).parents('.ball-content').siblings('.ball-control');
            if (control.length) {
                control.find('a.current').removeClass('current');
            }
        },
        //选球操作区域
        initSelectBalls: function () {
            var that = this;

            var gameSelfCfg = that.getGameConfig().getInstance();
            //选球
            $(document).on('click', '.ball-section .ball-number ', function () {
                Games.getCurrentSingleBet().reset();
                var limit = that.getSingleBallsLimit();

                var limit = $('.ball-section .ball-content:eq(0)').data('limit');
                //胆拖操作的时候
                if (limit) {
                    if ($(this).hasClass('ball-number-current')) {
                        $(this).removeClass('ball-number-current');
                    } else {
                        var isFirstRow = typeof($(this).parents('.ball-content').data('limit')) == 'number';
                        var activeNum = $('.ball-section .ball-content:eq(0) .ball-number-current').size();
                        if (isFirstRow) {
                            if (activeNum == limit) {
                                $('.ball-section .ball-content:eq(0) .ball-number-limit').removeClass('ball-number-current ball-number-limit');
                                $(this).addClass('ball-number-current ball-number-limit');
                            } else {
                                $(this).addClass('ball-number-current');
                                if ($('.ball-section .ball-content:eq(0) .ball-number-current').size() == limit) {
                                    $(this).addClass('ball-number-limit');
                                }
                            }
                        } else {
                            $(this).addClass('ball-number-current');
                        }
                        //互斥操作
                        var param = Games.getCurrentGameOrder().formatParam($(this).data('param'));
                        $('.ball-content').not($(this).parents('.ball-content')).find('.ball-number:eq(' + param.position + ')').removeClass('ball-number-current');
                    }
                } else {
                    if ($(this).hasClass('ball-number-current')) {
                        $(this).removeClass('ball-number-current');
                    } else {
                        $(this).addClass('ball-number-current');
                    }
                }
                that.triggerControl(this);

                gameSelfCfg.algorithmInjection();
            });

            //全 大 小 奇 偶 清 all  big  small  odd  even  none
            $(document).on('click', '.ball-section .ball-control a', function () {
                //if ($(this).hasClass('current')) return;
                Games.getCurrentSingleBet().reset();
                var type = $(this).data('value');
                var ballContent = $(this).parent().prev('.ball-content');
                var index = Math.floor(ballContent.find('.ball-number').size() / 2);
                switch (type) {
                    case 'all':
                    case 'big':
                    case 'small':
                    case 'odd':
                    case 'even':
                        var selectType = type == 'big' ? ':gt' + '(' + (index - 1) + ')' : (type == 'small' ? ':lt' + '(' + index + ')' : ':' + type);
                        //操作选球的时候奇偶互换
                        if (that.getSwitchOddEven()) {
                            if (selectType == ':odd') {
                                selectType = ':even';
                            } else if (selectType == ':even') {
                                selectType = ':odd';
                            }
                        }
                        if (type == 'all') selectType = '';
                        $(this).siblings('a').removeClass('current');
                        $(this).addClass('current');
                        ballContent.find('.ball-number').removeClass('ball-number-current');
                        ballContent.find('.ball-number' + selectType).addClass('ball-number-current');

                        var isExclusion = typeof($('.ball-section .ball-content:eq(0)').data('exclusion')) == 'boolean';
                        if (isExclusion) {
                            var exclusionArr = [];
                            $('.ball-section .ball-content:eq(0) .ball-number').each(function (index, item) {
                                if ($(item).hasClass('ball-number-current')) {
                                    exclusionArr.push(Games.getCurrentGameOrder().formatParam($(item).data('param')).position);
                                }
                            });
                            var currentBallsContainer = $(this).parents('.ball-control').prev('.ball-content');
                            for (var i = 0, len = exclusionArr.length; i < len; i++) {
                                currentBallsContainer.find('.ball-number:eq(' + exclusionArr[i] + ')').removeClass('ball-number-current');
                            }
                        }


                        break;
                    default:
                        $(this).siblings('a').removeClass('current');
                        ballContent.find('.ball-number').removeClass('ball-number-current');
                }
                gameSelfCfg.algorithmInjection();
            });

            //全 大 小 奇 偶 清 all  big  small  odd  even  none
            $(document).on('click', '.ball-section .ball-control-keno a', function () {
                var type = $(this).data('value');
                var ballContent = $('.ball-section .ball-content');
                var index = Math.floor(ballContent.find('.ball-number').size() / 2);
                var method = Games.getCurrentMethod();
                var start, end, ballType;
                switch (type) {
                    /* case 'random':
                     var nums = method.createRandomNum(1,81,'all');
                     $(this).siblings('a').removeClass('current');
                     $(this).addClass('current');
                     ballContent.find('.ball-number').removeClass('ball-number-current');
                     for(var i=0;i<nums.length;i++){
                     $('.ball-section .ball-number:eq('+(nums[i] - 1)+')').addClass('ball-number-current');
                     }
                     break;
                     case 'up':
                     $(this).siblings('a').removeClass('current');
                     $(this).addClass('current');
                     ballContent.find('.ball-number').removeClass('ball-number-current');
                     $('.ball-content:eq(0)').find('.ball-number:lt(' + index + ')').addClass('ball-number-current');
                     break;
                     case 'down':
                     $(this).siblings('a').removeClass('current');
                     $(this).addClass('current');
                     ballContent.find('.ball-number').removeClass('ball-number-current');
                     $('.ball-content:eq(1)').find('.ball-number:lt(' + index + ')').addClass('ball-number-current');
                     break;
                     case 'upOdd':
                     $(this).siblings('a').removeClass('current');
                     $(this).addClass('current');
                     ballContent.find('.ball-number').removeClass('ball-number-current');
                     $('.ball-content:eq(0)').find('.ball-number:even').addClass('ball-number-current');
                     break;
                     case 'upEven':
                     $(this).siblings('a').removeClass('current');
                     $(this).addClass('current');
                     ballContent.find('.ball-number').removeClass('ball-number-current');
                     $('.ball-content:eq(0)').find('.ball-number:odd').addClass('ball-number-current');
                     break;
                     case 'downOdd':
                     $(this).siblings('a').removeClass('current');
                     $(this).addClass('current');
                     ballContent.find('.ball-number').removeClass('ball-number-current');
                     $('.ball-content:eq(1)').find('.ball-number:even').addClass('ball-number-current');
                     break;
                     case 'downEven':
                     $(this).siblings('a').removeClass('current');
                     $(this).addClass('current');
                     ballContent.find('.ball-number').removeClass('ball-number-current');
                     $('.ball-content:eq(1)').find('.ball-number:odd').addClass('ball-number-current');
                     break;*/
                    case 'random':
                        start = 1;
                        end = 81;
                        ballType = 'all';
                        break;
                    case 'up':
                        start = 1;
                        end = 41;
                        ballType = 'all';
                        break;
                    case 'down':
                        start = 41;
                        end = 81;
                        ballType = 'all';
                        break;
                    case 'upOdd':
                        start = 1;
                        end = 41;
                        ballType = 'odd';
                        break;
                    case 'upEven':
                        start = 1;
                        end = 41;
                        ballType = 'even';
                        break;
                    case 'downOdd':
                        start = 41;
                        end = 81;
                        ballType = 'odd';
                        break;
                    case 'downEven':
                        start = 41;
                        end = 81;
                        ballType = 'even';
                        break;
                    case 'odd':
                        start = 1;
                        end = 81;
                        ballType = 'odd';
                        break;
                    case 'even':
                        start = 1;
                        end = 81;
                        ballType = 'even';
                        /*var selectType = type == 'big' ? ':gt' + '(' + (index - 1) + ')' : (type == 'small' ? ':lt' + '(' + index + ')' : ':' + type);
                         //操作选球的时候奇偶互换
                         if (that.getSwitchOddEven()) {
                         if (selectType == ':odd') {
                         selectType = ':even';
                         } else if (selectType == ':even') {
                         selectType = ':odd';
                         }
                         }
                         if (type == 'all') selectType = '';
                         $(this).siblings('a').removeClass('current');
                         $(this).addClass('current');
                         ballContent.find('.ball-number').removeClass('ball-number-current');
                         ballContent.find('.ball-number' + selectType).addClass('ball-number-current');*/

                        break;
                    case 'none':
                        $(this).siblings('a').removeClass('current');
                        ballContent.find('.ball-number').removeClass('ball-number-current');
                        break;
                }
                if (type != 'none') {
                    var nums = method.createRandomNum(start, end, ballType);
                    $(this).siblings('a').removeClass('current');
                    $(this).addClass('current');
                    ballContent.find('.ball-number').removeClass('ball-number-current');

                    for (var i = 0; i < nums.length; i++) {
                        $('.ball-section .ball-number:eq(' + (nums[i] - 1) + ')').addClass('ball-number-current');
                    }
                }
                gameSelfCfg.algorithmInjection();
            });


        },
        //设置奖金组
        initBonusGroup: function () {
            var that = this;
            var cfg = that.defConfig;
            //设置奖金组
            var bonusGroup = Games.getCurrentGameConfig().getOptionalPrizes(),
                bonusLength = bonusGroup.length,
                availableIdx = bonusLength - 1,
                bonusGroupMax = Games.getCurrentGameConfig().getConfigData()['maxPrizeGroup'],

                bonusGroupMax = (bonusGroupMax && bonusGroupMax != '0') ? bonusGroupMax : bonusGroup[bonusLength - 1]['prize_group'];
            for (; availableIdx >= 0; availableIdx--) {
                if (bonusGroup[availableIdx]['prize_group'] <= bonusGroupMax) {
                    break;
                }
            }
            that.bonusGroup = bonusGroup;
            //自定义奖金组设置组件
            that.prizeSlider = new gagame.SliderBar({
                // 'isUpOnly' : true,
                'minDom': '[data-slider-sub]',
                'maxDom': '[data-slider-add]',
                'contDom': '[data-slider-cont]',
                'handleDom': '[data-slider-handle]',
                'innerDom': '[data-slider-inner]',
                'minNumDom': '[data-slider-min]',
                'maxNumDom': '[data-slider-max]',
                'parentDom': cfg.prizeSlider.prizeGroupParent,
                'step': 1,
                'minBound': 0,
                'maxBound': bonusLength - 1,
                'rangeBound': [0, availableIdx],
                'value': availableIdx
            });
            // 设置初始化奖金组 
            that.prizeSlider.addEvent('change', function () {
                var bonus = bonusGroup[this.getValue()]['prize_group'],
                    rate = bonusGroup[this.getValue()]['rate'],
                    rateTxt = (rate * 100).toFixed(3) + '%';
                cfg.prizeSlider.prizeGroupInput.val(bonus);
                cfg.prizeSlider.prizeGroupPercent.text(rateTxt);
                cfg.prizeSlider.prizeGroupValue.text(bonus);
                var amount = $('#J-balls-statistics-amount').html();
                if (amount.indexOf(",") != -1) {
                    var arr = amount.split(",");
                    amount = arr.join("");
                }
                amount = parseFloat(amount);
                var rebate_amount = parseFloat(amount) * (parseFloat(rateTxt) / 100);
                rebate_amount = rebate_amount.toFixed(6);
                $("#J-balls-statistics-rebate").html(rebate_amount);
            });
            that.prizeSlider.setValue(availableIdx);
        },
        getBonusGroup: function () {
            return this.bonusGroup[this.prizeSlider.getValue()];
        },
        setBonusGroup: function (prizeGroup) {
            var index = -1;
            $.each(this.bonusGroup, function (i, item) {
                if (item['prize_group'] == prizeGroup) {
                    return index = i;
                }
            });
            this.prizeSlider.setValue(index);
        },
        initMultiple: function(defaultMultiple) {
            var that = this;
            var cfg = that.defConfig;
            var $multipleInput = cfg.container.multipleInput;
            var $tracemultipleInput = cfg.container.tracemultipleInput;
            var gameSelfCfg = that.getGameConfig().getInstance();
            $multipleInput.val(defaultMultiple);

            $multipleInput.on('keydown', function(event) {
                if (!(event.keyCode == 35) && !(event.keyCode == 36) && !(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39)) {
                    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
                        return false;
                    }
                    if ($.trim($(this).val()).length > 6) {
                        return false;
                    }
                }

            }).on('keyup', function() {
                var v = parseInt($.trim(this.value)),
                    maxnum = that.getMaxMultiple();
                if (v >= maxnum) {
                    this.value = maxnum;
                }
                if (v <= 1) {
                    this.value = 1;
                }
                //multipleNum
                cfg.container.multipleNum.html(this.value);
                gameSelfCfg.algorithmInjection();
                //todo

            });


            //减操作
            $(document).on('click', '.multiple-choose .normal-less', function() {
                var inputVal = parseInt($multipleInput.val());

                if (inputVal <= 1) {
                    $multipleInput.val(1);
                } else {
                    $multipleInput.val(inputVal - 1);
                }
                cfg.container.multipleNum.html($multipleInput.val());
                //todo
                gameSelfCfg.algorithmInjection();
            });
            //加操作
            $(document).on('click', '.multiple-choose .normal-add', function() {
                var inputVal = parseInt($multipleInput.val()),
                    maxnum = that.getMaxMultiple();
                if (inputVal >= maxnum) {
                    $multipleInput.val(maxnum);
                } else {
                    $multipleInput.val(inputVal + 1);
                }
                cfg.container.multipleNum.html($multipleInput.val());
                //todo
                gameSelfCfg.algorithmInjection();
            });
        },
        //获取倍数
        getMultiple: function() {
            return this.defConfig.container.multipleInput.val();
        },
        //设置倍数 
        setMultiple: function(value) {
            this.defConfig.container.multipleInput.val(value);
            this.defConfig.container.multipleNum.html(value);
        },
        //获取最大投注倍数
        getMaxMultiple: function() {
            var gameCfg = Games.getCurrentGameConfig();
            var that = this,
                methodId = that.getCurrentMethodId(),
                unit = that.getMoneyUnit(),
                maxnum = gameCfg.getLimitByMethodId(methodId, unit);
            return maxnum;
        },
        initTips: function() {
            //选号规则,中奖说明 
            $('.number-select-link a').hover(function() {
                var $pop = $(this).find('.j-ui-tip-showrule');
                var height = $pop.height();
                $pop.css({
                    top: -(height + 16) + 'px',
                    display: 'block'
                });

            }, function() {
                var $pop = $(this).find('.j-ui-tip-showrule');
                $pop.hide();
            });
        },
        //元角模式
        initMoneyUnit: function() {
            var that = this;
            var cfg = that.defConfig;
            var moneyunit = [];
            var gameSelfCfg = that.getGameConfig().getInstance();
            var gameConfigData = Games.getCurrentGameConfig().getConfigData();
             var moneyUnitData = gameConfigData['availableCoefficients'];
            for (var o in moneyUnitData) {
                moneyunit.push({
                    text: moneyUnitData[o],
                    value: o
                });
            }
            moneyunit = moneyunit.reverse();
            var moneyUnitDoT = doT.template($("#moneyUnitTmpl").html());
            $("#J-balls-statistics-moneyUnit").html(moneyUnitDoT({
                data: moneyunit
            }));
             //元/角模式比例  1为元模式 0.1为角模式 0.01分模式
            that.setMoneyUnit(gameConfigData.defaultCoefficient);

            //元角模式
            $(document).on('click', '#J-balls-statistics-moneyUnit a', function() {
                if ($(this).hasClass('current')) return;
                $(cfg.container.moneyunit).find('a.current').removeClass('current');
                $(this).addClass('current');
                var value = $(this).data('value');
                that.setMoneyUnit(value);
                that.updateHighestBonus();
                that.updateMultiple();
                if (Number($('#J-balls-statistics-lotteryNum').html()) > 0) {
                    gameSelfCfg.algorithmInjection();
                    Games.getCurrentSingleBet().updateData();
                    Games.getCurrentGame().fireEvent('smallMoneyAttention');
                }
            });
        },
        //点击不同元角自动检测相应的最大倍数，如果大于相应的最大倍数，则自动取值为最大倍数
        updateMultiple:function () {
            var that = this;
            var cfg = that.defConfig;
            var maxnum = this.getMaxMultiple();
            var $multipleInput = cfg.container.multipleInput;
            var nowMultiple = $multipleInput.val();
            nowMultiple = nowMultiple>maxnum? maxnum:nowMultiple;
            $multipleInput.val(nowMultiple);
        },
        setMoneyUnit: function(value) {
            var that = this;
            var cfg = that.defConfig;
            $(cfg.container.moneyunit).find('a').removeClass('current');
            $(cfg.container.moneyunit).find('[data-value="' + value + '"]').addClass('current');
            that.moneyunit = value;
        },
        getMoneyUnit: function() {
            return this.moneyunit;
        },
        //单注最高奖金
        updateHighestBonus: function() {
            var that = this;
            var gameCfg = Games.getCurrentGameConfig();
            var curMaxPrizeGroup = gameCfg.getMaxPrizeGroup(),
                len = gameCfg.getOptionalPrizes().length,
                systemMaxPrizeGroup = gameCfg.getOptionalPrizes()[len - 1]['prize_group'];

            var methodId = that.getCurrentMethodId();
            var methodPrize = gameCfg.getPrizeById(methodId).prize;
            var display_prize = gameCfg.getPrizeById(methodId).display_prize;
            var prize = methodPrize * Number(that.getMoneyUnit());
            // 计算最低单注奖金
            if (systemMaxPrizeGroup > curMaxPrizeGroup) {
                prize = methodPrize * Number(that.getMoneyUnit()) * curMaxPrizeGroup / systemMaxPrizeGroup;
            }
            prize = prize.toString();
            prize = Number(prize.replace(/,/g,''));
            prize = prize.toFixed(2);
            if(display_prize>0) {
                $('#J-method-prize').show();
                $('#J-method-prize').find('span').html(gagame.util.formatMoney(prize, 3));
            }else{
                $('#J-method-prize').hide();
            }
        },
        setRenxuanNum: function(renxuanNum) {
            this.renxuanNum = renxuanNum;
        },
        getRenxuanNum: function() {
            return this.renxuanNum;
        },
        setSingleBallNumbers: function(num) {
            this.singleBallNumbers = num;
        },
        //单式投注选球长度
        getSingleBallNumbers: function() {
            return this.singleBallNumbers;
        },
        setSingleBallRules: function(num) {
            this.singleBallRules = num;
        },
        //单式投注选球长度
        getSingleBallRules: function() {
            return this.singleBallRules;
        },
        setSingleBallsLimit: function(num) {
            this.singleBallsLimit = num;
        },
        //单式投注选球长度
        getSingleBallsLimit: function() {
            return this.singleBallsLimit;
        },
        setSingleGroupSplit: function(singleGroupSplit) {
            this.singleGroupSplit = singleGroupSplit;
        },
        //单式投注选球长度
        getSingleGroupSplit: function() {
            return this.singleGroupSplit;
        },
        setBallArraySplit: function(ballArraySplit) {
            this.ballArraySplit = ballArraySplit;
        },
        getBallArraySplit: function() {
            return this.ballArraySplit;
        },
        setSwitchOddEven: function(switchOddEven) {
            this.switchOddEven = switchOddEven;
        },
        //操作选球的时候奇偶互换
        getSwitchOddEven: function() {
            return this.switchOddEven;
        },
        setOrderNotLimited: function(orderNotLimited) {
            this.orderNotLimited = orderNotLimited;
        },
        getOrderNotLimited: function() {
            return this.orderNotLimited;
        },
        //页面渲染
        loadingComponents: function() {
            //1. 渲染玩法群与具体玩法  
            var that = this;
            var cfg = that.defConfig;
             var gameConfigData = Games.getCurrentGameConfig().getConfigData(); 
            //游戏玩法群 
            that.render({
                container: cfg.container.gameTypes,
                data: {
                    data: gameConfigData.wayGroups
                },
                tmplObj: cfg.scriptTmpl.gameTypes
            });
            //游戏玩法 
            that.render({
                container: cfg.container.games,
                data: {
                    data: gameConfigData.wayGroups
                },
                tmplObj: cfg.scriptTmpl.games
            });
        },
        //加载默认玩法
        loadDefaultGame: function() {
            var gameConfigData = Games.getCurrentGameConfig().getConfigData(); 
            var game = $('#J-gametyes-menu-panel [data-id="' + gameConfigData.defaultMethodId + '"]');
            var index = game.attr('data-index');
            $('#J-panel-gameTypes li:eq(' + index + ')').click();
        },
        /*
        1.更新单注最高奖金、选号规则、中奖说明
        2.重新渲染历史奖期列表
        3.重新渲染选球区域
        4.选配对应的注数计算*/
        loadGamesSource: function(methodId) {
            var that = this;
            var cfg = that.defConfig;
            // console.log('loadGamesSource methodId=' + methodId);
            //游戏开奖历史列表
            var gameCfg = Games.getCurrentGameConfig();
            if(gameCfg.defConfig.data.gameNameEn != "PGMMC" && gameCfg.defConfig.data.gameNameEn != "PG115MMC") {//add by ivan，苹果秒秒彩不需要获取上期期号
                var nums = gameCfg.getLotteryNumbers();
                var gameId=gameCfg.getLotteryGameId();
            }
            
            var method = gameCfg.getMethodById(methodId);

            cfg.container.pickRule.html(method.bet_note);
            cfg.container.winInfo.html(method.bonus_note);
            var map = that.getMapping();
            if (map[methodId].ball.singleBallNumbers) {
                that.setSingleBallNumbers(map[methodId].ball.singleBallNumbers);
            }
            //选球形态规则
            if (map[methodId].ball.rules) {
                that.setSingleBallRules(map[methodId].ball.rules);
            } else {
                that.setSingleBallRules([]);
            }
            //设置单式投注限制
            if (map[methodId].ball.ballsLimit) {
                that.setSingleBallsLimit(map[methodId].ball.ballsLimit);
            } else {
                that.setSingleBallsLimit(null);
            }
            //设置注数之间的分隔
            if (map[methodId].ball.singleGroupSplit) {
                that.setSingleGroupSplit(map[methodId].ball.singleGroupSplit);
            } else {
                that.setSingleGroupSplit(false);
            }

            //任选数 setting 
            if (map[methodId].ball.renxuanNum) {
                that.setRenxuanNum(map[methodId].ball.renxuanNum);
            } else {
                that.setRenxuanNum(null);
            }

            if (map[methodId].ball.ballArraySplit) {
                that.setBallArraySplit(map[methodId].ball.ballArraySplit);
            } else {
                that.setBallArraySplit('|');
            }


            //操作选球的时候奇偶互换
            if (map[methodId].ball.switchOddEven) {
                that.setSwitchOddEven(map[methodId].ball.switchOddEven);
            } else {
                that.setSwitchOddEven(false);
            }

            //顺序不限
            if (map[methodId].ball.orderNotLimited) {
                that.setOrderNotLimited(map[methodId].ball.orderNotLimited);
            } else {
                that.setOrderNotLimited(false);
            }

            that.render({
                container: cfg.container.ballSection,
                data: {
                    ball: map[methodId].ball
                },
                needClear: true,
                doTtmpl: gagame.tpl[map[methodId].ball.tmpl]
            });
            if(gameCfg.defConfig.data.gameNameEn != "PGMMC" && gameCfg.defConfig.data.gameNameEn != "PG115MMC"){//add by ivan，苹果秒秒彩不需要获取上期期号
       
            	that.render({
                container: cfg.container.gamesHistory,
                data: {
                    data: nums,
                    listTable: map[methodId].listTable,
                    gameId:gameId
                },
                needClear: true,
                doTtmpl: gagame.tpl[map[methodId].listTable.tmpl]
                });
                var longhuhe = []
                for(var i = 0 ;i<13;i++ ){
                    if($("#J-minitrend-cont tr").eq(i).find(".longhuhe").text() == "龙"){
                        $("#J-minitrend-cont tr").eq(i).find(".longhuhe").css({
                            "padding":"2px 3px",
                            "border-radius": "8px",
                            "color":"#fff",
                            "background": "#0ECA25"
                        })
                    }
                    if($("#J-minitrend-cont tr").eq(i).find(".longhuhe").text() == "虎"){
                        $("#J-minitrend-cont tr").eq(i).find(".longhuhe").css({
                            "padding":"2px 3px",
                            "border-radius": "8px",
                            "color":"#fff",
                            "background": "#FF9A02"
                        })
                    }
                    if($("#J-minitrend-cont tr").eq(i).find(".longhuhe").text() == "和"){
                        $("#J-minitrend-cont tr").eq(i).find(".longhuhe").css({
                            "padding":"2px 3px",
                            "border-radius": "8px",
                            "color":"#D22A2A",
                            "background": "#ffffff;"
                        })
                    }
                }
            }
            

            //methodId record
            Games.getCurrentGame().setCurrentMethodId(methodId);

            that.updateHighestBonus();
        },
        renderGamesHistory: function(res) {
            var that = this;
            var cfg = that.defConfig;
            var gameCfg = Games.getCurrentGameConfig();
            if(gameCfg.defConfig.data.gameNameEn != "PGMMC" && gameCfg.defConfig.data.gameNameEn != "PG115MMC"){//add by ivan，苹果秒秒彩不需要获取上期期号
            		var nums = gameCfg.getLotteryNumbers();
       	 }
            var map = that.getMapping();
            var methodId = that.getCurrentMethodId();
            if(gameCfg.defConfig.data.gameNameEn != "PGMMC" && gameCfg.defConfig.data.gameNameEn != "PG115MMC"){//add by ivan，苹果秒秒彩不需要获取上期期号
                // console.log(nums)
                that.render({
                container: cfg.container.gamesHistory,
                data: {
                    data: nums,
                    listTable: map[methodId].listTable
                },
                needClear: true,
                doTtmpl: gagame.tpl[map[methodId].listTable.tmpl]
                });
                var longhuhe = []
                for(var i = 0 ;i<13;i++ ){
                    if($("#J-minitrend-cont tr").eq(i).find(".longhuhe").text() == "龙"){
                        $("#J-minitrend-cont tr").eq(i).find(".longhuhe").css({
                            "padding":"2px 3px",
                            "border-radius": "8px",
                            "color":"#fff",
                            "background": "#0ECA25"
                        })
                    }
                    if($("#J-minitrend-cont tr").eq(i).find(".longhuhe").text() == "虎"){
                        $("#J-minitrend-cont tr").eq(i).find(".longhuhe").css({
                            "padding":"2px 3px",
                            "border-radius": "8px",
                            "color":"#fff",
                            "background": "#FF9A02"
                        })
                    }
                    if($("#J-minitrend-cont tr").eq(i).find(".longhuhe").text() == "和"){
                        $("#J-minitrend-cont tr").eq(i).find(".longhuhe").css({
                            "padding":"2px 3px",
                            "border-radius": "8px",
                            "color":"#fff",
                            "background": "#D22A2A;"
                        })
                    }
                }

            }
        },
        currentMethodId: null,
        setCurrentMethodId: function(methodId) {
            this.currentMethodId = methodId;
        },
        getCurrentMethodId: function() {
            return this.currentMethodId;
        },
        // 渲染模板 // container, data, tmplObj, needClear, prependDom,doTtmpl 
        render: function(options) {
            if (!options.doTtmpl) {
                var tmpl = $(options.tmplObj).html(),
                    doTtmpl = doT.template(tmpl);
            } else {
                var doTtmpl = options.doTtmpl;
            }

            var content = doTtmpl(options.data);
            if (options.needClear) {
                $(options.container).html('');
            }
            if (options.prependDom) {
                $(options.prependDom).before(content);
            } else {
                $(options.container).append(content);
            }
        },
        //切换玩法群
        switchGameTypes: function(obj) {
            if ($(obj).hasClass('current')) return;
            $('#J-panel-gameTypes li.current').removeClass('current');
            $(obj).addClass('current');
            var index = $(obj).attr('data-index');
            $('#J-gametyes-menu-panel li').hide();
            var gamesLi = $('#J-gametyes-menu-panel li:eq(' + index + ')');
            gamesLi.show();
            Games.getCurrentGameOrder().fireEvent('resetSelectBalls');
            return gamesLi;
        },
        //切换玩法
        switchGames: function(obj, methodId) {
            if ($(obj).hasClass('current')) return;
            $('#J-gametyes-menu-panel .types-item.current').removeClass('current');
            $(obj).addClass('current');
            //加载游戏资源
            Games.getCurrentGame().loadGamesSource(methodId);
            Games.getCurrentGameOrder().fireEvent('resetSelectBalls');
        },
        //开奖效果  各个彩种实现 
        animateLottery: function() {

        },
        compose: function(f, g) {
            return function(x) {
                return f(g(x));
            };
        }
    };

    var Main = host.ExtendClass(pros, Event);
    Main.defConfig = defConfig;
    host[name] = Main;
})(gagame, 'Game', jQuery, gagame.Event);