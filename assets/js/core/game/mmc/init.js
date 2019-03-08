$(function() {
    var lottery_id = getQueryString('game');
    var lottery = getQueryString('lottery');
    var data = {
        lottery:getQueryString('lottery'),
        token : token,
        ip :'127.0.0.1'
    }
    var postdata = urlEncode(data);
    var xurl = 'loaddataUrl';
    XCOOKIE.setCookie('loaddataUrl', baseUrl + "/public/load-data.do?params="+postdata, 1);
    $('#J-lottery-logo').prop('src', '/images/game/logo/' + lottery + '.png');
    ajaxData({
        url: baseUrl + "/public/load-data.do",
        data:{params:postdata},
        successCallback: function(data) {
            gagame.GameMapping.getInstance({
                'jsNameSpace': 'GameMapping'
            });
            gagame.GameConfig.getInstance({
                'jsNameSpace': 'GameConfig',
                data: data
            }); //游戏Config
            gagame.GameMethod.getInstance({
                'jsNameSpace': 'GameMethod'
            }); //游戏Method
            gagame.GameOrder.getInstance({
                'jsNameSpace': 'GameOrder'
            }); //游戏Order
            gagame.Games.MMC.Config.getInstance({
                'jsNameSpace': 'MMC.Config'
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

            gagame.Games.MMC.getInstance({
                lotteryLogoName:lottery
            });
        }
    });
});