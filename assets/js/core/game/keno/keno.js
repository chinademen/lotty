(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'KENO',
            //过滤方法
            filtration: /[；|;]+|[\n\r]+|[,|，]+|[:|：]+/g
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('KENO init');
            //设置注数之间的分隔符
            Games.getCurrentSingleBet().setFiltration(this.defConfig.filtration);
            that.animateLottery();
        },
        getGameConfig: function() {
            return Games.KENO.Config;
        },
        getFiltration: function() {
            return this.defConfig.filtration;
        },
        //格式化历史开奖列表
        formatLotteryNum: function(num) {
            return (num == "") ? ['-', '-', '-', '-', '-','-', '-', '-', '-', '-','-', '-', '-', '-', '-','-', '-', '-', '-', '-'] : num.split(' ');
        },
        //开奖效果 
        animateLottery: function() {
            var numHeight = 34;
            $("#J-lottery-ernie-numbers .nums").css('backgroundPositionY', 0);
            var lotterNumber = Games.getCurrentGameConfig().getLotteryBalls();
            if (lotterNumber == '') {
                $('#J-lottery-ernie-numbers').hide();
                $('.J-loading-lottery').show();
                return;
            } else {
                $('#J-lottery-ernie-numbers').show();
                $('.J-loading-lottery').hide();
            }

            var num_arr = lotterNumber.split(' ');
            $("#J-lottery-ernie-numbers .nums").each(function(index) {
                var _num = $(this);
                setTimeout(function() {
                    _num.animate({
                        backgroundPositionY: -(numHeight * (Math.abs(num_arr[index]) - 1))
                    }, {
                        duration: 700 + index * 100,
                        easing: "easeInOutCirc",
                        complete: function() {
                            //if (index == 3) isBegin = false;
                        }
                    });
                }, index * 300);
            });
        },

        getMapping: function() {
            var ballConfig = Games.getCurrentGameMapping().getBallConfig();
            var ballCls = ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'];
            return {
                '427': {
                    name: '',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.simpleDanshuang,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '428': {
                    name: '',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.daxiao810,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '431': {
                    name: '',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.wuxing,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '429': {
                    name: '',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.jiouhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '430': {
                    name: '',
                    'ball': {
                        labels: [''],
                        balls: ballConfig.shangzhongxia,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '400': {
                    name: '',
                    'ball': {
                        labels: ['上', '下'],
                        balls: [{
                            ball: {
                                start: 1,
                                end: 41 
                            },
                            control: true
                        }, {
                            ball: {
                                start: 41,
                                end: 81 
                            },
                            control: true
                        }],
                        control: false,
                        tmpl: 'ball_3',
                        ballBottomControl: true,
                        singleGroupSplit:' ',
                        ballArraySplit:' ',
                        switchOddEven:true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '401': {
                    name: '',
                    'ball': {
                        labels: ['上', '下'],
                        balls: [{
                            ball: {
                                start: 1,
                                end: 41 
                            },
                            control: true
                        }, {
                            ball: {
                                start: 41,
                                end: 81 
                            },
                            control: true
                        }],
                        control: false,
                        tmpl: 'ball_3',
                        ballBottomControl: true,
                        singleGroupSplit:' ',
                        ballArraySplit:' '
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '402': {
                    name: '',
                    'ball': {
                        labels: ['上', '下'],
                        balls: [{
                            ball: {
                                start: 1,
                                end: 41 
                            },
                            control: true
                        }, {
                            ball: {
                                start: 41,
                                end: 81 
                            },
                            control: true
                        }],
                        control: false,
                        tmpl: 'ball_3',
                        ballBottomControl: true,
                        singleGroupSplit:' ',
                        ballArraySplit:' '
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '403': {
                    name: '',
                    'ball': {
                        labels: ['上', '下'],
                        balls: [{
                            ball: {
                                start: 1,
                                end: 41 
                            },
                            control: true
                        }, {
                            ball: {
                                start: 41,
                                end: 81 
                            },
                            control: true
                        }],
                        control: false,
                        tmpl: 'ball_3',
                        ballBottomControl: true,
                        singleGroupSplit:' ',
                        ballArraySplit:' '
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '404': {
                    name: '',
                    'ball': {
                        labels: ['上', '下'],
                        balls: [{
                            ball: {
                                start: 1,
                                end: 41 
                            },
                            control: true
                        }, {
                            ball: {
                                start: 41,
                                end: 81 
                            },
                            control: true
                        }],
                        control: false,
                        tmpl: 'ball_3',
                        ballBottomControl: true,
                        singleGroupSplit:' ',
                        ballArraySplit:' '
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '405': {
                    name: '',
                    'ball': {
                        labels: ['上', '下'],
                        balls: [{
                            ball: {
                                start: 1,
                                end: 41 
                            },
                            control: true
                        }, {
                            ball: {
                                start: 41,
                                end: 81 
                            },
                            control: true
                        }],
                        control: false,
                        tmpl: 'ball_3',
                        ballBottomControl: true,
                        singleGroupSplit:' ',
                        ballArraySplit:' '

                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
                    }
                },
                '406': {
                    name: '',
                    'ball': {
                        labels: ['上', '下'],
                        balls: [{
                            ball: {
                                start: 1,
                                end: 41 
                            },
                            control: true
                        }, {
                            ball: {
                                start: 41,
                                end: 81 
                            },
                            control: true
                        }],
                        control: false,
                        tmpl: 'ball_3',
                        ballBottomControl: true,
                        singleGroupSplit:' ',
                        ballArraySplit:' '
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ballCls,
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_kl8'
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
})(gagame, 'KENO', jQuery, gagame.Game);