"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_secure_http_1 = require("../droi-secure-http");
var droi_api_1 = require("../droi-api");
var droi_http_1 = require("../droi-http");
var RestPreference = /** @class */ (function () {
    function RestPreference() {
    }
    RestPreference.instance = function () {
        if (RestPreference.INSTANCE == null)
            RestPreference.INSTANCE = new RestPreference();
        return RestPreference.INSTANCE;
    };
    RestPreference.prototype.get = function () {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestPreference.REST_HTTPS_SECURE : RestPreference.REST_HTTPS) + RestPreference.REST_PREFERENCE_URL + RestPreference.REST_GET;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.GET, null, null, null).then(function (res) {
            return res;
        });
    };
    RestPreference.REST_PREFERENCE_URL = "/apps/v2";
    RestPreference.REST_HTTPS = "https://api.droibaas.com/rest";
    RestPreference.REST_HTTPS_SECURE = "/droi";
    RestPreference.REST_GET = "/preference";
    RestPreference.INSTANCE = null;
    return RestPreference;
}());
exports.RestPreference = RestPreference;
