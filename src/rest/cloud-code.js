"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_api_1 = require("../droi-api");
var droi_const_1 = require("../droi-const");
var droi_secure_http_1 = require("../droi-secure-http");
var RestCloudCode = /** @class */ (function () {
    function RestCloudCode() {
    }
    RestCloudCode.instance = function () {
        if (RestCloudCode.INSTANCE == null)
            RestCloudCode.INSTANCE = new RestCloudCode();
        return RestCloudCode.INSTANCE;
    };
    RestCloudCode.prototype.callApi = function (apiKey, apiPath, method, params, token) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestCloudCode.REST_HTTPS_SECURE : RestCloudCode.REST_HTTPS) + apiPath;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var headers = {};
        headers[droi_const_1.DroiConstant.DROI_KEY_HTTP_API_KEY] = apiKey;
        var tokenHolder = (token == null) ? null : droi_api_1.RemoteServiceHelper.TokenHolder.make(token);
        return callServer(url, method, params, headers, tokenHolder).then(function (jresult) {
            return JSON.stringify(jresult);
        });
    };
    RestCloudCode.REST_HTTPS = "https://api.droibaas.com";
    RestCloudCode.REST_HTTPS_SECURE = "";
    RestCloudCode.INSTANCE = null;
    return RestCloudCode;
}());
exports.RestCloudCode = RestCloudCode;
