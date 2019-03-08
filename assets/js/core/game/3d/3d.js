(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'D3',
            //过滤方法
            filtration: /[\s]|[,]|[;]|[|]|[<br>]|[，]|[；]|[、]|[｜]/i,
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('D3 init');
            that.animateLottery();
        },
        getGameConfig: function() {
            return Games.D3.Config;
        },
        //开奖效果 
        animateLottery: function() {
            var numHeight = 60;
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
            
            var num_arr = lotterNumber.split('');
            $("#J-lottery-ernie-numbers .nums").each(function(index) {
                var _num = $(this);
                setTimeout(function() {
                    _num.animate({
                        backgroundPositionY: -(numHeight * num_arr[index])
                    }, {
                        duration: 1000 + index * 100,
                        easing: "easeInOutCirc",
                        complete: function() {
                            //if (index == 3) isBegin = false;
                        }
                    });
                }, index * 300);
            });
        },
        //格式化历史开奖列表
        formatLotteryNum: function(num) {
            return (num == "") ? ['-', '-', '-'] : num.split('');
        },
        getMapping: function() {
            var ballConfig = Games.getCurrentGameMapping().getBallConfig();
            return {
                '136': {
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
                        ballClass: ['normal', 'normal', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '123': {
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['normal', 'normal', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '139': {
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
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['normal', 'normal', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '131': {
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
                        ballClass: ['normal', 'normal', 'curr'],
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
                '132': {
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
                        ballClass: ['normal', 'normal', 'curr'],
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
                '130': {
                    name: '前3混合组选',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        hasAid: true,
                        rules: [{
                            func: 'isNotThreeSame',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ' 形态'],
                        ballClass: ['normal', 'normal', 'curr'],
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
                '140': {
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
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['normal', 'normal', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '124': {
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
                        ballClass: ['normal', 'normal', 'curr'],
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
                '125': {
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
                        ballClass: ['normal', 'normal', 'curr'],
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
                '138': {
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
                        ballClass: ['normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '128': {
                    name: '2星后二单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        hasAid: false
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ],
                        ballClass: ['normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '137': {
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
                        ballClass: ['curr', 'curr', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '126': {
                    name: '2星前二单式',
                    'ball': {
                        singleDesc: ballConfig.singleDesc,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        hasAid: false
                    },
                    'listTable': {
                        title: ['奖期', '开奖', ],
                        ballClass: ['curr', 'curr', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '135': {
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
                        ballClass: ['normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '129': {
                    name: '2星后二单式',
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
                        ballClass: ['normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '134': {
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
                        ballClass: ['curr', 'curr', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '127': {
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
                        ballClass: ['curr', 'curr', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '141': {
                    name: '一星不定位',
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
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '133': {
                    name: '一星不定位',
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
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '485': {
                    name: '一星不定位',
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
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },

                '372': {
                    name: '龙虎和 百十',
                    'ball': {
                        labels: ['百：十'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['curr', 'curr', 'normal'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [0, 1]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '373': {
                    name: '龙虎和 百个',
                    'ball': {
                        labels: ['百：个'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['curr', 'normal', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [0, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '374': {
                    name: '龙虎和 十个',
                    'ball': {
                        labels: ['十：个'],
                        balls: ballConfig.longhuhe,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '开奖', '龙虎和'],
                        ballClass: ['normal', 'curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'longhuhe',
                            position: [1, 2]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '367': {
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
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '368': {
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
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '369': {
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
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '370': {
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
                        ballClass: ['curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '371': {
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
})(gagame, 'D3', jQuery, gagame.Game);