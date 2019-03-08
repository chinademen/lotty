(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'KL12',
            //过滤方法
            filtration: /[；|;]+|[\n\r]+|[,|，]+|[:|：]+/g
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('KL12 init');
            //设置注数之间的分隔符
            Games.getCurrentSingleBet().setFiltration(this.defConfig.filtration);
            that.animateLottery();
        },
        getGameConfig: function() {
            return Games.KL12.Config;
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
            //var lotterNumber = '56789'
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
                '409': {
                    name: '任选复式 任选一',
                    'ball': {
                        labels: ['选1中1'],
                        balls: ballConfig.kl12,
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
                '410': {
                    name: '任选复式 任选二',
                    'ball': {
                        labels: ['选2中2'],
                        balls: ballConfig.kl12,
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
                '411': {
                    name: '任选复式 任选三',
                    'ball': {
                        labels: ['选3中3'],
                        balls: ballConfig.kl12,
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
                '412': {
                    name: '任选复式 任选四',
                    'ball': {
                        labels: ['选4中4'],
                        balls: ballConfig.kl12,
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
                '413': {
                    name: '任选复式 任选五',
                    'ball': {
                        labels: ['选5中5'],
                        balls: ballConfig.kl12,
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
                '461': {
                    name: '任选复式 任选六',
                    'ball': {
                        labels: ['选6中5'],
                        balls: ballConfig.kl12,
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
                '462': {
                    name: '任选复式 任选七',
                    'ball': {
                        labels: ['选7中5'],
                        balls: ballConfig.kl12,
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
                '463': {
                    name: '任选复式 任选八',
                    'ball': {
                        labels: ['选8中5'],
                        balls: ballConfig.kl12,
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
                '418': {
                    name: '任选单式 任选二',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '419': {
                    name: '任选单式 任选三',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '420': {
                    name: '任选单式 任选四',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 4,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '421': {
                    name: '任选单式 任选五',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 5,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '464': {
                    name: '任选单式 任选六',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 6,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '465': {
                    name: '任选单式 任选七',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 7,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '466': {
                    name: '任选单式 任选八',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 8,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '467': {
                    name: '任选胆拖  任选二',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
                '468': {
                    name: '任选胆拖  任选三',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
                '469': {
                    name: '任选胆拖  任选四',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
                '470': {
                    name: '任选胆拖  任选5',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
                '473': {
                    name: '任选胆拖  任选6',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
                '474': {
                    name: '任选胆拖  任选7',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
                '475': {
                    name: '任选胆拖  任选8',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
                '426': {
                    name: '定位胆',
                    'ball': {
                        labels: ['一位', '二位', '三位', '四位', '五位'],
                        balls: ballConfig.kl12,
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
                '414': {
                    name: '二码 前二直选复式',
                    'ball': {
                        labels: ['一位', '二位'],
                        balls: ballConfig.kl12,
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
                '422': {
                    name: '二码 前二直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '417': {
                    name: '二码 前二组选复式',
                    'ball': {
                        labels: ['前二'],
                        balls: ballConfig.kl12,
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
                '425': {
                    name: '二码 前二组选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '472': {
                    name: '前二组选胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
                '415': {
                    name: '三码 前三直选复式',
                    'ball': {
                        labels: ['一位', '二位', '三位'],
                        balls: ballConfig.kl12,
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
                '423': {
                    name: '三码 前三直选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '416': {
                    name: '三码 前三组选复式',
                    'ball': {
                        labels: ['前三'],
                        balls: ballConfig.kl12,
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
                '424': {
                    name: '三码 前三组选单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isKL12Number',
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
                '471': {
                    name: '前三组选胆拖',
                    'ball': {
                        labels: ['胆码', '拖码'],
                        balls: [{
                            ball: ballConfig.kl12,
                            control: false,
                        }, {
                            ball: ballConfig.kl12,
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
})(gagame, 'KL12', jQuery, gagame.Game);