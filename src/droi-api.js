"use strict";
// Droi rest-apis wrapper
//
// 2 implementation - HTTPS(RestAPI) and DroiSecure HTTP for each api
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var droi_error_1 = require("./droi-error");
var droi_http_1 = require("./droi-http");
var droi_secure_http_1 = require("./droi-secure-http");
var droi_core_1 = require("./droi-core");
var droi_const_1 = require("./droi-const");
var cuint_1 = require("cuint");
var droi_user_1 = require("./droi-user");
var RemoteServiceHelper;
(function (RemoteServiceHelper) {
    var DROI_TOKEN_INVALID = 1040006;
    var FETCH_DEVICE_ID_URL = "https://api.droibaas.com/uregister";
    var DeviceIdFormat = /** @class */ (function () {
        function DeviceIdFormat() {
        }
        DeviceIdFormat.parse = function (uidh, uidl) {
            var format = new DeviceIdFormat();
            var cuidh = cuint_1.UINT64(uidh, 10);
            var cuidl = cuint_1.UINT64(uidl, 10);
            var uuid = cuidh.toString(16).padStart(16, '0') + cuidl.toString(16).padStart(16, '0');
            uuid = uuid.substring(0, 8) + "-" + uuid.substring(8, 12) + "-" + uuid.substring(12, 16) + "-" + uuid.substring(16, 20) + "-" + uuid.substring(20, 32);
            format._uidh = uidh;
            format._uidl = uidl;
            format._string = uuid;
            return format;
        };
        DeviceIdFormat.parseId = function (id) {
            var part1 = id.substring(0, 16);
            var part2 = id.substring(16);
            var format = new DeviceIdFormat();
            var cuidh = cuint_1.UINT64(part1, 16);
            var cuidl = cuint_1.UINT64(part2, 16);
            var uuid = id.substring(0, 8) + "-" + id.substring(8, 12) + "-" + id.substring(12, 16) + "-" + id.substring(16, 20) + "-" + id.substring(20, 32);
            format._uidh = cuidh.toString(10);
            format._uidl = cuidl.toString(10);
            format._string = uuid;
            return format;
        };
        Object.defineProperty(DeviceIdFormat.prototype, "string", {
            get: function () {
                return this._string;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeviceIdFormat.prototype, "uidh", {
            get: function () {
                return this._uidh;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeviceIdFormat.prototype, "uidl", {
            get: function () {
                return this._uidl;
            },
            enumerable: true,
            configurable: true
        });
        return DeviceIdFormat;
    }());
    RemoteServiceHelper.DeviceIdFormat = DeviceIdFormat;
    var TokenHolder = /** @class */ (function () {
        function TokenHolder(token, isAuto) {
            this._token = token;
            this._isAuto = isAuto;
        }
        TokenHolder.make = function (token) {
            return new TokenHolder(token, false);
        };
        Object.defineProperty(TokenHolder.prototype, "token", {
            get: function () {
                if (this._isAuto) {
                    var user = droi_user_1.DroiUser.getCurrentUser();
                    if (user != null && user.isLoggedIn())
                        return user.sessionToken;
                    else
                        return null;
                }
                else {
                    return this._token;
                }
            },
            enumerable: true,
            configurable: true
        });
        TokenHolder.AUTO_TOKEN = new TokenHolder("", true);
        return TokenHolder;
    }());
    RemoteServiceHelper.TokenHolder = TokenHolder;
    function callServer(urlPath, method, input, headers, tokenHolder) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!headers)
                            headers = {};
                        request = new droi_http_1.DroiHttpRequest();
                        request.url = urlPath;
                        request.method = method;
                        request.data = input;
                        request.headers = headers;
                        request.isBinary = false;
                        return [4 /*yield*/, appendDefaultHeaders(request, tokenHolder)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, droi_http_1.DroiHttp.sendRequest(request).then(function (response) {
                                var error = translateDroiError(response);
                                if (!error.isOk)
                                    throw error;
                                // hardcode for count
                                var res = JSON.parse(response.data);
                                if (typeof res["Count"] !== "undefined" && typeof res["Result"] !== "undefined") {
                                    res.Result["Count"] = res["Count"];
                                }
                                return res.Result;
                            })];
                }
            });
        });
    }
    RemoteServiceHelper.callServer = callServer;
    function callServerSecure(urlPath, method, input, headers, tokenHolder) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!headers)
                            headers = {};
                        request = new droi_http_1.DroiHttpRequest();
                        request.url = urlPath;
                        request.method = method;
                        request.data = input;
                        request.headers = headers;
                        request.isBinary = true;
                        return [4 /*yield*/, appendDefaultHeaders(request, tokenHolder)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, droi_secure_http_1.DroiHttpSecure.sendRequest(request).then(function (response) {
                                var error = translateDroiError(response);
                                if (!error.isOk)
                                    throw error;
                                // hardcode for count
                                var res = JSON.parse(response.data);
                                if (typeof res["Count"] !== "undefined" && typeof res["Result"] !== "undefined") {
                                    res.Result["Count"] = res["Count"];
                                }
                                return res.Result;
                            })];
                }
            });
        });
    }
    RemoteServiceHelper.callServerSecure = callServerSecure;
    function fetchHttpsDeviceId() {
        if (!droi_secure_http_1.DroiHttpSecure.isEnable()) {
            var request = new droi_http_1.DroiHttpRequest();
            request.url = FETCH_DEVICE_ID_URL;
            request.method = droi_http_1.DroiHttpMethod.GET;
            request.isBinary = false;
            return droi_http_1.DroiHttp.sendRequest(request)
                .then(function (response) {
                // let regex = /.*\[\"([0-9A-Z]+)\",\s*(\d+)/g;
                var regex = /.*\[(\d+),\s*(\d+),\s*(\d+)/g;
                var match = regex.exec(response.data);
                // return DeviceIdFormat.parseId(match[1]);
                return DeviceIdFormat.parse(match[1], match[2]);
            });
        }
        else {
            return droi_secure_http_1.DroiHttpSecure.getUId().then(function (uids) {
                return DeviceIdFormat.parse(uids[0], uids[1]);
            });
        }
    }
    RemoteServiceHelper.fetchHttpsDeviceId = fetchHttpsDeviceId;
    function appendDefaultHeaders(request, tokenHolder) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, e_1, token;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        request.headers[droi_const_1.DroiConstant.DROI_KEY_HTTP_APP_ID] = droi_core_1.DroiCore.getAppId();
                        if (!droi_secure_http_1.DroiHttpSecure.isEnable() && Object.keys(request.headers).indexOf(droi_const_1.DroiConstant.DROI_KEY_HTTP_API_KEY) == -1)
                            request.headers[droi_const_1.DroiConstant.DROI_KEY_HTTP_API_KEY] = droi_core_1.DroiCore.getApiKey();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = request.headers;
                        _b = droi_const_1.DroiConstant.DROI_KEY_HTTP_DEVICE_ID;
                        return [4 /*yield*/, droi_core_1.DroiCore.getDeviceId()];
                    case 2:
                        _a[_b] = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        console.log("get device id fail. " + e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        // set token
                        if (tokenHolder) {
                            token = tokenHolder.token;
                            if (token && token != "") {
                                request.headers[droi_const_1.DroiConstant.DROI_KEY_HTTP_TOKEN] = token;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function translateDroiError(resp) {
        var retError = new droi_error_1.DroiError(droi_error_1.DroiError.OK, null);
        var code = -1;
        var errorCode = 0;
        var droiStatusCode = 0;
        var message = null;
        if (resp.data) {
            try {
                var jdata = JSON.parse(resp.data);
                if (typeof jdata.Code === 'number') {
                    code = jdata.Code;
                    if (code == DROI_TOKEN_INVALID) {
                        // Trick to access private member
                        droi_user_1.DroiUser.cleanUserCache();
                    }
                    if (typeof jdata.Message === 'string') {
                        message = jdata.Message;
                    }
                    if (typeof jdata.Ticket === 'string') {
                        retError.ticket = jdata.Ticket;
                    }
                }
            }
            catch (e) {
                // bypass
            }
        }
        if (resp instanceof droi_secure_http_1.DroiHttpSecureResponse) {
            droiStatusCode = resp.droiStatusCode;
            retError.ticket = resp.requestId;
        }
        if (code != -1) {
            retError.code = code;
            retError.appendMessage = message;
        }
        else if (resp.status != 0 && resp.status != 200) {
            var status_1 = resp.status;
            if (status_1 == 404)
                retError.code = droi_error_1.DroiError.SERVICE_NOT_FOUND;
            else if (status_1 == 403 || status_1 == 405)
                retError.code = droi_error_1.DroiError.SERVICE_NOT_ALLOWED;
            else if (status_1 == 509)
                retError.code = droi_error_1.DroiError.BANDWIDTH_LIMIT_EXCEED;
            else {
                retError.code = droi_error_1.DroiError.HTTP_SERVER_ERROR;
                retError.appendMessage = "status: " + status_1;
            }
        }
        else if (droiStatusCode != 0) {
            retError.code = droi_error_1.DroiError.INTERNAL_SERVER_ERROR;
            retError.appendMessage = "server code: " + droiStatusCode;
        }
        else {
            retError.code = droi_error_1.DroiError.ERROR;
            retError.appendMessage = "http status: " + resp.status + " errorCode: " + errorCode + " status: " + droiStatusCode;
        }
        return retError;
    }
    RemoteServiceHelper.translateDroiError = translateDroiError;
})(RemoteServiceHelper = exports.RemoteServiceHelper || (exports.RemoteServiceHelper = {}));
