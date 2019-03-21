;(function(w,$){

	$.fn.mySider = function(option){
		return new sider(this,option);
	}

	function sider(elements,option){
		this.$eles = elements;
		this.config = {
			'width':'500',
			'height':'300',
			'speed':500
		};
		this.opt = $.extend(true,{},this.config,option);
		return this.init();
	}

	sider.prototype = {
		constructor:sider,
		init:function(){
			var oSider = this;
			return this.$eles.each(function(){
				oSider.initHtml($(this));
				oSider.eventHandel($(this),oSider.opt);
			})
		},
		initHtml:function($ele){
			var $ul = $ele.find("ul");
			var liLen = $ul.find("li").length;
			var $ico = $ele.find(".ico");
			$ele.find(".sider-box-item").css({width:this.opt.width + "px",height:this.opt.height});
			/*添加圆点*/
			for (var j = 0; j < liLen; j++) {
				var a = '<a href="javascript:;"></a>';
				$ico.append(a);
			};
			$ico.find('a').eq(0).addClass('on');
		},
		eventHandel:function($ele,opt){
			var $ul = $ele.find("ul");
			var index = 0;

			$ele.on("click",".sider-box-right",function(){
				if(!$ul.is(":animated")){
					$ul.animate({
						marginLeft:'-' + opt.width
					},opt.speed,function(){
						$ul.css({margin:0}).find(".sider-box-item:first").appendTo($ul);
						var $on = $(".ico .on");
						$on.removeClass('on');
						if($on.next().length != 0){
							$on.next().addClass('on');
						}else{
							$(".ico").find('a').eq(0).addClass('on');
						}
						
					})
				}
				
			})

			$ele.on("click",".sider-box-left",function(){
				$ul.css({marginLeft:"-" + opt.width + 'px'}).find(".sider-box-item:last").prependTo($ul);
				if(!$ul.is(":animated")){
					$ul.animate({
						marginLeft:0
					},opt.speed,function(){
						var $on = $(".ico .on");
						$on.removeClass('on');
						if($on.prev().length != 0){
							$on.prev().addClass('on');
						}else{
							$(".ico").find('a').eq($(".ico").find('a').length - 1).addClass('on');
						}
					})
				}
				
			})

			$ele.on("click","a",function(){
				if(!$ul.is(':animated')){
					$(this).addClass("on").siblings().removeClass("on");
					var index=$(this).index();
					i=index;
					$ul.stop().animate({
						marginLeft: -index*opt.width + "px"
					},opt.speed);
				}
			})
		}
	}
})(window,jQuery)