"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_error_1 = require("./droi-error");
var Request = require("superagent");
var TUTILNS = require("./droi-secure/src");
var droi_log_1 = require("./droi-log");
// import * as btoa from "btoa"
// import * as atob from "atob"
var TUTIL = TUTILNS.TUTIL();
var DroiHttpMethod;
(function (DroiHttpMethod) {
    DroiHttpMethod["GET"] = "GET";
    DroiHttpMethod["POST"] = "POST";
    DroiHttpMethod["PUT"] = "PUT";
    DroiHttpMethod["PATCH"] = "PATCH";
    DroiHttpMethod["DELETE"] = "DELETE";
})(DroiHttpMethod = exports.DroiHttpMethod || (exports.DroiHttpMethod = {}));
var DroiHttpRequest = /** @class */ (function () {
    function DroiHttpRequest() {
    }
    return DroiHttpRequest;
}());
exports.DroiHttpRequest = DroiHttpRequest;
var DroiHttpResponse = /** @class */ (function () {
    function DroiHttpResponse() {
    }
    return DroiHttpResponse;
}());
exports.DroiHttpResponse = DroiHttpResponse;
var DroiHttp = /** @class */ (function () {
    function DroiHttp() {
    }
    DroiHttp.sendRequest = function (request) {
        var req = Request(request.method, request.url)
            .responseType("arraybuffer");
        // req.set('X-Path', request.url);
        // req.set('X-Method', request.method);
        // let body = {}
        // if (request.data != null) {
        //     body["Body"] = btoa(request.data);
        // }
        // if (request.headers != null) {
        //     body["Header"] = request.headers;
        // }
        // req.send(body);
        if (request.headers != null)
            req.set(request.headers);
        if (request.data != null)
            req.send(request.data);
        droi_log_1.DroiLog.d(DroiHttp.LOG_TAG, "    Url: " + request.method + " " + request.url);
        droi_log_1.DroiLog.d(DroiHttp.LOG_TAG, "Headers: " + JSON.stringify(request.headers));
        droi_log_1.DroiLog.d(DroiHttp.LOG_TAG, "  Input: " + request.data);
        return req
            .then(function (resp) {
            var text = TUTIL.bytes_to_string(new Uint8Array(resp.body));
            droi_log_1.DroiLog.d(DroiHttp.LOG_TAG, " Output: " + text);
            var response = new DroiHttpResponse();
            response.status = resp.status;
            response.data = text;
            response.headers = resp.header;
            return response;
        })
            .catch(function (reason) {
            var code = droi_error_1.DroiError.SERVER_NOT_REACHABLE;
            if (reason.code == "ETIMEDOUT")
                code = droi_error_1.DroiError.TIMEOUT;
            return Promise.reject(new droi_error_1.DroiError(code, reason.toString()));
        });
    };
    DroiHttp.LOG_TAG = "DroiHttp";
    return DroiHttp;
}());
exports.DroiHttp = DroiHttp;
