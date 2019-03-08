(function(host, name, $, Game) {
    var defConfig = {
            //游戏名称
            name: '',
            jsNamespace: 'PK10',
            //过滤方法
            filtration: /[；|;]+|[\n\r]+|[,|，]+|[:|：]+/g
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('PK10 init');
            //设置注数之间的分隔符
            Games.getCurrentSingleBet().setFiltration(this.defConfig.filtration);
            
            that.animateLottery();
        },
        getGameConfig: function() {
            return Games.PK10.Config;
        },
        getFiltration: function() {
            return this.defConfig.filtration;
        },
        //格式化历史开奖列表
        formatLotteryNum: function(num) {
            return (num == "") ? ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'] : num.split(' ');
        },
        //开奖效果 
        animateLottery: function() { 
            var lotterNumber = Games.getCurrentGameConfig().getLotteryBalls();
            var lotteryErnieNumbers = $('#J-lottery-ernie-numbers');
            if (lotterNumber == '') {
                lotteryErnieNumbers.hide();
                $('.J-loading-lottery').show();
                return;
            } else {
                lotteryErnieNumbers.show();
                $('.J-loading-lottery').hide();
            }
            var $dom = $('#lottery-numbers-board');
            var ballsArr = lotterNumber.split(' ');

            var lotteryNum = [];
            var _html = ['<div style="display:none;" id="J-lottery-ernie-numbers" class="pk10-lottery-ernie-numbers">'];
            for (var i = 0; i < ballsArr.length; i++) {
                lotteryNum.push('<span class="pk10-lottery-' + ballsArr[i] + '" >' + ballsArr[i] + '</span>');
            }; 
            _html.push('</div>');

            $dom.append(_html.join('')); 
            $("#J-lottery-ernie-numbers span").remove()
            //开奖号码逐个显示
            var i = 0
            var time = setInterval(function() {
                $('#J-lottery-ernie-numbers').append(lotteryNum[i]);
                i++
                if (i === 10) {
                    clearInterval(time);
                }
            }, 100);
            

            /*var numHeight = 42;
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
            });*/
        },

        getMapping: function() {
            var ballConfig = Games.getCurrentGameMapping().getBallConfig();
            return {
                '177': {
                    name: '猜名次',
                    'ball': {
                        labels: ['冠军', '亚军', '季军', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        switchOddEven:true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '175': {
                    name: '冠亚和值 和值',
                    'ball': {
                        labels: [''],
                        balls: {
                            start: 3,
                            end: 20
                        },
                        singleGroupSplit: '|',
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '冠 亚', '和值'],
                        ballClass: ['curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '176': {
                    name: '冠亚和值 大小单双',
                    'ball': {
                        labels: ['和值'],
                        balls: ballConfig.daxiaodanshuang,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '冠 亚', '和值', '大小', '单双'],
                        ballClass: ['curr', 'curr'],
                        hasTail: true,
                        tail: [{
                            isCondition: false,
                            func: 'getSumByNum',
                            position: [0, 1]
                        }, {
                            isCondition: false,
                            func: 'getDaxiaoPK10',
                            position: [0, 1]
                        }, {
                            iisCondition: false,
                            func: 'getDanshuangPK10',
                            position: [0, 1]
                        }],
                        tmpl: 'historyList'
                    }
                },
                '178': {
                    name: '冠亚和值 大小单双',
                    'ball': {
                        labels: ['1 V 10', '2 V 9', '3 V 8', '4 V 7', '5 V 6'],
                        balls: ballConfig.longhu,
                        control: false,
                        tmpl: 'ball_1'
                    },
                    'listTable': {
                        title: ['奖期', '1V10', '2V9', '3V8', '4V7', '5V6'],
                        ballClass: [],
                        hasTail: true,
                        tail: [{
                                isCondition: false,
                                func: 'longhu',
                                position: [0, 9]
                            }, {
                                isCondition: false,
                                func: 'longhu',
                                position: [1, 8]
                            }, {
                                iisCondition: false,
                                func: 'longhu',
                                position: [2, 7]
                            }, {
                                iisCondition: false,
                                func: 'longhu',
                                position: [3, 6]
                            }, {
                                iisCondition: false,
                                func: 'longhu',
                                position: [4, 5]
                            }

                        ],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '396': {
                    name: '精确前二 单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isPK10Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '172': {
                    name: '精确前二 复式',
                    'ball': {
                        labels: ['冠军', '亚军'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '398': {
                    name: '精确后二 单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 2,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isPK10Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '394': {
                    name: '精确前二 复式',
                    'ball': {
                        labels: ['第九名', '第十名'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '173': {
                    name: '精确前三 复式',
                    'ball': {
                        labels: ['冠军', '亚军', '季军'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '397': {
                    name: '精确前三 单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isPK10Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '395': {
                    name: '精确后三 复式',
                    'ball': {
                        labels: ['第八名', '第九名', '第十名'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '399': {
                    name: '精确后三 单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 3,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isPK10Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '486': {
                    name: '精确前四 复式',
                    'ball': {
                        labels: ['冠军', '亚军', '季军', '第四名'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '488': {
                    name: '精确前四 单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 4,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isPK10Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '487': {
                    name: '精确后四 复式',
                    'ball': {
                        labels: ['第七名', '第八名', '第九名', '第十名'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '489': {
                    name: '精确后四 单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 4,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isPK10Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '490': {
                    name: '精确前五 复式',
                    'ball': {
                        labels: ['冠军', '亚军', '季军', '第四名', '第五名'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '492': {
                    name: '精确前五 单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 5,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isPK10Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['curr', 'curr', 'curr', 'curr', 'curr', 'normal', 'normal', 'normal', 'normal', 'normal'],
                        hasTail: false,
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '491': {
                    name: '精确后五 复式',
                    'ball': {
                        labels: ['第六名', '第七名', '第八名', '第九名', '第十名'],
                        balls: {
                            start: 1,
                            end: 11
                        },
                        control: true,
                        controls: ballConfig.control,
                        tmpl: 'ball_1',
                        singleGroupSplit: ' ',
                        //操作选球的时候奇偶互换
                        switchOddEven: true
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['normal', 'normal', 'normal', 'normal', 'normal', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tail: [{
                            isCondition: false,
                            func: 'none'
                        }],
                        tmpl: 'historyList_pk10_1'
                    }
                },
                '493': {
                    name: '精确后五 单式',
                    'ball': {
                        singleDesc: ballConfig.singleDescL115,
                        tmpl: 'ball_single',
                        singleBallNumbers: 5,
                        rules: [{
                            func: 'isNotRepeat',
                            context: gagame.Games.getCurrentGameHelp()
                        }, {
                            func: 'isPK10Number',
                            context: gagame.Games.getCurrentGameHelp()
                        }]
                    },
                    'listTable': {
                        title: ['奖期', '冠', '亚', '季', '四', '五', '六', '七', '八', '九', '十'],
                        ballClass: ['normal', 'normal', 'normal', 'normal', 'normal', 'curr', 'curr', 'curr', 'curr', 'curr'],
                        hasTail: false,
                        tmpl: 'historyList_pk10_1'
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
})(gagame, 'PK10', jQuery, gagame.Game);