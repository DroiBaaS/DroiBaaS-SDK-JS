"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_api_1 = require("../droi-api");
var droi_http_1 = require("../droi-http");
var droi_error_1 = require("../droi-error");
var droi_secure_http_1 = require("../droi-secure-http");
var RestObject = /** @class */ (function () {
    function RestObject() {
    }
    RestObject.instance = function () {
        if (RestObject.INSTANCE == null)
            RestObject.INSTANCE = new RestObject();
        return RestObject.INSTANCE;
    };
    RestObject.prototype.upsert = function (obj, objId, table) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestObject.REST_HTTPS_SECURE : RestObject.REST_HTTPS) + RestObject.REST_OBJECT_URL + "/" + table + "/" + objId;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.PUT, obj, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestObject.prototype.delete = function (objId, table) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestObject.REST_HTTPS_SECURE : RestObject.REST_HTTPS) + RestObject.REST_OBJECT_URL + "/" + table + "/" + objId;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.DELETE, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestObject.prototype.query = function (table, where, offset, limit, order) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestObject.REST_HTTPS_SECURE : RestObject.REST_HTTPS) + RestObject.REST_OBJECT_URL + "/" + table;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var queryStrings = RestObject.generatorQueryString(where, offset, limit, order);
        if (!secureAvaiable)
            queryStrings = queryStrings + "&include_depth=3";
        if (queryStrings !== "")
            url = url + "?" + queryStrings;
        return callServer(url, droi_http_1.DroiHttpMethod.GET, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN).then(function (jresult) {
            if (jresult instanceof Array)
                return jresult;
            throw new droi_error_1.DroiError(droi_error_1.DroiError.INVALID_PARAMETER, "json is not array in query result");
        });
    };
    RestObject.prototype.updateData = function (table, data, where, offset, limit, order) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestObject.REST_HTTPS_SECURE : RestObject.REST_HTTPS) + RestObject.REST_OBJECT_URL + "/" + table;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var queryStrings = RestObject.generatorQueryString(where, offset, limit, order);
        if (queryStrings !== "")
            url = url + ("?" + queryStrings);
        return callServer(url, droi_http_1.DroiHttpMethod.PATCH, data, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestObject.prototype.bulkUpsert = function (table, data) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestObject.REST_HTTPS_SECURE : RestObject.REST_HTTPS) + RestObject.REST_BULK_OBJECT_URL + "/" + table;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.PUT, data, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestObject.prototype.bulkDelete = function (table, data) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestObject.REST_HTTPS_SECURE : RestObject.REST_HTTPS) + RestObject.REST_BULK_OBJECT_URL + "/" + table;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        if (data)
            url = url + "?body=" + encodeURIComponent(data);
        return callServer(url, droi_http_1.DroiHttpMethod.DELETE, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestObject.prototype.atomicAdd = function (table, id, values) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestObject.REST_HTTPS_SECURE : RestObject.REST_HTTPS) + RestObject.REST_OBJECT_URL + "/" + table + "/" + id + RestObject.REST_ATOMIC_ADD;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.POST, JSON.stringify(values), null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestObject.generatorQueryString = function (where, offset, limit, order) {
        var queryStrings = "";
        if (where)
            queryStrings = queryStrings + "where=" + encodeURIComponent(where) + "&";
        if (offset || !isNaN(offset))
            queryStrings = queryStrings + "offset=" + offset + "&";
        if (limit || !isNaN(limit))
            queryStrings = queryStrings + "offset=" + limit + "&";
        if (order)
            queryStrings = queryStrings + "offset=" + encodeURIComponent(order) + "&";
        return (queryStrings.length > 0) ? queryStrings.substring(0, queryStrings.length - 1) : queryStrings;
    };
    RestObject.REST_OBJECT_URL = "/objects/v2";
    RestObject.REST_BULK_OBJECT_URL = "/bulk/v2";
    RestObject.REST_HTTPS = "https://api.droibaas.com/rest";
    RestObject.REST_HTTPS_SECURE = "/droi";
    RestObject.REST_ATOMIC_ADD = "/increment";
    RestObject.INSTANCE = null;
    return RestObject;
}());
exports.RestObject = RestObject;
