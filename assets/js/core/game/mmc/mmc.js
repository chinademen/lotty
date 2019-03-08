;
(function($) {
    function F(t, o) {
        this.opts = $.extend({
            ballsize: 5, // 彩球个数
            initball: '0,0,0,0,0', // 初始化彩球数据
            separator: ',',
            loop: 5, // 彩球滚动循环次数（必须为整数）
            timeout: 5000, // 彩球滚动动画执行时间基数
            delay: 150, // 每个彩球动画执行延迟时间基数
            offset: [80, 110], // 球的宽高
            handbar: '.handle_hand', // 拉杆元素
            lamp: '.lamp', // 跑马灯元素
            debugs: true // 是否支持debug [0/false, 1=>对象级输出, 2=>字符串级输出]
        }, o);
        this.slides = [];
        this.size = this.opts.ballsize;
        this.$t = $(t);
        this.balls = [];
        // CALLBACK
        this.callback = function() {
            'sss'
        };
        this.errors = {
            'invalidBallFormat': '彩球数据格式错误'
        };
        this.debugs = this.opts.debugs;
        this.init();
    }

    F.prototype = {
        init: function() {
            var me = this,
                opts = me.opts;
            me.setSeparator(opts.separator);
            if (me.checkballs(opts.initball) != me.size) {
                alert(me.errors['invalidBallFormat']);
            }
            me.$handles = $(opts.handbar).children();
            me.createdom();
            // me.flip(me.balls, false);
            me.preloadLightImg();
        },
        setSeparator: function(t) {
            this.separator = this.opts.separator || t
        },
        getSeparator: function() {
            return this.separator
        },
        checkballs: function(balls) {
            var me = this,
                k = 0;
            if (balls && typeof balls === 'string') {
                balls = balls.split(me.getSeparator());
            }
            // balls存在、为数组，且其长度为size
            if (balls &&
                Object.prototype.toString.call(balls) === '[object Array]' &&
                balls.length == me.size
            ) {
                me.balls = balls;
                for (var i = 0; i < balls.length; i++) {
                    var ball = Number(balls[i]);
                    if (ball < 0 || ball > 9) {
                        break;
                    }
                    k++;
                }
            }
            // me.debug(k);
            return k;
        },
        createdom: function() {
            var me = this,
                opts = me.opts,
                balls = me.balls;
            for (var i = 0; i < me.size; i++) {
                var _style = 'position:absolute;top:0;left:' + i * me.opts.offset[0] + 'px;float:none;';
                /* ball_number*ball_height*(ball_max_loop+3) */
                _style += 'height:' + 10 * opts.offset[1] * (opts.loop + 3) + 'px';
                me.slides.push(
                    $('<div>', {
                        'class': 'flipball flipball_' + (i + 1),
                        'style': _style,
                        text: balls[i]
                    }).appendTo(me.$t)
                );
            }
        },
        preloadLightImg: function() {
            var me = this,
                $img = $('img', this.opts.lamp),
                src = $img.data('imgholder');
            $('<img/>').load(function() {
                me.$lampimg = $img;
                me.originsrc = $img.attr('src');
                me.lampsrc = src;
            }).attr('src', src);
        },
        // 跑马灯效果
        marquee: function(status) {
            if (this.lampsrc && this.$lampimg.length) {
                if (status == 'on') {
                    this.$lampimg.attr('src', this.lampsrc);
                } else if (status == 'off') {
                    this.$lampimg.attr('src', this.originsrc);
                }
            }
        },
        // 拉杆动画效果
        drawbar: function(callback) {
            this.$handles.eq(0).animate({
                opacity: 'hide'
            }, 300, function() {
                $(this).animate({
                    opacity: 'show'
                }, 300, function() {
                    callback && callback();
                });
            });
        },
        play: function() {
            this.marquee('on');
            this.drawbar();
        },
        stop: function() {
            this.marquee('off');
        },
        // 数字球滚动效果
        flip: function(balls, anim, callback) {
            var me = this,
                opts = me.opts,
                balls = balls || me.balls,
                callback = callback || me.callback;
            if (me.checkballs(balls) != me.size) {
                return alert(me.errors['invalidBallFormat']);
            }
            if (!me.$t.hasClass('.hasball')) me.$t.addClass('hasball');
            balls = me.balls;
            me.callback = callback;
            if (anim === false || anim === 'undefined') {
                me.stop();
                $.each(me.slides, function(idx, slide) {
                    var ball_num = Number(balls[idx]);
                    slide.stop().css('marginTop', -(10 + ball_num) * opts.offset[1]);
                });
                me.doCallback(me.callback);
            } else {
                me.play();
                $.each(me.slides, function(idx, slide) {
                    var ball_num = Number(balls[idx]),
                        timeout = opts.timeout + opts.delay * idx,
                        // 一圈是10个数，循环opts.loop圈后，在移动ball_num单位个高度(opts.offset[1])
                        step = (opts.loop * 10 + ball_num) * opts.offset[1];
                    slide.stop().animate({
                        marginTop: '+=' + (opts.offset[1] * .6)
                    }).stop().animate({
                        marginTop: -step
                    }, timeout, function() {
                        $(this).css('marginTop', -(10 + ball_num) * opts.offset[1]);
                        if (idx == me.size - 1) {
                            me.stop();
                            me.doCallback(me.callback);
                        }
                    });
                });
            }
        },
        quickflip: function(callback1) {
            var me = this,
                opts = me.opts,
                balls = balls || me.balls,
                callback = callback || me.callback;
            //快速开奖后立即重置掉当前的CALLBACK缓存
            //防止正常开奖逻辑再次执行回调
            me.callback = null;
            if (me.checkballs(balls) != me.size) {
                 return alert(me.errors['invalidBallFormat']);
            }
            $.each(me.slides, function(idx, slide) {
                var ball_num = Number(balls[idx]);
                slide.stop().css({
                    marginTop: -(10 + ball_num) * opts.offset[1]
                }).animate({
                    marginTop: -(10 + ball_num + 10) * opts.offset[1]
                }, 1000, function() {

                    if (idx == me.size - 1) {
                        me.doCallback(callback);
                        callback1 && callback1();
                    }
                });
            });
        },
        doCallback: function(callback) {
            if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
                callback();
            }
        },
        // debug
        debug: function() {
            this.debugs && window.console && console.log && console.log('[flipball] ' + Array.prototype.join.call(arguments, ' '));
        }
    }

    $.fn.flipball = function(o) {
        var instance;
        this.each(function() {
            instance = $.data(this, 'flipball');
            // instance = $(this).data( 'flipball' );
            if (instance) {
                // instance.init();
            } else {
                instance = $.data(this, 'flipball', new F(this, o));
            }
        });
        return instance;
    }
})(jQuery);

(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'MMC',
            //过滤方法
            filtration: /[\s]|[,]|[;]|[|]|[<br>]|[，]|[；]|[、]|[｜]/i,
            rechooseBall: $('.rechoose-ball'), //重新选号
            restartGame: $('.restart-game'), //再玩一次
            betInfoDom: $('#J-result-info')
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            //连投
            that.isRepeated = false;
            //连投次数
            that.repeatedTimes = 0;
            //连投数据
            that.repeatedData = null;
            that.repeatedWinMoney = 0;
            that.stopMultipleBet = false;

            that.handlePanelDom();

            that.addLotteryList(26,'history');
            that.flipball();
            // console.log('MMC init ');

        },
        getGameConfig: function() {
            return Games.MMC.Config;
        },
        flipball: function() {
            return $('#flipball').flipball({
                ballsize: 5, // 彩球个数
                initball: '0,0,0,0,0', // 初始化彩球数据
                loop: 5, // 彩球滚动循环次数（必须为整数）
                timeout: 5000, // 彩球滚动动画执行时间基数
                delay: 150, // 每个彩球动画执行延迟时间基数
                offset: [80, 110] // 球的宽高
            });
        },
        //投注按钮
        initButtonBets: function() {
            var that = this;
            var cfg = that.defConfig;
            var gameOrder = Games.getCurrentGameOrder();
            var gameCfg = Games.getCurrentGameConfig();
            var compress = gameCfg.getSubmitCompress();
            var gameTrace = Games.getCurrentTrace();
            var gameMessage = Games.getCurrentMessage();
            //立即投注
            cfg.buttonImmediatelyBetting.on('click', function() {
                if ($(this).hasClass('btn-disable')) return;
                var data = gameOrder.getOrder([gameOrder.createBall()]);
                gameOrder.submitOrder(compress, data);
            });
            //确认投注
            cfg.buttonConfirmBet.on('click', function() {
                if ($(this).hasClass('btn-disable')) return;
                if ($(this).hasClass('stop')) {
                    $(this).addClass('btn-disable');
                    that.flipball().quickflip();
                    that.stopMultipleBet = true;
                    return;
                }
                that.isRepeated = false;
                that.repeatedTimes = 0;
                that.repeatedWinMoney = 0;
                var balls = gameOrder.getBalls();
                if (balls.length <= 0) {
                    gameMessage.show('mustChoose', {});
                    return;
                }
                var data = gameOrder.getOrder(balls);
               if(parseInt($("#liantou").val())>1){
                   var traceTimes = parseInt($("#liantou").val());
                   data.traceTimes =traceTimes;
                   var orders = {};
                   for(var i=1;i<traceTimes+1;i++){
                       orders[i] = '1';
                   }
                   data.orders = orders;
                   gameMessage.show('draw_times', {
                       times: 1
                   })
                   cfg.buttonTraceBet.addClass('btn-disable');
                   that.isRepeated = true;
                   that.repeatedTimes = 0;
                   that.repeatedData = null;
                   that.repeatedWinMoney = 0;
                   //var balls = gameOrder.getBalls();
                   //信息确认
                   that.repeatedData = data;
                   $('#J-trace-panel .closeBtn').click();

                   gameMessage.show('draw_times', {
                       times: 1
                   })
                   gameOrder.submitOrder(compress, data);
               }else {

                   gameOrder.submitOrder(compress, data);
               }
            });

            //减操作
            $(document).on('click', '.multiple-choose .liantou_less', function() {
                var inputVal = parseInt($("#liantou").val());

                if (inputVal <= 1) {
                    $("#liantou").val(1);
                } else {
                    $("#liantou").val(inputVal - 1);
                }
                // cfg.container.multipleNum.html($multipleInput.val());
                // //todo
                // gameSelfCfg.algorithmInjection();
            });
            //加操作
            $(document).on('click', '.multiple-choose .liantou_add', function() {
                var inputVal = parseInt($("#liantou").val());

                $("#liantou").val(inputVal + 1);

                // cfg.container.multipleNum.html($multipleInput.val());
                // //todo
                // gameSelfCfg.algorithmInjection();
            });
            //连投confirm
            cfg.buttonTraceConfirm.on('click', function() {
                if ($(this).hasClass('btn-disable')) return;
                cfg.buttonTraceBet.addClass('btn-disable');
                that.isRepeated = true;
                that.repeatedTimes = 0;
                that.repeatedData = null;
                that.repeatedWinMoney = 0;
                var balls = gameOrder.getBalls();
                if (balls.length <= 0) {
                    gameMessage.show('mustChoose', {});
                    return;
                }
                //信息确认
                var data = gameOrder.getOrder(balls);
                var traceData = gameTrace.getTraceSumitData();
                traceData.isTrace = 0;
                //连投的倍数代替原来的倍数
                for(var i=0;i<balls.length;i++){
                    balls[i].multiple =traceData.orders[1];
                }
                that.repeatedData = data = $.extend(data, traceData);
                if (data.traceTimes == 0) {
                    alert('请生成连投计划');
                    return;
                }
                $('#J-trace-panel .closeBtn').click();
                $('.dialog ').hide();
                cfg.betInfoDom.find('ul').html('');
                cfg.buttonConfirmBet.addClass('stop');
                cfg.buttonConfirmBet.addClass('btn-disable');
                that.$gameBtns.fadeOut();

                gameMessage.show('draw_times', {
                    times: 1
                })
                gameOrder.submitOrder(compress, data);


            });

            //重新选号
            cfg.rechooseBall.on('click', function() {
                $('.dialog ').hide();
                that.panel('show');
                that.$gameBtns.fadeOut();

                gameOrder.clearBasketBox();

                gameOrder.defConfig.shoppingCart.show();
                cfg.buttonTraceBet.addClass('btn-disable');

                cfg.betInfoDom.hide();
            });

            //再玩一次
            cfg.restartGame.on('click', function() {
                $('.dialog ').hide();
                cfg.buttonConfirmBet.removeClass('btn-disable');
                that.$gameBtns.fadeOut();
                cfg.buttonConfirmBet.click();
                cfg.betInfoDom.hide();
                var container = cfg.betInfoDom.find('ul');
                container.html('');
            });

            var recordsContainer = $('.lottery_wrap ul');
            var curCursor = 0;
            //向下翻动
            $(document).on('click', '.lottery_draw  .next', function() {
                if ($(this).hasClass('disabled')) return;
                var maxCursor = $('.lottery_wrap ul li').not('.blankRecord').size() - 5;
                if (curCursor == maxCursor) return;
                curCursor++;
                recordsContainer.animate({
                    marginTop: -curCursor * 23
                }, 700);
                if (curCursor > 0) {
                    $('.lottery_draw  .prev').removeClass('disabled');
                }
                if (curCursor == maxCursor) {
                    $(this).addClass('disabled');
                }
            });
            //向上翻动
            $(document).on('click', '.lottery_draw  .prev', function() {
                if ($(this).hasClass('disabled')) return;
                var maxCursor = $('.lottery_wrap ul li').not('.blankRecord').size() - 5;
                if (curCursor == 0) return;
                curCursor--;
                recordsContainer.animate({
                    marginTop: -curCursor * 23
                }, 700);
                if (curCursor == 0) {
                    $(this).addClass('disabled');
                }
                if (curCursor < maxCursor) {
                    $('.lottery_draw  .next').removeClass('disabled');
                }
            });


            $(document).on('click', '.handle_hand', function() {
                if (cfg.buttonConfirmBet.hasClass('btn-disable')) {
                    gameMessage.show('mustChoose', {});
                }
                cfg.buttonConfirmBet.click();
            });

        },

        handlePanelDom: function() {
            this.$panel = $('.top-section');
            this.$panelCtrl = $('.section-handle', this.$panel);
            this.$panelCont = this.$panel.children().not(this.$panelCtrl);
            this.$drawbtn = $('.bet-btn input'); // 开奖按钮
            this.$drawbarbtn = $('.handle_hand'); // 拉杆按钮
            this.$history = $('.lottery-history'); // 游戏记录
            this.$header = $('.game-info');
            this.$gameBtns = $('.result-button-group');

            this.$panelCtrl.animate({
                opacity: 'hide'
            });
        },
        panel: function(status) {
            var me = this;
            if (status == 'show') {
                // 显示控制面板
                me.$panelCtrl.animate({
                    opacity: 'hide'
                });
                me.$panelCont.slideDown();
            } else if (status == 'hide') {
                $('html, body').animate({
                    scrollTop: 0
                }, function() {
                    // 隐藏控制面板
                    me.$panelCont.slideUp();
                    me.$panelCtrl.animate({
                        opacity: 'show'
                    });
                });
            }
        },
        afterSubmitSuccess: function(res) {
            /*
            马上开奖 按钮变灰  ，下拉按钮变灰显示
            关闭操作面板

            =动画执行完
            显示中奖反馈
            切换 马上开奖 to 再玩一次与重新选号
            渲染开奖列表
            渲染历史记录
            */
            /* this.animateLottery();
             this.renderGamesHistory();*/
            var that = this;
            var cfg = that.defConfig;
            var gameMessage = Games.getCurrentMessage();
            //cfg.buttonConfirmBet
            that.panel('hide');
            //cfg.buttonConfirmBet.addClass('btn-disable');
            //cfg.buttonTraceConfirm.addClass('btn-disable');
            if (that.isRepeated) {
                cfg.buttonConfirmBet.removeClass('btn-disable');
                $('.dialog ').hide();
                gameMessage.show('draw_times', {
                    times: that.repeatedTimes + 1
                });
            } else {
                cfg.buttonConfirmBet.addClass('btn-disable');
            }

            that.animateLottery(res);

        },
        //获取投注特定彩种的投注记录
        addLotteryList: function (lotteryId,history) {
            var gameOrder = Games.getCurrentGameOrder();
            var balls = gameOrder.getBalls();
            var length = balls.length;
            ajaxData({
                url: getWebsiteOfHost() + "?action=getProjectList&lottery_id="+lotteryId,
                successCallback: function(data) {
                    if (!history) {
                        data =data.list.splice(0,length);
                    }else{
                        data = data.list;
                    }

                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        var color_td =data[i].prize>0? "color:red;font-size:15px":"";
                        html += '<tr>' +
                            '<td><span>' + data[i].lottery + '</span></td>' +
                            '<td><span>' + data[i].way + '</span></td>' +
                            '<td><span>' + data[i].issue + '</span></td>' +
                            '<td><span>' + data[i].prize_group + '</span></td>' +
                            '<td><a class="view-detail" href="javascript:void(0);">详细号码</a>' +
                            '<textarea class="data-textarea" style="display:none;">' + data[i].bet_number + '</textarea></td>' +
                            '<td style='+color_td+'><span>' + data[i].winning_number + '</span></td>' +
                            '<td><span>' + (data[i].coefficient) * 2 + '元</span></td>' +
                            '<td><span>' + data[i].multiple + '倍</span></td>' +
                            '<td><span data-money-format="" style="font-size: 13px;">' + formatMoney(data[i].amount) + '</span></td>' +
                            '<td style ='+color_td+'> <dfn>￥</dfn><span data-money-format="" style="font-size: 13px;">' + formatMoney(data[i].prize) + '</span></td>' +
                            '<td style ='+color_td+'><span>' + data[i].status + '</span></td>' +
                            '<td><a href=/view/page/orderDetail.shtml?order=' + data[i].id + '>详情</a></td>'
                        '</tr>'

                    }
                    $("#mmc_lottery_history").prepend(html);
                }
            });

        },
        //开奖效果 
        /*  winPrize:$('#win_prize'),//中奖窗口
             prizeResult:$('#prize_result'),//中奖结果
             noPrize:$('#no_prize'),//未中奖
             drawTimes:$('#draw_times')//第几次开奖*/
        animateLottery: function(res) {
            var that = this;
            var data = res.data;
            var gameMessage = Games.getCurrentMessage();
            //单次开奖动画
            this.flipball().flip(data.result.split(''), true, function() {
                //中奖金额以及中奖注数
                that.renderGamesHistory(data.result.split(''));
                that.renderLotteryRecord(data);
                //中奖后停止连投
                var winStopTrace = Games.getCurrentTrace().getWinStopTrace_mmc(data.winNum);
                var traceTimes = Games.getCurrentTrace().getUpdateTraceStatisics().traceTimes;
                if(that.repeatedData){
                    traceTimes = that.repeatedData.traceTimes;
                }
                var cfg = that.defConfig;
                that.repeatedWinMoney += Number(data['winMoney']);
                // console.log(that.isRepeated);
                // console.log(!winStopTrace.traceWinStop );
                // console.log(that.repeatedTimes < traceTimes);
                // console.log(! that.stopMultipleBet);
                if (that.isRepeated && !winStopTrace.traceWinStop && that.repeatedTimes < traceTimes && ! that.stopMultipleBet) {
                    if (Number(data['winMoney']) > 0 && Number(data['winNum']) > 0) {
                        gameMessage.show('win_prize', data);
                    }

                    var gameOrder = Games.getCurrentGameOrder();
                    var gameCfg = Games.getCurrentGameConfig();
                    var compress = gameCfg.getSubmitCompress();
                    cfg.buttonConfirmBet.addClass('btn-disable');
                    for(var i=0;i<that.repeatedData.balls.length;i++){
                        that.repeatedData.balls[i].multiple = that.repeatedData.orders[that.repeatedTimes+1];
                    }
                    gameOrder.submitOrder(compress, that.repeatedData);

                } else {
                    $('.dialog ').hide();
                    if (Number(data['winMoney']) > 0 && Number(data['winNum']) > 0) {
                        data.winMoney = that.repeatedWinMoney.toFixed(2);
                        gameMessage.show('prize_result', data);
                    } else {
                        gameMessage.show('no_prize', {});
                    }
                    that.isRepeated = false;
                    that.repeatedTimes = 0;
                    that.stopMultipleBet = false;
                    cfg.buttonConfirmBet.removeClass('stop');
                    cfg.buttonConfirmBet.addClass('btn-disable');
                    cfg.buttonTraceBet.removeClass('btn-disable');
                    that.$gameBtns.fadeIn();
                }
                that.addLotteryList(26);
            });
        },
        renderGamesHistory: function(arr) {
            var html = ['<li>'];
            for (var i = 0, len = arr.length; i < len; i++) {
                html.push('<span class="num_' + arr[i] + '">' + arr[i] + '</span>');
            }
            html.push('</li>')
            $('.lottery_wrap ul li:eq(0)').before(html.join(''));
            var size = $('.lottery_wrap ul li').not('.blankRecord').size();

            if (size > 5) {
                $('.lottery_draw  .next').removeClass('disabled');
            }

        },
        renderLotteryRecord: function(data) {
            var that = this;
            var cfg = that.defConfig;
            cfg.betInfoDom.show();
            var container = cfg.betInfoDom.find('ul');
            var s = data.winMoney > 0 ? '¥' + data.winMoney + '元' : '未中奖';
            var li = '<li><span>第' + (++that.repeatedTimes) + '次开奖</span><span>' + data.result + '</span><span> ' + s + '</span></li>';
            if (that.isRepeated) {
                if (that.repeatedTimes == 1) {
                    container.append(li);
                } else {
                    container.find('li:eq(0)').before(li);
                }

            } else {
                container.html(li);
            }


            var setting = {
                autoReinitialise: false
            };
            //初始化滚动条
            var jspApi = cfg.betInfoDom.jScrollPane(setting);
            //获取滚动条
            var refreshApi = jspApi.data("jsp");
            //重新加载刷新滚动条
            refreshApi.reinitialise(setting);
        },
        //格式化历史开奖列表
        formatLotteryNum: function(num) {
            return (num == "") ? ['-', '-', '-', '-', '-'] : num.split('');
        },
        getMapping: function() {
            var ballConfig = Games.getCurrentGameMapping().getBallConfig();
            return {
                '78': {
                    name: '一星不定位',
                    'ball': {
                        labels: ['万位', '千位', '百位', '十位', '个位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '68': {
                    name: '五星直选复式',
                    'ball': {
                        labels: ['万位', '千位', '百位', '十位', '个位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '7': {
                    name: '五星直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 5
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '494': {
                    name: '五星直选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 46
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '32': {
                    name: '五星组选 120',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '120'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isNotRepeat',
                                class: 'focus',
                                text: '120'
                            }],

                            position: [0, 1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '31': {
                    name: '五星组选 60',
                    'ball': {
                        labels: ['二重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '60'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isOneRepeat',
                                class: 'curr',
                                text: '60'
                            }],

                            position: [0, 1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '30': {
                    name: '五星组选 30',
                    'ball': {
                        labels: ['二重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '30'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isTwoRepeat',
                                class: 'curr',
                                text: '30'
                            }],

                            position: [0, 1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '29': {
                    name: '五星组选 20',
                    'ball': {
                        labels: ['三重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '20'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isTreeSame',
                                class: 'curr',
                                text: '20'
                            }],

                            position: [0, 1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '28': {
                    name: '五星组选 10',
                    'ball': {
                        labels: ['三重号', '二重号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '10'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isTreeSameOneRepeat',
                                class: 'curr',
                                text: '10'
                            }],

                            position: [0, 1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '27': {
                    name: '五星组选 5',
                    'ball': {
                        labels: ['四重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '5'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isThourSame',
                                class: 'curr',
                                text: '5'
                            }],

                            position: [0, 1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '295': {
                    name: '四星直选复式',
                    'ball': {
                        labels: ['万位', '千位', '百位', '十位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '351': {
                    name: '四星直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 4
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '242': {
                    name: '四星组选24',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '24'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isNotRepeat',
                                class: 'curr',
                                text: '24'
                            }],

                            position: [0, 1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '329': {
                    name: '四星组选12',
                    'ball': {
                        labels: ['二重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },

                    'listTable': {
                        title: ['奖期', '开奖', '12'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isOneRepeat',
                                class: 'curr',
                                text: '12'
                            }],

                            position: [0, 1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '243': {
                    name: '四星组选6',
                    'ball': {
                        labels: ['二重号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '6'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isTwoRepeat',
                                class: 'curr',
                                text: '6'
                            }],

                            position: [0, 1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '330': {
                    name: '四星组选4',
                    'ball': {
                        labels: ['三重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },

                    'listTable': {
                        title: ['奖期', '开奖', '4'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isTreeSame',
                                class: 'curr',
                                text: '4'
                            }],

                            position: [0, 1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '67': {
                    name: '后四直选复式',
                    'ball': {
                        labels: ['千位', '百位', '十位', '个位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '6': {
                    name: '后四直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 4
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '26': {
                    name: '后四组选24',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '24'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isNotRepeat',
                                class: 'curr',
                                text: '24'
                            }],

                            position: [1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '25': {
                    name: '后四组选12',
                    'ball': {
                        labels: ['二重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '12'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isOneRepeat',
                                class: 'curr',
                                text: '12'
                            }],

                            position: [1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '24': {
                    name: '后四组选6',
                    'ball': {
                        labels: ['二重号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '6'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isTwoRepeat',
                                class: 'curr',
                                text: '6'
                            }],

                            position: [1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '23': {
                    name: '后四组选4',
                    'ball': {
                        labels: ['三重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '4'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                func: 'isTreeSame',
                                class: 'curr',
                                text: '4'
                            }],

                            position: [1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '65': {
                    name: '前三直选复式',
                    'ball': {
                        labels: ['万位', '千位', '百位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '1': {
                    name: '前3直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '71': {
                    name: '前3直选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 28
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '60': {
                    name: '前3直选跨度',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '跨度'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'zhixuanKuadu',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '16': {
                    name: '前3组选组三',
                    'ball': {
                        labels: ['组三'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '组三'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: 'focus',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '17': {
                    name: '前3组选组六',
                    'ball': {
                        labels: ['组六'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '组六'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: 'focus',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '13': {
                    name: '前3混合组选',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ' 形态'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '75': {
                    name: '前3组选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 1,
                            end: 27
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '2': {
                    name: '前3组三单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        rules: [{
                            func: 'isOneRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: 'focus',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '3': {
                    name: '前3组六单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: 'focus',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '64': {
                    name: '前3组六包胆',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        ballsLimit: 1,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '33': {
                    name: '前3和值尾数',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和尾'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getHeZhiTailNum',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '48': {
                    name: '前3特殊号码',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.teshuhaoma,
                        control: false,
                        tmpl: 'ball_1',
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '388': {
                    name: '前3 其他豹子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[0]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '387': {
                    name: '前3 其他顺子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[1]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '385': {
                    name: '前3 其他对子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[2]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '150': {
                    name: '中三直选复式',
                    'ball': {
                        labels: ['千位', '百位', '十位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '142': {
                    name: '中3直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '151': {
                    name: '中3直选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 28
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '149': {
                    name: '中3直选跨度',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '跨度'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'zhixuanKuadu',
                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '145': {
                    name: '中3组选组三',
                    'ball': {
                        labels: ['组三'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '组三'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: 'focus',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '146': {
                    name: '中3组选组六',
                    'ball': {
                        labels: ['组六'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '组六'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: 'focus',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '152': {
                    name: '中3混合组选',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ' 形态'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '154': {
                    name: '中3组选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 1,
                            end: 27
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '143': {
                    name: '中3组三单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        rules: [{
                            func: 'isOneRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: 'focus',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '144': {
                    name: '中3组六单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: 'focus',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '153': {
                    name: '中3组六包胆',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        ballsLimit: 1,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '156': {
                    name: '中3和值尾数',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和尾'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getHeZhiTailNum',
                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '155': {
                    name: '中3特殊号码',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.teshuhaoma,
                        control: false,
                        tmpl: 'ball_1',
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '393': {
                    name: '中3 其他豹子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[0]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '392': {
                    name: '中3 其他顺子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[1]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '391': {
                    name: '中3 其他对子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[2]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [1, 2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '69': {
                    name: '后三直选复式',
                    'ball': {
                        labels: ['百位', '十位', '个位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '8': {
                    name: '后3直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '73': {
                    name: '后3直选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 28
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '62': {
                    name: '后3直选跨度',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '跨度'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'zhixuanKuadu',
                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '49': {
                    name: '后3组选组三',
                    'ball': {
                        labels: ['组三'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '组三'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: 'focus',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '50': {
                    name: '后3组选组六',
                    'ball': {
                        labels: ['组六'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '组六'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: 'focus',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '81': {
                    name: '后3混合组选',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ' 形态'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '80': {
                    name: '后3组选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 1,
                            end: 27
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '9': {
                    name: '后3组三单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        rules: [{
                            func: 'isOneRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: 'focus',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: '',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '10': {
                    name: '后3组六单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '组三'
                                }, {
                                    func: 'isNotRepeat',
                                    class: 'focus',
                                    text: '组六'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '83': {
                    name: '后3组六包胆',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        ballsLimit: 1,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '54': {
                    name: '后3和值尾数',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和尾'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getHeZhiTailNum',
                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '57': {
                    name: '后3特殊号码',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.teshuhaoma,
                        control: false,
                        tmpl: 'ball_1',
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '390': {
                    name: '后3 其他豹子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[0]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '389': {
                    name: '后3 其他顺子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[1]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '386': {
                    name: '后3 其他对子',
                    'ball': {
                        labels: [''],
                        balls: [ballConfig.teshuhaoma[2]],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '形态'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: true,
                            rules: [{
                                    func: 'isOneRepeat',
                                    class: '',
                                    text: '对子'
                                }, {
                                    func: 'isQueueNum',
                                    class: '',
                                    text: '顺子'
                                }, {
                                    func: 'isTreeSame',
                                    class: '',
                                    text: '豹子'
                                }

                            ],

                            position: [2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '70': {
                    name: '二星  直选 后二复式',
                    'ball': {
                        labels: ['十位', '个位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '11': {
                    name: '2星后二单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        hasAid: false
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '74': {
                    name: '二星后二和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 19
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '63': {
                    name: '二星后二跨度',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '跨度'],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'zhixuanKuadu',
                            position: [3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '66': {
                    name: '二星  直选 前二复式',
                    'ball': {
                        labels: ['万位', '千位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '4': {
                    name: '2星前二单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        hasAid: false
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '72': {
                    name: '二星前二和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 19
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '112': {
                    name: '三码 前三直选复式',
                    'ball': {
                        labels: ['一位', '二位', '三位'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '111': {
                    name: '二码 前二直选复式',
                    'ball': {
                        labels: ['一位', '二位'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '122': {
                    name: '前三不定位',
                    'ball': {
                        labels: ['前三'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '109': {
                    name: '趣味型 定单双',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.moreDanshuang,
                        control: false,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' '
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '106': {
                    name: '定位胆',
                    'ball': {
                        labels: ['一位', '二位', '三位', '四位', '五位'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '98': {
                    name: '任选复式 任选一中一复式',
                    'ball': {
                        labels: ['选1中1'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '86': {
                    name: '任选一中一单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 1,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '113': {
                    name: '任选 任选二中二胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 1,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '380': {
                    name: '猜1不出',
                    'ball': {
                        labels: ['一个号'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '95': {
                    name: '前三直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '101': {
                    name: '任选复式 任选4中4复式',
                    'ball': {
                        labels: ['选4中4'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '102': {
                    name: '任选复式 任选5中5复式',
                    'ball': {
                        labels: ['选5中5'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '103': {
                    name: '任选复式 任选6中5复式',
                    'ball': {
                        labels: ['选6中5'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '104': {
                    name: '任选复式 任选7中5复式',
                    'ball': {
                        labels: ['选7中5'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '87': {
                    name: '任选二中二单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '114': {
                    name: '任选 任选三中三胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 2,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '115': {
                    name: '任选 任选四中四胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 3,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '116': {
                    name: '任选 任选五中五胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 4,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '117': {
                    name: '任选 任选六中五胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 5,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '118': {
                    name: '任选 任选七中五胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 6,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '119': {
                    name: '任选 任选八中五胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 7,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '381': {
                    name: '猜2不出',
                    'ball': {
                        labels: ['二个号'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '382': {
                    name: '猜3不出',
                    'ball': {
                        labels: ['三个号'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '383': {
                    name: '猜4不出',
                    'ball': {
                        labels: ['四个号'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '384': {
                    name: '猜5不出',
                    'ball': {
                        labels: ['五个号'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },

                '88': {
                    name: '任选三中三单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '89': {
                    name: '任选四中四单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 4,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '90': {
                    name: '任选五中五单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 5,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '91': {
                    name: '任选六中五单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 6,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '92': {
                    name: '任选七中五单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 7,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '93': {
                    name: '任选八中五单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 8,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '105': {
                    name: '任选复式 任选8中5复式',
                    'ball': {
                        labels: ['选8中5'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '100': {
                    name: '任选复式 任选三中三复式',
                    'ball': {
                        labels: ['选3中3'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '99': {
                    name: '任选复式 任选二中二复式',
                    'ball': {
                        labels: ['选2中2'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '110': {
                    name: '趣味型 猜中位',
                    'ball': {
                        labels: ['猜中位'],
                        balls: ballConfig.l115zhongwei,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '120': {
                    name: '二码 前二组选胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 1,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '96': {
                    name: '前二组选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '107': {
                    name: '二码 前二组选复式',
                    'ball': {
                        labels: ['前二'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '94': {
                    name: '前二直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '121': {
                    name: '三码 前三组选胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.l115,
                            control: false,
                        }, {
                            ball: ballConfig.l115,
                            control: true
                        }],
                        ballsLimit: 2,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '97': {
                    name: '前三组选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isL115Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '108': {
                    name: '三码 前三组选复式',
                    'ball': {
                        labels: ['前三'],
                        balls: ballConfig.l115,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['circle', 'circle', 'circle', 'circle', 'circle'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '61': {
                    name: '二星前二跨度',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '跨度'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'zhixuanKuadu',
                            position: [0, 1]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '59': {
                    name: '二星  组选 后二复式',
                    'ball': {
                        labels: ['组选'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '12': {
                    name: '2星后二单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        hasAid: false,
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '77': {
                    name: '二星 组选后二和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 18
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '85': {
                    name: '二星 组选后二包胆',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        ballsLimit: 1,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '20': {
                    name: '二星  组选 前二复式',
                    'ball': {
                        labels: ['组选'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '5': {
                    name: '2星前二单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        hasAid: false,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '76': {
                    name: '二星 组选 前二和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 18
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '84': {
                    name: '二星 组选前二包胆',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        ballsLimit: 1,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '51': {
                    name: '后三一码不定位',
                    'ball': {
                        labels: ['不定位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '52': {
                    name: '后三二码不定位',
                    'ball': {
                        labels: ['不定位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '18': {
                    name: '前三一码不定位',
                    'ball': {
                        labels: ['不定位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '21': {
                    name: '前三二码不定位',
                    'ball': {
                        labels: ['不定位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '34': {
                    name: '四星一码不定位',
                    'ball': {
                        labels: ['不定位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '35': {
                    name: '四星二码不定位',
                    'ball': {
                        labels: ['不定位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '36': {
                    name: '五星二码不定位',
                    'ball': {
                        labels: ['不定位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '37': {
                    name: '五星三码不定位',
                    'ball': {
                        labels: ['不定位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '58': {
                    name: '大小单双 后二大小单双',
                    'ball': {
                        labels: ['十位', '个位'],
                        balls: ballConfig.daxiaodanshuang,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '大小', '单双'],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getDaxiao',
                            position: [3, 4]
                        }, {
                            iisCondition: false,
                            func: 'getDanshuang',
                            position: [3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '53': {
                    name: '大小单双 后三大小单双',
                    'ball': {
                        labels: ['百位', '十位', '个位'],
                        balls: ballConfig.daxiaodanshuang,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '19': {
                    name: '大小单双 前二大小单双',
                    'ball': {
                        labels: ['万位', '千位'],
                        balls: ballConfig.daxiaodanshuang,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '大小', '单双'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getDaxiao',
                            position: [0, 1]
                        }, {
                            iisCondition: false,
                            func: 'getDanshuang',
                            position: [0, 1]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '22': {
                    name: '大小单双 前三大小单双',
                    'ball': {
                        labels: ['万位', '千位', '百位'],
                        balls: ballConfig.daxiaodanshuang,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },

                '495': {
                    name: '五星和值大小单双',
                    'ball': {
                        labels: ['五星和值'],
                        balls: ballConfig.daxiaodanshuang,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1, 2, 3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '38': {
                    name: '趣味 五码趣味三星',
                    'ball': {
                        labels: ['万位', '千位', '百位', '十位', '个位'],
                        balls: [{
                                ball: ballConfig.daxiao,
                                control: false
                            }, {
                                ball: ballConfig.daxiao,
                                control: false
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }

                        ],
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '39': {
                    name: '趣味 四码趣味三星',
                    'ball': {
                        labels: ['千位', '百位', '十位', '个位'],
                        balls: [{
                                ball: ballConfig.daxiao,
                                control: false
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }

                        ],
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '55': {
                    name: '趣味 后三趣味二星',
                    'ball': {
                        labels: ['百位', '十位', '个位'],
                        balls: [{
                                ball: ballConfig.daxiao,
                                control: false
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }

                        ],
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '40': {
                    name: '趣味 前三趣味二星',
                    'ball': {
                        labels: ['万位', '千位', '百位'],
                        balls: [{
                                ball: ballConfig.daxiao,
                                control: false
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }

                        ],
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '41': {
                    name: '趣味 五码区间三星',
                    'ball': {
                        labels: ['万位', '千位', '百位', '十位', '个位'],
                        balls: [{
                                ball: ballConfig.qujian,
                                control: false
                            }, {
                                ball: ballConfig.qujian,
                                control: false
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }

                        ],
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '42': {
                    name: '趣味 四码区间三星',
                    'ball': {
                        labels: ['千位', '百位', '十位', '个位'],
                        balls: [{
                                ball: ballConfig.qujian,
                                control: false
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }

                        ],
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '56': {
                    name: '趣味 后三区间二星',
                    'ball': {
                        labels: ['百位', '十位', '个位'],
                        balls: [{
                                ball: ballConfig.qujian,
                                control: false
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }

                        ],
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '43': {
                    name: '趣味 前三区间二星',
                    'ball': {
                        labels: ['万位', '千位', '百位'],
                        balls: [{
                                ball: ballConfig.qujian,
                                control: false
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }, {
                                ball: {
                                    start: 0,
                                    end: 10
                                },
                                control: true
                            }

                        ],
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '44': {
                    name: '趣味 一帆风顺',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '45': {
                    name: '趣味 好事成双',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '46': {
                    name: '趣味 三星报喜',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '47': {
                    name: '趣味 四季发财',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '199': {
                    name: '任选二 直选复式',
                    'ball': {
                        labels: ['万位', '千位', '百位', '十位', '个位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '200': {
                    name: '任选 任选二 直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        hasPositionOption: true,
                        positionOption: [0, 0, 0, 1, 1],
                        renxuanNum: 2
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '196': {
                    name: '任选二 直选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 19
                        },
                        control: false,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 0, 1, 1],
                        renxuanNum: 2,
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '183': {
                    name: '任选三 直选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 28
                        },
                        control: false,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3,
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '198': {
                    name: '任选二 直选跨度',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 0, 1, 1],
                        renxuanNum: 2
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '跨度'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'zhixuanKuadu',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '185': {
                    name: '任选三 直选跨度',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '跨度'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'zhixuanKuadu',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '195': {
                    name: '任选二 组选复式',
                    'ball': {
                        labels: ['组选'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 0, 1, 1],
                        renxuanNum: 2
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '201': {
                    name: '任选二 组选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        hasPositionOption: true,
                        positionOption: [0, 0, 0, 1, 1],
                        renxuanNum: 2,
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '197': {
                    name: '任选二 组选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 18
                        },
                        control: false,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 0, 1, 1],
                        renxuanNum: 2,
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '179': {
                    name: '任选三 直选复式',
                    'ball': {
                        labels: ['万位', '千位', '百位', '十位', '个位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '186': {
                    name: '任选 任选三 直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '181': {
                    name: '任选三 组三复式',
                    'ball': {
                        labels: ['组选'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '188': {
                    name: '任选三 组选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3,
                        rules: [{
                            func: 'isOneRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '182': {
                    name: '任选三 组六复式',
                    'ball': {
                        labels: ['组六'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '189': {
                    name: '任选三 组六单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '190': {
                    name: '任选三 混合组选',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3,
                        rules: [{
                            func: 'isNotThreeSame',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '184': {
                    name: '任选三 组选和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 27
                        },
                        control: false,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 0, 1, 1, 1],
                        renxuanNum: 3,
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '180': {
                    name: '任选四 直选复式',
                    'ball': {
                        labels: ['万位', '千位', '百位', '十位', '个位'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '187': {
                    name: '任选 任选四 直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 4,
                        hasPositionOption: true,
                        positionOption: [0, 1, 1, 1, 1],
                        renxuanNum: 4
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '194': {
                    name: '任选四 组选24',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 1, 1, 1, 1],
                        renxuanNum: 4,
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '193': {
                    name: '任选四 组选12',
                    'ball': {
                        labels: ['二重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 1, 1, 1, 1],
                        renxuanNum: 4,
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '192': {
                    name: '任选四 组选6',
                    'ball': {
                        labels: ['二重号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 1, 1, 1, 1],
                        renxuanNum: 4
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '191': {
                    name: '任选四 组选4',
                    'ball': {
                        labels: ['三重号', '单号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        hasPositionOption: true,
                        positionOption: [0, 1, 1, 1, 1],
                        renxuanNum: 4,
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '352': {
                    name: '龙虎和 万千',
                    'ball': {
                        labels: ['万：千'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [0, 1]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '353': {
                    name: '龙虎和 万百',
                    'ball': {
                        labels: ['万：百'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['curr', 'normal', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [0, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '354': {
                    name: '龙虎和 万十',
                    'ball': {
                        labels: ['万：十'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['curr', 'normal', 'normal', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [0, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '355': {
                    name: '龙虎和 万个',
                    'ball': {
                        labels: ['万：个'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['curr', 'normal', 'normal', 'normal', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [0, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '356': {
                    name: '龙虎和 千百',
                    'ball': {
                        labels: ['千：百'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['normal', 'curr', 'curr', 'normal', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '357': {
                    name: '龙虎和 千十',
                    'ball': {
                        labels: ['千：十'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['normal', 'curr', 'normal', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [1, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '358': {
                    name: '龙虎和 千个',
                    'ball': {
                        labels: ['千：个'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['normal', 'curr', 'normal', 'normal', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [1, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '359': {
                    name: '龙虎和 百十',
                    'ball': {
                        labels: ['百：十'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['normal', 'normal', 'curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [2, 3]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '360': {
                    name: '龙虎和 百个',
                    'ball': {
                        labels: ['百：个'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['normal', 'normal', 'curr', 'normal', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [2, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '361': {
                    name: '龙虎和 十个',
                    'ball': {
                        labels: ['十：个'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [3, 4]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '362': {
                    name: '猜1不出',
                    'ball': {
                        labels: ['一个号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '363': {
                    name: '猜2不出',
                    'ball': {
                        labels: ['二个号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '364': {
                    name: '猜3不出',
                    'ball': {
                        labels: ['三个号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '365': {
                    name: '猜4不出',
                    'ball': {
                        labels: ['四个号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '366': {
                    name: '猜5不出',
                    'ball': {
                        labels: ['五个号'],
                        balls: {
                            start: 0,
                            end: 10
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                }


            };
        }
    };

    var Main = host.ExtendClass(pros, Game);
    Main.defConfig = defConfig;
    //游戏控制单例
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };

    host.Games[name] = Main;
})(gagame, 'MMC', jQuery, gagame.Game);