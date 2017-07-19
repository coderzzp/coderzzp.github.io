//假loading
var $loading=$(".loading").eq(0);
var $progressBar=$(".progress-bar");
//设置进度条的函数
var setProgress=function(prg){
	 $progressBar.css("width",prg+"%");
}
var prg=0;
var timer=0;
//下面有过程所解决的三个问题
//1.分两个过程，第二过程(即window.onload之后)开始加速
progress([80,90],[1,3],100)//
window.onload=function(){
//2.设置一个延迟，不然根本还来不及看到100%效果的实现，页面就sildeup了。这里显然应该用一个匿名函数
	progress(100,[1,5],30,function(){setTimeout(function(){
		$loading.slideUp()
	},1000)})
}
//封装后的执行函数
function progress(dist,speed,delay,callback){
	var _dist=random(dist);
	var _delay=random(delay);
	var _speed=random(speed);
	window.clearInterval(timer);
	timer=window.setTimeout(function(){
		if(prg+_speed>=_dist){
			window.clearTimeout(timer)
			prg=_dist;
			callback&&callback()
		}else{
			prg+=_speed
			progress(dist,speed,delay,callback)
		}
		setProgress(parseInt(prg))
		console.log(prg)
	},_delay)
}
//3.随机函数，让进度条保持动态的
function random (n) {
  if (typeof n === 'object') {
    var times = n[1] - n[0]
    var offset = n[0]
    return Math.random() * times + offset
  } else {
    return n
  }
}