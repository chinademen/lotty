(function(host, name, $, GameSingleBet) {
    var defConfig = {
            id: -1,
            //游戏名称
            name: '',
            //文件名前缀
            jsNameSpace: '',
            //添加事件代理的主面板
            eventProxyPanel: 'body'
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            // console.log('ssc singleBet init');

        },

        getSingleDesc:function(){
            return Games.getCurrentGameMapping().getBallConfig().singleDesc;
        },
        
        //正则过滤输入框HTML
        //提取正确的投注号码
        filterLotters: function(data) {
            var that = this,
                result = '',
                checkFont = /[\u4E00-\u9FA5]|[/\n]|[/W]/g;
            result = data.replace(/<br>+|&nbsp;+/gi, ' ');
            result = result.replace(/\s\s|[\s]|[,]+|[;]+|[|]+|[，]+|[；]+|[｜]+/gi, ' ');
            result = result.replace(/<(?:"[^"]*"|'[^']*'|[^>'"]*)+>/g, ' ');
            result = result.replace(checkFont, '') + ' ';
            return result;
        },
        //用拆分符号拆分成单注
         iterator: function(data) {
            var me = this,
                cfg = Games.getCurrentGame().defConfig,
                result = [],
                breakNum = 0;

            for (var i = 0; i < data.length; i++) {
                if (cfg.filtration.test(data.charAt(i))) {
                    result.push(data.substr(breakNum, i - breakNum));
                    breakNum = i + 1;
                }
            }
            
            var currentGame = Games.getCurrentGame();
            var orderNotLimited = currentGame.getOrderNotLimited();
            if (orderNotLimited) {
                $.each(result, function(i) {
                    result[i] = result[i].split('').sort().join('');
                });
            }
            
            return result;
        },
        //检测结果重复
        checkResult: function(data, array) {
            //检查重复
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i] == data) {
                    return false;
                }
            };
            return true;
        },
        execFilterLottery:function(data){ 
            return Games.getCurrentGame().compose(this.iterator,this.filterLotters)(data);
        }
    };



    var Main = host.ExtendClass(pros, GameSingleBet);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;
})(gagame, 'SingleBet', jQuery, gagame.GameSingleBet);