$(function () {
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
});