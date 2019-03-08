(function(host, name, $, Event) {
    var ConfigData = null,
        defConfig = {
            id: -1,
            //游戏名称
            name: '',
            //文件名前缀
            jsNameSpace: '',
            //添加事件代理的主面板
            eventProxyPanel: 'body'
        },
        instance,
        Games = host.Games,
        nodeCache = {},
        methodCache = {};

    //将树状数据整理成两级缓存数据
    /*(function() {
        var data = ConfigData['wayGroups'],
            node1, node2, node3;

        $.each(data, function() {
            node1 = this;
            node1['fullname_en'] = [node1['name_en']];
            node1['fullname_cn'] = [node1['name_cn']];
            nodeCache['' + node1['id']] = node1;
            if (node1['children']) {
                $.each(node1['children'], function() {
                    node2 = this;
                    node2['fullname_en'] = node1['fullname_en'].concat(node2['name_en']);
                    node2['fullname_cn'] = node1['fullname_cn'].concat(node2['name_cn']);
                    nodeCache['' + node2['id']] = node2;
                    if (node2['children']) {
                        $.each(node2['children'], function() {
                            node3 = this;
                            node3['fullname_en'] = node2['fullname_en'].concat(node3['name_en']);
                            node3['fullname_cn'] = node2['fullname_cn'].concat(node3['name_cn']);
                            methodCache['' + node3['id']] = node3;
                        });
                    }
                });
            }
        });
    })();*/
    var pros = {
        init: function(option) {
            var that = this;
            Games.setCurrentGameConfig(that);
            // console.log('gameConfig init');
            ConfigData = option.data;
            that.initCacheData();
        },
        initCacheData: function() {
            var data = ConfigData['wayGroups'],
                node1, node2, node3;

            $.each(data, function() {
                node1 = this;
                node1['fullname_en'] = [node1['name_en']];
                node1['fullname_cn'] = [node1['name_cn']];
                nodeCache['' + node1['id']] = node1;
                if (node1['children']) {
                    $.each(node1['children'], function() {
                        node2 = this;
                        node2['fullname_en'] = node1['fullname_en'].concat(node2['name_en']);
                        node2['fullname_cn'] = node1['fullname_cn'].concat(node2['name_cn']);
                        nodeCache['' + node2['id']] = node2;
                        if (node2['children']) {
                            $.each(node2['children'], function() {
                                node3 = this;
                                node3['fullname_en'] = node2['fullname_en'].concat(node3['name_en']);
                                node3['fullname_cn'] = node2['fullname_cn'].concat(node3['name_cn']);
                                methodCache['' + node3['id']] = node3;
                            });
                        }
                    });
                }
            });
        }, 
        getGameId: function() {
            return ConfigData['gameId'];
        },
        //获取游戏英文名称
        getGameNameEn: function() {
            return ConfigData['gameNameEn'];
        },
        //获取游戏中文名称
        getGameNameCn: function() {
            return ConfigData['gameNameCn'];
        },
        //获取最大追号期数
        getTraceMaxTimes: function() {
            return Number(ConfigData['traceMaxTimes']);
        },
        //获取当前期开奖时间
        getCurrentLastTime: function() {
            return ConfigData['currentNumberTime'];
        },
        //获取当前时间
        getCurrentTime: function() {
            return ConfigData['currentTime'];
        },
        //获取当前期期号
        getCurrentGameNumber: function() {
            return ConfigData['currentNumber'];
        },
        //获取上期期号
        getLastGameNumber: function() {
            var data = (ConfigData['issueHistory']['last_number']) ? ConfigData['issueHistory']['last_number']['issue'] : ConfigData['issueHistory']['issues'][0]['issue'],
                b = ConfigData['issueHistory']['issues'][0]['issue'];
            if (b > data) {
                data = b
            }
            return data;
        },
        getLotteryBalls: function() {
            var num = (ConfigData['issueHistory']['last_number']) ? ConfigData['issueHistory']['last_number']['wn_number'] : ConfigData['issueHistory']['issues'][0]['wn_number'],
                data = (ConfigData['issueHistory']['last_number']) ? ConfigData['issueHistory']['last_number']['issue'] : ConfigData['issueHistory']['issues'][0]['issue'],
                b = ConfigData['issueHistory']['issues'][0]['issue'];
            if (b > data) {
                num = ConfigData['issueHistory']['issues'][0]['wn_number']
            }
            return num || '';
        },
        getLotteryNumbers: function() {
            return ConfigData['issueHistory']['issues']|| [];
        },
        getLotteryGameId: function() {
            return ConfigData['gameId']|| [];
        },
        getFormatLotteryNumbers: function(ft, numbers) {
            var me = this,
                temp = {};
            numbers = numbers ? numbers : me.getLotteryNumbers();
            ft = ft || 'hour';
            // {"number":"150504074","time":"12121212","hasLottery":1},
            $.each(numbers, function(i, n) {
                var key = me.getKeyByDateStr(('' + (n['offical_time'])), ft);

                if (key) {
                    if (!temp[key]) {
                        temp[key] = [];
                    }
                    temp[key].push(n);
                }
            });
            // console.log(temp);
            return temp;
        },
        getKeyByDateStr: function(unix, type) {
            unix = unix || '0',
                type = type || 'hour';
            var d = new Date();
            d.setTime(parseInt(unix) * 1000);
            if (Object.prototype.toString.call(d) === "[object Date]") {
                // it is a date
                if (isNaN(d.getTime())) { // d.valueOf() could also work
                    // date is not valid
                    return '';
                } else {
                    // date is valid
                    var month = d.getMonth() + 1,
                        day = d.getDate(),
                        hour = d.getHours(),
                        minute = d.getMinutes();
                    if (month < 10) month = '0' + month;
                    if (day < 10) day = '0' + day;
                    if (hour < 10) hour = '0' + hour;
                    if (minute < 10) minute = '0' + minute;

                    if (type == 'month') {
                        return month + '月';
                    } else if (type == 'day') {
                        return month + '月' + day + '日';
                    } else if (type == 'minute') {
                        return hour + ':' + minute;
                    } else {
                        return hour + ':00';
                    }
                }
            } else {
                // not a date
                return '';
            }

        },
        //获取期号列表
        getGameNumbers: function() {
            return ConfigData['gameNumbers'];
        },
        //id : methodid
        //unit : money unit (1 | 0.1)
        getLimitByMethodId: function(id, unit) {
            var unit = unit || 1,
                maxnum = Number(this.getPrizeById(id)['max_multiple']);
            return maxnum / unit;
        },
        //注单提交地址
        getSubmitUrl: function() {
            return ConfigData['submitUrl'];
        },
        //更新开奖、配置等最新信息的地址
        getUpdateUrl: function() {
            //return ConfigData['loaddataUrl'];
            return XCOOKIE.getCookie('loaddataUrl');
        },
        //文件上传地址
        getUploadPath: function() {
            return ConfigData['uploadPath'];
        },
        //js存放目录
        getJsPath: function() {
            return ConfigData['jsPath']; //'/assets/js/game/ssc/';
        },
        //默认游戏玩法
        getDefaultMethodId: function() {
            return ConfigData['defaultMethodId'];
        },
        //获取当前用户名
        getUserName: function() {
            return ConfigData['username'];
        },

        getDelayTime: function() {
            return 5;
            return Number(ConfigData['delayTime']);
        },
        getLastGameBallsUrl: function() {
            return ConfigData['lastGameBallsUrl'];
        },

        //获取所有玩法
        getMethods: function() {
            return ConfigData['wayGroups'];
        },
        //获取某个玩法
        getMethodById: function(id) {
            return methodCache['' + id];
        },
        //获取大数据某个玩法
        getPrizeById: function(id) {
            return ConfigData['prizeSettings']['' + id];
        },
        //获取玩法节点
        getMethodNodeById: function(id) {
            return nodeCache['' + id];
        },
        //获取玩法英文名称
        getMethodNameById: function(id) {
            var method = this.getMethodById(id);
            return method ? method['name_en'] : '';
        },
        //获取玩法中文名称
        getMethodCnNameById: function(id) {
            var method = this.getMethodById(id);
            return method ? method['name_cn'] : '';
        },
        //获取完整的英文名称 wuxing.zhixuan.fushi
        getMethodFullNameById: function(id) {
            var method = this.getMethodById(id);
            return method ? method['fullname_en'] : '';
        },
        //获取完整的玩法名称
        getMethodCnFullNameById: function(id) {
            var method = this.getMethodById(id);
            return method ? method['fullname_cn'] : '';
        },
        //获取某玩法的单注单价
        getOnePriceById: function(id) {
            return this.getMethodById(id)['price'];
        },
        getToken: function() {
            return ConfigData['_token'];
        },
        //更新配置，进行深度拷贝
        updateConfig: function(cfg) {
            $.extend(true, ConfigData, cfg);
        },
        getConfigData:function(){
            return ConfigData;
        },
        getOptionalPrizes: function() {
            return ConfigData['optionalPrizes'];
        },
        setOptionalPrizes: function() {
            return $('#J-bonus-select-value').val();
        },
        getDefaultCoefficient: function() {
            return (!ConfigData['defaultCoefficient']) ? '1' : ConfigData['defaultCoefficient'];

        },
        getDefaultMultiple: function() {
            return (!ConfigData['defaultMultiple']) ? '1' : ConfigData['defaultMultiple'];
        },
        getLoadIssueUrl: function() {
            return ConfigData['loadIssueUrl'];
        },
        getMaxPrizeGroup: function() {
            return ConfigData['maxPrizeGroup'];
        },
        getSubmitCompress: function() {
            return ConfigData['betSubmitCompress'] == '1';
        },
        getVideoMp3: function() {
            return ['/assets/images/game/numberlottery.mp3', '/assets/images/game/du.mp3'];
        },
        //从服务器端获取数据
        //返回数据格式
        //{"isSuccess":1,"type":"消息代号","msg":"返回的文本消息","data":{xxx:xxx}}
        getServerDynamicConfig:function(callback){
            var that = this;
            /**
            //test
            var currentNumber = Number(cfg.getCurrentGameNumber()) + 1;
            var nowTime = (new Date()).getTime()/1000;
            var data = {currentNumber:'' + currentNumber, currentNumberTime:nowTime + (60 * 10), currentTime:nowTime, lotteryBalls:'' + Math.floor(Math.random()*(99999-11111))+11111, lastNumber:'140804064', gameNumbers:[]};
            //需要补全的属性有 lotteryBalls  lastNumber
            me.setDynamicConfig(data);
            return;
            **/ 
           /* $.ajax({
                url:that.getUpdateUrl(),
                dataType:'JSON',
                success:function(respone){
                    if(Number(respone['errno']) == 0){
                        that.setDynamicConfig(respone['data']);
                        if($.isFunction(callback)){
                            callback.call(that, respone['data']);
                        }
                    }

                }
            });*/

            ajaxData({
                url: that.getUpdateUrl(),
                successCallback: function(data) {
                    if ($.isFunction(callback)) {
                        callback.call(that, data);
                    }
                    that.setDynamicConfig(data); 
                }
            });
        },
        //需要更新的数据{currentNumber:当前期号, currentNumberTime:本期开奖时间,currentTime: 当前时间, lotteryBalls:上期开奖号码, lastNumber:上期期号, gameNumbers:期号列表}
        setDynamicConfig:function(cfg){
            this.updateConfig(cfg);
           Games.getCurrentCountdown().fireEvent('changeDynamicConfig', cfg);
        }
    };



    var Main = host.ExtendClass(pros, Event);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;

})(gagame, 'GameConfig', jQuery, gagame.Event);