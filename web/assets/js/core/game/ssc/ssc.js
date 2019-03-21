(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'SSC',
            //过滤方法
            filtration: /[\s]|[,]|[;]|[|]|[<br>]|[，]|[；]|[、]|[｜]/i,
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('ssc init');
            that.animateLottery();
        },
        getGameConfig: function() {
            return Games.SSC.Config;
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
            //var lotterNumber = '56789'
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
                        rules: [{
                            func: 'isNotThreeSame',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
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
                        rules: [{
                            func: 'isNotThreeSame',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
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
                        rules: [{
                            func: 'isNotThreeSame',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
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
                        hasAid: false,

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
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
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
                            start: 1,
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
                            start: 1,
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
                        singleGroupSplit: ''
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
                        singleGroupSplit: ''
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
                        singleGroupSplit: ''
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
                        title: ['奖期', '开奖', '龙虎和'],
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
                        title: ['奖期', '开奖', '龙虎和'],
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
})(gagame, 'SSC', jQuery, gagame.Game);