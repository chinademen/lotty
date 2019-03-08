(function(host, name, $, Event) {
    var defConfig = {
            id: -1,
            //游戏名称
            name: '',
            //文件名前缀
            jsNameSpace: ''
        },
        instance,
        Games = host.Games;

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            Games.setCurrentGameHelp(that);
            // console.log('GameHelp init >>>');
        },
        //events here
        events: function() {

        },
        getNewOneByPosition: function(position, arr) {
            var result = [];
            for (var i = 0; i < position.length; i++) {
                result.push(arr[position[i]]);
            }
            return result;
        },
        //JS判断一个数组中是否有重复值
        isNotRepeat: function(arr) {
            var hash = {};
            for (var i in arr) {
                if (hash[arr[i]]) return false;
                hash[arr[i]] = true;
            }
            return true;
        },
        //5个数中只有一个重复 组选60
        isOneRepeat: function(arr) {
            var obj = {};
            var numlen = 0;
            var moretimes = 0;
            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i]]) {
                    obj[arr[i]] = 1;
                } else {
                    obj[arr[i]] += 1;
                }
            }

            for (var k in obj) {
                numlen += 1;
                if (obj[k] == 2) {
                    moretimes += 1;
                }
            }
            if (moretimes == 1 && numlen == arr.length - 1) {
                return true;
            }
            return false;
        },
        //5个数中只有2个重复 组选30
        isTwoRepeat: function(arr) {
            var obj = {};
            var numlen = 0;
            var moretimes = 0;
            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i]]) {
                    obj[arr[i]] = 1;
                } else {
                    obj[arr[i]] += 1;
                }
            }

            for (var k in obj) {
                numlen += 1;
                if (obj[k] == 2) {
                    moretimes += 1;
                }
            }
            if (moretimes == 2 && numlen == arr.length - 2) {
                return true;
            }
            return false;
        },
        isNotThreeSame: function(arr) {
            return !(arr[0] == arr[1] && arr[1] == arr[2]);
        },
        //5个数中只有一个3重号 组选20
        isTreeSame: function(arr) {
            var obj = {};
            var numlen = 0;
            var moretimes = 0;
            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i]]) {
                    obj[arr[i]] = 1;
                } else {
                    obj[arr[i]] += 1;
                }
            }

            for (var k in obj) {
                numlen += 1;
                if (obj[k] == 3) {
                    moretimes += 1;
                }
            }
            if (moretimes == 1 && numlen == arr.length - 2) {
                return true;
            }
            return false;
        },
        //5个数中只有一个3重号 一个重复组选10
        isTreeSameOneRepeat: function(arr) {
            var obj = {};
            var numlen = 0;
            var moretimes = 0;

            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i]]) {
                    obj[arr[i]] = 1;
                } else {
                    obj[arr[i]] += 1;
                }
            }

            for (var k in obj) {
                numlen += 1;
                if (obj[k] == 3) {
                    moretimes += 1;
                }
            }
            if (moretimes == 1 && numlen == 2) {
                return true;
            }
            return false;
        },
        isThourSame: function(arr) {
            var obj = {};
            var numlen = 0;
            var moretimes = 0;

            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i]]) {
                    obj[arr[i]] = 1;
                } else {
                    obj[arr[i]] += 1;
                }
            }

            for (var k in obj) {
                numlen += 1;
                if (obj[k] == 4) {
                    moretimes += 1;
                }
            }
            if (moretimes == 1 && numlen == 2) {
                return true;
            }
            return false;
        },
        //顺子
        isQueueNum: function(arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i] = Number(arr[i]);
            }
            if (arr.length == 3) {
                return arr[0] + 1 == arr[1] && arr[1] + 1 == arr[2];
            }
            if (arr.length == 4) {
                return arr[0] + 1 == arr[1] && arr[1] + 1 == arr[2] && arr[2] + 1 == arr[3];
            }
            if (arr.length == 5) {
                return arr[0] + 1 == arr[1] && arr[1] + 1 == arr[2] && arr[2] + 1 == arr[3] && arr[3] + 1 == arr[4];
            }
        },
        isL115Number: function(arr) {
            var checkNum = /^\d{2}$/;
            var isPass = true;
            $.each(arr, function() {
                if (!checkNum.test(this) || Number(this) < 1 || Number(this) > 11) {
                    isPass = false;
                    return false;
                }
            });
            return isPass;

        },
        isKL12Number: function(arr) {
            var checkNum = /^\d{2}$/;
            var isPass = true;
            $.each(arr, function() {
                if (!checkNum.test(this) || Number(this) < 1 || Number(this) > 12) {
                    isPass = false;
                    return false;
                }
            });
            return isPass;

        },
        isKLSFNumber: function(arr) {
            var checkNum = /^\d{2}$/;
            var isPass = true;
            $.each(arr, function() {
                if (!checkNum.test(this) || Number(this) < 1 || Number(this) > 20) {
                    isPass = false;
                    return false;
                }
            });
            return isPass;

        },
        isPK10Number: function(arr) {
            var checkNum = /^\d+$/;
            var isPass = true;
            $.each(arr, function() {
                if (!checkNum.test(this) || Number(this) < 1 || Number(this) > 10) {
                    isPass = false;
                    return false;
                }
            });
            return isPass;

        },
        //ASC
        bubble: function(arra) {

            var temp;

            for (var i = 0; i < arra.length; i++) { //比较多少趟，从第一趟开始

                for (var j = 0; j < arra.length - i - 1; j++) { //每一趟比较多少次数

                    if (arra[j] > arra[j + 1]) {
                        temp = arra[j];
                        arra[j] = arra[j + 1];
                        arra[j + 1] = temp;
                    }
                }
            };
            return arra;
        },
        //单双 单（13579）双（02468）
        getDanshuang: function(nums) {
            var result = '';
            for (var i = 0, len = nums.length; i < len; i++) {
                if (nums[i] % 2 != 0) {
                    result += '单';
                } else {
                    result += '双';
                }
            }
            return result;
        },
        getDanshuangPK10: function(nums) {
            return this.compose(function(num) {
                return num % 2 != 0 ? '单' : '双';
            }, this.getSumByNum)(nums);
        },
        getDaxiaoPK10: function(nums) {
            //大 11~19 ，小  3~10
            return this.compose(function(num){
                return num >10?'大':'小';
            }, this.getSumByNum)(nums);
        },
        //大小 对十位和个位的“大（56789）小（01234）
        getDaxiao: function(nums) {
            var result = '';
            var xiao = '01234';
            var da = '56789';

            for (var i = 0, len = nums.length; i < len; i++) {
                if (xiao.indexOf(nums[i]) > -1) {
                    result += '小';
                }
                if (da.indexOf(nums[i]) > -1) {
                    result += '大';
                }
            }
            return result;
        },
        //取和值 
        getSumByNum: function(nums) {
            var sum = 0;
            for (var i = 0; i < nums.length; i++) {
                sum += Number(nums[i]);
            }
            return sum;
        },
        //和值尾数
        getHeZhiTailNum: function(nums) {
            return this.getSumByNum(nums) % 10;
        },
        //龙虎
        longhu:function(nums){
            if (nums[0] > nums[1]) {
                return '<i class="long">龙</i>';
            } else if (nums[0] < nums[1]) {
                return '<i class="hu">虎</i>';
            } else {
                return '';
            }
        },
        //龙虎和
        longhuhe: function(nums) {
            if (nums[0] > nums[1]) {
                return '龙';
            } else if (nums[0] < nums[1]) {
                return '虎';
            } else {
                return '和';
            }
        },
        //直选跨度
        zhixuanKuadu: function(nums) {
            var min = Math.min.apply(Math, nums);
            var max = Math.max.apply(Math, nums);
            return max - min;
        },

        getMoneyUnitText: function(moneyUnit) {
            var text = "";
            switch (moneyUnit + '') {
                case '1.000':
                    text = "2元";
                    break;
                case '0.500':
                    text = "1元";
                    break;
                case '0.100':
                    text = "2角";
                    break;
                case '0.050':
                    text = "1角";
                    break;
                case '0.010':
                    text = "2分";
                    break;
                case '0.001':
                    text = "2厘";
                    break;
            }
            return text;
        },
        compose: function(f, g) {
            return function(x) {
                return f(g(x));
            };
        }

    };



    var Main = host.ExtendClass(pros, Event);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;
})(gagame, 'GameHelp', jQuery, gagame.Event);