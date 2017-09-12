/**
 * Created by Neo on 2017/8/31.
 */
// 模拟延迟
Mock.setup({
    timeout: '1000'
});


Mock.mock(/\/api\/test/, {
    "code": 200,
    "message": "ok",
    "data": null
});

Mock.mock(/\/server\/barrage/, {
    "code": 200,
    "message": "ok",
    "data|20": [
        "@csentence()"
    ]
});
