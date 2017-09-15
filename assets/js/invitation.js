$(function () {
    FastClick.attach(document.body);
    var VISIT = !!Cookies.get('isVisit');

    var Device = {
        ua: navigator.userAgent.toLowerCase(),
        isWeixin: function () {
            return /micromessenger/.test(this.ua);
        },
        isAndroid: function () {
            return /android/.test(this.ua);
        }
    };
    if (Device.isAndroid()) {
        $('audio').each(function () {
            $(this).attr('src', $(this).data('src'));
            $(this)[0].load();
        });
    } else {
        if (Device.isWeixin()) {
            $(document).one('WeixinJSBridgeReady', function () {
                $('audio').each(function () {
                    $(this)[0].play();
                    $(this).attr('src', $(this).data('src'));
                    $(this)[0].load();
                });
            })
        } else {
            $(document).one('touchstart', function () {
                $('audio').each(function () {
                    $(this)[0].play();
                    $(this).attr('src', $(this).data('src'));
                    $(this)[0].load();
                });
            });
        }
    }

    var master = MASTER === 'girl' ? 1 : 0;
    var GUEST = {
        id: 'other',
        name: '' || '我的朋友',
        avatar: '' || QI_NIU + '/img/avatar-2.jpg'
    };

    var _dialog = {};
    var _members = {};

    function geneDialog(user) {
        var _master = {};
        var defaultMembers = {
            neo: {id: 'neo', name: '常鸿飞', avatar: QI_NIU + '/img/avatar-1.jpg'},
            man: {id: 'neo', name: '冯蔓', avatar: QI_NIU + '/img/avatar-2.jpg'}
        };
        _members = $.extend(_members, defaultMembers);

        if (user) {
            _master = _members.man;
        } else {
            _master = _members.neo;
        }
        _dialog.d0 = [
            {
                type: 'picture',
                extra: 'emoji',
                author: _master,
                content: QI_NIU + "/img/wai.gif"
            },
            {
                type: 'plain',
                author: _master,
                content: "Hi，我" + _master.name + "呀"
            },
            {
                type: 'plain',
                author: _master,
                content: "告诉你一件事，我要结婚了",
                pause: 2000
            },
            {
                type: 'plain',
                author: _master,
                content: "哈哈，谢谢谢谢。"
            },
            {
                type: 'plain',
                author: _master,
                content: "前方高能！！！",
                pause: 2000
            },
            {
                type: 'picture',
                extra: 'width',
                author: _master,
                content: QI_NIU + "/photo-1.jpg"
            },
            {
                type: 'picture',
                extra: 'width',
                author: _master,
                content: QI_NIU + "/photo-2.jpg"
            },
            {
                type: 'picture',
                extra: 'width',
                author: _master,
                content: QI_NIU + "/photo-3.jpg"
            },
            {
                type: 'picture',
                extra: 'width',
                author: _master,
                content: QI_NIU + "/photo-4.jpg"
            },
            {
                type: 'picture',
                extra: 'height',
                author: _master,
                content: QI_NIU + "/photo-5.jpg"
            },
            {
                type: 'picture',
                extra: 'height',
                author: _master,
                content: QI_NIU + "/photo-6.jpg"
            },
            {
                type: 'picture',
                extra: 'width',
                author: _master,
                content: QI_NIU + "/photo-7.jpg",
                pause: 2000
            }
        ];

        _dialog.d1 = [
            {
                type: 'voice',
                author: _master
            },
            {
                type: 'plain',
                author: _master,
                content: "具体时间地点如下："
            },
            {
                type: 'plain',
                author: _master,
                content: "2017年10月5日 11点28分<br>濮阳市 瑞丰园 三楼"
            },
            {
                type: 'plain',
                author: _master,
                content: "这是地图。温馨提示：关闭地图点击右上角红叉。不然要重新打开了。๑乛v乛๑"
            },
            {
                type: 'map',
                author: _master,
                content: QI_NIU + "/img/map.png"
            },
            {
                type: 'invite',
                author: _master
            }
        ];

        _dialog.d2 = [
            {
                type: 'plain',
                author: _master,
                content: "你又肥来了。"
            },
            {
                type: 'plain',
                author: _master,
                content: "照片忘了存了？"
            },
            {
                type: 'picture',
                extra: 'width',
                author: _master,
                content: QI_NIU + "/photo-7.jpg"
            },
            {
                type: 'plain',
                author: _master,
                content: "日期地址忘记了？"
            },
            {
                type: 'plain',
                author: _master,
                content: "2017年10月5日 11点28分<br>濮阳市 瑞丰园 三楼"
            },
            {
                type: 'map',
                author: _master,
                content: QI_NIU + "/img/map.png"
            },
            {
                type: 'plain',
                author: _master,
                content: "要不直接看看海报？"
            },
            {
                type: 'link',
                author: _master,
                pause: 2000
            },
            {
                type: 'plain',
                author: _master,
                content: "安排变卦了？"
            },
            {
                type: 'invite',
                author: _master
            },
            {
                type: 'button',
                author: _master
            }
        ];
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
                            $chat.find('.picture').removeClass('is-loading')
                                .find('span').remove();
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
                self.textChangeConnect();
                return false;
            }).on('touchend', function () {
                self.textChangeConnect();
                return false;
            });
        },
        connectVoice: function () {
            var self = this;
            $('#J_connect').on('touchend', function () {
                $callMusic[0].pause();
                $('.js-callOut').addClass('hide');
                $('.js-connect').removeClass('hide');
                $('.voice-tips').addClass('voice-tips-small');
                self.playVoice();
            });
        },
        textChange: function () {
            $('#J_callOutText').toggleClass('hide');
            $('#J_hangUpText').toggleClass('hide');
        },
        textChangeConnect: function () {
            $('#J_connectText').toggleClass('hide');
            $('#J_hangUpText').toggleClass('hide');
        },
        playVoice: function () {
            var self = this;
            var voice = $('#connect-voice');
            voice[0].play();
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
            $('#J_connectText').text('通话结束');
            $('#J_break').off('touchstart touchend');
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

    geneDialog(master);


    if (VISIT) {
        showDialog(_dialog['d2']);
    } else {
        showDialog(_dialog['d0'], function () {
            Voice.showVoice();
        });
    }


    var $fullPics = $('#J_fullPics');
    var $pic = $fullPics.find('.pic');

    $(document).on('click', '.J_img', function () {
        var $target = $(this);
        var imgUrl = $target.attr('src');
        if (imgUrl) {
            $pic.append('<img src="' + imgUrl.replace(/.clouddn.com/, '.clouddn.com/big') + '" style="display: none;">');
            $pic.imagesLoaded(function () {
                $pic.find('.heartbeat-loader').hide();
                $pic.find('img').show();
            });
            $fullPics.show();
        }
    }).on("click", "#J_fullPics", function () {
        $fullPics.hide();
        $pic.find('.heartbeat-loader').show();
        $pic.find('img').remove();
    }).on('click', '#J_showMap', function () {
        $('#J_iframe').addClass('bounceInUp');
    }).on('click', '#J_closeLayer', function () {
        $('#J_iframe').removeClass('bounceInUp');
    }).on('click', '#J_attend', function () {
        invitationForm.showAttend();
    }).on('click', '#J_blessing', function () {
        invitationForm.showBlessing();
    }).on('click', '#J_returnBtn', function () {
        invitationForm.closeForm();
    }).on('click', '#J_resetBtn', function () {
        Cookies.remove('isVisit', {path: ''});
        window.location.reload();
    });

    var $layerForm = $('.layer-form');
    var $attendForm = $('.attend-form');
    var $blessingForm = $('.blessing-form');

    var invitationForm = {
        showAttend: function () {
            $layerForm.show();
            $attendForm.show();
            $('#J_attendBtn').show();
        },
        showBlessing: function () {
            $layerForm.find('.form-wrap').addClass('form-top-wrap');
            $layerForm.show();
            $blessingForm.show();
            $('#J_blessingBtn').show();
        },
        closeForm: function () {
            $layerForm.hide();
            $attendForm.hide();
            $blessingForm.hide();
            $('.btn-confirm').hide();
            $layerForm.find('.form-wrap').removeClass('form-top-wrap');
        }
    };


    $('#J_attendBtn').click(function () {
        var form = $('.attend-form');
        var data = {};
        data.name = form.find('input[name="vip"]').val();
        data.number = form.find('select[name="attendNumber"]').val();
        data.type = 1;
        data.belong = master;
        if (!data.name) return errorMsg('姓名不能为空');
        ajaxData(data);
    });

    $('#J_blessingBtn').click(function () {
        var form = $('.blessing-form');
        var data = {};
        data.name = form.find('input[name="vip"]').val();
        data.blessing = form.find('textarea[name="blessing"]').val();
        data.type = 2;
        data.belong = master;
        if (!data.name) return errorMsg('姓名不能为空');
        if (!data.blessing) return errorMsg('祝福一下呗~');
        ajaxData(data);
    });

    function ajaxData(data) {
        $('.layer-loading').addClass('open');
        $.ajax(VISIROR, {
            data: data,
            method: 'POST',
            dataType: 'json',
            success: function (res) {
                $('.layer-loading').removeClass('open');
                if (res.code !== 200) {
                    errorMsg('抱歉，服务器异常~');
                    return '';
                }
                window.location.href = POSTER_URI;
            },
            error: function () {
                $('.layer-loading').removeClass('open');
                errorMsg('抱歉，服务器异常~');
            }
        });
    }

    function errorMsg(msg) {
        $('.weui-toast').text(msg).addClass('weui-toast--visible')
            .delay(1500)
            .queue(function () {
                $(this).removeClass('weui-toast--visible').dequeue();
            })
    }
});