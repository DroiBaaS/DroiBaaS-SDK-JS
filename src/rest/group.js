"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
var droi_secure_http_1 = require("../droi-secure-http");
var droi_api_1 = require("../droi-api");
var droi_http_1 = require("../droi-http");
var index_1 = require("../index");
var RestGroup = /** @class */ (function () {
    function RestGroup() {
    }
    RestGroup.instance = function () {
        if (RestGroup.INSTANCE == null)
            RestGroup.INSTANCE = new RestGroup();
        return RestGroup.INSTANCE;
    };
    RestGroup.prototype.upsert = function (obj, objId, table) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestGroup.REST_HTTPS_SECURE : RestGroup.REST_HTTPS) + RestGroup.REST_GROUP_URL + "/" + objId;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.PUT, obj, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestGroup.prototype.query = function (table, where, offset, limit, order, countOnly) {
        if (countOnly === void 0) { countOnly = false; }
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestGroup.REST_HTTPS_SECURE : RestGroup.REST_HTTPS) + RestGroup.REST_GROUP_URL;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var queryStrings = object_1.RestObject.generatorQueryString(where, offset, limit, order, countOnly);
        if (!secureAvaiable)
            queryStrings = queryStrings + "&include_depth=3";
        if (queryStrings !== "")
            url = url + "?" + queryStrings;
        return callServer(url, droi_http_1.DroiHttpMethod.GET, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN).then(function (jresult) {
            if (jresult instanceof Array)
                return jresult;
            throw new index_1.DroiError(index_1.DroiError.INVALID_PARAMETER, "json is not array in query result");
        });
    };
    RestGroup.prototype.updateData = function (table, data, where, offset, limit, order) {
        return object_1.RestObject.instance().updateData(table, data, where, offset, limit, order);
    };
    RestGroup.prototype.delete = function (objId, table) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestGroup.REST_HTTPS_SECURE : RestGroup.REST_HTTPS) + RestGroup.REST_GROUP_URL + "/" + objId;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.DELETE, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestGroup.prototype.fetch = function (name) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestGroup.REST_HTTPS_SECURE : RestGroup.REST_HTTPS) + RestGroup.REST_GROUP_URL + "/" + name + "?name=true";
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.GET, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (json) {
            var jarr = json;
            return jarr[0];
        });
    };
    RestGroup.prototype.getGroupIdByObjectId = function (type, objectId) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var table = (type == 0) ? RestGroup.REST_USER_URL : RestGroup.REST_GROUP_URL;
        var url = "" + (secureAvaiable ? RestGroup.REST_HTTPS_SECURE : RestGroup.REST_HTTPS) + table + "/" + objectId + "/parent";
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.GET, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (json) {
            return json;
        });
    };
    RestGroup.REST_GROUP_URL = "/groups/v2";
    RestGroup.REST_USER_URL = "/users/v2";
    RestGroup.REST_HTTPS = "https://api.droibaas.com/rest";
    RestGroup.REST_HTTPS_SECURE = "/droi";
    RestGroup.TABLE_NAME = "_Group";
    RestGroup.INSTANCE = null;
    return RestGroup;
}());
exports.RestGroup = RestGroup;
