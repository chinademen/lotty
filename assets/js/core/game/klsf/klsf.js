(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'KLSF',
            //过滤方法
            filtration: /[；|;]+|[\n\r]+|[,|，]+|[:|：]+/g
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('KLSF init');
            //设置注数之间的分隔符
            Games.getCurrentSingleBet().setFiltration(this.defConfig.filtration);
            that.animateLottery();
        },
        getGameConfig: function() {
            return Games.KLSF.Config;
        },
        getFiltration: function() {
            return this.defConfig.filtration;
        },
        //格式化历史开奖列表
        formatLotteryNum: function(num) {
            return (num == "") ? ['-', '-', '-', '-', '-', '-', '-', '-'] : num.split(' ');
        },
        //开奖效果 
        animateLottery: function() {
            var numHeight = 42;
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
            //var lotterNumber = '01 05 06 10 11'
            var num_arr = lotterNumber.split(' ');
            $("#J-lottery-ernie-numbers .nums").each(function(index) {
                var _num = $(this);
                setTimeout(function() {
                    _num.animate({
                        backgroundPositionY: -(numHeight * (num_arr[index] - 1))
                    }, {
                        duration: 2000 + index * 100,
                        easing: "easeInOutCirc",
                        complete: function() {
                            //if (index == 3) isBegin = false;
                        }
                    });
                }, index * 100);
            });

        },

        getMapping: function() {
            var ballConfig = Games.getCurrentGameMapping().getBallConfig();
            return {
                '455': {
                    name: '前三直选复式',
                    'ball': {
                        labels: ['一位', '二位', '三位'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '443': {
                    name: '三码 前三直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '452': {
                    name: '前三组选复式',
                    'ball': {
                        labels: ['前三'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '444': {
                    name: '三码 前三组选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '481': {
                    name: '前三组选胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.klsf,
                            control: false,
                        }, {
                            ball: ballConfig.klsf,
                            control: true
                        }],
                        ballsLimit: 2,
                        //互斥
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },

                '456': {
                    name: '前二直选复式',
                    'ball': {
                        labels: ['一位', '二位'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '445': {
                    name: '二码 前二直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '453': {
                    name: '前二组选复式',
                    'ball': {
                        labels: ['前二'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '446': {
                    name: '二码 前二组选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }],
                        orderNotLimited: true
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '482': {
                    name: '前二组选胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.klsf,
                            control: false,
                        }, {
                            ball: ballConfig.klsf,
                            control: true
                        }],
                        ballsLimit: 1,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '477': {
                    name: '任选胆拖 任选二',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.klsf,
                            control: false,
                        }, {
                            ball: ballConfig.klsf,
                            control: true
                        }],
                        ballsLimit: 1,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '478': {
                    name: '任选胆拖 任选三',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.klsf,
                            control: false,
                        }, {
                            ball: ballConfig.klsf,
                            control: true
                        }],
                        ballsLimit: 2,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '479': {
                    name: '任选胆拖 任选四',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.klsf,
                            control: false,
                        }, {
                            ball: ballConfig.klsf,
                            control: true
                        }],
                        ballsLimit: 3,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },

                '480': {
                    name: '任选胆拖 任选五',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.klsf,
                            control: false,
                        }, {
                            ball: ballConfig.klsf,
                            control: true
                        }],
                        ballsLimit: 4,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '483': {
                    name: '任选胆拖 任选六',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.klsf,
                            control: false,
                        }, {
                            ball: ballConfig.klsf,
                            control: true
                        }],
                        ballsLimit: 5,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '484': {
                    name: '任选胆拖 任选七',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.klsf,
                            control: false,
                        }, {
                            ball: ballConfig.klsf,
                            control: true
                        }],
                        ballsLimit: 6,
                        exclusion: true,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_2',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '439': {
                    name: '任选单式 任选二',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '440': {
                    name: '任选单式 任选三',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '441': {
                    name: '任选单式 任选四',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 4,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '442': {
                    name: '任选单式 任选五',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 5,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '459': {
                    name: '任选单式 任选六',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 6,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '460': {
                    name: '任选单式 任选七',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 7,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKLSFNumber',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList'
                    }
                },
                '448': {
                    name: '任选复式 任选二',
                    'ball': {
                        labels: ['任选二'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '449': {
                    name: '任选复式 任选三',
                    'ball': {
                        labels: ['任选三'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '450': {
                    name: '任选复式 任选四',
                    'ball': {
                        labels: ['任选四'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '451': {
                    name: '任选复式 任选五',
                    'ball': {
                        labels: ['任选五'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '457': {
                    name: '任选复式 任选六',
                    'ball': {
                        labels: ['任选六'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList'
                    }
                },
                '458': {
                    name: '任选复式 任选七',
                    'ball': {
                        labels: ['任选七'],
                        balls: ballConfig.klsf,
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true,
                        ballContentStyle: 'width:500px;',
                        ballControlStyle: 'top:30px;'
                    },
                    'listTable': {
                        title: ['奖期', '开奖'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
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
})(gagame, 'KLSF', jQuery, gagame.Game);