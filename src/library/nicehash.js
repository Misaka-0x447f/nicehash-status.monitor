import request from "superagent";

export default class nicehash {
    static getProvider (address, callbackSuccess, callbackFailed) {
        nicehash.httpRequest("stats.provider", {addr: address}, callbackSuccess, callbackFailed);
    }

    static httpRequest (method, paramArray, callbackSuccess, callbackFailed) {
        request
            .get("http://" + window.location.hostname + ":3000/" + method)
            .query(paramArray)
            .then(function (response) {
                callbackSuccess(response);
            })
            .catch(function (error) {
                callbackFailed(error);
            });
    }
}
