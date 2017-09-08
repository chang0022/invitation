$(function () {
    FastClick.attach(document.body);

    var GUEST = {
        id: 'other', // 写死的，不用改
        name: '' || '', // 用户昵称
        avatar: '' || './img/avatar-2.jpg' // 用户头像图片 url
    };

    var _dialog = {};
    var _members = {};

    function geneDialog(userName) {
        var defaultMembers = {
            neo: {id: 'neo', name: '常鸿飞', avatar: './img/avatar-1.jpg'}
        };
        _members = $.extend(_members, defaultMembers);

        _dialog.d0 = [
            {
                type: 'picture',
                extra: 'emoji',
                author: _members.neo,
                content: "./img/wai.gif"
            },
            {
                type: 'plain',
                author: _members.neo,
                content: "Hi，我。 常鸿飞"
            },
            {
                type: 'plain',
                author: _members.neo,
                content: "告诉你一件事，我要结婚了"
            },
            {
                type: 'plain',
                author: _members.neo,
                content: "真的，真的。"
            },
            {
                type: 'picture',
                extra: 'width',
                author: _members.neo,
                content: "./img/img-1.jpg"
            },
            {
                type: 'picture',
                extra: 'height',
                author: _members.neo,
                content: "./img/img-2.jpg"
            },
            {
                type: 'plain',
                author: _members.neo,
                content: "我还是语音和你说吧。"
            }
        ];

        _dialog.d1 = [
            {
                type: 'voice',
                author: _members.neo
            },
            {
                type: 'plain',
                author: _members.neo,
                content: "2017年10月5日 11点58分<br>濮阳市 瑞丰园 三楼"
            },
            {
                type: 'map',
                author: _members.neo,
                content: "./img/map.png"
            },
            {
                type: 'invite',
                author: _members.neo
            }
        ]
    }

    function Queue() {
    }

    Queue.prototype = {
        add: function (el) {
            if (this._last) {
                this._last = this._last._next = {
                    el: el,
                    _next: null
                }
            } else {
                this._last = this._first = {
                    el: el,
                    _next: null
                }
            }
            return this;
        }
    };


    function copyQueue(p) {
        var queue = new Queue;
        for (var i = 0; i < p.length; i++) {
            queue.add(p[i]);
        }
        return queue;
    }

    var $content = $('#J_scrollContent');
    var $chat = $('#J_msgList');

    function showDialog(dialog, cb) {
        var message = copyQueue(dialog)._first;

        function loop(delay) {
            // speed
            if (delay === undefined) {
                delay = Math.random() * 1000 + 600;
            }

            var timeout = setTimeout(function () {
                if (message) {
                    // 显示 message
                    var messageHtml = template('tpl', message.el);
                    $chat.append(messageHtml);
                    if (message.el['type'] === 'picture' || message.el['type'] === 'map') {
                        $chat.imagesLoaded(function () {
                            $chat.find('.picture').removeClass('is-loading');
                        });
                    }


                    // 自动滚动
                    // 窗口的高度
                    var timeH = $('.chat-time').outerHeight(true);
                    var viewH = $content.height();
                    var contentH = $chat.height();
                    $("#message-push-music")[0].play();
                    if (contentH + timeH > viewH) {
                        $content.scrollTop(contentH + timeH - viewH);
                    }

                    // 特别语句的特殊delay
                    if (message.el.pause !== undefined) {
                        loop(message.el.pause);
                    } else {
                        loop();
                    }

                    // 指向下一句
                    message = message._next;

                } else {
                    clearTimeout(timeout);
                    cb && cb();
                }
            }, delay);
        }

        loop(0);
    }

    var $voice = $('#J_voice');
    var $callMusic = $('#call-out-music');
    var Voice = {
        time: null,
        showVoice: function () {
            $fullPics.trigger('click');
            $voice.show();
            $callMusic[0].play();
        },
        hangUp: function () {
            var self = this;
            $('#J_hangUp').on('touchstart', function () {
                self.textChange();
                return false;
            }).on('touchend', function () {
                self.textChange();
                return false;
            });
            $('#J_break').on('touchstart', function () {
                self.textChangConnect();
                return false;
            }).on('touchend', function () {
                self.textChangConnect();
                return false;
            });
        },
        connectVoice: function () {
            var self = this;
            $('#J_connect').on('touchend', function () {
                $callMusic[0].pause();
                $('.js-callOut').addClass('hide');
                $('.js-connect').removeClass('hide');
                self.playVoice();
            });
        },
        textChange: function () {
            $('#J_callOutText').toggleClass('hide');
            $('#J_hangUpText').toggleClass('hide');
        },
        textChangConnect: function () {
            $('#J_connectText').toggleClass('hide');
            $('#J_hangUpText').toggleClass('hide');
        },
        playVoice: function () {
            var self = this;
            var voice = $('#connect-voice');
            voice[0].play();
            // voiceDuration = parseInt(voice[0].duration);
            self.timeStart();
            voice.on('ended', function () {
                self.timeOver();
                self.breakVoice();
            });
        },
        timeStart: function () {
            var self = this;
            var sec = 0;
            var $voice = $('#J_voiceDuration');
            self.time = setInterval(function () {
                sec += 1;
                if (sec.toString().length < 2) {
                    $voice.text('00:0' + sec)
                } else {
                    $voice.text('00:' + sec)
                }
            }, 1000);

        },
        breakVoice: function () {
            var self = this;
            $('#J_breakText').removeClass('hide').siblings().addClass('hide');
            var $cutVoice = $('#cut-voice');
            $cutVoice[0].play();
            $cutVoice.on('ended', function () {
                self.closeVoice();
            });
        },
        timeOver: function () {
            var self = this;
            clearInterval(self.time);
        },
        closeVoice: function () {
            $voice.hide();
            showDialog(_dialog['d1']);
        },
        init: function () {
            this.hangUp();
            this.connectVoice();
        }
    };

    Voice.init();

    geneDialog();
    // showDialog(_dialog['d0'], function () {
    //     Voice.showVoice();
    // });


    var $fullPics = $('#J_fullPics');
    var $pic = $fullPics.find('.pic');

    $(document).on('click', '.J_img', function () {
        var $target = $(this);
        var imgUrl = $target.attr('src');
        if (imgUrl) {
            // 全屏显示照片
            $pic.append('<img src="' + imgUrl + '" style="display: none;">');
            $pic.imagesLoaded(function () {
                $pic.find('.loading').hide();
                $pic.find('img').show();
            });
            $fullPics.show();
        }
    }).on("click", "#J_fullPics", function () {
        $fullPics.hide();
        $pic.find('.loading').show();
        $pic.find('img').remove();
    }).on('click', '#J_showMap', function () {
        $('#J_iframe').addClass('bounceInUp');
    }).on('click', '#J_closeLayer', function () {
        $('#J_iframe').removeClass('bounceInUp');
    });
});