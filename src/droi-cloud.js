"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_http_1 = require("./droi-http");
var index_1 = require("./index");
var cloud_code_1 = require("./rest/cloud-code");
var DroiCloud = /** @class */ (function () {
    function DroiCloud() {
    }
    DroiCloud.callRestApi = function (apiKey, apiPath, method, params, token) {
        if ((method == droi_http_1.DroiHttpMethod.DELETE || method == droi_http_1.DroiHttpMethod.GET) && params != null)
            return Promise.reject(new index_1.DroiError(index_1.DroiError.INVALID_PARAMETER, "Params must be null in method GET / DELETE"));
        return cloud_code_1.RestCloudCode.instance().callApi(apiKey, apiPath, method, params, token);
    };
    return DroiCloud;
}());
exports.DroiCloud = DroiCloud;
