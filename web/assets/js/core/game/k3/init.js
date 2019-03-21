

$(function() {
    var lottery = getQueryString('lottery')
    var data = {
        lottery:lottery,
        token : token,
        ip :'127.0.0.1'
    }
    var postdata = urlEncode(data);
    $('#J-lottery-logo').prop('src', "/images/game/logo/" + lottery + ".png");
    XCOOKIE.setCookie('loaddataUrl', baseUrl + "/public/load-data.do?params="+postdata, 1);
    ajaxData({
        url: baseUrl + "/public/load-data.do",
        data:{params:postdata},
        successCallback: function(data) {
            data.currentNumber = "20180820078";
            data.currentNumberTime = 1534771603;
            data.defaultMultiple = 1;
            data.traceMaxTimes = 246;
            gagame.GameMapping.getInstance({
                'jsNameSpace': 'GameMapping'
            });
            gagame.GameConfig.getInstance({
                'jsNameSpace': 'GameConfig',
                 data: data
            });
            gagame.GameMethod.getInstance({
                'jsNameSpace': 'GameMethod'
            }); //游戏Method
            gagame.GameOrder.getInstance({
                'jsNameSpace': 'GameOrder'
            }); //游戏Order
            gagame.Games.K3.Config.getInstance({
                'jsNameSpace': 'K3.Config'
            }); //游戏SSC实例Config
            gagame.GameTrace.getInstance({
                'jsNameSpace': 'GameTrace'
            }); //GameTrace
            gagame.GameMessage.getInstance({
                'jsNameSpace': 'GameMessage'
            }); //GameMessage

            gagame.SingleBet.getInstance({
                'jsNameSpace': 'SingleBet'
            }); //单式投注

            gagame.GameHelp.getInstance({
                'jsNameSpace': 'GameHelp'
            });

            gagame.Games.K3.getInstance({
                'jsNameSpace': 'K3'
            }); //游戏实例

            var gameCountdownInstance = gagame.GameCountdown.getInstance({
                'jsNameSpace': 'GameCountdown'
            });

        }
    });


});