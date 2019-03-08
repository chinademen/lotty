(function(host, name, $, Event) {
    var defConfig = {
            jsNameSpace: '',
            //添加事件代理的主面板
            container: {
                countdown: $('.J-lottery-countdown ul')
            },
            scriptTmpl: {
                countdown: '#countdownTmpl',
                remind: '#remindTmpl'
            },
            mask: $('#maskOfXGAME'),
            beginPullData: 0,
            donePullData: 0,
            consumption: 0 //拉取数据与执行其它操作消耗时间(单位ms)
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            Games.setCurrentCountdown(that);
            that.timer = null;
            that.events();
            that.firstTimeConsumption = config.firstTimeConsumption;
            that.firstTimeConsumptionExce = true;
            that.execCountdown();
        },
        //events here
        events: function() {
            var that = this;
            window.onfocus = function () {
                setTimeout(function () {
                    var lottery = getQueryString('lottery');
                    var data = {
                        lottery:lottery,
                        token : token,
                        ip :'127.0.0.1'
                    }
                    data = urlEncode(data);
                    ajaxData({
                        url: baseUrl + "/public/load-numbers.do",
                        data:{params:data},
                        successCallback: function(data) {
                          var lastTime =data.currentNumberTime;
                          var currentTime = data.currentTime;
                          that.seconds = lastTime * 1000 - currentTime * 1000 - 1000;
                        }
                    });
                },50)

            }
            var cfg = that.defConfig;
            //changeDynamicConfig
            that.addEvent('changeDynamicConfig', function() {
                cfg.donePullData = new Date().getTime();
                that.execCountdown();
                var currentGame = Games.getCurrentGame();
                currentGame.updateLotteryPeriod();
                var timer = setInterval(function () {
                   that.getIssueListForRefresh(function (data) {
                       var wn_number = data.issueHistory.issues[0].wn_number;
                       if(wn_number!=''){
                           clearInterval(timer)
                           var gameCfg = Games.getCurrentGameConfig();
                           var configData = gameCfg.getConfigData();
                           configData.issueHistory = data.issueHistory;
                           currentGame.animateLottery();
                           currentGame.renderGamesHistory(currentGame.getCurrentMethodId());
                           setTimeout(function () {
                               var lottery_id = Games.getCurrentGameConfig().getGameId();
                               window.GRTL.pullBetRecord(lottery_id);
                               window.GRTL.pullTraceRecord(lottery_id);
                               window.GRTL.pullTransactionList(lottery_id);
                           },5000)

                       }
                   });
               },1000);
            });

            that.addEvent('updateBetData', function() {
                // console.log('updateBetData====>>>>>>');
                cfg.beginPullData = new Date().getTime();
                var gameCfg = Games.getCurrentGameConfig();
                gameCfg.getServerDynamicConfig(function() {
                    //clearInterval(that.timer);
                });
            });
        },
        //消耗时间
        getConsumption: function() {
            var that = this;
            var cfg = this.defConfig;
            cfg.consumption = cfg.donePullData - cfg.beginPullData;
            if (that.firstTimeConsumptionExce) {
                cfg.consumption += that.firstTimeConsumption;
                that.firstTimeConsumptionExce = false;
            }
            // console.log('调用后端接口用时===' + cfg.consumption);
            return cfg.consumption;
        },
        //执行单位(秒)
        execCountdown: function(loadTime) {
            var that = this;
            var lottery_id = Games.getCurrentGameConfig().getGameId();
            //加载游戏记录
            window.GRTL.pullBetRecord(lottery_id);
            window.GRTL.pullTraceRecord(lottery_id);
            window.GRTL.pullTransactionList(lottery_id);

            //that.timer && clearInterval(that.timer);
            var cfg = that.defConfig;
            var consumption = that.getConsumption(); //消耗时间
            var gameCfg = Games.getCurrentGameConfig();
            var lastTime = gameCfg.getCurrentLastTime(),
                currentTime = gameCfg.getCurrentTime();
            var currentGame = Games.getCurrentGame();
            //修正消耗时间
            // console.log('倒计时剩余时间===' + ((lastTime - currentTime) * 1000));
            that.seconds = lastTime * 1000 - currentTime * 1000 - 1000 /*- that.getConsumption()*/ ;
            // console.log( that.seconds);
            // console.log('修正倒计时剩余时间===' + that.seconds);
            if (that.seconds > 1000) {
                renderLotteryBord(Math.floor(that.seconds / 1000));
                renderLotteryBord_little(Math.floor(that.seconds / 1000));
            } else {
                // console.log('that.seconds < 1000  pullData >>>> that.seconds==' + that.seconds);
                renderLotteryBord_little(0);
                renderLotteryBord(0);
                doGetIssueListForRefresh();
                return;
            }

            that.timer = setTimeout(doCountdown, 1000);

            function doCountdown() {
                that.seconds = that.seconds - 1000;
                if (that.seconds > 0) {
                    renderLotteryBord(Math.floor(that.seconds / 1000));
                    renderLotteryBord_little(Math.floor(that.seconds / 1000));
                    setTimeout(function() {
                        doCountdown();
                    }, 1000);
                } else {
                    renderLotteryBord(0);
                    renderLotteryBord_little(0);
                    doGetServerPrepare();
                    doGetIssueListForRefresh();
                }
            }

            function doGetServerPrepare() {
                // clearInterval(that.timer);
                //拉取开奖数据
                that.showRemind();
                $('#J-lottery-ernie-numbers').hide();
                $('.J-loading-lottery').show();
            }

            function renderLotteryBord(seconds) {
                var cd = that.getCountdown(seconds);
                currentGame.render({
                    container: cfg.container.countdown,
                    data: cd,
                    needClear: true,
                    tmplObj: cfg.scriptTmpl.countdown
                });
                Games.getCurrentTrace().defConfig.traceStatisticsCountdown.html(cd.h + ':' + cd.m + ':' + cd.s);
            }

            function renderLotteryBord_little(seconds) {
                var cd = that.getCountdown(seconds);
                currentGame.render({
                    container: $("#J-side"),
                    data: cd,
                    needClear: true,
                    tmplObj: $("#J-sideTmpl")
                });
                Games.getCurrentTrace().defConfig.traceStatisticsCountdown.html(cd.h + ':' + cd.m + ':' + cd.s);
            }


            function doGetIssueListForRefresh() {
                var delay = that.seconds >= 0 ? that.seconds + 2500 : 0;
                cfg.beginPullData = new Date().getTime() + delay;
                //console.log('delay======>>>'+delay);
                var timer = setTimeout(function() {
                    //gameCfg.getServerDynamicConfig(function() {});
                    clearTimeout(timer);
                    that.getIssueListForRefresh(function(data) {
                        var gameCfg = Games.getCurrentGameConfig();
                        var configData = gameCfg.getConfigData();
                        configData.issueHistory = data.issueHistory;
                        configData.currentNumber = data.currentNumber;
                        configData.currentNumberTime = data.currentNumberTime;
                        configData.currentTime = data.currentTime;
                        // if(!data.issueHistory.issues[0].wn_number){
                        //     // that.execCountdown1();
                        //     doGetIssueListForRefresh();
                        // }else {
                        that.fireEvent('changeDynamicConfig');
                        // }
                    });
                }, delay);
            }

        },

        getIssueListForRefresh: function(callback) {
            var that = this;
            var data = {
                lottery:getQueryString('lottery'),
                token : token,
            }
            var postdata = urlEncode(data);
            var lottery_id = Games.getCurrentGameConfig().getGameId();
            ajaxData({
                url: baseUrl + "/public/load-numbers.do",
                data:{params:postdata},
                successCallback: function(data) {
                    callback && callback(data);
                   
                }
            });
        },

        showRemind: function() {
            var that = this;
            var cfg = that.defConfig;
            var gameCfg = Games.getCurrentGameConfig();
            var newCurrentNumber = Number(gameCfg.getCurrentGameNumber().replace(/-/,'')) + 1;
            // console.log(gameCfg.getCurrentGameNumber());
            // console.log(newCurrentNumber);
            var currentGame = Games.getCurrentGame();
            cfg.mask.show();
            //当当前期期号不同时,提示用户期号变化
            currentGame.render({
                container: $('body'),
                data: {
                    newCurrentNumber: newCurrentNumber
                },
                tmplObj: cfg.scriptTmpl.remind
            });
            //倒计时
            var countDown = $("#countDown").text();
            var timer = setInterval(function () {
                countDown--;
                $("#countDown").text(countDown);
                if(countDown<0){
                    clearInterval(timer);
                }
            },1000);
            setTimeout(function() {
                cfg.mask.hide();
                $('#remindDom').remove();
            }, 3000);
        },
        getCountdown: function(seconds) {
            var h = Math.floor(seconds / 3600), // 小时数
                m = Math.floor(seconds % 3600 / 60), // 分钟数
                s = seconds % 60;

            h = h < 10 ? '0' + h : '' + h;
            m = m < 10 ? '0' + m : '' + m;
            s = s < 10 ? '0' + s : '' + s;
            return {
                hour: h.split(''),
                minute: m.split(''),
                second: s.split(''),
                h: h,
                m: m,
                s: s
            };
        }
    };
    var Main = host.ExtendClass(pros, Event);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;
})(gagame, 'GameCountdown', jQuery, gagame.Event);