/**
 *  Nicehash api agent parser
 *  Author: 447f.misaka@outlook.com
 *  This method requires an agent to work.
 *  You can deployment a node.js agent using this script: ../../server/
 *  Then you will need to set the port number using const "port".
 *
 *  nicehash api documentation @ https://www.nicehash.com/doc-api
 *
 *  @param {string} addr - address of target provider
 *  @param {function} callbackSuccess(response)
 *  @param {function} callbackFailed(errors) - callback with a plain text error info.
 */

import request from "superagent";
import Throttle from "superagent-throttle";

export default class Nicehash {
    constructor() {
        this.pendingRequest = {};
        this.lastSentRequestAt = 0;
        this.fastThrottle = 3;
        this.slowThrottle = 30;
        this.throttle = new Throttle({
            active: true, // set false to pause queue
            rate: 2, // how many requests can be sent every `ratePer`
            ratePer: 7000, // number of ms in which `rate` requests may be sent
            concurrent: 3 // how many requests can be sent concurrently
        });

        this.baseUri = window.location.hostname;
        this.port = 17535;
    }

    setAddress(address) {
        this.address = address;
    }

    throttleMode() {
        Nicehash.logger("ModeSelect", "throttleMode");
        this.fastThrottle = 3;
        this.slowThrottle = 30;
    }

    queueMode() {
        Nicehash.logger("ModeSelect", "queueMode");
        this.fastThrottle = 0;
        this.slowThrottle = 0;
    }

    getProvider(callbackSuccess, callbackFailed) {
        this.httpRequest("stats.provider", {addr: this.address}, callbackSuccess, callbackFailed, this.fastThrottle);
    }

    isValidAddress(address, callbackSuccess, callbackFailed) {
        /**
         * This method will callback with a boolean which indicates if it is a valid address.
         */
        this.httpRequest("stats.provider", {addr: address},
            (response) => {
                if (response["result"].hasOwnProperty("error") === true) {
                    callbackSuccess("false");
                } else {
                    callbackSuccess("true");
                }
            }, callbackFailed, this.fastThrottle);
    }

    getProviderEx(callbackSuccess, callbackFailed) {
        this.httpRequest("stats.provider.ex", {
            addr: this.address,
            from: Nicehash.getUnixTimeStamp(86400 * 3)
        }, callbackSuccess, callbackFailed, this.slowThrottle);
    }

    getProviderWorkers(callbackSuccess, callbackFailed) {
        this.httpRequest("stats.provider.workers", {
            addr: this.address
        }, callbackSuccess, callbackFailed, this.fastThrottle);
    }

    getPriceBitcoin(callbackSuccess, callbackFailed, currency = "USD") {
        this.httpRequest("price.btc", {currency: currency}, callbackSuccess, callbackFailed, this.fastThrottle);
    }

    getBalance(key, callbackSuccess, callbackFailed) {
        key = key.split(".");
        if (key.length !== 2) {
            Nicehash.logger("Failed", "Incorrect key format.");
            return false;
        }
        this.httpRequest("balance", {id: key[0], key: key[1]}, callbackSuccess, callbackFailed, this.fastThrottle);
    }

    httpRequest(method, paramArray, callbackSuccess, callbackFailed, throttle = 3) {
        let startAt = (new Date()).getTime() / 1000;
        if (typeof (this.address) !== "string") {
            Nicehash.logger("Warning", "Address not set.");
        }

        let uri = "http://" + this.baseUri + ":" + this.port + "/" + method;
        if (throttle > 0) {
            if (Nicehash.getUnixTimeStamp() - this.lastSentRequestAt < throttle) {
                Nicehash.logger("Throttled request");

                callbackFailed({internalError: "Request too frequently. Your request will be queued unless more request in before limiter released."});

                // discard previous request
                if (this.pendingRequest.hasOwnProperty("timer")) {
                    clearTimeout(this.pendingRequest.timer);
                }

                // overwrite previous request and set timer
                this.pendingRequest = {
                    method: method,
                    paramArray: paramArray,
                    callbackSuccess: callbackSuccess,
                    callbackFailed: callbackFailed,
                    throttle: throttle
                };

                console.log(this.pendingRequest);

                this.pendingRequest.timer = setTimeout(() => {
                    this.httpRequest(
                        this.pendingRequest.method,
                        this.pendingRequest.paramArray,
                        this.pendingRequest.callbackSuccess,
                        this.pendingRequest.callbackFailed,
                        this.pendingRequest.throttle
                    );
                }, (this.lastSentRequestAt + throttle - Nicehash.getUnixTimeStamp()) * 1000);

                return true;
            }
            this.lastSentRequestAt = Nicehash.getUnixTimeStamp();
            // discard previous request
            if (this.pendingRequest.hasOwnProperty("timer")) {
                clearTimeout(this.pendingRequest.timer);
            }
            this.pendingRequest = {};

            request
                .get(uri)
                .query(paramArray)
                .then(function(response) {
                    Nicehash.logger("Success", method);
                    callbackSuccess(response["body"]);
                })
                .catch(function(error) {
                    Nicehash.logger("Failed", error + ", " + uri);
                    callbackFailed(error);
                });
        } else {
            request
                .get(uri)
                .query(paramArray)
                .use(this.throttle.plugin(uri))
                .then(function(response) {
                    Nicehash.logger("Success", method + " in " + ((new Date()).getTime() / 1000 - startAt).toFixed(2) + "s");
                    callbackSuccess(response["body"]);
                })
                .catch(function(error) {
                    Nicehash.logger("Failed", error + ", " + uri);
                    callbackFailed(error);
                });
        }

        Nicehash.logger("Outgoing", (function() {
            let fullUrl = uri;
            let counter = 0;
            for (let i in paramArray) {
                if (counter === 0) {
                    fullUrl += "?";
                } else {
                    fullUrl += "&";
                }
                if (paramArray.hasOwnProperty(i)) {
                    fullUrl += i + "=" + paramArray[i];
                }
                counter++;
            }
            return fullUrl;
        }()));
    }

    static logger(type, log) {
        let output = "[" + (new Date()).toLocaleTimeString() + "] " + type + (log ? (": " + log) : "");
        if (type === "Warning") {
            console.log("%c" + output, "background: #ffc; color: #000; padding: 2px 0");
        } else if (type === "Failed") {
            console.log("%c" + output, "background: #fcc; color: #000; padding: 2px 0");
        } else if (type === "Debug") {
            console.log("%c" + output, "background: #6cf; color: #fff; padding: 2px 0");
        } else {
            console.log(output);
        }

        window.nicehashExternalLog = output;
    }

    static getLogger() {
        if (typeof (nicehashExternalLog) === "undefined") {
            return "<disconnected>";
        } else {
            return window.nicehashExternalLog;
        }
    }

    static getUnixTimeStamp(offset = 0) {
        return Math.round((new Date()).getTime() / 1000 - offset);
    }
}
