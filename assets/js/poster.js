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

    function Barrager(dom) {
        this.element = dom;
        this.msgs = [];
        this.width = dom.width();
        this.height = dom.height();
        this.range = null;
        this.interval = '';
        this.top = null;
        this.draw = function (delay) {
            var _this = this;
            clearTimeout(_this.interval);
            if (delay === undefined) {
                delay = Math.random() * 1000 + 2000;
            }
            _this.interval = setTimeout(function () {
                var top = parseInt(Math.random() * (_this.height / 2));
                if (_this.msgs.length > 0) {
                    var $span = $('<span class="barrager-item">' + _this.msgs[_this.msgs.length - 1] + '</span>');
                    $span.css('top', top);
                    $span.one(animationEnd, function () {
                       $(this).remove();
                    });
                    dom.append($span);
                    _this.msgs.pop();
                    _this.draw();
                } else {
                    clearTimeout(_this.interval);
                    _this.interval = '';
                }
            }, delay);
        };
        this.putMsg = function (datas) {
            if (!datas) return;
            for (var i = 0; i < datas.length; i++) {
                this.msgs.push(datas[i]);
            }
            this.draw(1000);
        };
        this.clear = function () {
            clearTimeout(this.interval);
            this.interval = '';
            for (var i = 0; i < this.msgs.length; i++) {
                this.msgs[i] = null;
            }
        };
    }


    var $barrager = $('#J_barrager');
    var barrager = new Barrager($barrager);

    $.getJSON('/barrage/2', function (res) {
        if (res.data.length > 0) {
            barrager.putMsg(res.data);
        }
    });
});
