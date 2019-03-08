$(function() {
    $('.img').mySlider({
        imgBox: $('.img'),
        imgIco: $('.ico'),
        active: 'on',
        autoPlay: true,
        interval: 5000,
        speed: 500,
        direction: true
    });

    var width = 0;
    $('.message-wrap').find('li').each(function(index,item){
        width += $(item).width();
    });
    $('.message').width(width+200);
    //消息公告滚动
    $('.notice .message-wrap').liMarquee({
        direction: 'left',
        scrollamount: 40
    });

    var viewmsg = $('.viewmsg');
    //系统通知展现
    $(document).on('click','.notice .message-wrap li',function(){
        //1.设置通知内容
        //2.显示消息窗口
        viewmsg.show();
    });

    animateLottery();


    function animateLottery() {
        var numHeight = 79;
        $(".lotterypool .num").css('backgroundPositionY', 0);
        var lotterNumber = '2388188288';
        var num_arr = lotterNumber.split('');
        $(".lotterypool .num").each(function(index) {
            var _num = $(this);
            setTimeout(function() {
                _num.animate({
                    backgroundPositionY: -(numHeight * num_arr[index])
                }, {
                    duration: 1000 + index * 100,
                    easing: "easeInOutCirc",
                    complete: function() {
                        //if (index == 3) isBegin = false;
                    }
                });
            }, index * 300);
        });
    }

});