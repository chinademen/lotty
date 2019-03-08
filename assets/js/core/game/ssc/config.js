(function(host, name, $, GameConfig) {
    var defConfig = {
            name: '',
            jsNamespace: ''
        },
        instance,
        Games = host.Games;


    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('ssc config init');
            that.events();
        },
        //events here
        events: function() {
            var that = this;
        },
        //算法注入  选配对应的注数计算 
        algorithmInjection: function() {
            var methodId = Games.getCurrentGame().getCurrentMethodId();
            var currentMethod = Games.getCurrentMethod();
            var gameOrder = Games.getCurrentGameOrder();
            var balls = gameOrder.getSelectedBalls();
            var currentGame = Games.getCurrentGame();
            var renxuanNum = currentGame.getRenxuanNum();
            switch (methodId) {
                //猜1不出  
                case '362':
                    //龙虎和 万千
                case '352':
                    //龙虎和 万百
                case '353':
                    //龙虎和 万十
                case '354':
                    //龙虎和 万个
                case '355':
                    //龙虎和 千百
                case '356':
                    //龙虎和 千十
                case '357':
                    //龙虎和 千个
                case '358':
                    //龙虎和 百十
                case '359':
                    //龙虎和 百个
                case '360':
                    //龙虎和 十个
                case '361':

                    //趣味 四季发财
                case '47':
                    //趣味 三星报喜
                case '46':
                    //趣味 好事成双
                case '45':
                    //趣味 一帆风顺
                case '44':
                    //五星和值大小单双
                case '495':
                    //四星一码不定位
                case '34':
                    //前三一码不定位
                case '18':
                    //后三一码不定位
                case '51':
                    //后3其他对子
                case '386':
                    //后3其他顺子
                case '389':
                    //后3其他豹子
                case '390':
                    //后3特殊号码
                case '57':
                    //后3和值尾数
                case '54':
                    //中3其他对子
                case '391':
                    //中3其他顺子
                case '392':
                    //中3其他豹子
                case '393':
                    //中3特殊号码
                case '155':
                    //中3和值尾数
                case '156':
                    //前3 其他豹子
                case '388':
                    //前3 其他顺子
                case '387':
                    //前3 其他对子
                case '385':
                    //前3特殊号码
                case '48':
                    //前3和值尾数
                case '33':
                    //一星定位胆
                case '78':
                    if (balls.ballsNum > 0) {
                        currentGame.doneAlgorithmInjection(balls.ballsNum);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //趣味 前三区间二星
                case '43':
                    //趣味 后三区间二星
                case '56':
                    //趣味 四码区间三星
                case '42':
                    //趣味 五码区间三星
                case '41':
                    //趣味 前三趣味二星
                case '40':
                    //趣味 后三趣味二星
                case '55':
                    //趣味 四码趣味三星
                case '39':
                    //趣味 五码趣味三星
                case '38':
                    //前三大小单双
                case '22':
                    //前二大小单双
                case '19':
                    //后三大小单双
                case '53':
                    //后二大小单双
                case '58':
                    //二星  直选 前二复式
                case '66':
                    //后二直选复式
                case '70':
                    //后3直选复式
                case '69':
                    //中3直选复式
                case '150':
                    //前3直选复式
                case '65':
                    //后四直选复式
                case '67':
                    //四星直选复式
                case '295':
                    //五星直选复式
                case '68':
                    var result = currentMethod.combination2(balls.balls);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    ///五星直选和值
                case '494':
                    if (balls.balls[0].length > 0) {
                        var result = 0;
                        for (var i = 0; i < balls.balls[0].length; i++) {
                            result += currentMethod.zhixuanHezhi5(Number(balls.balls[0][i].ball), 0, 9);
                        }

                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }

                    break;
               
                    //五星组选 60
                case '31':
                    var result = currentMethod.getOneRepeadNums(balls.balls, 3);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //五星组选 30
                case '30':
                    var result = currentMethod.getTwoRepeadNums(balls.balls);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                //中3混合组选 30
                case '152':
                    var result = currentMethod.getTwoRepeadNums(balls.balls);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //五星组选 20
                case '29':
                    var result = currentMethod.getTreeSameNums(balls.balls, 5);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //五星组选 10
                case '28':
                    var result = currentMethod.isTreeSameOneRepeat(balls.balls);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //五星组选 5
                case '27':
                    var result = currentMethod.isThourSame(balls.balls);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                 //五星组选 120
                case '32':
                    //猜5不出
                case '366':
                    var result = currentMethod.combine(currentMethod.getPureDataFromBall(balls.balls[0]), 5);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //猜4不出
                case '365':
                    //后四组选24
                case '26':
                    //四星组选24
                case '242':
                    var result = currentMethod.combine(currentMethod.getPureDataFromBall(balls.balls[0]), 4);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //后四组选12
                case '25':
                    //四星组选12
                case '329':
                    var result = currentMethod.getOneRepeadNums(balls.balls, 2);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //后四组选6
                case '24':
                    //四星组选6
                case '243':
                    var result = currentMethod.getTwoRepeadNums(balls.balls, 1);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //后四组选 4
                case '23':
                    //四星组选 4
                case '330':
                    var result = currentMethod.getTreeSameNums(balls.balls, 4);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //后3直选和值
                case '73':
                    //中3直选和值
                case '151':
                    //前3直选和值
                case '71':
                    if (balls.balls[0].length > 0) {
                        var result = 0;
                        for (var i = 0; i < balls.balls[0].length; i++) {
                            result += currentMethod.zhixuanHezhi3(Number(balls.balls[0][i].ball), 0, 9).length;
                        }

                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }

                    break;
                    //后3直选跨度
                case '62':
                    //中3直选跨度
                case '149':
                    //前3直选跨度
                case '60':
                    if (balls.balls[0].length > 0) {
                        var result = 0;
                        for (var i = 0; i < balls.balls[0].length; i++) {
                            result += currentMethod.zhixuanKuadu3(Number(balls.balls[0][i].ball), 0, 9).length;
                        }

                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }

                    break;
                    //后3组选组三
                case '49':
                    //中3组选组三
                case '145':
                    //前3组选组三
                case '16':
                    var result = currentMethod.zuxuanZusan(balls.balls);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //猜3不出
                case '364':
                    //五星三码不定位
                case '37':
                    //后3组选组六
                case '50':
                    //中3组选组六
                case '146':
                    //前3组选组六
                case '17':
                    var result = currentMethod.combine(currentMethod.getPureDataFromBall(balls.balls[0]), 3);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //后3组选和值
                case '80':
                    //中3组选和值
                case '154':
                    //前3组选和值
                case '75':
                    if (balls.balls[0].length > 0) {
                        var result = 0;
                        for (var i = 0; i < balls.balls[0].length; i++) {
                            result += currentMethod.zuxuanHezhi3(Number(balls.balls[0][i].ball), 0, 9).length;
                        }
                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }

                    break;
                    //后3组选包胆
                case '83':
                    //中3组选包胆
                case '153':
                    //前3组选包胆
                case '64':
                    if (balls.balls[0].length > 0) {
                        var result = currentMethod.zuxuanBaodan3(balls.balls[0][0].ball, 0, 9);
                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //二星 组选 后二和值    
                case '77':
                    if (balls.balls[0].length > 0) {
                        var result = 0;
                        for (var i = 0; i < balls.balls[0].length; i++) {
                            result += currentMethod.zuxuanHezhi2(Number(balls.balls[0][i].ball), 0, 9).length;
                        }
                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //二星 前二和值    
                case '72':
                    //二星 后二和值
                case '74':
                    if (balls.balls[0].length > 0) {
                        var result = 0;
                        for (var i = 0; i < balls.balls[0].length; i++) {
                            result += currentMethod.zhixuanHezhi2(Number(balls.balls[0][i].ball), 0, 9).length;
                        }
                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //二星 前二跨度
                case '61':
                    //二星 后二跨度
                case '63':
                    if (balls.balls[0].length > 0) {
                        var result = 0;
                        for (var i = 0; i < balls.balls[0].length; i++) {
                            result += currentMethod.kuadu2(Number(balls.balls[0][i].ball), 0, 9).length;
                        }
                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //猜2不出
                case '363':
                    //五星二码不定位
                case '36':
                    //四星二码不定位
                case '35':
                    //前三二码不定位
                case '21':
                    //后三二码不定位
                case '52':
                    //二星  组选 前二复式
                case '20':
                    //二星  组选 后二复式
                case '59':
                    var result = currentMethod.combine(currentMethod.getPureDataFromBall(balls.balls[0]), 2);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //二星  组选 前二包胆
                case '84':
                    //二星  组选 后二包胆
                case '85':
                    if (balls.balls[0].length > 0) {
                        var result = currentMethod.baodan2(balls.balls[0][0].ball, 0, 9);
                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //二星  组选 前二和值
                case '76':
                    if (balls.balls[0].length > 0) {
                        var result = 0;
                        for (var i = 0; i < balls.balls[0].length; i++) {
                            result += currentMethod.zuxuanHezhi2(Number(balls.balls[0][i].ball), 0, 9).length;
                        }
                        if (result > 0) {
                            currentGame.doneAlgorithmInjection(result);
                        } else {
                            gameOrder.fireEvent('resetSelectBalls');
                        }
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选二 直选复式
                case '199':
                    var obj = currentMethod.renxuan2Zhixuanfushi(currentMethod.getPureDataFromBall(balls.balls));
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.seat.join(''),
                            seat: 2
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选二 直选和值
                case '196':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), 'zhixuanHezhi2', 2);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 2
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选三 直选和值
                case '183':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), 'zhixuanHezhi3', 3);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 3
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选二 直选跨度
                case '198':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), 'kuadu2', 2);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 2
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选三 直选跨度
                case '185':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), 'zhixuanKuadu3', 3);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 3
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选二 组选复式
                case '195':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), null, 2, true);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 2
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选二 组选复式
                case '197':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), 'zuxuanHezhi2', 2);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 2
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选三 直选复式
                case '179':
                    var obj = currentMethod.renxuan3Zhixuanfushi(currentMethod.getPureDataFromBall(balls.balls));
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.seat.join(''),
                            seat: 3
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选三 组三复式
                case '181':
                    var obj = currentMethod.renxuan3Zusanfushi(currentMethod.getPureDataFromBall(balls.balls));
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 3
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选三 组六复式
                case '182':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), null, 3, true);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 3
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选三 组选和值
                case '184':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), 'zuxuanHezhi3', 3);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: 3
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选四 直选复式
                case '180':
                    var obj = currentMethod.renxuan4Zhixuanfushi(currentMethod.getPureDataFromBall(balls.balls));
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.seat.join(''),
                            seat: 4
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选四 组选24
                case '194':
                    var obj = currentMethod.renxuanCommon(currentMethod.getPureDataFromBall(balls.balls[0]), null, 4, true);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: renxuanNum
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选四 组选12
                case '193':
                    var obj = currentMethod.renxuan4Zuxuan12(balls.balls);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: renxuanNum
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选四 组选6
                case '192':
                    var arr = currentMethod.getPureDataFromBall(balls.balls[0]);
                    for (var c = 0; c < arr.length; c++) {
                        arr[c] = [arr[c], arr[c]];
                    }
                    var obj = currentMethod.renxuanCommon(arr, null, 4, true, 2);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: renxuanNum
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                    //任选四 组选4
                case '191':
                    var obj = currentMethod.renxuan4Zuxuan4(balls.balls);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: renxuanNum
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;

            }
        }
    };


    var Main = host.ExtendClass(pros, GameConfig);
    Main.defConfig = defConfig;
    //游戏控制单例
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };

    host.Games.SSC[name] = Main;
})(gagame, 'Config', jQuery, gagame.Event);