(function(root,factory,plug){
    factory(root.jQuery,plug);
})(window,function($,plug){
    var GesturePasswd= function (element, options) {
        this.$element	= $(element);
        this.options	= options;
        var that=this;
        this.pr=options.pointRadii;
        this.rr=options.roundRadii;
        this.o=options.space;
        this.color=options.color;
        //全局样式
        this.$element.css({
            "position":"relative",
            "width":this.options.width,
            "height":this.options.height,
            "background-image":options.backgroundImage,
            "overflow":"hidden",
            "cursor":"default"
        });
        this.id="#"+$(element).attr("id");
        //记录点的构造函数
        var Point = function (x,y){
            this.x  =x;this.y=y
        };
        //记录密码结果
        this.result="";
        //记录所有的点
        this.pList=[];
        //记录已经经过了的点
        this.sList=[];
        this.$element.prepend('<canvas class="main-c" width="'+options.width+'" height="'+options.height+'" >');
        this.$c= $(this.id+" .main-c")[0];
        this.$ctx=this.$c.getContext('2d');
        //画基本图形
        this.initDraw=function(){
            this.$ctx.strokeStyle=this.color;
            this.$ctx.lineWidth=2;
            for(var j=0; j<3;j++ ){
                for(var i =0;i<3;i++){
                    this.$ctx.moveTo(this.o*1.5+this.rr*2+i*(this.o+2*this.rr),this.o*1.5+this.rr+j*(this.o+2*this.rr));
                    this.$ctx.arc(this.o*1.5+this.rr+i*(this.o+2*this.rr),this.o*1.5+this.rr+j*(this.o+2*this.rr),this.rr,0,2*Math.PI);
                    var tem=new Point(this.o*1.5+this.rr+i*(this.o+2*this.rr),this.o*1.5+this.rr+j*(this.o+2*this.rr));
                    if (that.pList.length < 9)
                        this.pList.push(tem);
                }
            }
            this.$ctx.stroke();
            this.initImg=this.$ctx.getImageData(0,0,this.options.width,this.options.height);
        };
        this.initDraw();
        //this.$ctx.stroke();
        //判断是否经过图上的九个点，是则返回该店
        this.isIn=function(x,y){

            for (var p in that.pList){
                //console.log(that.pList[p][x]);
                //  console.log(( Math.pow((x-that.pList[p][x]),2)+Math.pow((y-that.pList[p][y]),2)));
                if(( Math.pow((x-that.pList[p]["x"]),2)+Math.pow((y-that.pList[p]["y"]),2) ) < Math.pow(this.rr,2)){
                    return that.pList[p];
                }
            }
            return 0;
        };
        //画已经经过了的点
        this.pointDraw =function(c){
            if (arguments.length>0){
                that.$ctx.strokeStyle=c;
                that.$ctx.fillStyle=c;
            }
            //画出sList中存在的店
            for (var p in that.sList){
                that.$ctx.moveTo(that.sList[p]["x"]+that.pr,that.sList[p]["y"]);
                that.$ctx.arc(that.sList[p]["x"],that.sList[p]["y"],that.pr,0,2*Math.PI);
                that.$ctx.fill();
            }
        };
        //画已经有的线
        this.lineDraw=function (c){
            if (arguments.length>0){
                that.$ctx.strokeStyle=c;
                that.$ctx.fillStyle=c;
            }
            if(that.sList.length > 0){
                for( var p in that.sList){
                    //依次画线
                    if(p == 0){
                        // console.log(that.sList[p]["x"],that.sList[p]["y"]);
                        that.$ctx.moveTo(that.sList[p]["x"],that.sList[p]["y"]);
                        continue;
                    }
                    that.$ctx.lineTo(that.sList[p]["x"],that.sList[p]["y"]);
                    // console.log(that.sList[p]["x"],that.sList[p]["y"]);
                }

            }
        };
        //这里设置传参是因为错误失败可能颜色会不相同
        this.allDraw =function(r,l){
            if (arguments.length>0){
                this.pointDraw(r);
                this.lineDraw(l);
                that.$ctx.stroke();
            }
            else {
                this.pointDraw();
                this.lineDraw();
            }
        };
        //
        this.draw=function(x,y){
            that.$ctx.clearRect(0,0,that.options.width,that.options.height);
            that.$ctx.beginPath();
            //that.initDraw();
            that.$ctx.putImageData(this.initImg,0,0);
            that.$ctx.lineWidth=4;
            that.pointDraw(that.options.roundColor);
            that.lineDraw(that.options.lineColor);
            that.$ctx.lineTo(x,y);
            that.$ctx.stroke();
        };


        //在list中找点，有则返回位置，无则返回false
        this.pointInList=function(poi,list){
            for (var p in list){
                if( poi["x"] == list[p]["x"] && poi["y"] == list[p]["y"]){
                    return ++p;
                }
            }
            return false;
        };
        //默认touch为false
        this.touched=false;
        $(this.id).on ("mousedown touchstart",{that:that},function(e){
            e.data.that.touched=true;
        });
        $(this.id).on ("mouseup touchend",{that:that},function(e){
            e.data.that.touched=false;
            that.$ctx.clearRect(0,0,that.options.width,that.options.height);
            that.$ctx.beginPath();
            that.$ctx.putImageData(e.data.that.initImg,0,0);
            that.allDraw(that.options.roundColor,that.options.lineColor);
            // that.$ctx.stroke();
            for(var p in that.sList){
                if(e.data.that.pointInList(that.sList[p], e.data.that.pList)){
                    //返回一组数字密码
                    e.data.that.result= e.data.that.result+(e.data.that.pointInList(that.sList[p], e.data.that.pList)).toString();
                }
            }
            if(e.data.that.result.length>=5){
                 $(element).trigger("hasPasswd",that.result);
            }else{
                 $("#message").text('密码太短，至少需要5个点')
                 $("#gesturepwd").trigger("passwdWrong");
            }
        });

        //
        $(this.id).on('touchmove mousemove',{that:that}, function(e) {
            if(e.data.that.touched){
                var x= e.pageX || e.originalEvent.targetTouches[0].pageX ;
                var y = e.pageY || e.originalEvent.targetTouches[0].pageY;
                x=x-that.$element.offset().left;
                y=y-that.$element.offset().top;
                var p = e.data.that.isIn(x, y);
                // console.log(x)
                if(p != 0 ){
                    //如果sList中不存在p这个点，则添加这个点
                    if ( !e.data.that.pointInList(p,e.data.that.sList)){
                        e.data.that.sList.push(p);
                    }
                }

                console.log( e.data.that.sList);
                e.data.that.draw(x, y);
            }

        });



        $(this.id).on('passwdWrong',{that:that}, function(e) {
            that.$ctx.clearRect(0,0,that.options.width,that.options.height);
            that.$ctx.beginPath();
            that.$ctx.putImageData(that.initImg,0,0);
            that.allDraw("#cc1c21");
            that.result="";
            that.pList=[];
            that.sList=[];

            setTimeout(function(){
                that.$ctx.clearRect(0,0,that.options.width,that.options.height);
                that.$ctx.beginPath();
                that.initDraw()
            },500)

        });


        $(this.id).on('passwdRight',{that:that}, function(e) {
            that.$ctx.clearRect(0,0,that.options.width,that.options.height);
            that.$ctx.beginPath();
            that.$ctx.putImageData(that.initImg,0,0);
            that.allDraw("#00a254");
            that.result="";
            that.pList=[];
            that.sList=[];
            setTimeout(function(){
                that.$ctx.clearRect(0,0,that.options.width,that.options.height);
                that.$ctx.beginPath();
                that.initDraw()
            },500)
        });
        $(this.id).on('passwdAgain',{that:that}, function(e) {
            that.result="";
            that.pList=[];
            that.sList=[];
            setTimeout(function(){
                that.$ctx.clearRect(0,0,that.options.width,that.options.height);
                that.$ctx.beginPath();
                that.initDraw()
            },500)
        });
        GesturePasswd.DEFAULTS = {
            backgroundImage:"none",
            color:"#FFFFFF",
            roundRadii:46,
            pointRadii:44,
            space:136,
            width:980,
            height:1400,
            lineColor:"#DF3134",
            roundColor:"#FFA726",
      //       backgroundImage:"url(img/11.jpg)",  //背景色
      // color:"#F7A136",   //主要的控件颜色
      // roundRadii:46,    //大圆点的半径
      // pointRadii:44, //大圆点被选中时显示的圆心的半径
      // space:136,  //大圆点之间的间隙
      // width:980,   //整个组件的宽度
      // height:1600,  //整个组件的高度
      // roundColor:"#FFA726",
      // lineColor:"#DF3134",   //用户划出线条的颜色
        };
    };
    function Plugin(option,arg) {
        return this.each(function () {
            var $this   = $(this);
            var options = $.extend({}, GesturePasswd.DEFAULTS, typeof option == 'object' && option);
            var data    = $this.data('GesturePasswd');
            var action  = typeof option == 'string' ? option : NaN;
            if (!data) $this.data('danmu', (data = new GesturePasswd(this, options)));
            if (action)	data[action](arg);
        })
    }
    $.fn[plug]= Plugin;
},"GesturePasswd");