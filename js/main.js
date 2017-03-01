//loading
var $loading=$(".loading").eq(0);
var $progressBar=$(".progress-bar");
//设置进度条的函数
var setProgress=function(prg){
	 $progressBar.css("width",prg+"%");
}
var prg=0;
var timer=0;
//设置定时器
// var timer_first=window.setInterval(function(){
// 	if(prg>=80){
// 		window.clearInterval(timer_first);
// 	}	
// 	else{
// 		prg++
// 	}
// 	setProgress(prg)
// },100,10)
// //页面载入后清除
// window.onload=function(){
// 	alert("1")
// 	//先清除第一阶段
// 	window.clearInterval(timer_first);
// 	timer_second=window.setInterval(function(){
// 		if(prg>100){
// 			prg=100;
// 			setProgress(prg)
// 			clearInterval(timer_second)
// 			$loading.hide()
// 		}
// 		else{
// 			prg++
// 			setProgress(prg)
// 		}
// 	},100)
// }
progress(80,100)
window.onload=function(){
	progress(100,80,function(){
		$loading.slideUp()
	})
}
//封装后的执行函数
function progress(dist,delay,callback){
	window.clearInterval(timer)
	timer=window.setInterval(function(){
		if(prg>=dist){
			window.clearInterval(timer)
			prg=dist;
			callback&&callback()
		}
		else{
			prg++
		}
		setProgress(prg)
	},delay)
}