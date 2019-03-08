(function(host, name, $, Event) {
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
            Games.setCurrentSubmit(that);
        },
        //events here
        events: function() {

        }
    };



    var Main = host.ExtendClass(pros, Event);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;
})(gagame, 'GameSubmit', jQuery, gagame.Event);