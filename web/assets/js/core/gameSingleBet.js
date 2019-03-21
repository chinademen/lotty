(function(host, name, $, GameMethod) {
    var defConfig = {
            id: -1,
            //游戏名称
            name: '',
            //文件名前缀
            jsNameSpace: '',
            //添加事件代理的主面板
            //中文 全角符号  中文
            checkFont: /[\u4E00-\u9FA5]|[/\n]|[/W]/g,
            //过滤方法
            filtration: /[\s]|[,]|[;]|[|]|[<br>]|[，]|[；]|[、]|[｜]/i,
            //验证是否纯数字
            checkNum: /^[0-9]*$/
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            Games.setCurrentSingleBet(that);

            that.fileData = null;

            that.events();
            // console.log('GameSingleBet init');
        },
        //events here
        events: function() {
            var that = this;
            that.initFileChange();
            that.dragUpload();
            that.initTextarea();
            that.initOperationButton();
        },
        reset: function() {
            this.fileData = null;
            $('.content-textarea-balls').val('');
            $('.content-textarea-balls').blur();
        },
        getFileData: function() {
            return this.fileData;
        },
        setFiltration: function(filtration) {
            this.defConfig.filtration = filtration;
        },
        initOperationButton: function() {
            var that = this;

            //删除错误项
            $(document).on('click', '.remove-error', function() {
                if (!that.fileData) return;
                $('.content-textarea-balls').val(that.formatData(that.fileData.passedData));
                if (!that.fileData) return;
                if (that.fileData.errorData.length == 0) return;
                that.execFilterDirtyData(1, 0);
            });

            //删除重复项
            $(document).on('click', '.remove-same', function() {
                if (!that.fileData) return;
                $('.content-textarea-balls').val(that.formatData(that.fileData.passedData));
                if (!that.fileData) return;
                if (that.fileData.repeatData.length == 0) return;
                that.execFilterDirtyData(0, 1);
            });
            //清空
            $(document).on('click', '.remove-all', function() {
                that.reset();
                Games.getCurrentGameOrder().fireEvent('resetSelectBalls');
            });

            //balls-example-danshi-aid
            $(document).on('click', '.balls-example-danshi-aid', function() {
                window.open('/js/vendor/aidFun/index.html', "", "height=562,width=802,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no");
            });
        },
        formatData: function(data) {
            var currentOrder = Games.getCurrentGameOrder();
            if (Object.prototype.toString.call(data[0]) === '[object Array]') {
                return currentOrder.formatViewObj(data).viewBalls;
            } else {
                return data.join(' ');
            }
        },
        execFilterDirtyData: function(showError, showRepeat) {
            var that = this;
            if (!that.fileData) return;
            if (that.fileData.errorData.length == 0 && that.fileData.repeatData == 0) return;
            var errorDataStr = that.formatData(that.fileData.errorData);
            var repeatDataStr = that.formatData(that.fileData.repeatData);
            if(that.fileData.errorData[0]==""){
                errorDataStr = '有多余空格或者不合法字符';
            }
            var currentOrder = Games.getCurrentGameOrder();
            Games.getCurrentMessage().show('singleBet_error', {
                errorData: errorDataStr,
                errorDataTitle: '以下号码错误，已进行自动过滤',
                repeatData: repeatDataStr,
                repeatDataTitle: '以下号码重复，已进行自动过滤',
                showError: showError,
                showRepeat: showRepeat
            });
            if (that.fileData.passedData.length > 0) {
                $('.content-textarea-balls').val(that.formatData(that.fileData.passedData));
            } else {
                $('.content-textarea-balls').blur();
                currentOrder.fireEvent('resetSelectBalls');
            }


            that.fileData.errorData = [];
            that.fileData.repeatData = [];
            that.fileData.errorData = [];
            that.fileData.repeatData = [];
        },


        dragUpload: function() {
            var that = this;
            //拖拽上传
            if (window.FileReader) {

                $(document).on('dragover', '.content-textarea-balls', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });

                $(document).on('drop', '.content-textarea-balls', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var files = e.originalEvent.dataTransfer.files,
                        file = files[0],
                        reader = new FileReader(),
                        fType = file.type ? file.type : 'n/a';

                    if (fType != 'text/plain') {
                        return;
                    }

                    reader.onload = function(e) {
                        var text = e.target.result;
                        if ($.trim(text) != '') {
                            // console.log('onload >>>>>');
                            $('.content-textarea-balls').val(text);
                            that.updateData();
                        }
                    };
                    reader.readAsText(file);
                });
            }
        },
        initTextarea: function() {
            var that = this;
            var CLS = 'content-textarea-balls-def';
            var singleDesc = that.getSingleDesc();
            //绑定输入框事件
            $(document).on('focus', '.content-textarea-balls', function() {
                var v = $.trim(this.value);
                if (v == singleDesc) {
                    this.value = '';
                    $(this).removeClass(CLS);
                }
            }).on('blur', '.content-textarea-balls', function() {
                var v = $.trim(this.value);
                if (v == '') {
                    //me.removeOrderAll(); 
                    $(this).val(singleDesc);
                    $(this).addClass(CLS);
                }

            }).on('input propertychange', '.content-textarea-balls', function() {
                that.updateData();
                // console.log('===input propertychange >>>');
            });

        },
        initFileChange: function() {
            var that = this;
            $(document).on('change', '#file', function() {
                var form = $("#file").parent();
               
                that.checkFile(this, form);
            });
        },
        //用拆分符号拆分成单注
        /* iterator: function(data) {
             var me = this,
                 cfg = me.defConfig,
                 result = [],
                 breakNum = 0;

             for (var i = 0; i < data.length; i++) {
                 if (cfg.filtration.test(data.charAt(i))) {
                     result.push(data.substr(breakNum, i - breakNum));
                     breakNum = i + 1;
                 }
             }
             $.each(result, function(i){
                 result[i] = result[i].split('').sort().join('');
             });
             return result;
         },*/
        /* //检测结果重复
         checkResult: function(data, array) {
             //检查重复
             for (var i = array.length - 1; i >= 0; i--) {
                 if (array[i] == data) {
                     return false;
                 }
             };
             return true;
         },*/
        //正则过滤输入框HTML
        //提取正确的投注号码
        /*  filterLotters: function(data) {
              var that = this,
                  result = '';
              result = data.replace(/<br>+|&nbsp;+/gi, ' ');
              result = result.replace(/\s\s|[\s]|[,]+|[;]+|[|]+|[，]+|[；]+|[｜]+/gi, ' ');
              result = result.replace(/<(?:"[^"]*"|'[^']*'|[^>'"]*)+>/g, ' ');
              result = result.replace(that.defConfig.checkFont, '') + ' ';
              return result;
          },*/
        //检测单注号码是否通过
        checkSingleNum: function(lotteryNum) {
            var that = this;
            var currentGame = Games.getCurrentGame();
            var num = currentGame.getSingleBallNumbers();
            var rules = currentGame.getSingleBallRules();
            var result = true;
            //兼容11选5与时时彩
            if (!Object.prototype.toString.call(lotteryNum) === '[object Array]') {
                if (!that.defConfig.checkNum.test(lotteryNum)) {
                    return false;
                }
            }

            if (lotteryNum.length != num) {
                return false;
            }

            for (var i = 0, len = rules.length; i < len; i++) {
                if (!rules[i].context[rules[i].func].call(rules[i].context, lotteryNum)) {
                    result = false;
                    break;
                }
            }
            return result;

        },

        //检测上传
        checkFile: function(file, form) {
            var that = this;
            var fileName = file.value,
                suffixName = fileName.substring(fileName.lastIndexOf("."), fileName.length),
                suffixName = suffixName.toLowerCase();
                
            if(suffixName == ''){
                
            }else{
                if (suffixName !== '.txt') { 
               
                    Games.getCurrentMessage().show('normal',{error:'对不起，导入数据格式必须是.txt格式文件哦，请您调整格式后重新上传，谢谢 ！'});
                    return false;
                }
                if(window.FileReader){
                    var reader = new FileReader();
                    reader.onloadstart = function(){
    
                    }
                    reader.onloadend = function(){
           
                    }
                    reader.readAsText(file.files[0]);
                    reader.onload = function () {
                        // $("#maskOfXGAME").hide();
                        $("#normalMSG").hide()
                        that.getFile(this.result);
                    }
                }else{
                    alert("您的浏览器不支持读取文件，请升级您的浏览器来解决");
                }
            }    


        },
        //接收文件
        getFile: function(result) {
            var that = this,
                file = $('#file');
            if (!result) return;
            
            $('.content-textarea-balls').val(result);
            
            that.updateData();
            file.val('');
        },
        updateData: function() {
            var that = this;
            var currentGame = Games.getCurrentGame();
            var data = $('.content-textarea-balls').val();
            if(typeof(data) == "undefined") return false;
            // console.log(data);
            // console.log(that.checknum(data));
            var gameOrder = Games.getCurrentGameOrder();
            // that.fileData = that.processData(data);
            that.processData(data,function(result){
                that.fileData = result ;
                if (currentGame.getRenxuanNum() != null && !that.checknum(data)) {
                    var obj = that.execRenxuan(that.fileData.passedData, currentGame.getRenxuanNum());
                    console.log(obj.result.length);
                    if (obj.result.length > 0) {
                        gameOrder.setOrderExtraData({
                            position: obj.position,
                            seat: currentGame.getRenxuanNum()
                        });
                        currentGame.doneAlgorithmInjection(obj.result.length);
                    }else{
                        var cfg = Games.getCurrentGame().defConfig;
                        cfg.buttonImmediatelyBetting.addClass('btn-disable');
                        cfg.buttonAddOrder.addClass('btn-disable');
                    }
    
                } else {
                    if (that.fileData.passedData.length > 0 && !that.checknum(data)) {
                        currentGame.doneAlgorithmInjection(that.fileData.passedData.length);
                    } else {
                        var cfg = Games.getCurrentGame().defConfig;
                        cfg.buttonImmediatelyBetting.addClass('btn-disable');
                        cfg.buttonAddOrder.addClass('btn-disable');
    
                    }
                }
            })

            
            // var d = (that.processData(data)).then(function(datas){
            //                 //任选单式
            // $("#moduleShowHide").hide()
            // console.log(data)                
            // that.fileData = datas           
            // if (currentGame.getRenxuanNum() != null && !that.checknum(data)) {
            //     var obj = that.execRenxuan(that.fileData.passedData, currentGame.getRenxuanNum());
            //     if (obj.result.length > 0) {
            //         gameOrder.setOrderExtraData({
            //             position: obj.position,
            //             seat: currentGame.getRenxuanNum()
            //         });
            //         currentGame.doneAlgorithmInjection(obj.result.length);
            //     }else{
            //         var cfg = Games.getCurrentGame().defConfig;
            //         cfg.buttonImmediatelyBetting.addClass('btn-disable');
            //         cfg.buttonAddOrder.addClass('btn-disable');
            //     }

            // } else {
            //     if (that.fileData.passedData.length > 0 && !that.checknum(data)) {
            //         currentGame.doneAlgorithmInjection(that.fileData.passedData.length);
            //     } else {
            //         var cfg = Games.getCurrentGame().defConfig;
            //         cfg.buttonImmediatelyBetting.addClass('btn-disable');
            //         cfg.buttonAddOrder.addClass('btn-disable');

            //     }
            // }
            
            // })



        },
        checknum : function (value) {
            var Regx = /[a-zA-Z]/g;
            if(Regx.test(value)){
                return true;
            }else{
                return false;
            }
        },
        execRenxuan: function(data, renxuanNum) {
            var me = this,
                has = {},
                optionIndex = [],
                optionResult = [],
                tempArr = [],
                result = [],
                currentMethod = Games.getCurrentMethod();

            $('.balls-import-positionOption input[type=checkbox]').each(function() {
                if (this.checked) {
                    optionIndex.push($(this).data('index'));
                }
            });
            optionResult = currentMethod.combine(optionIndex, renxuanNum);

            $.each(optionResult, function(i) {
                optionResult[i] = optionResult[i].join(',');
            });

            tempArr.push(optionResult);
            tempArr.push(data);

            result = me.combination2(tempArr);

            //返回投注
            return {
                result: result,
                position: optionIndex.join('')
            };
        },
        //检测选球是否完整，是否能形成有效的投注 
        processData: function(data,callback) {
            var that = this;
            var allData = [];
            var verificationPassedData = [];
            var repeatData = [];
            var errorData = [];
            var passedData = [];
            //var fragment = 500;
            var currentGame = Games.getCurrentGame();

            //按规则进行拆分结果
            //result = currentGame.iterator(currentGame.filterLotters(data));

            result = that.execFilterLottery(data);
            /*var startTime = new Date().getTime();
            console.log("startTime==="+startTime);*/

            // if (result.length < fragment) {
                fragment = 1;
                var space = result.length;
            
            // } else {
            //     var space = Math.ceil(result.length / fragment);
            //
            //
            // }
            var calculation = [];
            if(typeof(data) != "undefined") {
                if (data.length > 2000) {
                    $("#moduleShowHide").show()
                }
            }
        
            // return new Promise(function(resolve, reject){
            //     setTimeout(function() {
            //         for (var n = 0; n < fragment; n++) {
            //             calculation.push( that.spliceCalculation(result.splice(0, space)) );
            //         }
            //         for (var m = 0; m < calculation.length; m++) {
            //             allData = allData.concat(calculation[m].allData);
            //             verificationPassedData = verificationPassedData.concat(calculation[m].verificationPassedData);
            //             repeatData = repeatData.concat(calculation[m].repeatData);
            //             errorData = errorData.concat(calculation[m].errorData);
            //             passedData = passedData.concat(calculation[m].passedData);
            //         }
            //         var data = {
            //             allData: allData,
            //             verificationPassedData: verificationPassedData,
            //             repeatData: repeatData,
            //             errorData: errorData,
            //             passedData: passedData
            //         }
            //         resolve(data);
            //     },0);
            //   })

            setTimeout(function(){
                setTimeout(function() {
                    for (var n = 0; n < fragment; n++) {
                        calculation.push( that.spliceCalculation(result.splice(0, space)) );
                    }
                    for (var m = 0; m < calculation.length; m++) {
                        allData = allData.concat(calculation[m].allData);
                        verificationPassedData = verificationPassedData.concat(calculation[m].verificationPassedData);
                        repeatData = repeatData.concat(calculation[m].repeatData);
                        errorData = errorData.concat(calculation[m].errorData);
                        passedData = passedData.concat(calculation[m].passedData);
                    }
                    var datas = {
                        allData: allData,
                        verificationPassedData: verificationPassedData,
                        repeatData: repeatData,
                        errorData: errorData,
                        passedData: passedData
                    }
                    $("#moduleShowHide").hide()
                    callback(datas)
                },0);
              
            })
            // for (var n = 0; n < fragment; n++) {
            //     calculation.push( that.spliceCalculation(result.splice(0, space)) );
            // }
            // for (var m = 0; m < calculation.length; m++) {
            //     allData = allData.concat(calculation[m].allData);
            //     verificationPassedData = verificationPassedData.concat(calculation[m].verificationPassedData);
            //     repeatData = repeatData.concat(calculation[m].repeatData);
            //     errorData = errorData.concat(calculation[m].errorData);
            //     passedData = passedData.concat(calculation[m].passedData);
            // }

            // return {
            //     allData: allData,
            //     verificationPassedData: verificationPassedData,
            //     repeatData: repeatData,
            //     errorData: errorData,
            //     passedData: passedData
            // };
        },
        spliceCalculation: function(result) {
            var me = this;
            var allData = [];
            var verificationPassedData = [];
            var repeatData = [];
            var errorData = [];
            var passedData = [];
            //  var currentGame =Games.getCurrentGame();
            // console.log(result)
             // for(var i=0,val;val=result[i++];){

            // if(result.length>2000){
            //     $(".moduleShowHide").show()
            // }
            // $("#moduleShowHide").show()

            // setTimeout(function(){
                for (var i = 0; i < result.length; i++) {
                    //判断单注合理
                    if (me.checkSingleNum(result[i])) {
                        if (me.checkResult(result[i], passedData)) {
                            //正确结果[已去重]
                            passedData.push(result[i]);
                        } else {
                            if (me.checkResult(result[i], repeatData)) {
                                //重复结果
                                repeatData.push(result[i]);
                            }
                        }
                        //正确结果[不去重]
                        verificationPassedData.push(result[i]);
                    } else {
                        if (me.checkResult(result[i], errorData)) {
                            //错误结果[已去重]
                            errorData.push(result[i]);
                        }
                    }
                    //所有结果[已去重]
                    if (me.checkResult(result[i], allData)) {
                        allData.push(result[i]);
                        
                    }
                }

            //     $("#moduleShowHide").hide() 
            // },100)
 
            return {
                allData: allData,
                verificationPassedData: verificationPassedData,
                repeatData: repeatData,
                errorData: errorData,
                passedData: passedData
            }
            
            // console.log(allData)
            // console.log(verificationPassedData)
            // console.log(repeatData)
            // console.log(errorData)
            // console.log(passedData)

        }
    };


    var Main = host.ExtendClass(pros, GameMethod);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;
})(gagame, 'GameSingleBet', jQuery, gagame.GameMethod);