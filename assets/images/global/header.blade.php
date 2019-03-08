<div id="nav" class="wrap">

    <div class="wrap-inner">
        <div class="nav-top-content">
            <a href="{{ route('home') }}" class="left" id="logo">苹果游戏</a>
            <div class="user-box">
                <div class="user-name"><a href="{{ route('users.user') }}">{{ Session::get('nickname') }}</a></div>
                <div class="user-account-balance">

                    <span class="">
                        <i class="alert-icon" data-tips-top="
                                @foreach($aJCblance as $aBalance)
                                    {{$aBalance['name']}} 余额：¥ {{$aBalance['balance']}} <br />
                                @endforeach
                        "></i>
                    </span>
                    <span class="user-cash balance-a" style="display: inline;">余额：<span data-user-account-balance="" class="num">{{$fAvailable}}</span> 元<i data-refresh-balance=""></i></span>
                    <span style="display: none;" class="balance-b">余额已隐藏</span>
                    <span class="balance-toggle highlight-color">隐藏</span>
                </div>
                <div class="user-btn">
                    <a href="{{ route('user-recharges.quick', $iDefaultPaymentPlatformId) }}" class=" recharge"><i></i> <font>充值</font></a>
                    <a href="{{ route('user-withdrawals.withdraw') }}" class=" withdraw"><i></i> <font>提现</font></a>
                    @if (Session::get('is_agent'))
                    <a href="{{route('transfer.transfer')}}" class=" transfer"><i></i> <font>转账</font></a>
                    @else
                    <a href="{{ route('bank-cards.index') }}" class=" card-manage"><i></i> <font>银行卡</font></a>
                    @endif
                    <a href="{{route('transfer.plat-transfer')}}" class=" transfer"><i></i> <font>频道转账</font></a>
                    <a href="{{ route('station-letters.index') }}" class="messsage"><i></i>  <font>消息</font></a>
                    <a href="{{ route('users.user') }}" class="user-centent"><i></i> <font>个人中心</font> </a>
                </div>
            </div>

        </div>

    </div>
@include('w.nav')
    <div class="nav-game-lists">
        @include('w.lottery-nav')
    </div>
</div>

<script>
    $(function () {
        var $lotteryUrl = '{{URL::full()}}';
        // 游戏大厅下拉
            $('#nav').overdropdown({
                handler: 'li[data-gamelist] > a',
                dropdown: '.nav-game-lists'
            });


        // 下拉水平位置
        // var $lobby = $('#nav .nav-lobby'),
        //         $gameLists = $('.nav-game-lists');
        // $gameLists.css({
        //     marginLeft: ($lobby.offset().left + $lobby.outerWidth() / 2) - $(window).outerWidth() / 2 - $gameLists.outerWidth() / 2
        // });

        // 当前游戏高亮
        $('.list-link-box a').each(function (i) {
            if ($(this).attr('href') == $lotteryUrl) {
                $(this).addClass('active')
            }
            ;
        });

    });
</script>