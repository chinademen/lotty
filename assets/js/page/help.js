 /**  
     * 获取本周、本季度、本月、上月的开始日期、结束日期  
     */
function quickTimeClick(nowTime) { 


    var mows = nowTime.replace(/-/g,"/")
    var now = new Date(mows); //当前日期 


    
 
    var nowDayOfWeek = now.getDay(); //今天本周的第几天   
    var nowDay = now.getDate(); //当前日   
    var nowMonth = now.getMonth(); //当前月   
    var nowYear = now.getYear(); //当前年   
    nowYear += (nowYear < 2000) ? 1900 : 0; //   
    var lastMonthDate = new Date(); //上月日期   
    lastMonthDate.setDate(1);
 
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();

    //格式化日期：yyyy-MM-dd   
    function formatDate(date) {

        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday+" "+"00"+":"+"00"+":"+"00");
    }
    //格式化日期：yyyy-MM-dd   
    function formatDateEnd(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday+" "+"23"+":"+"59"+":"+"59");
    }
    //获得某月的天数   
    function getMonthDays(myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }
    //获得本季度的开始月份   
    function getQuarterStartMonth() {
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    }
    //获得本周的开始日期   
    function getWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, (nowDay+1) - nowDayOfWeek);

        return formatDate(weekStartDate);
    }
    //获得本周的结束日期   
    function getWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, (nowDay+1) + (6 - nowDayOfWeek));
        
        return formatDateEnd(weekEndDate);
    }
    //获得上周的开始日期   
    function getLastWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, (nowDay+1) - nowDayOfWeek - 7);
        return formatDate(weekStartDate);
    }
    //获得上周的结束日期   
    function getLastWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, (nowDay+1) - nowDayOfWeek - 1);
        return formatDateEnd(weekEndDate);
    }
    //获得本月的开始日期   
    function getMonthStartDate() {
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return formatDate(monthStartDate);
    }
    //获得本月的结束日期   
    function getMonthEndDate() {
        var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
        return formatDateEnd(monthEndDate);
    }
    //上半月
    function getHalfMonthEndDate() {
        var monthEndDate = new Date(nowYear, nowMonth, Math.ceil(getMonthDays(nowMonth) / 2));
        return formatDate(monthEndDate);
    }
    //上半月结束
    function getHalfMonthStartDate(day) {
        var monthEndDate = new Date(nowYear, nowMonth, day);
        return formatDateEnd(monthEndDate);
    }
    //下半月开始
    function getHalfMonthStartDates(day) {
        var monthEndDate = new Date(nowYear, nowMonth, day);
        return formatDate(monthEndDate);
    }
    //获得上月开始时间   
    function getLastMonthStartDate() {
        var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return formatDate(lastMonthStartDate);
    }
    //获得上月结束时间   
    function getLastMonthEndDate() {
        var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
        return formatDateEnd(lastMonthEndDate);
    }

    var start = $('#datebegin');
    var end = $('#dateend');
 

    $(document).on('click', '[data-time]', function() {
        if ($(this).hasClass('active')) return;
        $('[data-time]').removeClass('active');
        $(this).addClass('active');
        var key = $(this).attr('data-time');
        switch (key) {
            case "0": //今日 
                start.val(formatDate(now));
                end.val(formatDateEnd(now));
                break;
            case "1": //上周
                start.val(getLastWeekStartDate());
                end.val(getLastWeekEndDate());
                break;
            case "2": //本周
                start.val(getWeekStartDate());
                end.val(getWeekEndDate());
                break;
            case "3": //本月
                start.val(getMonthStartDate());
                end.val(getMonthEndDate());
                break;
            case "4": //上半月
                start.val(getMonthStartDate());
                end.val(getHalfMonthStartDate(15));
                break;
            case "5": //下半月
                start.val(getHalfMonthStartDates(16));
                end.val(getMonthEndDate());
                break;
        }
    });

}

function  registerTeamUserSelect(option){
     var selector = option.selector || '.icon-users';
     var searchUserId = option.searchUserId || 'searchUserId';
     var searchUser = option.searchUser || 'searchUser';
    $(document).on('click',selector,function(){
        $('#teamUserSelectWin').show();
    });

    // 选中收款人
    $(document).on('click', 'input[name="transfer-user"]',function() {
        var $me = $(this),
            id = $me.data('id'),
            name = $me.siblings('span').text();
            $('#'+searchUserId).val(id);
            $('#'+searchUser).val(name);
        $('#teamUserSelectWin').hide();
    });

    $(document).on('click','#teamUserSelectWin .pop-close',function(){
        $('#teamUserSelectWin').hide();
    });

    // 筛选
    $(document).on('keyup', '#J-search-btn', function() {
        var val = $(this).val(),
            $lis = $('.transfer-panel:visible').find('li'),
            $f = $lis.filter(':contains("' + val + '")');
        if (val) {
            $lis.hide();
            $f.show();
            if (!$f.length) {
                $('.transfer-filter-info').html('没有符合<span class="c-red">' + val + '</span>的用户名').show();
            } else {
                $('.transfer-filter-info').hide();
            }
        } else {
            $('.transfer-filter-info').hide();
            $lis.show();
        }
    });
    // ajaxData({
    //     url: getWebsiteOfHost() + "?action=getChildren&terminal_id=" + terminal_id,
    //     successCallback: function(data) {
    //         doTrender({
    //             container: 'body',
    //             tmplObj: '#teamUserSelectTpl',
    //             data: {
    //                 data: data
    //             },
    //             needClear: false,
    //             prependDom: false
    //         });
    //     }
    // });

 

}

function bankSelectorData(){
    var selectorData={"1":{"id":1,"name":"\u5317\u4eac","children":[{"id":35,"name":"\u4e1c\u57ce\u533a"},{"id":36,"name":"\u897f\u57ce\u533a"},{"id":38,"name":"\u671d\u9633\u533a"},{"id":39,"name":"\u6d77\u6dc0\u533a"},{"id":40,"name":"\u4e30\u53f0\u533a"},{"id":41,"name":"\u77f3\u666f\u5c71\u533a"},{"id":42,"name":"\u95e8\u5934\u6c9f\u533a"},{"id":43,"name":"\u623f\u5c71\u533a"},{"id":44,"name":"\u901a\u5dde\u533a"},{"id":45,"name":"\u987a\u4e49\u533a"},{"id":46,"name":"\u660c\u5e73\u533a"},{"id":47,"name":"\u5927\u5174\u533a"},{"id":48,"name":"\u5e73\u8c37\u533a"},{"id":49,"name":"\u6000\u67d4\u533a"},{"id":50,"name":"\u5bc6\u4e91\u53bf"},{"id":51,"name":"\u5ef6\u5e86\u53bf"}]},"2":{"id":2,"name":"\u4e0a\u6d77","children":[{"id":140,"name":"\u9ec4\u6d66\u533a"},{"id":141,"name":"\u5362\u6e7e\u533a"},{"id":142,"name":"\u5f90\u6c47\u533a"},{"id":143,"name":"\u957f\u5b81\u533a"},{"id":144,"name":"\u9759\u5b89\u533a"},{"id":145,"name":"\u666e\u9640\u533a"},{"id":146,"name":"\u95f8\u5317\u533a"},{"id":147,"name":"\u8679\u53e3\u533a"},{"id":148,"name":"\u6768\u6d66\u533a"},{"id":149,"name":"\u5b9d\u5c71\u533a"},{"id":150,"name":"\u95f5\u884c\u533a"},{"id":151,"name":"\u5609\u5b9a\u533a"},{"id":152,"name":"\u6d66\u4e1c\u65b0\u533a"},{"id":153,"name":"\u677e\u6c5f\u533a"},{"id":154,"name":"\nn\u91d1\u5c71\u533a"},{"id":155,"name":"\u9752\u6d66\u533a"},{"id":156,"name":"\u5357\u6c47\u533a"},{"id":157,"name":"\u5949\u8d24\u533a"},{"id":158,"name":"\u5d07\u660e\u53bf"}]},"3":{"id":3,"name":"\u5929\u6d25","children":[{"id":52,"name":"\u548c\u5e73\u533a"},{"id":53,"name":"\u6cb3\u4e1c\u533a"},{"id":54,"name":"\u6cb3\u897f\u533a"},{"id":55,"name":"\u5357\u5f00\u533a"},{"id":56,"name":"\u6cb3\u5317\u533a"},{"id":57,"name":"\u7ea2\u6865\u533a"},{"id":58,"name":"\u5858\u6cbd\u533a"},{"id":59,"name":"\u6c49\u6cbd\u533a"},{"id":60,"name":"\u5927\u6e2f\u533a"},{"id":61,"name":"\u4e1c\u4e3d\u533a"},{"id":62,"name":"\u897f\u9752\u533a"},{"id":63,"name":"\u5317\u8fb0\u533a"},{"id":64,"name":"\u6d25\u5357\u533a"},{"id":65,"name":"\u6b66\u6e05\u533a"},{"id":66,"name":"\u9759\u6d77\u53bf"},{"id":67,"name":"\u5b81\u6cb3\u53bf"},{"id":68,"name":"\u5b9d\u577b\u533a"},{"id":69,"name":"\u84df\u53bf"}]},"4":{"id":4,"name":"\u91cd\u5e86","children":[{"id":337,"name":"\u6e1d\u4e2d\u533a"},{"id":338,"name":"\u5927\u6e21\u53e3"},{"id":339,"name":"\u6c5f\u5317\u533a"},{"id":340,"name":"\u6c99\u576a\u575d"},{"id":341,"name":"\u4e5d\u9f99\u5761"},{"id":342,"name":"\u5357\u5cb8\u533a"},{"id":343,"name":"\u5317\u789a\u533a"},{"id":344,"name":"\u4e07\u76db\u533a"},{"id":345,"name":"\u53cc\u6865\u533a"},{"id":346,"name":"\u6e1d\u5317\u533a"},{"id":347,"name":"\u5df4\u5357\u533a"},{"id":348,"name":"\u4e07\u5dde\u533a"},{"id":349,"name":"\u6daa\u9675\u533a"},{"id":350,"name":"\u9ed4\u6c5f\u533a"},{"id":351,"name":"\u6c38\u5ddd\u533a"},{"id":352,"name":"\u5408\u5ddd\u533a"},{"id":353,"name":"\u6c5f\u6d25\u533a"},{"id":354,"name":"\u5357\u5ddd\u533a"},{"id":355,"name":"\u957f\u5bff\u53bf"},{"id":356,"name":"\u7da6\u6c5f\u53bf"},{"id":357,"name":"\u6f7c\u5357\u53bf"},{"id":358,"name":"\u8363\u660c\u53bf"},{"id":359,"name":"\u74a7\u5c71\u53bf"},{"id":360,"name":"\u5927\u8db3\u53bf"},{"id":361,"name":"\u94dc\u6881\u53bf"},{"id":362,"name":"\u6881\u5e73\u53bf"},{"id":363,"name":"\u57ce\u53e3\u53bf"},{"id":364,"name":"\u57ab\u6c5f\u53bf"},{"id":365,"name":"\u6b66\u9686\u53bf"},{"id":366,"name":"\u4e30\u90fd\u53bf"},{"id":367,"name":"\u5949\u8282\u53bf"},{"id":368,"name":"\u5f00\u53bf"},{"id":369,"name":"\u4e91\u9633\u53bf"},{"id":370,"name":"\u5fe0\u53bf"},{"id":371,"name":"\u5deb\u6eaa\u53bf"},{"id":372,"name":"\u5deb\u5c71\u53bf"},{"id":373,"name":"\u77f3\u67f1\u53bf"},{"id":374,"name":"\u79c0\u5c71\u53bf"},{"id":375,"name":"\u9149\u9633\u53bf"},{"id":376,"name":"\u5f6d\u6c34\u53bf"},{"id":489,"name":"\u9ad8\u65b0\u533a"}]},"5":{"id":5,"name":"\u5e7f\u4e1c","children":[{"id":286,"name":"\u5e7f\u5dde"},{"id":287,"name":"\u6df1\u5733"},{"id":288,"name":"\u73e0\u6d77"},{"id":289,"name":"\u6c55\u5934"},{"id":290,"name":"\u97f6\u5173"},{"id":291,"name":"\u6cb3\u6e90"},{"id":292,"name":"\u6885\u5dde"},{"id":293,"name":"\u60e0\u5dde"},{"id":294,"name":"\u6c55\u5c3e"},{"id":295,"name":"\u4e1c\u839e"},{"id":296,"name":"\u4e2d\u5c71"},{"id":297,"name":"\u4f5b\u5c71"},{"id":298,"name":"\u9633\u6c5f"},{"id":299,"name":"\u6e5b\u6c5f"},{"id":300,"name":"\u8302\u540d"},{"id":301,"name":"\u8087\u5e86"},{"id":302,"name":"\u6e05\u8fdc"},{"id":303,"name":"\u6f6e\u5dde"},{"id":304,"name":"\u63ed\u9633"},{"id":305,"name":"\u4e91\u6d6e"},{"id":480,"name":"\u6c5f\u95e8"}]},"6":{"id":6,"name":"\u5e7f\u897f","children":[{"id":306,"name":"\u5357\u5b81"},{"id":307,"name":"\u67f3\u5dde"},{"id":308,"name":"\u6842\u6797"},{"id":309,"name":"\u68a7\u5dde\u5e02"},{"id":310,"name":"\u5317\u6d77"},{"id":311,"name":"\u9632\u57ce\u6e2f"},{"id":312,"name":"\u94a6\u5dde"},{"id":313,"name":"\u8d35\u6e2f"},{"id":314,"name":"\u7389\u6797"},{"id":315,"name":"\u8d3a\u5dde"},{"id":316,"name":"\u767e\u8272"},{"id":317,"name":"\u6cb3\u6c60"},{"id":487,"name":"\u5357\u5b81\u5730\u533a"},{"id":488,"name":"\u67f3\u5dde\u5730\u533a"}]},"7":{"id":7,"name":"\u798f\u5efa","children":[{"id":200,"name":"\u798f\u5dde"},{"id":201,"name":"\u53a6\u95e8"},{"id":202,"name":"\u4e09\u660e"},{"id":203,"name":"\u8386\u7530"},{"id":204,"name":"\u6cc9\u5dde"},{"id":205,"name":"\u6f33\u5dde"},{"id":206,"name":"\u5357\u5e73"},{"id":207,"name":"\u9f99\u5ca9"},{"id":208,"name":"\u5b81\u5fb7"}]},"8":{"id":8,"name":"\u6d59\u6c5f","children":[{"id":172,"name":"\u676d\u5dde"},{"id":173,"name":"\u5b81\u6ce2"},{"id":174,"name":"\u6e29\u5dde"},{"id":175,"name":"\u5609\u5174"},{"id":176,"name":"\u6e56\u5dde"},{"id":177,"name":"\u7ecd\u5174"},{"id":178,"name":"\u91d1\u534e"},{"id":179,"name":"\u8862\u5dde"},{"id":180,"name":"\u821f\u5c71"},{"id":181,"name":"\u53f0\u5dde"},{"id":182,"name":"\u4e3d\u6c34"}]},"9":{"id":9,"name":"\u6c5f\u82cf","children":[{"id":159,"name":"\u5357\u4eac"},{"id":160,"name":"\u5f90\u5dde"},{"id":161,"name":"\u8fde\u4e91\u6e2f"},{"id":162,"name":"\u6dee\u5b89"},{"id":163,"name":"\u5bbf\u8fc1"},{"id":164,"name":"\u76d0\u57ce"},{"id":165,"name":"\u626c\u5dde"},{"id":166,"name":"\u6cf0\u5dde"},{"id":167,"name":"\u5357\u901a"},{"id":168,"name":"\u9547\u6c5f"},{"id":169,"name":"\u5e38\u5dde"},{"id":170,"name":"\u65e0\u9521"},{"id":171,"name":"\u82cf\u5dde"}]},"10":{"id":10,"name":"\u5c71\u4e1c","children":[{"id":220,"name":"\u6d4e\u5357"},{"id":221,"name":"\u9752\u5c9b"},{"id":222,"name":"\u6dc4\u535a"},{"id":223,"name":"\u67a3\u5e84"},{"id":224,"name":"\u4e1c\u8425"},{"id":225,"name":"\u6f4d\u574a"},{"id":226,"name":"\u70df\u53f0"},{"id":227,"name":"\u5a01\u6d77"},{"id":228,"name":"\u6d4e\u5b81"},{"id":229,"name":"\u6cf0\u5b89"},{"id":230,"name":"\u65e5\u7167"},{"id":231,"name":"\u83b1\u829c"},{"id":232,"name":"\u5fb7\u5dde"},{"id":233,"name":"\u4e34\u6c82"},{"id":234,"name":"\u804a\u57ce"},{"id":235,"name":"\u83cf\u6cfd"},{"id":236,"name":"\u6ee8\u5dde"}]},"11":{"id":11,"name":"\u5c71\u897f","children":[{"id":81,"name":"\u592a\u539f"},{"id":82,"name":"\u5927\u540c"},{"id":83,"name":"\u9633\u6cc9"},{"id":84,"name":"\u957f\u6cbb"},{"id":85,"name":"\u664b\u57ce"},{"id":86,"name":"\u6714\u5dde"},{"id":87,"name":"\u664b\u4e2d"},{"id":88,"name":"\u5ffb\u5dde"},{"id":89,"name":"\u4e34\u6c7e"},{"id":90,"name":"\u8fd0\u57ce"},{"id":91,"name":"\u5415\u6881\u5730\u533a"}]},"12":{"id":12,"name":"\u8fbd\u5b81","children":[{"id":104,"name":"\u6c88\u9633"},{"id":105,"name":"\u5927\u8fde"},{"id":106,"name":"\u978d\u5c71"},{"id":107,"name":"\u629a\u987a"},{"id":108,"name":"\u672c\u6eaa"},{"id":109,"name":"\u4e39\u4e1c"},{"id":110,"name":"\u9526\u5dde"},{"id":111,"name":"\u846b\u82a6\u5c9b"},{"id":112,"name":"\u8425\u53e3"},{"id":113,"name":"\u76d8\u9526"},{"id":114,"name":"\u961c\u65b0"},{"id":115,"name":"\u8fbd\u9633"},{"id":116,"name":"\u94c1\u5cad"},{"id":117,"name":"\u671d\u9633"}]},"13":{"id":13,"name":"\u5409\u6797","children":[{"id":118,"name":"\u957f\u6625"},{"id":119,"name":"\u5409\u6797\u5e02"},{"id":120,"name":"\u56db\u5e73"},{"id":121,"name":"\u8fbd\u6e90"},{"id":122,"name":"\u901a\u5316"},{"id":123,"name":"\u767d\u5c71"},{"id":124,"name":"\u677e\u539f"},{"id":125,"name":"\u767d\u57ce"},{"id":126,"name":"\u5ef6\u8fb9\u81ea\u6cbb\u5dde"}]},"14":{"id":14,"name":"\u9ed1\u9f99\u6c5f","children":[{"id":127,"name":"\u54c8\u5c14\u6ee8"},{"id":128,"name":"\u9f50\u9f50\u54c8\u5c14"},{"id":129,"name":"\u9e64\u5c97"},{"id":130,"name":"\u53cc\u9e2d\u5c71"},{"id":131,"name":"\u9e21\u897f"},{"id":132,"name":"\u5927\u5e86"},{"id":133,"name":"\u4f0a\u6625"},{"id":134,"name":"\u7261\u4e39\u6c5f"},{"id":135,"name":"\u4f73\u6728\u65af"},{"id":136,"name":"\u4e03\u53f0\u6cb3"},{"id":137,"name":"\u9ed1\u6cb3"},{"id":138,"name":"\u7ee5\u5316"},{"id":139,"name":"\u5927\u5174\u5b89\u5cad\u5730\u533a"}]},"15":{"id":15,"name":"\u6cb3\u5317","children":[{"id":70,"name":"\u77f3\u5bb6\u5e84"},{"id":71,"name":"\u5510\u5c71"},{"id":72,"name":"\u79e6\u7687\u5c9b"},{"id":73,"name":"\u90af\u90f8"},{"id":74,"name":"\u90a2\u53f0"},{"id":75,"name":"\u4fdd\u5b9a"},{"id":76,"name":"\u5f20\u5bb6\u53e3"},{"id":77,"name":"\u627f\u5fb7"},{"id":78,"name":"\u6ca7\u5dde"},{"id":79,"name":"\u5eca\u574a"},{"id":80,"name":"\u8861\u6c34"}]},"16":{"id":16,"name":"\u6cb3\u5357","children":[{"id":237,"name":"\u90d1\u5dde"},{"id":238,"name":"\u5f00\u5c01"},{"id":239,"name":"\u6d1b\u9633"},{"id":240,"name":"\u5e73\u9876\u5c71"},{"id":241,"name":"\u7126\u4f5c"},{"id":242,"name":"\u9e64\u58c1"},{"id":243,"name":"\u65b0\u4e61"},{"id":244,"name":"\u5b89\u9633"},{"id":245,"name":"\u6fee\u9633"},{"id":246,"name":"\u8bb8\u660c"},{"id":247,"name":"\u6f2f\u6cb3"},{"id":248,"name":"\u4e09\u95e8\u5ce1"},{"id":249,"name":"\u5357\u9633"},{"id":250,"name":"\u5546\u4e18"},{"id":251,"name":"\u4fe1\u9633"},{"id":252,"name":"\u5468\u53e3"},{"id":253,"name":"\u9a7b\u9a6c\u5e97"},{"id":254,"name":"\u6d4e\u6e90"}]},"17":{"id":17,"name":"\u56db\u5ddd","children":[{"id":377,"name":"\u6210\u90fd"},{"id":378,"name":"\u81ea\u8d21"},{"id":379,"name":"\u6500\u679d\u82b1"},{"id":380,"name":"\u6cf8\u5dde"},{"id":381,"name":"\u5fb7\u9633"},{"id":382,"name":"\u7ef5\u9633"},{"id":383,"name":"\u5e7f\u5143"},{"id":384,"name":"\u9042\u5b81"},{"id":385,"name":"\u5185\u6c5f"},{"id":386,"name":"\u4e50\u5c71"},{"id":387,"name":"\u5357\u5145"},{"id":388,"name":"\u5b9c\u5bbe"},{"id":389,"name":"\u5e7f\u5b89"},{"id":390,"name":"\u8fbe\u5dde"},{"id":391,"name":"\u5df4\u4e2d"},{"id":392,"name":"\u96c5\u5b89"},{"id":393,"name":"\u7709\u5c71"},{"id":394,"name":"\u8d44\u9633"},{"id":395,"name":"\u963f\u575d\u81ea\u6cbb\u5dde"},{"id":396,"name":"\u7518\u5b5c\u81ea\u6cbb\u5dde"},{"id":397,"name":"\u51c9\u5c71\u81ea\u6cbb\u5dde"}]},"18":{"id":18,"name":"\u9655\u897f","children":[{"id":430,"name":"\u897f\u5b89"},{"id":431,"name":"\u94dc\u5ddd"},{"id":432,"name":"\u5b9d\u9e21"},{"id":433,"name":"\u54b8\u9633"},{"id":434,"name":"\u6e2d\u5357"},{"id":435,"name":"\u5ef6\u5b89"},{"id":436,"name":"\u6c49\u4e2d"},{"id":437,"name":"\u6986\u6797"},{"id":438,"name":"\u5b89\u5eb7"},{"id":439,"name":"\u5546\u6d1b\u5730\u533a"}]},"19":{"id":19,"name":"\u6e56\u5317","children":[{"id":255,"name":"\u6b66\u6c49"},{"id":256,"name":"\u9ec4\u77f3"},{"id":257,"name":"\u8944\u6a0a"},{"id":258,"name":"\u5341\u5830"},{"id":259,"name":"\u8346\u5dde"},{"id":260,"name":"\u5b9c\u660c"},{"id":261,"name":"\u8346\u95e8"},{"id":262,"name":"\u9102\u5dde"},{"id":263,"name":"\u5b5d\u611f"},{"id":264,"name":"\u9ec4\u5188"},{"id":265,"name":"\u54b8\u5b81"},{"id":266,"name":"\u968f\u5dde"},{"id":267,"name":"\u6069\u65bd\u81ea\u6cbb\u5dde"},{"id":268,"name":"\u4ed9\u6843"},{"id":269,"name":"\u5929\u95e8"},{"id":270,"name":"\u6f5c\u6c5f"},{"id":271,"name":"\u795e\u519c\u67b6\u6797\u533a"},{"id":483,"name":"\u9ec4\u5c97"}]},"20":{"id":20,"name":"\u6e56\u5357","children":[{"id":272,"name":"\u957f\u6c99"},{"id":273,"name":"\u682a\u6d32"},{"id":274,"name":"\u6e58\u6f6d"},{"id":275,"name":"\u8861\u9633"},{"id":276,"name":"\u90b5\u9633"},{"id":277,"name":"\u5cb3\u9633"},{"id":278,"name":"\u5e38\u5fb7"},{"id":279,"name":"\u5f20\u5bb6\u754c"},{"id":280,"name":"\u76ca\u9633"},{"id":281,"name":"\u90f4\u5dde"},{"id":282,"name":"\u6c38\u5dde"},{"id":283,"name":"\u6000\u5316"},{"id":284,"name":"\u5a04\u5e95"},{"id":285,"name":"\u6e58\u897f\u81ea\u6cbb\u5dde"}]},"21":{"id":21,"name":"\u6c5f\u897f","children":[{"id":209,"name":"\u5357\u660c"},{"id":210,"name":"\u666f\u5fb7\u9547"},{"id":211,"name":"\u840d\u4e61"},{"id":212,"name":"\u65b0\u4f59"},{"id":213,"name":"\u4e5d\u6c5f"},{"id":214,"name":"\u9e70\u6f6d"},{"id":215,"name":"\u8d63\u5dde"},{"id":216,"name":"\u5409\u5b89"},{"id":217,"name":"\u5b9c\u6625"},{"id":218,"name":"\u4e0a\u9976"},{"id":219,"name":"\u629a\u5dde"}]},"22":{"id":22,"name":"\u4e91\u5357","children":[{"id":407,"name":"\u6606\u660e"},{"id":408,"name":"\u66f2\u9756"},{"id":409,"name":"\u7389\u6eaa"},{"id":410,"name":"\u4fdd\u5c71"},{"id":411,"name":"\u662d\u901a"},{"id":412,"name":"\u666e\u6d31\u5e02"},{"id":413,"name":"\u4e34\u6ca7\u5730\u533a"},{"id":414,"name":"\u4e3d\u6c5f"},{"id":415,"name":"\u6587\u5c71\u81ea\u6cbb\u5dde"},{"id":416,"name":"\u7ea2\u6cb3\u81ea\u6cbb\u5dde"},{"id":417,"name":"\u897f\u53cc\u7248\u7eb3\u81ea\u6cbb\u5dde"},{"id":418,"name":"\u695a\u96c4\u81ea\u6cbb\u5dde"},{"id":419,"name":"\u5927\u7406"},{"id":420,"name":"\u5fb7\u5b8f\u81ea\u6cbb\u5dde"},{"id":421,"name":"\u6012\u6c5f\u81ea\u6cbb\u5dde"},{"id":422,"name":"\u8fea\u5e86\u81ea\u6cbb\u5dde"}]},"23":{"id":23,"name":"\u5b89\u5fbd","children":[{"id":183,"name":"\u5408\u80a5"},{"id":184,"name":"\u829c\u6e56"},{"id":185,"name":"\u868c\u57e0"},{"id":186,"name":"\u6dee\u5357"},{"id":187,"name":"\u9a6c\u978d\u5c71"},{"id":188,"name":"\u6dee\u5317"},{"id":189,"name":"\u94dc\u9675"},{"id":190,"name":"\u5b89\u5e86"},{"id":191,"name":"\u9ec4\u5c71"},{"id":192,"name":"\u6ec1\u5dde"},{"id":193,"name":"\u961c\u9633"},{"id":194,"name":"\u5bbf\u5dde"},{"id":195,"name":"\u5de2\u6e56"},{"id":196,"name":"\u516d\u5b89"},{"id":197,"name":"\u6beb\u5dde"},{"id":198,"name":"\u5ba3\u57ce"},{"id":199,"name":"\u6c60\u5dde"}]},"24":{"id":24,"name":"\u6d77\u5357","children":[{"id":318,"name":"\u6d77\u53e3"},{"id":319,"name":"\u4e09\u4e9a"},{"id":320,"name":"\u4e94\u6307\u5c71"},{"id":321,"name":"\u743c\u6d77"},{"id":322,"name":"\u510b\u5dde"},{"id":324,"name":"\u6587\u660c"},{"id":325,"name":"\u4e07\u5b81"},{"id":326,"name":"\u4e1c\u65b9"},{"id":327,"name":"\u6f84\u8fc8\u53bf"},{"id":328,"name":"\u5b89\u5b9a\u53bf"},{"id":329,"name":"\u5c6f\u660c\u53bf"},{"id":330,"name":"\u4e34\u9ad8\u53bf"},{"id":331,"name":"\u767d\u6c99\u81ea\u6cbb\u53bf"},{"id":332,"name":"\u660c\u6c5f\u81ea\u6cbb\u53bf"},{"id":333,"name":"\u4e50\u4e1c\u81ea\u6cbb\u53bf"},{"id":334,"name":"\u9675\u6c34\u81ea\u6cbb\u53bf"},{"id":335,"name":"\u4fdd\u4ead\u81ea\u6cbb\u53bf"},{"id":336,"name":"\u743c\u4e2d\u81ea\u6cbb\u53bf"}]},"25":{"id":25,"name":"\u8d35\u5dde","children":[{"id":398,"name":"\u8d35\u9633"},{"id":399,"name":"\u516d\u76d8\u6c34"},{"id":400,"name":"\u9075\u4e49"},{"id":401,"name":"\u5b89\u987a"},{"id":402,"name":"\u94dc\u4ec1\u5730\u533a"},{"id":403,"name":"\u6bd5\u8282\u5730\u533a"},{"id":404,"name":"\u9ed4\u897f\u5357\u81ea\u6cbb\u5dde"},{"id":405,"name":"\u9ed4\u4e1c\u5357\u81ea\u6cbb\u5dde"},{"id":406,"name":"\u9ed4\u5357\u81ea\u6cbb\u5dde"}]},"26":{"id":26,"name":"\u7518\u8083","children":[{"id":440,"name":"\u5170\u5dde"},{"id":441,"name":"\u91d1\u660c"},{"id":442,"name":"\u767d\u94f6"},{"id":443,"name":"\u5929\u6c34"},{"id":444,"name":"\u5609\u5cea\u5173"},{"id":445,"name":"\u5b9a\u897f\u5730\u533a"},{"id":446,"name":"\u5e73\u51c9\u5e02"},{"id":447,"name":"\u5e86\u9633\u5e02"},{"id":448,"name":"\u9647\u5357\u5730\u533a"},{"id":449,"name":"\u6b66\u5a01\u5e02"},{"id":450,"name":"\u5f20\u6396\u5e02"},{"id":451,"name":"\u9152\u6cc9"},{"id":452,"name":"\u7518\u5357\u81ea\u6cbb\u5dde"},{"id":453,"name":"\u4e34\u590f\u81ea\u6cbb\u5dde"}]},"27":{"id":27,"name":"\u65b0\u7586","children":[{"id":465,"name":"\u4e4c\u9c81\u6728\u9f50"},{"id":466,"name":"\u514b\u62c9\u739b\u4f9d"},{"id":467,"name":"\u77f3\u6cb3\u5b50"},{"id":468,"name":"\u5410\u9c81\u756a"},{"id":469,"name":"\u54c8\u5bc6\u5730\u533a"},{"id":470,"name":"\u548c\u7530\u5730\u533a"},{"id":471,"name":"\u963f\u514b\u82cf\u5730\u533a"},{"id":472,"name":"\u5580\u4ec0\u5730\u533a"},{"id":473,"name":"\u514b\u5b5c\u52d2\u82cf\u67ef\u5c14\u514b\u5b5c\u81ea\u6cbb"},{"id":474,"name":"\u5df4\u97f3\u90ed\u695e\u81ea\u6cbb\u5dde"},{"id":475,"name":"\u660c\u5409\u81ea\u6cbb\u5dde"},{"id":476,"name":"\u535a\u5c14\u5854\u62c9\u81ea\u6cbb\u5dde"},{"id":477,"name":"\u4f0a\u7281\u81ea\u6cbb\u5dde"},{"id":481,"name":"\u4f0a\u5b81"}]},"28":{"id":28,"name":"\u5185\u8499\u53e4","children":[{"id":92,"name":"\u547c\u548c\u6d69\u7279"},{"id":93,"name":"\u5305\u5934"},{"id":94,"name":"\u4e4c\u6d77"},{"id":95,"name":"\u8d64\u5cf0"},{"id":96,"name":"\u901a\u8fbd"},{"id":97,"name":"\u4e4c\u5170\u5bdf\u5e03"},{"id":98,"name":"\u9521\u6797\u90ed\u52d2\u76df"},{"id":99,"name":"\u4e4c\u5170\u5bdf\u5e03\u76df"},{"id":100,"name":"\u9102\u5c14\u591a\u65af\u5e02"},{"id":101,"name":"\u5df4\u5f66\u6dd6\u5c14\u76df"},{"id":102,"name":"\u963f\u62c9\u5584"},{"id":103,"name":"\u5174\u5b89"}]},"29":{"id":29,"name":"\u5b81\u590f","children":[{"id":461,"name":"\u94f6\u5ddd"},{"id":462,"name":"\u77f3\u5634\u5c71"},{"id":463,"name":"\u5434\u5fe0"},{"id":464,"name":"\u56fa\u539f"}]},"30":{"id":30,"name":"\u9752\u6d77","children":[{"id":454,"name":"\u897f\u5b81"},{"id":455,"name":"\u6d77\u4e1c\u5730\u533a"},{"id":456,"name":"\u6d77\u5317\u81ea\u6cbb\u5dde"},{"id":457,"name":"\u6d77\u5357\u81ea\u6cbb\u5dde"},{"id":458,"name":"\u679c\u6d1b\u81ea\u6cbb\u5dde"},{"id":459,"name":"\u7389\u6811\u81ea\u6cbb\u5dde"},{"id":460,"name":"\u6d77\u897f\u81ea\u6cbb\u5dde"},{"id":484,"name":"\u9ec4\u5357\u81ea\u6cbb\u5dde"}]},"31":{"id":31,"name":"\u897f\u85cf","children":[{"id":423,"name":"\u62c9\u8428"},{"id":424,"name":"\u90a3\u66f2"},{"id":425,"name":"\u660c\u90fd\u5730\u533a"},{"id":426,"name":"\u5c71\u5357\u5730\u533a"},{"id":427,"name":"\u65e5\u5580\u5219"},{"id":428,"name":"\u963f\u91cc\u5730\u533a"},{"id":429,"name":"\u6797\u829d\u5730\u533a"}]},"32":{"id":32,"name":"\u9999\u6e2f","children":[{"id":478,"name":"\u4e2d\u897f\u533a"},{"id":493,"name":"\u4e1c\u533a"},{"id":494,"name":"\u4e5d\u9f99\u57ce\u533a"},{"id":495,"name":"\u89c2\u5858\u533a"},{"id":496,"name":"\u5357\u533a"},{"id":497,"name":"\u6df1\u6c34\u57d7\u533a"},{"id":498,"name":"\u6e7e\u4ed4\u533a"},{"id":499,"name":"\u9ec4\u5927\u4ed9\u533a"},{"id":500,"name":"\u6cb9\u5c16\u65fa\u533a"},{"id":501,"name":"\u79bb\u5c9b\u533a"},{"id":502,"name":"\u8475\u9752\u533a"},{"id":503,"name":"\u5317\u533a"},{"id":504,"name":"\u897f\u8d21\u533a"},{"id":505,"name":"\u6c99\u7530\u533a"},{"id":506,"name":"\u5c6f\u95e8\u533a"},{"id":507,"name":"\u5927\u57d4\u533a"},{"id":508,"name":"\u8343\u6e7e\u533a"},{"id":509,"name":"\u5143\u6717\u533a"}]},"33":{"id":33,"name":"\u6fb3\u95e8","children":[]},"34":{"id":34,"name":"\u53f0\u6e7e","children":[{"id":491,"name":"\u53f0\u5317\u5e02"},{"id":510,"name":"\u9ad8\u96c4\u5e02"},{"id":511,"name":"\u57fa\u9686\u5e02"},{"id":512,"name":"\u53f0\u4e2d\u5e02"},{"id":513,"name":"\u53f0\u5357\u5e02"},{"id":514,"name":"\u65b0\u7af9\u5e02"},{"id":515,"name":"\u5609\u4e49\u5e02"},{"id":516,"name":"\u53f0\u5317\u53bf"},{"id":517,"name":"\u5b9c\u5170\u53bf"},{"id":518,"name":"\u65b0\u7af9\u53bf"},{"id":519,"name":"\u6843\u56ed\u53bf"},{"id":520,"name":"\u82d7\u6817\u53bf"},{"id":521,"name":"\u53f0\u4e2d\u53bf"},{"id":522,"name":"\u5f70\u5316\u53bf"},{"id":523,"name":"\u5357\u6295\u53bf"},{"id":524,"name":"\u5609\u4e49\u53bf"},{"id":525,"name":"\u4e91\u6797\u53bf"},{"id":526,"name":"\u53f0\u5357\u53bf"},{"id":527,"name":"\u9ad8\u96c4\u53bf"},{"id":528,"name":"\u5c4f\u4e1c\u53bf"},{"id":529,"name":"\u53f0\u4e1c\u53bf"},{"id":530,"name":"\u82b1\u83b2\u53bf"},{"id":531,"name":"\u6f8e\u6e56\u53bf"}]}};
    return selectorData;
}


