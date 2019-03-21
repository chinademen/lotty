//Games
(function(host, name, undefined) {
    var Main = {};
    //缓存
    Main.cacheData = {};

    //当前游戏
    Main.currentGame = null;
    Main.currentGameConfig = null;
    Main.currentMessage = null;
    Main.currentMethod = null;
    Main.currentSubmit = null;
    Main.currentTrace = null;
    Main.currentGameOrder = null;
    Main.currentCountdown = null;
    Main.currentSingleBet = null;
    Main.currentGameHelp = null;
    Main.currentGameMapping = null;

    //当前游戏
    Main.getCurrentGame = function() {
        return Main.currentGame;
    };
    Main.setCurrentGame = function(game) {
        Main.currentGame = game;
    };

    Main.getCurrentGameConfig = function() {
        return Main.currentGameConfig;
    }
    Main.setCurrentGameConfig = function(currentGameConfig) {
        Main.currentGameConfig = currentGameConfig;
    };

    Main.getCurrentMessage = function() {
        return Main.currentMessage;
    }
    Main.setCurrentMessage = function(currentMessage) {
        Main.currentMessage = currentMessage;
    };

    Main.getCurrentMethod = function() {
        return Main.currentMethod;
    }
    Main.setCurrentMethod = function(currentMethod) {
        Main.currentMethod = currentMethod;
    };

    Main.getCurrentSubmit = function() {
        return Main.CurrentSubmit;
    }
    Main.setCurrentSubmit = function(CurrentSubmit) {
        Main.CurrentSubmit = CurrentSubmit;
    };

    Main.getCurrentTrace = function() {
        return Main.currentTrace;
    }
    Main.setCurrentTrace = function(currentTrace) {
        Main.currentTrace = currentTrace;
    };

    //号码篮
    Main.getCurrentGameOrder = function() {
        return Main.currentGameOrder;
    };
    Main.setCurrentGameOrder = function(currentGameOrder) {
        Main.currentGameOrder = currentGameOrder;
    };


    Main.getCurrentCountdown = function() {
        return Main.currentCountdown;
    };
    Main.setCurrentCountdown = function(currentCountdown) {
        Main.currentCountdown = currentCountdown;
    };

    Main.getCurrentSingleBet = function() {
        return Main.currentSingleBet;
    };
    Main.setCurrentSingleBet = function(currentSingleBet) {
        Main.currentSingleBet = currentSingleBet;
    };

    Main.getCurrentGameHelp = function() {
        return Main.currentGameHelp;
    };
    Main.setCurrentGameHelp = function(currentGameHelp) {
        Main.currentGameHelp = currentGameHelp;
    };

    Main.getCurrentGameMapping = function() {
        return Main.currentGameMapping;
    };
    Main.setCurrentGameMapping = function(currentGameMapping) {
        Main.currentGameMapping = currentGameMapping;
    };

    host[name] = Main;

})(gagame, "Games");