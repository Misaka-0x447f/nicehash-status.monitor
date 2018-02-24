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

const port = 17535;

export default class Nicehash {
    constructor() {
        this.pendingRequest = {};
        this.lastSentRequestAt = 0;
    }

    setAddress(address) {
        this.address = address;
    }

    getProvider(callbackSuccess, callbackFailed) {
        this.httpRequest("stats.provider", {addr: this.address}, callbackSuccess, callbackFailed);
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
            }, callbackFailed);
    }

    getProviderEx(callbackSuccess, callbackFailed) {
        this.httpRequest("stats.provider.ex", {
            addr: this.address,
            from: Nicehash.getUnixTimeStamp(7 * 86400)
        }, callbackSuccess, callbackFailed, 30);
    }

    getProviderWorkers(callbackSuccess, callbackFailed) {
        this.httpRequest("stats.provider.ex", {
            addr: this.address,
            from: Nicehash.getUnixTimeStamp(3 * 86400)
        }, callbackSuccess, callbackFailed);
    }

    httpRequest(method, paramArray, callbackSuccess, callbackFailed, throttle = 3) {
        if (Nicehash.getUnixTimeStamp() - this.lastSentRequestAt < throttle) {
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

        let uri = "http://" + window.location.hostname + ":" + port + "/" + method;
        request
            .get(uri)
            .query(paramArray)
            .then(function(response) {
                callbackSuccess(response["body"]);
            })
            .catch(function(error) {
                callbackFailed(error);
            });
    }

    static getUnixTimeStamp(offset = 0) {
        return Math.round((new Date()).getTime() / 1000 - offset);
    }
}
