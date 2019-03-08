(function(host, name, $, Event) {
    var defConfig = {
            id: -1,
            //游戏名称
            name: '',
            //文件名前缀
            jsNameSpace: '',

            statistics: {
                //注数 
                lotteryNum: $('#J-balls-statistics-lotteryNum'),
                //倍数
                multiple: $('#J-balls-statistics-multipleNum'),
                //总金额
                amount: $('#J-balls-statistics-amount'),
                //返还
                rebate: $('#J-balls-statistics-rebate')
            },
            sectionBill: {
                //返还
                rebate: $('#J-rebate-amount'),
                //注数
                lotteryNum: $('#J-gameOrder-lotterys-num'),
                //总金额
                amount: $('#J-gameOrder-amount')
            },
            container: {
                //号码篮
                basketBox: $('#J-balls-order-container'),
                panelOrderList: $('#J-panel-order-list-cont')
            },
            scriptTmpl: {
                oneOrder: '#oneOrderTmpl'
            },
            shoppingCart: $('.J-cart-empty'),
            submiting:$('.submiting')
        },
        instance,
        Games = host.Games;


    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            Games.setCurrentGameOrder(that);
            that.balls = [];
            that.ballId = 0;
            // console.log('GameOrder init');
            //防止多次重复提交
            that.postLock = null;
            that.orderExtraData = {};


            that.events();
        },
        //events here
        events: function() {
            var that = this;

            that.addEvent('updateSectionBill', function(e) {
                var currentGame = Games.getCurrentGame();
                // console.log('event updateSectionBill >>>>');
                currentGame.compose(that.updateSectionBill, that.getUpdateSectionBill)(that.balls);
            });
            //重置选球区 
            that.addEvent('resetSelectBalls', function(e, clearBall) {
                var currentGame = Games.getCurrentGame();
                var gameDefConfig = currentGame.defConfig;
                if (clearBall) {
                    $('.ball-section .ball-number').removeClass('ball-number-current');
                    $('.ball-section .ball-control a').removeClass('current');
                    $('.ball-section .ball-control-keno a').removeClass('current');
                }

                that.updateStatistics({
                    num: 0,
                    multiple: 1,
                    rebate: '0.000',
                    totalMoney: '0.000'
                });
                currentGame.setMultiple(1);
                gameDefConfig.buttonImmediatelyBetting.addClass('btn-disable');
                gameDefConfig.buttonAddOrder.addClass('btn-disable');
                //gameDefConfig.buttonTraceBet.addClass('btn-disable');
                //gameDefConfig.buttonConfirmBet.addClass('btn-disable'); 
            });


            that.addEvent('beforeAdd', function() {
                var currentGame = Games.getCurrentGame();
                var gameCfg = Games.getCurrentGameConfig();
                var method = gameCfg.getMethodById(currentGame.getCurrentMethodId());
                if (method.name_en.indexOf('danshi') > -1) {
                    Games.getCurrentSingleBet().execFilterDirtyData(1, 1);
                }
            });
        },
        getSelectedBalls: function() {
            var that = this;
            var balls2 = [];

            $('.ball-section .ball-content').each(function() {
                var balls1 = [];
                $(this).find('.ball-number.ball-number-current').each(function() {
                    var param = that.formatParam($(this).data('param'));
                    balls1.push({
                        ball: param['ball'],
                        viewBall: param['viewBall'],
                        position: param['position']
                    });
                });
                balls2.push(balls1);
            });

            return {
                balls: balls2,
                ballsNum: $('.ball-section .ball-number-current').size()
            };
        },
        //param num, multiple, rebate, totalMoney
        updateStatistics: function(obj) {
            var cfg = this.defConfig;
            //注数dom
            cfg.statistics.lotteryNum.html(obj.num);
            //倍数
            cfg.statistics.multiple.html(obj.multiple);
            //总金额
            cfg.statistics.amount.html(gagame.util.formatMoney(obj.totalMoney, 3));
            //返还
            cfg.statistics.rebate.html(gagame.util.formatMoney(obj.rebate, 6));

        },
        getUpdateStatistics: function(num, balls) {
            var gameCfg = Games.getCurrentGameConfig();
            var currentGame = Games.getCurrentGame();
            var multiple = currentGame.getMultiple();
            var rate = currentGame.getBonusGroup().rate;
            var moneyunit = currentGame.getMoneyUnit();
            var onePrice = gameCfg.getOnePriceById(currentGame.getCurrentMethodId());
            var totalMoney = multiple * num * moneyunit * onePrice;
            var rebate = totalMoney * rate;
            return {
                num: num,
                multiple: multiple,
                rebate: rebate,
                totalMoney: totalMoney,
                moneyunit: moneyunit
            };
        },
        //param num, multiple, rebate, totalMoney
        updateSectionBill: function(obj) {
            var gameOrder = Games.getCurrentGameOrder();
            var cfg = gameOrder.defConfig;
            //注数dom
            cfg.sectionBill.lotteryNum.html(obj.num);
            //总金额
            cfg.sectionBill.amount.html(gagame.util.formatMoney(obj.totalMoney, 3));
            //返还
            cfg.sectionBill.rebate.html(gagame.util.formatMoney(obj.rebate, 6));
        },
        getUpdateSectionBill: function(balls) {
            var num = 0,
                totalMoney = 0,
                rebate = 0,
                gameOrder = Games.getCurrentGameOrder();
            for (var i = 0, len = balls.length; i < len; i++) {
                num += Number(balls[i].num);
                totalMoney += Number(balls[i].totalMoney);
                rebate += Number(balls[i].rebate);
            }
            return {
                num: num,
                totalMoney: totalMoney,
                rebate: rebate
            }
        },
        //所有注单的单倍价格
        getOneMultiplePrice: function() {
            var that = this;
            var currentGame = Games.getCurrentGame();
            var gameCfg = Games.getCurrentGameConfig();
            //用户奖金组
            var userPrizeGroup = gameCfg.getOptionalPrizes();
            //最大奖金组
            var maxPirizeGroup = userPrizeGroup[userPrizeGroup.length - 1]['prize_group'];
            // 最大投注奖金组
            var maxPirize = gameCfg.getMaxPrizeGroup();
            var methodId = currentGame.getCurrentMethodId();


            var userGroupMoney = 0;
            var onePrice = 0;
            var num = 0; //注数

            for (var i = 0, len = that.balls.length; i < len; i++) {
                var moneyunit = that.balls[0].moneyunit;
                var order = that.balls[i];
                //price += order.num * 1 * order.moneyunit * order.onePrice; 
                var method = gameCfg.getMethodById(order.wayId);
                var prize = gameCfg.getPrizeById(order.wayId);

                //maxPirize*Number(prize['prize'])/maxPirizeGroup;
                userGroupMoney += maxPirize * Number(prize['prize']) / maxPirizeGroup;
                onePrice += order['num'] * Number(method['price']);
                num += order['num'];
            }
            userGroupMoney *= moneyunit;
            onePrice *= moneyunit;

            return {
                userGroupMoney: userGroupMoney,
                onePrice: onePrice,
                num: num
            };
        },
        basketBoxAdd: function(ball) {
            var that = this;
            var cfg = that.defConfig;
            var currentGame = Games.getCurrentGame();
            if (cfg.shoppingCart.is(":visible")) {
                cfg.shoppingCart.hide();
            }
            //如果有data-reverse這個屬性說明是反选，只需更新自身;如果沒有data-reverse說明不是反選{如果與号码栏上同玩法同号码同奖金组同元角模式不同倍数则在相加，否则添加号码栏}
            var IsReverse = $('.ball-section ').find('a:eq(0)').attr("data-reverse");
            var gameConfigData = Games.getCurrentGameConfig().getConfigData();
            var moneyUnitData = gameConfigData['availableCoefficients'];
            ball.moneyUnitData = moneyUnitData[ball.moneyunit];
            if(typeof (IsReverse) =="undefined"){
                for(var i=1;i<that.balls.length;i++){
                    if(that.balls[i].ball==ball.ball && that.balls[i].typeCN==ball.typeCN && that.balls[i].prizeGroup==ball.prizeGroup && that.balls[i].moneyunit==ball.moneyunit){
                        Games.getCurrentMessage().show('normal',{error:'您选择的号码在号码篮已存在，将直接进行倍数累加'});
                        ball.multiple =parseInt( ball.multiple)+parseInt(that.balls[i].multiple);
                        var multiple =currentGame.getMaxMultiple();;
                        ball.totalMoney += that.balls[i].totalMoney;
                        if(ball.multiple>multiple){
                            ball.multiple = multiple;
                            ball.totalMoney = (ball.totalMoney/ball.multiple)*multiple;
                        }
                        var container = cfg.container.basketBox;
                        container.find('li:eq('+(i-1)+')').remove();
                        that.balls.splice(i,1);
                    }
                }
                currentGame.render({
                    container: cfg.container.basketBox,
                    data: ball,
                    tmplObj: cfg.scriptTmpl.oneOrder,
                    prependDom: cfg.container.basketBox.find('li:eq(0)').get(0)
                });


            }else{
                that.balls.splice(0,1);
                that.balls[IsReverse]=ball;
                var container = cfg.container.basketBox;
                container.find('li:eq('+(IsReverse)+')').remove();
                currentGame.render({
                    container: cfg.container.basketBox,
                    data: ball,
                    tmplObj: cfg.scriptTmpl.oneOrder,
                    prependDom: cfg.container.basketBox.find('li:eq('+IsReverse+')').get(0)
                });

                $('.ball-section ').find('a:eq(0)').removeAttr("data-reverse");
            }
            var setting = {
                autoReinitialise: false
            };
            //初始化滚动条
            var jspApi = cfg.container.panelOrderList.jScrollPane(setting);
            //获取滚动条
            var refreshApi = jspApi.data("jsp");
            //重新加载刷新滚动条
            refreshApi.reinitialise(setting);
            // var iSame = 0;
            // for(var i=1;i<that.balls.length;i++){
            //     if(that.balls[i].ball==ball.ball && that.balls[i].typeCN==ball.typeCN){
            //         iSame = i;
            //     }
            // }
            // if(iSame !==0){
            //     var container = cfg.container.basketBox;
            //     container.find('li:eq('+(iSame-1)+')').remove();
            //     that.balls.splice(iSame,1);
            // }

        },
        //反选
        reverseSelection: function(ballId,ballPosition,isCollection,collectionBall) {
            var ball = null;
            if (isCollection) {
                ball = collectionBall;
            }
            var currentGame = Games.getCurrentGame();
            var gameCfg = Games.getCurrentGameConfig();
            if (!isCollection) {
                for (var i = 0, len = this.balls.length; i < len; i++) {
                    if (this.balls[i].jsId == ballId) {
                        ball = this.balls[i];
                        break;
                    }
                }
            }
            var method = gameCfg.getMethodById(ball.wayId);
            var node = gameCfg.getMethodNodeById(method.pid);
            var gameGroupDom = $('#gameGroup' + node.pid)[0];

            //切换玩法群
            currentGame.switchGameTypes(gameGroupDom);
            //加载玩法
            $('.types-item[data-id="' + ball.wayId + '"]').click();

            $('.ball-section .ball-number').removeClass('ball-number-current');
            //选球 
            var position = ball.position;
            for (var i = 0; i < position.length; i++) {
                for (var j = 0; j < position[i].length; j++) {
                    $('.ball-section .ball-content:eq(' + i + ')').find('.ball-number:eq(' + position[i][j] + ')').addClass('ball-number-current');
                    $('.ball-section .ball-content:eq(' + i + ')').find('.ball-number').attr("data-reverse",ballPosition);
                }
            }
            currentGame.setMoneyUnit(ball.moneyunit);
            currentGame.setMultiple(ball.multiple);
            currentGame.setBonusGroup(ball.prizeGroup);
            var gameSelfCfg = currentGame.getGameConfig().getInstance();
            gameSelfCfg.algorithmInjection();

        },
        isBasketBoxEmpty: function() {
            var that = this;
            var cfg = that.defConfig;
            return $.trim(cfg.container.basketBox.html()).length == 0;
        },
        formatViewBalls: function(balls) {
            var that = this;
            var ballArray = [];
            var viewBallsArray = [];
            var positionArray = [];
            var currentGame = Games.getCurrentGame();
            var positionView = [];

            for (var i = 0, len = balls.length; i < len; i++) {
                var ball = [];
                var view = [];
                var position = [];
                for (var j = 0, len2 = balls[i].length; j < len2; j++) {
                    ball.push(balls[i][j].ball);
                    view.push(balls[i][j].viewBall);
                    position.push(balls[i][j].position);
                }
                if (currentGame.getSingleGroupSplit() !== false) {
                    ballArray.push(ball.join(currentGame.getSingleGroupSplit()));
                    viewBallsArray.push(view.join(currentGame.getSingleGroupSplit()));
                } else {
                    ballArray.push(ball.join(''));
                    viewBallsArray.push(view.join(''));
                }

                positionArray.push(position);
            }

            //兼容任选玩法
            positionView = that.getPositionOption();

            if ($('.ball-section .ball-content').size() == 1 && currentGame.getSingleGroupSplit() !== false) {
                return {
                    ball: ball.join(currentGame.getSingleGroupSplit()),
                    viewBalls: positionView.join('') + view.join(currentGame.getSingleGroupSplit()),
                    position: positionArray
                };
            } else {
                return {
                    ball: ballArray.join(currentGame.getBallArraySplit()),
                    viewBalls: positionView.join('') + viewBallsArray.join(currentGame.getBallArraySplit()),
                    position: positionArray
                };
            }
        },
        getPositionOption: function() {
            var positionView = [];
            var extra = this.getOrderExtraData();
            var map = {
                    '0': '万',
                    '1': '千',
                    '2': '百',
                    '3': '十',
                    '4': '个'
                }
                //兼容任选玩法
            if (extra.position) {
                var posArr = extra.position.split('');
                for (var i = 0, len = posArr.length; i < len; i++) {
                    positionView.push('<i>' + map[posArr[i]] + '</i>');
                }
            }
            //兼容任选玩法
            /*$('.balls-import-positionOption input[type=checkbox]').each(function() {
                if (this.checked) {
                    positionView.push('<i>'+$(this).data('view')+'</i>');
                }
            });*/
            return positionView;
        },
        setOrderExtraData: function(orderExtraData) {
            this.orderExtraData = orderExtraData;
        },
        getOrderExtraData: function() {
            return this.orderExtraData;
        },
        formatViewObj: function(passedData) {
            var that = this;
            var result = [];
            for (var i = 0, len = passedData.length; i < len; i++) {
                result.push(passedData[i].join(' '));
            }
            return {
                ball: result.join('|'),
                position: [],
                viewBalls: that.getPositionOption().join('') + result.join('|')
            };
        },
        createBall: function() {
            var that = this;
            var singleBetFileData = Games.getCurrentSingleBet().getFileData();
            var cfg = that.defConfig;
            var gameCfg = Games.getCurrentGameConfig();
            var currentGame = Games.getCurrentGame();
            var onePrice = gameCfg.getOnePriceById(currentGame.getCurrentMethodId());
            var prizeObject = currentGame.getBonusGroup();
            var prizeGroup = prizeObject['prize_group'];
            var rate = prizeObject['rate'];
            var moneyunit = currentGame.getMoneyUnit();
            var methodId = currentGame.getCurrentMethodId();
            var multiple = currentGame.getMultiple();
            var type = gameCfg.getMethodFullNameById(methodId).join('.');
            var typeCN = gameCfg.getMethodCnFullNameById(methodId).join(',');
            var num = Number(cfg.statistics.lotteryNum.html());
            if (singleBetFileData && singleBetFileData.passedData.length > 0) {

                ////兼容11选5与时时彩
                if (Object.prototype.toString.call(singleBetFileData.passedData[0]) === '[object Array]') {
                    var viewBallObj = that.formatViewObj(singleBetFileData.passedData);
                } else {
                    var viewBallObj = {
                        ball: singleBetFileData.passedData.join('|'),
                        position: [],
                        viewBalls: that.getPositionOption().join('') + singleBetFileData.passedData.join('|')
                    };
                }

            } else {
                var ballObj = that.getSelectedBalls();
                var viewBallObj = that.formatViewBalls(ballObj.balls);
            }

            var totalMoney = multiple * num * moneyunit * onePrice;
            var rebate = totalMoney * rate;
            rebate = rebate.toFixed(6);
            var ball = {
                ball: viewBallObj.ball,
                position: viewBallObj.position,
                extra: that.getOrderExtraData(),
                moneyunit: moneyunit,
                multiple: multiple,
                num: num,
                onePrice: onePrice,
                prizeGroup: prizeGroup,
                type: type,
                typeCN: typeCN,
                viewBalls: viewBallObj.viewBalls,
                wayId: methodId,
                jsId: that.ballId++,
                totalMoney: totalMoney,
                rebate: rebate
            };

            that.setOrderExtraData({});
            return ball;
        },
        addBall: function(ball) {
            this.balls.unshift(ball);
        },
        deleteBall: function(ballId) {
            for (var i = 0, len = this.balls.length; i < len; i++) {
                if (this.balls[i].jsId == ballId) {
                    this.balls.splice(i, 1);
                    break;
                }
            }
        },
        getBalls: function() {
            return this.balls;
        },
        deleteAllBall:function(){
            this.balls = [];
        },
        clearBasketBox:function(){
            var cfg = this.defConfig;
            $('#J-balls-order-container .delete').each(function(){
                $(this).click();
            });
        },
        getOrder: function(balls) {
            var gameCfg = Games.getCurrentGameConfig();
            var gameId = gameCfg.getGameId();
            var currentGameConfig = Games.getCurrentGameConfig();
            var gameNumbers = currentGameConfig.getGameNumbers();
            if(gameCfg.defConfig.data.gameNameEn.indexOf("MMC")==-1){
                var lotteryNumber = gameCfg.getCurrentGameNumber();
                for(var j=0;j<gameNumbers.length;j++){
                    if(lotteryNumber ==gameNumbers[j].number){
                        gameNumbers=gameNumbers.slice(j);
                    }
                }
            }
            var orders = {};
            orders[lotteryNumber + ''] = 1;


            var billObj = this.getUpdateSectionBill(balls);
            var winStopTrace = Games.getCurrentTrace().getWinStopTrace();
            var gameNameCn = gameCfg.getGameNameCn();
            var orderObj = {
                amount: billObj.totalMoney.toFixed(4),
                balls: balls,
                gameId: gameId,
                isTrace: 0,
                orders: orders, 
                traceWinStop: winStopTrace.traceWinStop,
                gameNameCn: gameNameCn
            };

            return orderObj;
        },
        //执行请求锁定动作
        doPostLock: function() {
            this.postLock = true;
        },
        //取消请求锁定动作
        cancelPostLock: function() {
            this.postLock = false;
        },
        getPostLock: function() {
            return this.postLock;
        },


        //提交订单
        submitOrder: function(compress, data) {
            var that = this,
                message = Games.getCurrentMessage(),
                gameCfg = Games.getCurrentGameConfig(),
                submitUrl = gameCfg.getSubmitUrl(),
                action = 'bet',
                cfg = that.defConfig;
                // action = gameCfg.defConfig.data.gameNameEn != "PGMMC"?'bet':'InstantBet';//add by ivan

            if(gameCfg.defConfig.data.gameNameEn.indexOf("MMC")>0){
                    action = 'InstantBet';
                }
             //殊号码玩法，同时选择豹子，对子，顺子,删除ball中的|
            for(var i=0;i<data.balls.length;i++){
                if(data.balls[i].typeCN.indexOf("特殊号码")!=-1){
                    data.balls[i].ball = data.balls[i].ball.replace(/[\|]/g,'');
                }
            }
            // console.log(data);
            if (that.getPostLock()) return;

            if (compress) {

                     data =  encodeURIComponent(that.getCompressData(data))

            }

            /*if (Games.getCurrentGame().getDebug()) {
                var res = {
                    "isSuccess": 1,
                    "type": "success",
                    "msg": "\u6295\u6ce8\u6210\u529f",
                    "data": {
                        "winMoney": (Math.random(100) * 100).toFixed(2),
                        "result": "85080",
                        "winNum": 1,
                        "list": []
                    }
                };
                setTimeout(function(){
                    Games.getCurrentGame().fireEvent('afterSubmitSuccess', res);
                },1000);
                
                return;
            }*/
            // console.log(JSON.stringify(data));
          //data = JSON.stringify(data)
            // var postdata = {
            //     token
            //     token: token,
            //     betdata:data
            // }
            // data = 'eJwFwcmCQzAAANB%2FmauDSqTlKDp2ExU03FBbrVVtNV8%2F7%2F1Uzudv90GX95qmEQxJ8vR6mm58tG3%2FK%2B%2BmH5OULoZpqUEtHKFgIbfaxyWFK8fzmA7TUG9eRkB76f1gysFbfXwM0G1gne2E29xqfGcGxfLLSYE2vEtieZ21KES1xpYqro%2BFWmZhAMpjA7NW3lw5PGwRuicviQmGCm10%2FLr2o8Ire1rmKdr65xhZ2cf9VgLfG6A%2FlFt%2B57l3TmHyEAkD%2FW95jqLLk5Adc7qt2d1Eedh2MWXTLZZOxm1KA1aIosQbB6IXTUD%2B5mJtDLL0vHSrS8%2BVBjkcKGF6VxX6dYKhTLXyms6Tm0CLDdyczKPprmbzKtvsU7nan95s3qGQumnBr4tcA0se%2FeWiWzpr8GlZyGdejLadVOFNTigox00hhFH57FGkyN2jJyUysBIYHgoEL8Z1pvaV8w7m4bqKDbApLrAihQ6zYi2%2Bh%2BxsGX49qaLY6BWzWfjzDwzdlwQ%3D'
            postdata = "token="+token+"&betdata="+data;
             //postdata = urlEncode(postdata);
            $.ajax({
                url: baseUrl+"/game/bet.do",
                data: {
                    params: postdata
                },
                dataType: 'json',
                method: 'post',
                beforeSend: function() {
                    that.doPostLock();
                    //me.fireEvent('beforeSend', message);
                    //message.showTip("提交中...");
                    Games.getCurrentGame().defConfig.mask.show();
                    cfg.submiting.show();
                },
                success: function(response) {
                    Games.getCurrentGame().defConfig.mask.hide();
                    var currentGame = Games.getCurrentGame();
                    //如果是单式 成功后清空文本框
                    var method = gameCfg.getMethodById(currentGame.getCurrentMethodId());
                    if (method.name_en.indexOf('danshi') > -1 || method.name_en.indexOf('zuxuan') > -1) {
                        Games.getCurrentSingleBet().reset();
                    }

                    cfg.submiting.hide();
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }
               //     console.log(response);
                    if (response.status == 200) {
                        //
                        Games.getCurrentMessage().show('successTip',response.data);
                       if(gameCfg.defConfig.data.gameNameEn.indexOf("MMC")==-1){
                           that.clearBasketBox();
                       }
                         that.fireEvent('resetSelectBalls',true);
                         Games.getCurrentGame().fireEvent('afterSubmitSuccess', response);
                         //successTip
                         Games.getCurrentTrace().updateBalance();
                        var lottery_id = Games.getCurrentGameConfig().getGameId();
                        if (action !== 'InstantBet') {
                            GRTL.pullBetRecord(lottery_id);
                            GRTL.pullTraceRecord(lottery_id);
                            GRTL.pullTransactionList(lottery_id);
                        }
                    }  else {
                       // console.log(response.msg);
                       //    Games.getCurrentGame().fireEvent('afterSubmitError', response.msg);
                        Games.getCurrentMessage().show('normal',{error:response.msg});
                    }
                    //请求解锁
                    that.cancelPostLock();
                },
                complete: function() {
                    //message.hideTip()
                },
                error: function(r) {
                    cfg.submiting.hide();  
                    Games.getCurrentMessage().show('normal',{error:'服务器信息错误,请在投注列表中查询'});
                    that.cancelPostLock();
                }
            });

 
        },
        formatParam: function(param) {
            var arr = $.trim(param).split('&'),
                i = 0,
                len = arr.length,
                paramArr,
                result = {};
            for (; i < len; i++) {
                paramArr = arr[i].split('=');
                if (paramArr.length > 0) {
                    if (paramArr.length == 2) {
                        result[paramArr[0]] = paramArr[1];
                    } else {
                        result[paramArr[0]] = '';
                    }
                }
            }
            return result;
        },
        //压缩加密动作
        getCompressData: function(data) {
            var me = this,
                binaryString;
            var forIn = function(obj, handler) {
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        handler(i, obj[i]);
                    }
                }
            };
            var each = function(arr, handler) {
                for (var i = 0, len = arr.length; i < len; i += 1) {
                    handler(i, arr[i]);
                }
            };
            if (!JSON) {
                JSON = {};
            }
            if (!JSON.parse) {
                JSON.parse = function(json) {
                    return eval('1,' + json)
                };
            }
            if (!JSON.stringify) {
                (function(JSON) {
                    var arr = '[object Array]',
                        obj = '[object Object]';

                    JSON.stringify = function(json) {
                        var t = '';
                        var m = Object.prototype.toString.call(json);
                        if (m == arr) {
                            t = ArrPartten(json);
                        } else if (m == obj) {
                            t = ObjectJson(json);
                        } else {
                            t = json;
                        }
                        return t;
                    }

                    function ObjectParse() {
                        var t = '{';
                        forIn(json, function(i, ele) {
                            var m = Object.prototype.toString.call(ele);
                            if (m == arr) {
                                t += i + ':' + ArrPartten(ele) + ',';
                            } else if (m == obj) {
                                t += i + ':' + ObjectJson(ele) + ',';
                            } else {

                                t += i + ':' + ele + ',';
                            }
                        });
                        if (t.length != 1) {
                            t = t.substring(0, t.length - 1);
                        }
                        return t + '}';
                    }

                    function ArrayParse() {
                        var t = '[';
                        each(json, function(i, ele) {
                            var m = Object.prototype.toString.call(ele);
                            if (m == arr) {
                                t += ArrPartten(ele) + ',';
                            } else if (m == obj) {
                                t += ObjectJson(ele) + ',';
                            } else {
                                t += ele + ',';
                            }
                        });
                        if (json.length > 0) {
                            t = t.substring(0, t.length - 1);
                        }
                        return t + ']';
                    }
                }(JSON));
            };
            //压缩动作 3次

            binaryString = pako.deflate(JSON.stringify(data), {
                to: 'string'
            });
            binaryString = window.btoa(binaryString);

            binaryString = pako.deflate(JSON.stringify(binaryString), {
                to: 'string'
            });
            binaryString = window.btoa(binaryString);

            binaryString = pako.deflate(JSON.stringify(binaryString), {
                to: 'string'
            });
            binaryString = window.btoa(binaryString);
            return binaryString;
        }

    };



    var Main = host.ExtendClass(pros, Event);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;
})(gagame, 'GameOrder', jQuery, gagame.Event);