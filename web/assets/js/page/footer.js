$(function() {
    var mask = $('.mask');
    var boxRegister = $('.box-register');
    var infomsg = $('.infomsg');
    var datetimeDom = $('.navtop .datetime');
    //弹出窗口关闭
    $(document).on('click', '.close', function() {
        $(this).parent().hide();
        mask.hide();
    });

    //点击注册
    $(document).on('click', '.navtop .reg', function() {
        mask.show();
        boxRegister.show();
    });

    //注册窗口 表单验证注册 
    var validator = new Validator('register-form', [{
            name: 'register-username',
            display: '此项为必填',
            rules: 'required'
        }, {
            name: 'register-phone',
            display: '此项为必填',
            rules: 'required'
        }, {
            name: 'register-password',
            display: '此项为必填',
            rules: 'required'
        }, {
            name: 'register-repassword',
            display: '此项为必填',
            rules: 'required'
        }, {
            name: 'register-email',
            display: '此项为必填',
            rules: 'required'
        }, {
            name: 'register-code',
            display: '此项为必填',
            rules: 'required'
        }

    ], function(obj, evt) {
        if (obj.errors.length > 0) {
            // 判断是否错误
            alert('请完成必填项填写');
        } else {
            //  //1.验证表单
            //2.如果验证通过,表单提交
            boxRegister.hide();
            infomsg.show();
        }
    });



    //让ie支持placeholder
    $.support.placeholder = ('placeholder' in document.createElement('input'));
    //fix for IE7 and IE8 
    if (!$.support.placeholder) {
        $("[placeholder]").focus(function() {
            if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
        }).blur(function() {
            if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
        }).blur();

        $("[placeholder]").parents("form").submit(function() {
            $(this).find('[placeholder]').each(function() {
                if ($(this).val() == $(this).attr("placeholder")) {
                    $(this).val("");
                }
            });
        });
    }

    //实时显示顶部时间
    setInterval(getCurDate, 1000);

    function getCurDate() {
        var d = new Date();
        var week;
        switch (d.getDay()) {
            case 1:
                week = "星期一";
                break;
            case 2:
                week = "星期二";
                break;
            case 3:
                week = "星期三";
                break;
            case 4:
                week = "星期四";
                break;
            case 5:
                week = "星期五";
                break;
            case 6:
                week = "星期六";
                break;
            default:
                week = "星期天";
        }
        var years = d.getFullYear();
        var month = add_zero(d.getMonth() + 1);
        var days = add_zero(d.getDate());
        var hours = add_zero(d.getHours());
        var minutes = add_zero(d.getMinutes());
        var seconds = add_zero(d.getSeconds());
        var ndate = years + "年" + month + "月" + days + "日 " + hours + ":" + minutes + ":" + seconds + " " + week;
        datetimeDom.html(ndate);
    }

    function add_zero(temp) {
        if (temp < 10) return "0" + temp;
        else return temp;
    }


    //数字输入过滤
    $('.only-input-num').on('keydown', function(event) {
        if (!(event.keyCode == 35) && !(event.keyCode == 36) && !(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39)) {
            if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
                return false;
            }
            /* if ($.trim($(this).val()).length > 5) {
                 return false;
             }*/
        }
    });

  


});