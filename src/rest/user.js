"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_api_1 = require("../droi-api");
var droi_core_1 = require("../droi-core");
var droi_http_1 = require("../droi-http");
var droi_const_1 = require("../droi-const");
var droi_error_1 = require("../droi-error");
var object_1 = require("./object");
var droi_secure_http_1 = require("../droi-secure-http");
var ResetPasswordType;
(function (ResetPasswordType) {
    ResetPasswordType["EMAIL"] = "EMAIL";
    ResetPasswordType["PHONE"] = "PHONE";
    ResetPasswordType["ALL"] = "ALL";
})(ResetPasswordType = exports.ResetPasswordType || (exports.ResetPasswordType = {}));
var OtpType;
(function (OtpType) {
    OtpType["EMAIL"] = "EMAIL";
    OtpType["PHONE"] = "PHOME";
})(OtpType = exports.OtpType || (exports.OtpType = {}));
var RestUser = /** @class */ (function () {
    function RestUser() {
    }
    RestUser.instance = function () {
        if (RestUser.INSTANCE == null)
            RestUser.INSTANCE = new RestUser();
        return RestUser.INSTANCE;
    };
    RestUser.prototype.upsert = function (obj, objId, table) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable ? RestUser.REST_HTTPS_SECURE : RestUser.REST_HTTPS) + "/" + RestUser.REST_USER_URL + "/" + objId;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.PUT, obj, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestUser.prototype.query = function (table, where, offset, limit, order, countOnly) {
        if (countOnly === void 0) { countOnly = false; }
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable ? RestUser.REST_HTTPS_SECURE : RestUser.REST_HTTPS) + "/" + RestUser.REST_USER_URL;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var queryStrings = object_1.RestObject.generatorQueryString(where, offset, limit, order, countOnly);
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
    RestUser.prototype.updateData = function (table, data, where, offset, limit, order) {
        return object_1.RestObject.instance().updateData(table, data, where, offset, limit, order);
    };
    RestUser.prototype.delete = function (objId, table) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = (secureAvaiable ? RestUser.REST_HTTPS_SECURE : RestUser.REST_HTTPS) + "/" + RestUser.REST_USER_URL + "/" + objId;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.DELETE, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestUser.prototype.signupUser = function (data) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_SIGNUP;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var jdata = { Data: data, Type: RestUser.USER_TYPE_GENERAL, InstallationId: droi_core_1.DroiCore.getInstallationId() };
        return callServer(url, droi_http_1.DroiHttpMethod.POST, JSON.stringify(jdata), null, null).then(function (res) {
            return res;
        });
    };
    RestUser.prototype.loginUser = function (userId, password) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_LOGIN;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var jdata = { Type: RestUser.USER_TYPE_GENERAL, InstallationId: droi_core_1.DroiCore.getInstallationId(), UserId: userId, Password: password };
        return callServer(url, droi_http_1.DroiHttpMethod.POST, JSON.stringify(jdata), null, null).then(function (res) {
            return res;
        });
    };
    RestUser.prototype.loginAnonymous = function (userData) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_LOGIN;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var data = "{\"Type\": \"anonymous\", \"InstallationId\": \"" + droi_core_1.DroiCore.getInstallationId() + "\"}";
        return callServer(url, droi_http_1.DroiHttpMethod.POST, data, null, null)
            .catch(function (error) {
            if (error.code != droi_const_1.DroiConstant.DROI_API_USER_NOT_EXISTS)
                return Promise.reject(error);
            return Promise.resolve(error);
        })
            .then(function (result) {
            if (!(result instanceof droi_error_1.DroiError))
                return result;
            url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_SIGNUP;
            var jdata = { Data: JSON.parse(userData.toJson()), Type: "anonymous", InstallationId: droi_core_1.DroiCore.getInstallationId() };
            return callServer(url, droi_http_1.DroiHttpMethod.POST, JSON.stringify(jdata), null, null);
        });
    };
    RestUser.prototype.logout = function (objId) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_LOGOUT;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var data = JSON.stringify({ _Id: objId });
        return callServer(url, droi_http_1.DroiHttpMethod.POST, data, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestUser.prototype.requestOTP = function (userId, contact, type) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_OTP_LOGIN;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var jdata = { UserId: userId, Contact: contact, ContactType: type };
        return callServer(url, droi_http_1.DroiHttpMethod.POST, JSON.stringify(jdata), null, null)
            .then(function (_) {
            return true;
        });
    };
    RestUser.prototype.loginOTP = function (otp, type, newUser) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_LOGIN;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var jotp = { Code: otp, ContactType: type };
        var jdata = { OTP: jotp, Data: newUser, Type: "otp", InstallationId: droi_core_1.DroiCore.getInstallationId() };
        return callServer(url, droi_http_1.DroiHttpMethod.POST, JSON.stringify(jdata), null, null).then(function (res) {
            return res;
        });
    };
    RestUser.prototype.changePassword = function (oldPassword, newPassword) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_PASSWORD;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var jdata = { Old: oldPassword, New: newPassword };
        return callServer(url, droi_http_1.DroiHttpMethod.PUT, JSON.stringify(jdata), null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestUser.prototype.resetPassword = function (userId, type) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_RESET_PASSWORD;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var jdata = { UserId: userId, ContactType: type };
        return callServer(url, droi_http_1.DroiHttpMethod.POST, JSON.stringify(jdata), null, null)
            .then(function (_) {
            return true;
        });
    };
    RestUser.prototype.validateEmail = function () {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_EMAIL;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.POST, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestUser.prototype.validatePhoneNum = function () {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_SMS;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        return callServer(url, droi_http_1.DroiHttpMethod.POST, null, null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestUser.prototype.confirmPhoneNumPin = function (pin) {
        var secureAvaiable = droi_secure_http_1.DroiHttpSecure.isEnable();
        var url = "" + (secureAvaiable ? RestUser.REST_HTTPS_SECURE : (RestUser.REST_HTTPS + '/')) + RestUser.REST_USER_URL + RestUser.REST_USER_VALIDATE_SMS;
        var callServer = secureAvaiable ? droi_api_1.RemoteServiceHelper.callServerSecure : droi_api_1.RemoteServiceHelper.callServer;
        var jdata = { PinCode: pin };
        return callServer(url, droi_http_1.DroiHttpMethod.POST, JSON.stringify(jdata), null, droi_api_1.RemoteServiceHelper.TokenHolder.AUTO_TOKEN)
            .then(function (_) {
            return true;
        });
    };
    RestUser.REST_USER_URL = "users/v2";
    RestUser.REST_HTTPS = "https://api.droibaas.com/rest";
    RestUser.REST_HTTPS_SECURE = "/droi";
    RestUser.REST_USER_LOGIN = "/login";
    RestUser.REST_USER_OTP_LOGIN = "/otp/login";
    RestUser.REST_USER_SIGNUP = "/signup";
    RestUser.REST_USER_LOGOUT = "/logout";
    RestUser.REST_USER_PASSWORD = "/password";
    RestUser.REST_USER_EMAIL = "/email";
    RestUser.REST_USER_SMS = "/sms";
    RestUser.REST_USER_VALIDATE_SMS = "/validate/sms";
    RestUser.REST_USER_RESET_PASSWORD = "/otp/password";
    RestUser.USER_TYPE_GENERAL = "general";
    RestUser.USER_TYPE_ANONYMOUS = "anonymous";
    RestUser.TABLE_NAME = "_User";
    RestUser.INSTANCE = null;
    return RestUser;
}());
exports.RestUser = RestUser;
