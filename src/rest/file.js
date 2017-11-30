"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_api_1 = require("../droi-api");
var droi_error_1 = require("../droi-error");
var index_1 = require("../index");
var droi_http_1 = require("../droi-http");
var droi_log_1 = require("../droi-log");
var droi_secure_http_1 = require("../droi-secure-http");
var Request = require("superagent");
var RestFile = /** @class */ (function () {
    function RestFile() {
    }
    RestFile.instance = function () {
        if (RestFile.INSTANCE == null)
            RestFile.INSTANCE = new RestFile();
        return RestFile.INSTANCE;
    };
    RestFile.prototype.getUri = function (objectId) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable ? RestFile.REST_HTTP_SECURE : RestFile.REST_HTTPS) + "/" + objectId;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.GET, "", null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN).then(function (res) {
            if (res.hasOwnProperty("CDN")) {
                var result = res["CDN"];
                if (!(result instanceof Array))
                    return [result];
                return result;
            }
            throw new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "There is no CDN link");
        });
    };
    RestFile.prototype.delete = function (objectId) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable ? RestFile.REST_HTTP_SECURE : RestFile.REST_HTTPS) + "/" + objectId;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.DELETE, "", null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN).then(function (_) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    RestFile.prototype.getUploadToken = function (objectId, name, mimeType, size, md5, newFile) {
        droi_log_1.DroiLog.d(RestFile.LOG_TAG, "getUploadToken");
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable || !newFile) ? (secureAvaiable ? RestFile.REST_HTTP_SECURE : RestFile.REST_HTTPS) + "/" + objectId : "" + (secureAvaiable ? RestFile.REST_HTTP_SECURE : RestFile.REST_HTTPS);
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var method = secureAvaiable ? droi_http_1.DroiHttpMethod.PUT : (newFile ? droi_http_1.DroiHttpMethod.POST : droi_http_1.DroiHttpMethod.PATCH);
        var input = JSON.stringify({ "Name": name, "Type": mimeType, "Size": size, "MD5": md5 });
        return callServer(url, method, input, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN).then(function (res) {
            res = res;
            var fileToken = res["Token"];
            var uploadUrl = res["UploadUrl"];
            var sessionId = res["SessionId"];
            if (fileToken === undefined || uploadUrl === undefined)
                throw new droi_error_1.DroiError(droi_error_1.DroiError.UPLOAD_FAILED, "Token or Upload url is empty.");
            return res;
        });
    };
    RestFile.prototype.upload = function (uploadUrl, fileToken, sessionId, objectId, name, mimeType, data, progressCB) {
        var buffer = null;
        if (typeof Blob != 'undefined')
            buffer = new Blob([data]);
        else
            buffer = Buffer.from(data);
        var req = Request
            .post(uploadUrl)
            .field("key", name)
            .field("token", fileToken)
            .field("x:AppId", index_1.DroiCore.getAppId())
            .field("x:Id", objectId)
            .field("x:SessionId", sessionId)
            .attach("file", buffer, { filename: name, contentType: mimeType })
            .on("progress", function (event) {
            if (progressCB != null)
                progressCB(event.loaded, event.total);
        });
        return req.then(function (resp) {
            var response = new droi_http_1.DroiHttpResponse();
            response.status = resp.status;
            response.data = resp.text;
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
    RestFile.REST_HTTP_SECURE = "/droifu/v2/file"; // For secure connection
    RestFile.REST_HTTPS = "https://api.droibaas.com/rest/files/v2"; // For openapi (https)
    RestFile.INSTANCE = null;
    RestFile.LOG_TAG = "DroiFileApi";
    return RestFile;
}());
exports.RestFile = RestFile;
