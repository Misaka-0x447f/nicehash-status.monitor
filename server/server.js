/**
 * Nicehash/Coinbase API agent
 *
 * Default port: 17535
 *
 * @method stats.provider
 * param addr - Nicehash bitcoin address.
 * @method stats.provider.ex
 * param addr
 * param from - Get history data from this time (UNIX timestamp). This parameter is optional and is by default considered to be 0 (return complete history).
 * @method stats.provider.workers
 * param addr
 * param algo - Algorithm marked with ID. Optional.
 * @method balance
 * param id
 * param key
 *
 * @method price
 * param currency - optional.
 */

const url = require("url");
const http = require("http");
const request = require("request");

const hostname = "127.0.0.1";
const port = 17535;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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
    } else if (url.parse(req.url).pathname === "/price.btc") {
        let param = [
        ];
        if (typeof (queryData.currency) !== "undefined") {
            param = [{
                    name: "currency",
                    value: queryData.currency
            }];
        }
        coinbasePriceRequest(res, "prices/spot", param);
    } else {
        res.write("{\"result\": \"error\", \"error\": \"invalid request to " + url.parse(req.url).pathname + "\"}");
        res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function nicehashRequest(hostRes, method, para = undefined) {
    let address = "https://api.nicehash.com/api?method=" + method;
    for (let i of para) {
        address += "&" + i.name + "=" + i.value;
    }
    request(address, function(e, r, b) {
        if (r && r.statusCode === 200) {
            hostRes.write(b);
        } else {
            hostRes.write(JSON.stringify({
                "result": "error",
                "error": "node.js proxy error",
                "errorCode": r && r.statusCode,
                "errorDetail": e
            }));
        }
        hostRes.end();
    });
}

function coinbasePriceRequest(hostRes, method, para = undefined) {
    let address = "https://api.coinbase.com/v2/" + method;
    let counter = 0;
    for (let i of para) {
        if (counter === 0) {
            address += "?" + i.name + "=" + i.value;
        } else {
            address += "&" + i.name + "=" + i.value;
        }
        counter++;
    }
    let options = {
        url: address,
        headers: {
            // Max effort for solve the warning.
            // This api should only be used for read-only request.
            "CB-VERSION": "2018-02-24"
        }
    };

    function callback(e, r, b) {
        if (r && r.statusCode === 200) {
            hostRes.write(
                JSON.stringify(
                    {
                        "result": {
                            "data": JSON.parse(b)["data"]
                        },
                        "method": "price.btc"
                    }
                )
            );
        } else {
            hostRes.write(JSON.stringify({
                "result": "error",
                "error": "node.js proxy error",
                "errorCode": r && r.statusCode,
                "errorDetail": e
            }));
        }
        hostRes.end();
    }

    request(options, callback);
}
