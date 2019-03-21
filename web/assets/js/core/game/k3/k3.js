(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'K3',
            //过滤方法
            filtration: /[；|;]+|[\n\r]+|[,|，]+|[:|：]+/g
        },
        instance,
        Games = host.Games;
    // 开奖动画
    var diceAnimation = function($dices){
        this.$dices = $dices || $('.dice');
        this.rands = ['a', 'b', 'c', 'd'];
        this.randLen = this.rands.length;
        this.timeout = 150;
        this.animation = function(ballsArr, callback){
            var me = this;
            me.$dices.each(function(idx, dice){
                var $dice = $(dice),
                    nums = me.randomBelle(me.randLen, me.randLen-1, 0);
                $dice.attr('class', 'dice')
                    .delay(me.timeout).animate({opacity: 'show'}, 100, function(){
                        $dice.addClass('dice_' + me.rands[nums[0]]);
                    }).delay(me.timeout).animate({opacity: 'show'}, 100, function(){
                        $dice.removeClass('dice_' + me.rands[nums[0]]).addClass('dice_' + me.rands[nums[1]]);
                    }).delay(me.timeout).animate({opacity: 'show'}, 600, function(){
                        $dice.removeClass('dice_' + me.rands[nums[1]]).addClass('dice_' + me.rands[nums[2]]);
                    }).delay(me.timeout).animate({opacity: 'show'}, 600, function(){
                        $dice.removeClass('dice_' + me.rands[nums[2]]).addClass('dice_' + me.rands[nums[3]]);
                    }).delay(me.timeout).animate({opacity: 'show'}, 100, function(){
                        $dice.removeClass('dice_' + me.rands[nums[3]]).addClass('dice_' + ballsArr[idx]);
                        if( callback && typeof callback == 'function' ){
                            callback();
                        }
                    });
            });
        }
        this.randomBelle = function(count, maxs, mins){
            var numArray = new Array();
            //getArray(4,27,0); //4是生成4个随机数,27和0是指随机生成数是从0到27的数
            function getArray(count, maxs, mins){
                while(numArray.length < count){
                    var temp = getRandom(maxs,mins);
                    if(!search(numArray,temp)){
                        numArray.push(temp);
                    }
                }
                //alert("生成的数组为:"+numArray);
                return numArray;
            }
            function getRandom(maxs, mins){  //随机生成maxs到mins之间的数
                return Math.round(Math.random()*(maxs-mins))+mins;
            }
            function search(numArray, num){   //array是否重复的数
                for(var i=0; i<numArray.length; i++){
                    if(numArray[i] == num){
                        return true;
                    }
                }
                return false;
            }
            return getArray(count, maxs, mins);
        }
    };
    var diceAnim;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('K3 init');
            //设置注数之间的分隔符
            Games.getCurrentSingleBet().setFiltration(this.defConfig.filtration);
            that.animateLottery();
        },
        getGameConfig: function() {
            return Games.K3.Config;
        },
        getFiltration: function() {
            return this.defConfig.filtration;
        },
        //格式化历史开奖列表
        formatLotteryNum: function(num) {
            return (num == "") ? ['-', '-', '-'] : num.split('');
        },
        //开奖效果 
        animateLottery: function() {
            var lotteryErnieNumbers = $('#J-lottery-ernie-numbers');
            var lotterNumber = Games.getCurrentGameConfig().getLotteryBalls();
            
            if (lotterNumber == '') {
                lotteryErnieNumbers.hide();
                $('.J-loading-lottery').show();
                return;
            } else {
                lotteryErnieNumbers.show();
                $('.J-loading-lottery').hide();
            }
            var ballsArr = lotterNumber.split('');
            var $dom = $('#lottery-numbers-board');
            if (!diceAnim) { 
                diceAnim = new diceAnimation($dom.find('.dice'));
            }  
            var hz = 0,
                dx = '大',
                ds = '双';
            $.each(ballsArr, function(i, ball) {
                hz += parseInt(ball);
            });
            if (hz <= 10) dx = '小';
            // if( hz <= 9 ) dx = '小';
            if (hz % 2) ds = '单';
            diceAnim.animation(ballsArr, function() {
                $('#J-lottery-property-hz').html(hz);
                $('#J-lottery-property-dx').html(dx);
                $('#J-lottery-property-ds').html(ds);
            });
            
        },

        getMapping: function() {
            var ballConfig = Games.getCurrentGameMapping().getBallConfig();
            return {
                '160': {
                    name: '二同号单选',
                    'ball': {
                        labels: ['同号', '不同号'],
                        balls: [{
                            ball: ballConfig.doubleNumber1to6,
                            control: false,
                        }, {
                            ball: {
                                start: 1,
                                end: 7
                            },
                            control: false
                        }],
                        tmpl: 'ball_2'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '161': {
                    name: '二同号复选',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.doubleNumber1to6fushi,
                        tmpl: 'ball_1',
                        control: false,
                        singleGroupSplit: '|'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '157': {
                    name: '和值 和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 3,
                            end: 19
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '和值'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '158': {
                    name: '三同号单选',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.tripleNumber1to6,
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '159': {
                    name: '三同号通选',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.tongxuan,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '162': {
                    name: '三不同号',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 1,
                            end: 7
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '163': {
                    name: ' 二不同号',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 1,
                            end: 7
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '164': {
                    name: ' 三连号通选',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.tongxuan,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '165': {
                    name: ' 大小',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.daxiaodanshuang.slice().splice(0, 2),
                        control: false,
                        singleGroupSplit: '|',
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '166': {
                    name: ' 单双',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.simpleDanshuang,
                        control: false,
                        singleGroupSplit: '|',
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '167': {
                    name: ' 猜必出',
                    'ball': {
                        labels: ['猜必出'],
                        balls: {
                            start: 1,
                            end: 7
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: '|',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '375': {
                    name: ' 猜1不出',
                    'ball': {
                        labels: ['一个号'],
                        balls: {
                            start: 1,
                            end: 7
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '376': {
                    name: ' 猜2不出',
                    'ball': {
                        labels: ['二个号'],
                        balls: {
                            start: 1,
                            end: 7
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '377': {
                    name: ' 猜3不出',
                    'ball': {
                        labels: ['三个号'],
                        balls: {
                            start: 1,
                            end: 7
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '378': {
                    name: ' 颜色 全红',
                    'ball': {
                        labels: [''],
                        balls: [{
                            text: '全红',
                            viewBall: '全红',
                            value: '1',
                            class: 'ball-number-long'
                        }],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '379': {
                    name: ' 颜色 全黑',
                    'ball': {
                        labels: [''],
                        balls: [{
                            text: '全黑',
                            viewBall: '全黑',
                            value: '1',
                            class: 'ball-number-long'
                        }],
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr'],
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
})(gagame, 'K3', jQuery, gagame.Game);