
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

        // 引导对话
        _dialog.d0 = [
            {
                type: 'plain',
                author: _members.neo,
                content: "Hi，我。 常鸿飞",
                callBack: 'haha',
                pause: 2000
            },
            {
                type: 'picture',
                extra: 'emoji',
                author: _members.neo,
                content: "./img/wai.gif"
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
                content: "./img/big.jpg"
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
                type: 'map',
                author: _members.neo,
                content: "./img/map.png"
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
                    if(message.el['type'] === 'picture' || message.el['type'] === 'map') {
                        $chat.imagesLoaded(function() {
                            $chat.find('.picture').removeClass('is-loading');
                        });
                    }


                    // 自动滚动
                    // 窗口的高度
                    var timeH = $('.chat-time').outerHeight(true);
                    var viewH = $content.height();
                    var contentH = $chat.height();
                    // $("#message-push-music")[0].play();
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


    geneDialog();
    showDialog(_dialog['d0'], function () {
        console.info('It\'s time for me');
    });


    var $fullPics = $('#J_fullPics');
    var $pic = $fullPics.find('.pic');

    $(document).on('click', '.J_img', function () {
        var $target = $(this);
        var imgUrl = $target.attr('src');
        if (imgUrl) {
            // 全屏显示照片
            $pic.append('<img src="'+imgUrl+'" style="display: none;">');
            $pic.imagesLoaded(function() {
                $pic.find('.loading').hide();
                $pic.find('img').show();
            });
            $fullPics.show();
        }
    }).on("click", "#J_fullPics", function () {
        $fullPics.hide();
        $pic.find('.loading').show();
        $pic.find('img').remove();
    });
});