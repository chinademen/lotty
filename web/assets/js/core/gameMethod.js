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

    if (!!window.attachEvent) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        }
    }

    var pros = {
        //初始化
        init: function(config) {
            var that = this;
            Games.setCurrentMethod(that);
            // console.log('gameMethod init');
        },
        //生成单注随机数
        createRandomNum: function(start, end, type) {
            var me = this,
                current = [],
                arr = [];

            //建立索引数组
            for (var i = start; i < end; i++) {
                if (type == 'odd' && (i % 2 != 0)) {
                    arr.push(i);
                } else if (type == 'even' && (i % 2 == 0)) {
                    arr.push(i);
                } else if (type == 'all') {
                    arr.push(i);
                }

            };
            //随机数
            for (var k = 0; k < 10; k++) {
                var ranDomNum = Math.floor(Math.random() * arr.length);
                current.push(arr[ranDomNum]);
                arr.splice(ranDomNum, 1);
            };
            current.sort(function(a, b) {
                return a - b;
            })
            return current;
        },
        //过滤结果集合中的双重号和豹子号
        filterErrorData: function(arr, len, num, saveArray) {
            /*var me = this,
                saveArray = saveArray || [],
                num = num || 0,
                len = len || arr.length;

            if (num == len) {
                return saveArray;
            } else {
                if (arr[num][0] != arr[num][1] && arr[num][0] != arr[num][2] && arr[num][1] != arr[num][2]) {
                    saveArray.push(arr[num]);
                }
                num++;
                return me.filterErrorData(arr, len, num, saveArray);
            }*/

            var me = this,
                saveArray = [],
                num = 0,
                len = len || arr.length - 1;
            // console.log(len);
            for (len; len >= num; len--) {

                var add = true;
                for (var i = 0; i < arr[len].length; i++) {
                    for (var j = 0; j < arr[len].length; j++) {
                        if (i != j && arr[len][i] == arr[len][j]) {
                            add = false;
                        }
                    }
                }

                if (add) {
                    saveArray.push(arr[len]);
                }

            }

            return saveArray;
        },
        //单行数组的排列组合
        //list 参与排列的数组
        //num 每组提取数量
        //last 递归中间变量
        combine: function(list, num, last) {
            var result = [],
                i = 0;
            last = last || [];
            if (num == 0) {
                return [last];
            }
            for (; i <= list.length - num; i++) {
                result = result.concat(arguments.callee(list.slice(i + 1), num - 1, last.slice(0).concat(list[i])));
            }
            return result;
        },
        /*一维数组*/
        //m数组
        combination1: function(n, m) {
            var r;
            for (i = 0, p = 1; i < m; p *= (n - i++));
            for (f = 1, i = 2; i <= m; f *= i++);
            r = p / f;
            return r
        },
        //二维数组的排列组合
        //arr2 二维数组
        combination2: function(arr2) {
            if (arr2.length < 1) {
                return [];
            }
            var w = arr2[0].length,
                h = arr2.length,
                i, j,
                m = [],
                n,
                result = [],
                _row = [];

            m[i = h] = 1;

            while (i--) {
                m[i] = m[i + 1] * arr2[i].length;
            }
            n = m[0];
            for (i = 0; i < n; i++) {
                _row = [];
                for (j = 0; j < h; j++) {
                    _row[j] = arr2[j][~~(i % m[j] / m[j + 1])];
                }
                result[i] = _row;
            }
            return result;
        },
        //2个数的跨度
        kuadu2: function(sum, nBegin, nEnd) {
            var arr = [],
                x, y;

            for (x = nBegin; x <= nEnd; x++) {
                for (y = nBegin; y <= nEnd; y++) {
                    if (y - x == sum) {
                        arr.push([x, y]);
                        if (x != y) {
                            arr.push([y, x]);
                        }
                    }
                }
            }
            return arr;
        },
        //2个数的直选和值
        zhixuanHezhi2: function(sum, nBegin, nEnd) {
            var me = this,
                arr = [],
                checkArray = [],
                x, y;

            for (x = nBegin; x <= nEnd; x++) {
                for (y = nBegin; y <= nEnd; y++) {
                    if (x + y == sum) {
                        arr.push([x, y]);
                    }
                }
            }
            return arr;
        },
        //2个数的组选和值
        zuxuanHezhi2: function(sum, nBegin, nEnd) {
            var me = this,
                arr = [],

                checkArray = [],
                _arr = [],
                x, y,
                has = {},
                key = '',
                fn = function(a, b) {
                    return a - b;
                };

            for (x = nBegin; x <= nEnd; x++) {
                for (y = nBegin; y <= nEnd; y++) {
                    if (x + y == sum) {
                        _arr = [x, y];
                        key = _arr.sort(fn).join(',');
                        if (!has[key] && x != y) {
                            arr.push([x, y]);
                            has[key] = true;
                        }
                    }
                }
            }
            return arr;
        },
        isRepeat: function(data, array) {
            //检查重复
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i].join('') == data) {
                    return false;
                }
            };
            return true;
        },
        //2个数的包胆
        baodan2: function(sum, nBegin, nEnd) {
            var me = this,
                //arr = [],
                arr = 0,
                checkArray = [],
                x, y;

            for (x = nBegin; x <= nEnd; x++) {
                for (y = nBegin; y <= nEnd; y++) {
                    if ((x == sum && y != sum) || (y == sum && x != sum)) {
                        var postArray = [x, y].sort(function(a, b) {
                            return a - b;
                        });
                        if (me.isRepeat(postArray.join(''), checkArray)) {
                            checkArray.push(postArray)
                                //arr.push([x, y]);
                            arr++;
                        }
                    }
                }
            }
            return arr;
        },
        zhixuanHezhi5: function(sum, nBegin, nEnd) {
            var result = 0,
                a, b, c, d, e;

            for (a = nBegin; a <= nEnd; a++) {
                for (b = nBegin; b <= nEnd; b++) {
                    for (c = nBegin; c <= nEnd; c++) {
                        for (d = nBegin; d <= nEnd; d++) {
                            for (e = nBegin; e <= nEnd; e++) {
                                if (a + b + c + d + e == sum) {
                                    //arr.push([a, b, c, d, e]);
                                    result++;
                                }
                            }
                        }
                    }
                }
            }
            return result;
        },
        //三个数和值
        zhixuanHezhi3: function(sum, nBegin, nEnd) {
            var result = [],
                a, b, c;

            for (a = nBegin; a <= nEnd; a++) {
                for (b = nBegin; b <= nEnd; b++) {
                    for (c = nBegin; c <= nEnd; c++) {
                        if (a + b + c == sum) {
                            result.push([a, b, c]);
                        }
                    }
                }
            }
            return result;
        },
        //组选三个数和值
        zuxuanHezhi3: function(sum, nBegin, nEnd) {
            var me = this,
                arr = [],
                checkArray = [],
                x, y, z;

            for (x = nBegin; x <= nEnd; x++) {
                for (y = nBegin; y <= nEnd; y++) {
                    for (z = nBegin; z <= nEnd; z++) {
                        if (x + y + z == sum && me.arrIndexOf(x, [x, y, z]) != 3) {
                            var postArray = [x, y, z].sort(function(a, b) {
                                return a - b;
                            });
                            if (me.isRepeat(postArray.join(''), checkArray)) {
                                checkArray.push(postArray)
                                arr.push([x, y, z]);
                            }
                        }
                    }
                }
            }
            return arr;
        },
        //组选三个数和值
        zuxuanBaodan3: function(sum, nBegin, nEnd) {
            var me = this,
                arr = 0,
                checkArray = [],
                x, y, z;

            for (x = nBegin; x <= nEnd; x++) {
                for (y = nBegin; y <= nEnd; y++) {
                    for (z = nBegin; z <= nEnd; z++) {
                        if (x == sum && me.arrIndexOf(x, [x, y, z]) != 3 || y == sum && me.arrIndexOf(x, [x, y, z]) != 3 || z == sum && me.arrIndexOf(x, [x, y, z]) != 3) {
                            var postArray = [x, y, z].sort(function(a, b) {
                                return a - b;
                            });
                            if (me.isRepeat(postArray.join(''), checkArray)) {
                                checkArray.push(postArray)
                                    //arr.push([x,y,z]);
                                arr++;
                            }
                        }
                    }
                }
            }
            return arr;
        },
        //直选跨度 3个数
        zhixuanKuadu3: function(sum, nBegin, nEnd) {
            var arr = [],
                x, y, z;

            for (x = nBegin; x <= nEnd; x++) {
                for (y = nBegin; y <= nEnd; y++) {
                    for (z = nBegin; z <= nEnd; z++) {
                        var numList = [x, y, z];
                        minNums = Math.min.apply(Math, numList);
                        maxNums = Math.max.apply(Math, numList);
                        if (maxNums - minNums == sum) {
                            arr.push(numList);
                        }
                    }
                }
            }
            return arr;
        },

        //检查数组存在某数
        arrIndexOf: function(value, arr) {
            var r = 0;
            for (var s = 0; s < arr.length; s++) {
                if (arr[s] == value) {
                    r += 1;
                }
            }
            return r || -1;
        },
        //只有一个重复 组选60
        getOneRepeadNums: function(ball, singleNum) {
            var that = this,
                len = ball[1].length,
                result = [],
                arr = [],
                nr = [];
            //获取选中数字 
            for (var i = 0; i < len; i++) {
                arr.push(ball[1][i].ball);
            }
            //存储单号组合
            result = that.combine(arr, singleNum);
            //二重号组合
            for (var j = 0; j < ball[0].length; j++) {
                //加上单号各种组合
                for (var s = 0; s < result.length; s++) {
                    if (that.arrIndexOf(ball[0][j].ball, result[s]) == -1) {
                        nr.push(result[s].concat([ball[0][j].ball, ball[0][j].ball]));
                    }
                }
            }
            return nr;
        },
        //只有2个重复 组选30
        getTwoRepeadNums: function(ball, noFilter) {
            var that = this,
                len = ball[0].length,
                result = [],
                arr = [],
                nr = [];
            //获取选中数字 
            for (var i = 0; i < len; i++) {
                arr.push(ball[0][i].ball);
            }
            for (var c = 0; c < arr.length; c++) {
                arr[c] = [arr[c], arr[c]];
            }
            if (noFilter) {
                return that.combine(arr, 2);
            }
            //存储单号组合
            result = that.combine(arr, 2);
            //二重号组合
            for (var j = 0; j < ball[1].length; j++) {
                //加上单号各种组合
                for (var s = 0; s < result.length; s++) {
                    if (that.arrIndexOf(ball[1][j].ball, result[s]) == -1) {
                        nr.push(result[s].concat([ball[1][j].ball]));
                    }
                }
            }
            return nr;
        },
        //只有3个重复 组选20
        getTreeSameNums: function(ball, numLength) {
            var that = this,
                len = ball[1].length,
                result = [],
                arr = [],
                nr = [];
            //获取选中数字 
            for (var i = 0; i < len; i++) {
                arr.push(ball[1][i].ball);
            }
            //存储单号组合
            result = that.combine(arr, numLength - 3);
            //二重号组合
            for (var j = 0; j < ball[0].length; j++) {
                //加上单号各种组合
                for (var s = 0; s < result.length; s++) {
                    if (that.arrIndexOf(ball[0][j].ball, result[s]) == -1) {
                        nr.push(result[s].concat([ball[0][j].ball, ball[0][j].ball, ball[0][j].ball]));
                    }
                }
            }
            return nr;
        },
        //只有3个重号1个重复 组选10
        isTreeSameOneRepeat: function(ball) {
            var that = this,
                len = ball[1].length,
                result = [],
                arr = [],
                nr = [];
            //获取选中数字 
            for (var i = 0; i < len; i++) {
                arr.push(ball[1][i].ball);
            }
            //存储单号组合
            result = that.combine(arr, 1);

            for (var c = 0; c < result.length; c++) {
                result[c] = [result[c][0], result[c][0]];
            }

            //二重号组合
            for (var j = 0; j < ball[0].length; j++) {
                //加上单号各种组合
                for (var s = 0; s < result.length; s++) {
                    if (that.arrIndexOf(ball[0][j].ball, result[s]) == -1) {
                        nr.push(result[s].concat([ball[0][j].ball, ball[0][j].ball, ball[0][j].ball]));
                    }
                }
            }
            return nr;
        },
        //只有4个重复 组选5 
        isThourSame: function(ball) {
            var that = this,
                len = ball[1].length,
                result = [],
                arr = [],
                nr = [];
            //获取选中数字 
            for (var i = 0; i < len; i++) {
                arr.push(ball[1][i].ball);
            }
            //存储单号组合
            result = that.combine(arr, 1);
            //二重号组合
            for (var j = 0; j < ball[0].length; j++) {
                //加上单号各种组合
                for (var s = 0; s < result.length; s++) {
                    if (that.arrIndexOf(ball[0][j].ball, result[s]) == -1) {
                        nr.push(result[s].concat([ball[0][j].ball, ball[0][j].ball, ball[0][j].ball, ball[0][j].ball]));
                    }
                }
            }
            return nr;
        },
        //组选组三
        zuxuanZusan: function(ball) {
            var that = this,
                len = ball[0].length,
                saveNum = [],
                checkNum = [],
                result = [],
                arr = [],
                nr = [];
            //获取选中数字 
            for (var i = 0; i < len; i++) {
                arr.push(ball[0][i].ball);
            }
            for (var c = 0; c < arr.length; c++) {
                checkNum = [];
                saveNum = arr.concat();
                checkNum.push([
                    [arr[c], arr[c]].join('')
                ]);
                saveNum.splice(c, 1)
                checkNum.push(saveNum);
                result = result.concat(that.combination2(checkNum));
            };

            for (var k = 0; k < result.length; k++) {
                result[k] = result[k].join('').split('');
            };

            return result;
        },
        //任选三 组三复式
        renxuan3Zusanfushi: function(ball) {
            var me = this,
                data = [],
                result = [],
                optionResult = [],
                optionIndex = me.getPositionOptionIndex();

            data = me.zuxuanZusan(ball);
            optionResult = me.combine(optionIndex, 3);
            $.each(optionResult, function(i) {
                optionResult[i] = optionResult[i].join(',');
            });

            result = me.combination2([optionResult, data]);

            return {
                result: result,
                position: optionIndex.join('')
            };
        },
        //任选二 直选复式
        renxuan2Zhixuanfushi: function(arr) {
            var me = this,
                tempArr = [],
                result = [],
                seat = [];
            $.each(arr, function(i) {
                $.each(arr, function(j) {
                    if (i < j) {
                        tempArr = [];
                        tempArr.push(arr[i]);
                        tempArr.push(arr[j]);
                        result = result.concat(me.combination2(tempArr));
                    }
                });
            });

            $.each(arr, function(i) {
                if (arr[i] != '') {
                    seat.push(i);
                }
            });
            //me.defConfig.seatNum = seatNum.join(''); 

            return {
                seat: seat,
                result: result
            };
        },
        //任选三 直选复式
        renxuan3Zhixuanfushi: function(arr) {
            var me = this,
                tempArr = [],
                result = [],
                seat = [];
            $.each(arr, function(i) {
                $.each(arr, function(j) {
                    $.each(arr, function(k) {
                        if (i < j && j < k) {
                            //console.log(i, j, k);
                            tempArr = [];
                            tempArr.push(arr[i]);
                            tempArr.push(arr[j]);
                            tempArr.push(arr[k]);
                            result = result.concat(me.combination2(tempArr));
                        }
                    });
                });
            });

            $.each(arr, function(i) {
                if (arr[i] != '') {
                    seat.push(i);
                }
            });
            //me.defConfig.seatNum = seatNum.join(''); 

            return {
                seat: seat,
                result: result
            };
        },
        //任选四 直选复式
        renxuan4Zhixuanfushi: function(arr) {
            var me = this,
                tempArr = [],
                result = [],
                seat = [];
            $.each(arr, function(i) {
                $.each(arr, function(j) {
                    $.each(arr, function(k) {
                        $.each(arr, function(l) {
                            if (i < j && j < k && i < l && j < l && k < l) {
                                //console.log(i, j, k);
                                tempArr = [];
                                tempArr.push(arr[i]);
                                tempArr.push(arr[j]);
                                tempArr.push(arr[k]);
                                tempArr.push(arr[l]);
                                result = result.concat(me.combination2(tempArr));
                            }
                        });
                    });
                });
            });

            $.each(arr, function(i) {
                if (arr[i] != '') {
                    seat.push(i);
                }
            });
            //me.defConfig.seatNum = seatNum.join(''); 

            return {
                seat: seat,
                result: result
            };
        },
        //任选四 组选12
        renxuan4Zuxuan12: function(ball) {
            var me = this,
                len = ball[1].length,
                arr = [],
                data = [],

                singleNumArr = [],
                result = [],
                optionResult = [],
                optionIndex = me.getPositionOptionIndex();

            //校验当前的面板 

            //获取选中数字 
            for (var i = 0; i < len; i++) {
                arr.push(ball[1][i].ball);
            }
            //存储单号组合
            singleNumArr = me.combine(arr, 2);
            //二重号组合 
            for (var j = 0; j < ball[0].length; j++) {
                //加上单号各种组合
                for (var s = 0; s < singleNumArr.length; s++) {
                    if (me.arrIndexOf(ball[0][j].ball, singleNumArr[s]) == -1) {
                        data.push(singleNumArr[s].concat([ball[0][j].ball, ball[0][j].ball]));
                    }
                }
            }

            optionResult = me.combine(optionIndex, 4);
            $.each(optionResult, function(i) {
                optionResult[i] = optionResult[i].join(',');
            });

            result = me.combination2([optionResult, data]);

            return {
                result: result,
                position: optionIndex.join('')
            };
        },
        //任选四 组选4
        renxuan4Zuxuan4: function(ball) {
            var me = this,
                len = ball[1].length,
                arr = [],
                data = [],

                singleNumArr = [],
                result = [],
                optionResult = [],
                optionIndex = me.getPositionOptionIndex();

            //校验当前的面板 

            //获取选中数字 
            for (var i = 0; i < len; i++) {
                arr.push(ball[1][i].ball);
            }
            //存储单号组合
            singleNumArr = me.combine(arr, 1);
            //二重号组合 
            for (var j = 0; j < ball[0].length; j++) {
                //加上单号各种组合
                for (var s = 0; s < singleNumArr.length; s++) {
                    if (me.arrIndexOf(ball[0][j].ball, singleNumArr[s]) == -1) {
                        data.push(singleNumArr[s].concat([ball[0][j].ball, ball[0][j].ball, ball[0][j].ball]));
                    }
                }
            }

            optionResult = me.combine(optionIndex, 4);
            $.each(optionResult, function(i) {
                optionResult[i] = optionResult[i].join(',');
            });

            result = me.combination2([optionResult, data]);

            return {
                result: result,
                position: optionIndex.join('')
            };
        },
        getPositionOptionIndex: function() {
            var optionIndex = [];
            $('.balls-import-positionOption input[type=checkbox]').each(function() {
                if (this.checked) {
                    optionIndex.push($(this).data('index'));
                }
            });
            return optionIndex;
        },
        //任选 直选和值 
        renxuanCommon: function(numArr, func, renxuanNum, isZuxuan, repeatNum) {
            var me = this,
                i = 0,
                len2,
                optionIndex = me.getPositionOptionIndex(),
                optionResult = [],
                data = [],
                result = [];

            optionResult = me.combine(optionIndex, renxuanNum);
            $.each(optionResult, function(i) {
                optionResult[i] = optionResult[i].join(',');
            });

            if (isZuxuan) {
                if (repeatNum) {
                    data = me.combine(numArr, repeatNum);
                } else {
                    data = me.combine(numArr, renxuanNum);
                }

            } else {
                for (i = 0, len = numArr.length; i < len; i++) {
                    //data = data.concat(me.zhixuanHezhi2(numArr[i], 0, 9));
                    data = data.concat(me[func].call(me, numArr[i], 0, 9));
                }
            }

            result = me.combination2([optionResult, data]);

            return {
                result: result,
                position: optionIndex.join('')
            };
        },

        getPureDataFromBall: function(ball) {
            var result = [];
            for (var i = 0; i < ball.length; i++) {
                if (Object.prototype.toString.call(ball[i]) === '[object Array]') {
                    var tmp = [];
                    for (var j = 0; j < ball[i].length; j++) {
                        tmp.push(ball[i][j].ball);
                    }
                    result.push(tmp);
                } else {
                    result.push(ball[i].ball);
                }

            }
            return result;
        }

    };



    var Main = host.ExtendClass(pros, Event);
    Main.defConfig = defConfig;
    Main.getInstance = function(cfg) {
        return instance || (instance = new Main(cfg));
    };
    host[name] = Main;
})(gagame, 'GameMethod', jQuery, gagame.Event);