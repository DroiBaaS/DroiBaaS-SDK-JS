"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_secure_http_1 = require("../droi-secure-http");
var droi_api_1 = require("../droi-api");
var droi_http_1 = require("../droi-http");
var index_1 = require("../index");
var RestCloudCache = /** @class */ (function () {
    function RestCloudCache() {
    }
    RestCloudCache.instance = function () {
        if (RestCloudCache.INSTANCE == null)
            RestCloudCache.INSTANCE = new RestCloudCache();
        return RestCloudCache.INSTANCE;
    };
    RestCloudCache.prototype.get = function (key) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable ? RestCloudCache.REST_HTTPS_SECURE : RestCloudCache.REST_HTTPS) + "/" + key;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.GET, null, null, null).then(function (result) {
            // v3
            //return result["Value"]; 
            return result;
        });
    };
    RestCloudCache.prototype.set = function (key, value, ttl) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable ? RestCloudCache.REST_HTTPS_SECURE : RestCloudCache.REST_HTTPS) + "/" + key;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        ttl = ttl || 180;
        var body = { TTL: ttl, Value: value };
        return callServer(url, droi_http_1.DroiHttpMethod.PUT, JSON.stringify(body), null, null).then(function (result) {
            return new index_1.DroiError(index_1.DroiError.OK);
        });
    };
    RestCloudCache.prototype.remove = function (key) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable ? RestCloudCache.REST_HTTPS_SECURE : RestCloudCache.REST_HTTPS) + "/" + key;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.DELETE, null, null, null).then(function (result) {
            return new index_1.DroiError(index_1.DroiError.OK);
        });
    };
    RestCloudCache.REST_HTTPS = "https://api.droibaas.com/rest/cloudcache/v2";
    RestCloudCache.REST_HTTPS_SECURE = "/droi/cloudcache/v2";
    RestCloudCache.REST_GET = "/preference";
    RestCloudCache.INSTANCE = null;
    return RestCloudCache;
}());
exports.RestCloudCache = RestCloudCache;
