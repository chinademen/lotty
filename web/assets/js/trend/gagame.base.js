!function(t,e){var n=function(){};t[e]=n}(this,"gagame"),function(t,e,n){var i="beforeInit",o="afterInit",r=function(t,e,r){var r=r||{};if(t.superClass&&t.superClass.defConfig&&(t.defConfig=n.extend({},t.superClass.defConfig,t.defConfig)),r=e.defConfig=n.extend({},t.defConfig,r),r.expands&&n.extend(e,r.expands),t.superClass&&t.superClass.call(e,r),n.isFunction(t.prototype.init)){var a=e.constructor===t;if(a&&n.isFunction(r[i])&&r[i].call(e,r),t.prototype.init.call(e,r),a&&n.isFunction(r[o])&&r[o].call(e,r),a)for(var s=0,f=e._inits.length;f>s;s++)e._inits[s].call(e,e.defConfig)}},a=function(t,e){var i=function(t){var e=this;e._inits=[],r(i,e,t)};if(arguments.length<2)i.prototype=t;else{var o=function(){};o.prototype=e.prototype,i.prototype=new o,n.extend(i.prototype,t),i.superClass=e}return i.prototype.constructor=i,i};t[e]=a}(gagame,"Class",jQuery),function(t,e){var n=function(){this._isStop=!0},i={init:function(){this._events={}},addEvent:function(t,e){if(!e||"[object Function]"!==Object.prototype.toString.call(e))throw"Event.addEvent第二个参数必须是函数";var n=this,i=n._events;i[t]=i[t]||[],i[t].push(e)},removeEvent:function(t,e){var n=this,i=n._events;if(i[t]){if(!e)return void delete i[t];for(var o=i[t],r=o.length;r;)r--,o[r]===e&&o.splice(r,1);o.length||delete i[t]}},fireEvent:function(t){var e=this,i=e._events;if(i[t]){var o=i[t];if(o._isStop)return void delete o._isStop;for(var r=0,a=o.length,s={type:t,data:e,stopEvent:n},f=[s].concat(Array.prototype.slice.call(arguments,1)),r=0;a>r;r++)if(s._isStop||o[r].apply(e,f)===!1)return void(s._isStop=!1)}},stopEvent:function(t){var e=this,n=e._events;n[t]&&(n[t]._isStop=!0)}},o=t.Class(i);t[e]=o}(gagame,"Event"),function(t,e,n,i){var o=function(){};o.win=n(window),o.doc=n(document),o.isIE=!!document.all,o.isIE6=window.ActiveXObject&&6==navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/)[1]?!0:!1,o.toViewCenter=function(t){o.toViewCenter.fn(t),o.win.bind("resize",function(){o.toViewCenter.fn(t)})},o.toViewCenter.fn=function(t){var t=n(t),e=t.width(),i=t.height(),r=o.win.width(),a=o.win.height(),s=o.isIE6?o.win.scrollLeft():0,f=o.isIE6?o.win.scrollTop():0;t.css({left:r/2-e/2+s,top:a/2-i/2+f})},o.startFixed=function(e,i){var r,e=n(e),i=i||500,a=(parseInt(e.css("top")),o.win.scrollTop()),s=a,f=(parseInt(e.css("left")),o.win.scrollLeft()),c=f;return r=function(){var t=e.height(),n=e.width(),i=o.win.width(),r=o.win.height();s=o.win.scrollTop(),c=o.win.scrollLeft(),e.stop(),e.animate({top:r/2-t/2+s},50),a=s,e.animate({left:i/2-n/2+c},50),f=c},new t.Timer({time:i,fn:r})},o.getRandom=function(t,e){return Math.floor(Math.random()*(e-t+1)+t)},o.getByteLen=function(t){return t.replace(/[^\x00-\xff]/g,"xx").length},o.getParam=function(t){var e=new RegExp("(^|\\?|&)"+t+"=([^&]*)(\\s|&|$)","i");return e.test(location.href)?unescape(RegExp.$2.replace(/\+/g," ")):null},o.template=function(t,e){var n,i,o=e;for(n in o)o.hasOwnProperty(n)&&(i=RegExp("<#="+n+"#>","g"),t=t.replace(i,o[n]));return t},o.formatMoney=function(t,e){var t=Number(t),e=e==i||0>e?2:e,n=/(-?\d+)(\d{3})/;for(t=Number.prototype.toFixed?t.toFixed(e):Math.round(t*Math.pow(10,e))/Math.pow(10,e),t=""+t;n.test(t);)t=t.replace(n,"$1,$2");return t},t[e]=o}(gagame,"util",jQuery);