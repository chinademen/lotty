(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'L115',
            //过滤方法
            filtration: /[；|;]+|[\n\r]+|[,|，]+|[:|：]+/g
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('L115 init');
            //设置注数之间的分隔符
            Games.getCurrentSingleBet().setFiltration(this.defConfig.filtration);
            that.animateLottery();
        },
        getGameConfig: function() {
            return Games.L115.Config;
        },
        getFiltration: function() {
            return this.defConfig.filtration;
        },
        //格式化历史开奖列表
        formatLotteryNum: function(num) {
            return (num == "") ? ['-', '-', '-', '-', '-'] : num.split(' ');
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
           
            var num_arr = lotterNumber.split(' ');
            $("#J-lottery-ernie-numbers .nums").each(function(index) {
                var _num = $(this);
                setTimeout(function() {
                    _num.animate({
                        backgroundPositionY: -(numHeight * (Math.abs(num_arr[index]) - 1))
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

        getMapping: function() {
            var ballConfig = Games.getCurrentGameMapping().getBallConfig();
            return {
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
})(gagame, 'L115', jQuery, gagame.Game);