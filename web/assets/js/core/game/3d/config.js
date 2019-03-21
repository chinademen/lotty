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
            // console.log('D3 config init');
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
                case '367':
                case '372':
                case '373':
                case '374':
                case '133':
                case '141':
                    if (balls.ballsNum > 0) {
                        currentGame.doneAlgorithmInjection(balls.ballsNum);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                case '137':
                case '138':
                case '136':
                    var result = currentMethod.combination2(balls.balls);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                case '139':
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
                case '131':
                    var result = currentMethod.zuxuanZusan(balls.balls);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                case '371':
                    var result = currentMethod.combine(currentMethod.getPureDataFromBall(balls.balls[0]), 5);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                case '370':
                    var result = currentMethod.combine(currentMethod.getPureDataFromBall(balls.balls[0]), 4);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                case '369':
                case '132':
                    var result = currentMethod.combine(currentMethod.getPureDataFromBall(balls.balls[0]), 3);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                case '485':
                case '134':
                case '135':
                case '368':
                    var result = currentMethod.combine(currentMethod.getPureDataFromBall(balls.balls[0]), 2);
                    if (result.length > 0) {
                        currentGame.doneAlgorithmInjection(result.length);
                    } else {
                        gameOrder.fireEvent('resetSelectBalls');
                    }
                    break;
                case '140':
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

            }
        }
    };


    var Main = host.ExtendClass(pros, GameConfig);
    Main.defConfig = defConfig;
    //游戏控制单例
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };

    host.Games.D3[name] = Main;
})(gagame, 'Config', jQuery, gagame.Event);