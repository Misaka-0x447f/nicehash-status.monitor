const url = require("url");
const http = require("http");
const request = require("request");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
    let responseBody = "";

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");

    let queryData = url.parse(req.url, true).query;

    if (url.parse(req.url).pathname === "/stats.provider") {
        nicehashRequest(res, "stats.provider", [{
            name: "addr",
            value: queryData.addr
        }]);
    } else if (url.parse(req.url).pathname === "/stats.provider.ex") {
        let param = [{
            name: "addr",
            value: queryData.addr
        }];
        if (typeof (queryData.from) !== "undefined") {
            param = param.concat([{
                name: "from",
                value: queryData.from
            }]);
        }
        nicehashRequest(res, "stats.provider.ex", param);
    } else if (url.parse(req.url).pathname === "/stats.provider.workers") {
        let param = [{
            name: "addr",
            value: queryData.addr
        }];
        if (typeof (queryData.algo) !== "undefined") {
            param = param.concat([{
                name: "algo",
                value: queryData.algo
            }]);
        }
        nicehashRequest(res, "stats.provider.workers", param);
    } else if (url.parse(req.url).pathname === "/balance") {
        nicehashRequest(res, "balance", [
            {
                name: "id",
                value: queryData.id
            },
            {
                name: "key",
                value: queryData.key
            }
        ]);
    }
    res.write(responseBody);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function nicehashRequest (hostRes, method, para = undefined) {
    let address = "https://api.nicehash.com/api?method=" + method;
    for (let i of para) {
        address += "&" + i.name + "=" + i.value;
    }
    request(address, function (e, r, b) {
        if (r && r.statusCode === 200) {
            hostRes.write(b);
        } else {
            hostRes.write(JSON.stringify({
                "error": "node.js proxy error",
                "errorCode": r && r.statusCode,
                "errorDetail": e
            }));
        }
        hostRes.end();
    });
}
