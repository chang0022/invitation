$(function () {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    var scene = document.getElementById('scene');
    var parallax = new Parallax(scene, {
        scalarX: 4,
        scalarY: 6
    });

    $('#J_countdown').countDown({
        targetDate: {
            'day': 5,
            'month': 10,
            'year': 2017,
            'hour': 11,
            'min': 28,
            'sec': 0
        },
        omitWeeks: true
    });
    $('.barrager-item').one(animationEnd, function() {
        console.log(111);
    });


    function Barrager(dom) {
        this.canvas = dom.get(0);
        this.ctx = this.canvas.getContext("2d");
        this.msgs = new Array(300);
        this.width = 1280;//canvas分辨率1280*720
        this.height = 720;
        this.canvas.width=this.width;
        this.canvas.height=this.height;
        this.font = "30px 黑体";
        this.ctx.font=this.font;
        this.colorArr=["Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue"];
        this.interval = "";
        this.draw = function () {
            if (this.interval != "")return;
            var _this=this;
            this.interval = setInterval(function () {
                _this.ctx.clearRect(0, 0, _this.width, _this.height);
                _this.ctx.save();
                for (var i = 0; i < _this.msgs.length; i++) {
                    if (!(_this.msgs[i] == null || _this.msgs[i] == "" || typeof(_this.msgs[i]) == "undefined")) {
                        if(_this.msgs[i].L==null || typeof(_this.msgs[i].L)=="undefined"){
                            _this.msgs[i].L=_this.width;
                            _this.msgs[i].T=parseInt(Math.random() * 700);
                            _this.msgs[i].S=parseInt(Math.random() * (10 - 4) + 4);
                            _this.msgs[i].C=_this.colorArr[Math.floor(Math.random() * _this.colorArr.length)];
                        }else{
                            if(_this.msgs[i].L<-200){
                                _this.msgs[i]=null;
                            }else {
                                _this.msgs[i].L=parseInt(_this.msgs[i].L-_this.msgs[i].S);
                                _this.ctx.fillStyle =_this.msgs[i].C;
                                _this.ctx.fillText(_this.msgs[i].msg,_this.msgs[i].L,_this.msgs[i].T);
                                _this.ctx.restore();
                            }
                        }
                    }
                }
            }, 20);
        };
        //添加数据，数据格式[{"msg":"nihao"}]
        this.putMsg = function (datas) {
            for (var j = 0; j < datas.length; j++) {
                for (var i = 0; i < this.msgs.length; i++) {
                    if (this.msgs[i] == null || this.msgs[i] == "" || typeof(this.msgs[i]) == "undefined") {
                        this.msgs[i] = datas[j];
                        break;
                    }
                }
            }
            this.draw();
        };
        this.clear = function () {
            clearInterval(this.interval);
            this.interval="";
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.save();
            for(var i=0;i<this.msgs.length;i++){
                this.msgs[i]=null;
            }
        };
    }
});
