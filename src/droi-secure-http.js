"use strict";
// DroiSecure http implemention
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var droi_http_1 = require("./droi-http");
var TUTILNS = require("./droi-secure/src");
var droi_error_1 = require("./droi-error");
var droi_core_1 = require("./droi-core");
var droi_object_1 = require("./droi-object");
var droi_persist_settings_1 = require("./droi-persist-settings");
var droi_log_1 = require("./droi-log");
var UINT = require("cuint");
var droi_const_1 = require("./droi-const");
var utf8 = require('utf8');
var TUTIL = TUTILNS.TUTIL();
var IpElement = /** @class */ (function () {
    function IpElement() {
    }
    IpElement.prototype.toJson = function () {
        return { IP: this.ip, Port: this.port, Name: this.name, Weight: String(this.weight) };
    };
    IpElement.prototype.isValid = function () {
        return this.ip != null && this.ip.length > 0;
    };
    return IpElement;
}());
var IpList = /** @class */ (function () {
    function IpList() {
        this.ipList = {};
    }
    IpList.load = function () {
        var ipl = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_IPLIST);
        if (ipl == null)
            return null;
        return IpList.parse(ipl);
    };
    IpList.refresh = function (appId) {
        var req = new droi_http_1.DroiHttpRequest();
        req.url = droi_const_1.DroiConstant.IP_LIST_URL + "?appid=" + appId;
        req.method = droi_http_1.DroiHttpMethod.GET;
        req.isBinary = false;
        return droi_http_1.DroiHttp.sendRequest(req).then(function (resp) {
            if (resp.status != 200)
                throw new droi_error_1.DroiError(droi_error_1.DroiError.SERVER_NOT_REACHABLE, "http statue: " + resp.status);
            return IpList.parse(resp.data);
        });
    };
    IpList.parse = function (ipl) {
        var jip = null;
        try {
            jip = JSON.parse(ipl);
        }
        catch (jsonErr) {
            droi_log_1.DroiLog.e(IpList.LOG_TAG, "parse json error. " + ipl);
            return null;
        }
        var count = Number(jip["Total"]);
        if (isNaN(count) || count == 0)
            return null;
        var ipList = new IpList();
        ipList.version = jip["Version"];
        if (Number(ipList.version) < 3)
            return null;
        var timestamp = UINT.UINT64(jip["Timestamp"]);
        var expireTime = UINT.UINT64(jip["Expire"]);
        var timeDiff = expireTime.clone().subtract(timestamp);
        var localNow = UINT.UINT64(String(Date.now()));
        if (!jip["LocalCache"]) {
            if (timestamp.greaterThan(localNow))
                droi_object_1.DroiObject.TIME_SHIFT = Number(timestamp.clone().subtract(localNow).toString());
            else
                droi_object_1.DroiObject.TIME_SHIFT = Number(localNow.clone().subtract(timestamp).toString());
            expireTime = localNow.clone().add(timeDiff);
        }
        ipList.createTime = timestamp;
        ipList.expiredTime = expireTime;
        if (jip["ZoneCode"])
            ipList.zoneCode = jip["ZoneCode"];
        if (jip["Order"])
            ipList.order = Number(jip["Order"]);
        else
            ipList.order = 0;
        ipList.ipList = {};
        var jList = jip["List"];
        for (var i = 0; i < count; ++i) {
            var jitems = jList[String(i)];
            var ipes = Array(jitems.length);
            for (var j = 0; j < jitems.length; ++j) {
                var jitem = jitems[j];
                var ipe = new IpElement();
                ipe.ip = jitem["IP"];
                ipe.port = jitem["Port"];
                ipe.name = jitem["Name"];
                ipe.weight = Number(jitem["Weight"]);
                ipe.listPos = j;
                ipes[j] = ipe;
            }
            ipList.ipList[String(i)] = ipes;
        }
        return ipList;
    };
    IpList.prototype.save = function () {
        var jobj = {
            Total: String(Object.keys(this.ipList).length),
            Version: this.version,
            Timestamp: this.createTime.toString(),
            Order: this.order,
            LocalCache: true
        };
        if (this.expiredTime != null)
            jobj["Expire"] = this.expiredTime.toString();
        if (this.zoneCode != null)
            jobj["ZoneCode"] = this.zoneCode;
        var jips = {};
        for (var i in this.ipList) {
            var ipes = this.ipList[i];
            var jobjs = [];
            for (var _i = 0, ipes_1 = ipes; _i < ipes_1.length; _i++) {
                var ipe = ipes_1[_i];
                jobjs.push(ipe.toJson());
            }
            jips[i] = jobjs;
        }
        jobj["List"] = jips;
        var json = JSON.stringify(jobj);
        droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_IPLIST, json);
    };
    IpList.prototype.getCurrent = function () {
        if (this.ipList == null || Object.keys(this.ipList).length == 0)
            return null;
        if (this.currentIpElement != null)
            return this.currentIpElement;
        if (this.order >= Object.keys(this.ipList).length)
            this.order = 0;
        var ipes = this.ipList[String(this.order)];
        var weight = Math.random() * 1000;
        var cw = 0;
        var focus = null;
        for (var _i = 0, ipes_2 = ipes; _i < ipes_2.length; _i++) {
            var ipe = ipes_2[_i];
            cw = cw + ipe.weight;
            if (weight < cw) {
                focus = ipe;
                this.currentIpElement = ipe;
                break;
            }
        }
        return focus;
    };
    IpList.prototype.nextServer = function () {
        if (this.currentIpElement == null)
            return;
        var curr = this.currentIpElement;
        this.currentIpElement = null;
        var pos = curr.listPos;
        if (pos >= Object.keys(this.ipList).length)
            return;
        var ipes = this.ipList[String(pos)];
        var found = false;
        for (var i = ipes.length - 1; i >= 0; --i) {
            var ipe = ipes[i];
            if (ipe === curr) {
                ipes.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found)
            return false;
        if (Object.keys(ipes).length == 0) {
            while (this.ipList[String(this.order)].length <= 0) {
                this.order = this.order + 1;
                if (this.order >= Object.keys(this.ipList).length) {
                    this.order = 0;
                    this.invalidate();
                    return;
                }
            }
            this.save();
            return;
        }
        var weight = curr.weight / ipes.length;
        for (var _i = 0, ipes_3 = ipes; _i < ipes_3.length; _i++) {
            var ipe = ipes_3[_i];
            ipe.weight += weight;
        }
        this.save();
    };
    IpList.prototype.invalidate = function () {
        this.expiredTime = null;
        this.save();
    };
    Object.defineProperty(IpList.prototype, "isValid", {
        get: function () {
            if (this.ipList == null || Object.keys(this.ipList).length == 0 || this.expiredTime == null)
                return false;
            if (this.zoneCode == null || this.zoneCode.length == 0)
                return false;
            var now = Date.now();
            var expire = Number(this.expiredTime.toString());
            if (now >= expire)
                return false;
            for (var i in this.ipList) {
                var ipes = this.ipList[i];
                for (var _i = 0, ipes_4 = ipes; _i < ipes_4.length; _i++) {
                    var ipe = ipes_4[_i];
                    if (!ipe.isValid())
                        return false;
                }
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    IpList.LOG_TAG = "IpList";
    return IpList;
}());
var DroiHttpSecureResponse = /** @class */ (function (_super) {
    __extends(DroiHttpSecureResponse, _super);
    function DroiHttpSecureResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DroiHttpSecureResponse;
}(droi_http_1.DroiHttpResponse));
exports.DroiHttpSecureResponse = DroiHttpSecureResponse;
var DroiHttpSecure = /** @class */ (function () {
    function DroiHttpSecure() {
    }
    DroiHttpSecure.isEnable = function () {
        if (!DroiHttpSecure.DROI_SECURE_CHECKED) {
            DroiHttpSecure.DROI_SECURE_CHECKED = true;
            DroiHttpSecure.DROI_SECURE_ENABLE = TUTIL.selfTesting();
        }
        return DroiHttpSecure.DROI_SECURE_ENABLE;
    };
    DroiHttpSecure.getUId = function () {
        if (!DroiHttpSecure.isEnable())
            return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.DROI_SECURE_NOT_SUPPORT));
        var keyInvalid = DroiHttpSecure.isKeyInvalid();
        if (!keyInvalid) {
            return Promise.resolve([TUTIL.getKlKeyUID_u().toString(), TUTIL.getKlKeyUID_l().toString()]);
        }
        else {
            return DroiHttpSecure.pickIpList(droi_core_1.DroiCore.getAppId())
                .then(function (ipList) {
                var ipElement = ipList.getCurrent();
                TUTIL.setFakeKlKeyUID_u_UID_l(TUTIL.getKlKeyUID_u().toString(), TUTIL.getKlKeyUID_l().toString());
                return DroiHttpSecure.refreshKey(ipElement, true).then(function (result) {
                    if (result.error.isOk) {
                        return [TUTIL.getKlKeyUID_u().toString(), TUTIL.getKlKeyUID_l().toString()];
                    }
                    else {
                        throw Promise.reject(result.error);
                    }
                });
            });
        }
    };
    DroiHttpSecure.sendRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var appId, error, ipList, err_1, response, rb_error, retryTimes, err_2, ipElement, method, dataBuffer, inputBuffer, isCompressed, keyInvalid, timeValid, headerTimestamp, uidu_1, uidl_1, refreshResult, req, kid, ktype, kver, rsaver, uidu, uidl, dataLen, encoding, headerTs, encBuffer, oriKey, resp, err_3, status_1, droiStatus, drid, outEncoding, outData, needRetry, decBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Reject if not support droi secure
                        if (!DroiHttpSecure.isEnable()) {
                            return [2 /*return*/, Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.DROI_SECURE_NOT_SUPPORT))];
                        }
                        appId = droi_core_1.DroiCore.getAppId();
                        error = new droi_error_1.DroiError(droi_error_1.DroiError.OK);
                        ipList = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, DroiHttpSecure.pickIpList(appId)];
                    case 2:
                        ipList = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        error = err_1;
                        return [3 /*break*/, 4];
                    case 4:
                        response = new DroiHttpSecureResponse();
                        rb_error = false;
                        retryTimes = 0;
                        _a.label = 5;
                    case 5:
                        if (!(retryTimes < 2)) return [3 /*break*/, 18];
                        if (!(IpList == null)) return [3 /*break*/, 10];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        error.code = droi_error_1.DroiError.OK;
                        return [4 /*yield*/, DroiHttpSecure.pickIpList(appId)];
                    case 7:
                        ipList = _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        error = err_2;
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 17];
                    case 10:
                        if (!error.isOk)
                            return [3 /*break*/, 17];
                        // Local time check
                        if (Math.abs(droi_object_1.DroiObject.TIME_SHIFT) > droi_const_1.DroiConstant.TIME_DIFF_THRESHOLD) {
                            error = new droi_error_1.DroiError(droi_error_1.DroiError.TIME_UNCORRECTED);
                            return [3 /*break*/, 18];
                        }
                        ipElement = ipList.getCurrent();
                        if (ipElement == null) {
                            error = new droi_error_1.DroiError(droi_error_1.DroiError.SERVER_NOT_REACHABLE, "no valid ip element");
                            ipList.invalidate();
                            return [3 /*break*/, 17];
                        }
                        method = request.method;
                        // Clean data if method GET / DELETE
                        if (method == droi_http_1.DroiHttpMethod.GET || method == droi_http_1.DroiHttpMethod.DELETE)
                            request.data = null;
                        dataBuffer = null;
                        inputBuffer = null;
                        isCompressed = true;
                        // Compress data
                        if (request.data != null) {
                            dataBuffer = TUTIL.string_to_bytes(utf8.encode(request.data));
                            inputBuffer = TUTIL.compressDeflater(dataBuffer);
                            if (inputBuffer == null) {
                                error = new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "compress fail.");
                                return [3 /*break*/, 18];
                            }
                            // Using original buffer if compression ratio > 100%
                            if (inputBuffer.length >= dataBuffer.length) {
                                inputBuffer = dataBuffer;
                                isCompressed = false;
                            }
                        }
                        keyInvalid = DroiHttpSecure.isKeyInvalid();
                        timeValid = TUTIL.timeStampIsValid();
                        // Load cached timestamp first
                        if (!timeValid) {
                            headerTimestamp = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_KL_TIMESTAMPV2);
                            if (headerTimestamp != null) {
                                TUTIL.setTimeStampHeader(headerTimestamp);
                                timeValid = TUTIL.timeStampIsValid();
                            }
                        }
                        if (!(keyInvalid || !timeValid)) return [3 /*break*/, 12];
                        if (keyInvalid) {
                            uidu_1 = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_DEVICE_ID_HIGH) || TUTIL.getKlKeyUID_u().toString();
                            uidl_1 = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_DEVICE_ID_LOW) || TUTIL.getKlKeyUID_l().toString();
                            TUTIL.setFakeKlKeyUID_u_UID_l(uidu_1, uidl_1);
                        }
                        else if (!timeValid)
                            DroiHttpSecure.invalidAndEraseKey();
                        return [4 /*yield*/, DroiHttpSecure.refreshKey(ipElement, true)];
                    case 11:
                        refreshResult = _a.sent();
                        if (!refreshResult.error.isOk) {
                            error = refreshResult.error;
                            response.droiStatusCode = refreshResult.droiStatus;
                            if (refreshResult.droiStatus == droi_const_1.DroiConstant.X_DROI_STAT_ZONECODE_EXPIRED || refreshResult.droiStatus == droi_const_1.DroiConstant.X_DROI_STAT_ZONE_EXPIRED_INVALID || refreshResult.droiStatus == droi_const_1.DroiConstant.X_DROI_STAT_ZONECODE_MISSING) {
                                ipList.zoneCode = null;
                                ipList.invalidate();
                            }
                            ipList.nextServer();
                            return [3 /*break*/, 17];
                        }
                        _a.label = 12;
                    case 12:
                        req = new droi_http_1.DroiHttpRequest();
                        req.method = request.method;
                        req.url = DroiHttpSecure.getURLWithRequest(request, ipElement);
                        req.headers = JSON.parse(JSON.stringify(request.headers));
                        req.isBinary = true;
                        kid = TUTIL.getKlKeyID().toString();
                        ktype = TUTIL.getKlKeyType();
                        kver = TUTIL.getKlKeyVersion();
                        rsaver = TUTIL.rsaKeyVersion;
                        uidu = TUTIL.getKlKeyUID_u().toString();
                        uidl = TUTIL.getKlKeyUID_l().toString();
                        dataLen = dataBuffer == null ? 0 : dataBuffer.length;
                        encoding = "Droi";
                        if (isCompressed)
                            encoding = encoding + "-gzip";
                        req.headers["Content-Type"] = "application/octet-stream";
                        req.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_ID] = DroiHttpSecure.setDroiHttpRequestHeader(kid, ktype, kver, droi_const_1.DroiConstant.COMMUNICATION_PROTOCOL_VERSION, rsaver, dataLen, uidu, uidl);
                        req.headers[droi_const_1.DroiConstant.HTTP_HEADER_CONTENT_ENCODING] = encoding;
                        // req.headers["Accept-Encoding"] = "gzip";
                        if (ipList.zoneCode)
                            req.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_ZC] = ipList.zoneCode;
                        headerTs = TUTIL.getTimeStampHeader();
                        req.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_TS] = headerTs;
                        encBuffer = null;
                        oriKey = TUTIL.klKeyGet();
                        if (inputBuffer != null) {
                            encBuffer = DroiHttpSecure.encodeBuffer(inputBuffer, headerTs);
                            // Encrypt fail. Clear cache key and retry again.
                            if (encBuffer == null) {
                                DroiHttpSecure.invalidAndEraseKey();
                                error.code = droi_error_1.DroiError.ERROR;
                                error.appendMessage = "encrypt data fail.";
                                return [3 /*break*/, 17];
                            }
                            req.data = Buffer.from(encBuffer.buffer);
                        }
                        droi_log_1.DroiLog.d(DroiHttpSecure.LOG_TAG, "  Input: " + request.data);
                        resp = null;
                        _a.label = 13;
                    case 13:
                        _a.trys.push([13, 15, , 16]);
                        return [4 /*yield*/, droi_http_1.DroiHttp.sendRequest(req)];
                    case 14:
                        resp = _a.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        err_3 = _a.sent();
                        error = err_3;
                        if (error.code == droi_error_1.DroiError.TIMEOUT)
                            return [3 /*break*/, 18];
                        else
                            return [3 /*break*/, 17];
                        return [3 /*break*/, 16];
                    case 16:
                        status_1 = resp.status;
                        droiStatus = Number(resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_STATUS.toLowerCase()] || "-999");
                        drid = resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_REQUEST_ID.toLowerCase()] || "";
                        outEncoding = resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_CONTENT_ENCODING.toLowerCase()];
                        outData = resp.data;
                        response.requestId = drid;
                        if (droiStatus < 0) {
                            needRetry = true;
                            switch (droiStatus) {
                                // Zone code error, just invalidate zonecode
                                case droi_const_1.DroiConstant.X_DROI_STAT_ZONE_EXPIRED_INVALID:
                                case droi_const_1.DroiConstant.X_DROI_STAT_ZONECODE_EXPIRED:
                                case droi_const_1.DroiConstant.X_DROI_STAT_ZONECODE_MISSING:
                                    ipList.zoneCode = null;
                                    ipList.invalidate();
                                    break;
                                // Just retry, do not validate again.
                                case droi_const_1.DroiConstant.X_DROI_STAT_ILLEGAL_CLIENT_KEY:
                                case droi_const_1.DroiConstant.X_DROI_STAT_BACKEND_NETWORK_ERROR:
                                case droi_const_1.DroiConstant.X_DROI_STAT_RSA_PUBKEY_ERROR:
                                    break;
                                // Attack! just return or No retry and not clear key
                                case droi_const_1.DroiConstant.X_DROI_STAT_RB_TS_VERIFY_ERROR:
                                case droi_const_1.DroiConstant.X_DROI_STAT_RB_LZ4_DECOMPRESS_ERROR:
                                    needRetry = false;
                                    break;
                                // Timestamp timeout.
                                case droi_const_1.DroiConstant.X_DROI_STAT_KEY_SERVER_ISSUE_REKEY:
                                case droi_const_1.DroiConstant.X_DROI_STAT_TS_TIMEOUT:
                                    TUTIL.setTimeStampValid(false);
                                    droi_persist_settings_1.DroiPersistSettings.removeItem(droi_persist_settings_1.DroiPersistSettings.KEY_KL_TIMESTAMPV2);
                                    break;
                                case droi_const_1.DroiConstant.X_DROI_STAT_RB_DECRYPT_ERROR:
                                case droi_const_1.DroiConstant.X_DROI_STAT_RB_GUNZIP_ERROR:
                                    if (rb_error)
                                        needRetry = false;
                                    else {
                                        DroiHttpSecure.invalidAndEraseKey();
                                        rb_error = true;
                                    }
                                    break;
                                default:
                                    DroiHttpSecure.invalidAndEraseKey();
                                    break;
                            }
                            if (needRetry)
                                return [3 /*break*/, 17];
                            else
                                return [3 /*break*/, 18];
                        }
                        if (outEncoding == null) {
                            error.code = droi_error_1.DroiError.ERROR;
                            error.appendMessage = "No response encoding.";
                            return [3 /*break*/, 18];
                        }
                        try {
                            if (outData != null) {
                                TUTIL.klKeyAlloc(oriKey);
                                encBuffer = TUTIL.string_to_bytes(outData);
                                decBuffer = TUTIL.aesDecrypt(encBuffer);
                                if (outEncoding.indexOf("gzip") > 0) {
                                    decBuffer = TUTIL.decompress(decBuffer);
                                }
                                resp.data = utf8.decode(TUTIL.bytes_to_string(decBuffer));
                            }
                        }
                        catch (error) {
                            error.code = droi_error_1.DroiError.ERROR;
                            error.appendMessage = error.toString();
                            DroiHttpSecure.invalidAndEraseKey();
                            return [3 /*break*/, 17];
                        }
                        response.status = status_1;
                        response.droiStatusCode = droiStatus;
                        response.headers = JSON.parse(JSON.stringify(resp.headers));
                        response.data = resp.data;
                        droi_log_1.DroiLog.d(DroiHttpSecure.LOG_TAG, " Output: " + response.data);
                        error.code = droi_error_1.DroiError.OK;
                        error.appendMessage = null;
                        return [3 /*break*/, 18];
                    case 17:
                        ++retryTimes;
                        return [3 /*break*/, 5];
                    case 18:
                        if (!error.isOk) {
                            return [2 /*return*/, Promise.reject(error)];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(response)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DroiHttpSecure.refreshKey = function (ipElement, needStore) {
        var n1 = Math.ceil(Math.random() * 4294967295) & 0xffffffff;
        var data = TUTIL.genKeyValidationNonce(n1);
        if (data == null)
            return Promise.resolve({ error: new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "gen nonce fail."), droiStatus: -999 });
        var kid = TUTIL.getKlKeyID().toString(); // UINT64
        var ktype = TUTIL.getKlKeyType();
        var kver = TUTIL.getKlKeyVersion();
        var rsaver = TUTIL.rsaKeyVersion;
        var uidu = TUTIL.getKlKeyUID_u().toString(); // UINT64
        var uidl = TUTIL.getKlKeyUID_l().toString(); // UINT64
        var headers = {};
        headers["Content-Type"] = "application/octet-stream";
        headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_ID] = DroiHttpSecure.setDroiHttpRequestHeader(kid, ktype, kver, droi_const_1.DroiConstant.COMMUNICATION_PROTOCOL_VERSION, rsaver, data.length, uidu, uidl);
        var request = new droi_http_1.DroiHttpRequest();
        request.url = DroiHttpSecure.getValidateURL(ipElement);
        request.method = droi_http_1.DroiHttpMethod.POST;
        request.data = Buffer.from(data.buffer);
        request.headers = headers;
        request.isBinary = true;
        return droi_http_1.DroiHttp.sendRequest(request).then(function (resp) {
            var droiStatus = -999;
            if (resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_STATUS.toLowerCase()])
                droiStatus = Number(resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_STATUS.toLowerCase()]);
            if (droiStatus == -999) {
                return { error: new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "validate fail. No headers"), droiStatus: droiStatus };
            }
            var drid = resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_REQUEST_ID.toLowerCase()];
            var error = new droi_error_1.DroiError(droi_error_1.DroiError.OK);
            if (droiStatus == droi_const_1.DroiConstant.DROI_STATUS_CORRECT) {
                var res = TUTIL.chkKeyValidationCorrectNonce(n1, TUTIL.string_to_bytes(resp.data));
                if (!res) {
                    error.code = droi_error_1.DroiError.ERROR;
                    error.appendMessage = "validate correct nonce fail.";
                }
            }
            else if (droiStatus == droi_const_1.DroiConstant.DROI_STATUS_FAILED && resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_OTP.toLowerCase()]) {
                var xor = Number(resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_OTP.toLowerCase()]);
                var res = TUTIL.chkKeyValidationFailedNonce(n1, xor, TUTIL.string_to_bytes(resp.data));
                if (!res) {
                    error.code = droi_error_1.DroiError.ERROR;
                    error.appendMessage = "validate fail nonce fail.";
                }
            }
            else {
                error.code = droi_error_1.DroiError.ERROR;
                error.appendMessage = "validate fail. dstatus = " + droiStatus;
            }
            if (error.isOk && needStore) {
                DroiHttpSecure.storeKlKey();
            }
            if (resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_TS.toLowerCase()]) {
                var headerTimestamp = resp.headers[droi_const_1.DroiConstant.HTTP_HEADER_DROI_TS.toLowerCase()];
                TUTIL.setTimeStampHeader(headerTimestamp);
                var timestamp = TUTIL.decryptTimeStamp(headerTimestamp);
                var now = UINT.UINT64(String(Date.now()));
                if (timestamp.greaterThan(now))
                    droi_object_1.DroiObject.TIME_SHIFT = Number(timestamp.clone().subtract(now).toString());
                else
                    droi_object_1.DroiObject.TIME_SHIFT = Number(now.clone().subtract(timestamp).toString());
                droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_KL_TIMESTAMPV2, headerTimestamp);
            }
            else {
                error.code = droi_error_1.DroiError.ERROR;
                error.appendMessage = "validate fail. no timestamp";
            }
            return { error: error, droiStatus: droiStatus };
        }).catch(function (error) {
            return Promise.resolve({ error: error, droiStatus: -999 });
        });
    };
    DroiHttpSecure.encodeBuffer = function (data, headerTs) {
        var outbuffer = TUTIL.addTimeStampToData(headerTs, data);
        return TUTIL.aesEncrypt(outbuffer);
    };
    DroiHttpSecure.setDroiHttpRequestHeader = function (kid, ktype, kver, commver, rsaver, length, uidu, uidl) {
        var uidType = 2;
        return kid + "," + ktype + "," + kver + "," + commver + "," + rsaver + "," + length + "," + uidu + "," + uidl + "," + uidType;
    };
    DroiHttpSecure.getURL = function (ip, port, resource) {
        return "http://" + ip + ":" + port + resource;
    };
    DroiHttpSecure.getValidateURL = function (ipElement) {
        return DroiHttpSecure.getURL(ipElement.ip, ipElement.port, droi_const_1.DroiConstant.VALIDATE_RESOURCE);
    };
    DroiHttpSecure.getURLWithRequest = function (request, ipElement) {
        return DroiHttpSecure.getURL(ipElement.ip, ipElement.port, request.url);
    };
    DroiHttpSecure.pickIpList = function (appId) {
        var ipList = IpList.load();
        if (ipList == null || !ipList.isValid || ipList.zoneCode == null) {
            return IpList.refresh(appId).then(function (ipl) {
                if (ipl != null && ipl.isValid) {
                    ipl.save();
                    return Promise.resolve(ipl);
                }
                else {
                    var code = droi_error_1.DroiError.SERVER_NOT_REACHABLE;
                    if (ipl != null && (ipl.zoneCode == null || ipl.zoneCode.length == 0))
                        code = droi_error_1.DroiError.APPLICATION_ID_UNCORRECTED;
                    return Promise.reject(new droi_error_1.DroiError(code, "in IpList"));
                }
            });
        }
        else {
            return Promise.resolve(ipList);
        }
    };
    DroiHttpSecure.isKeyInvalid = function () {
        return (!TUTIL.getKlKeyIsValid() || TUTIL.getKlKeyType() == 0) && (!DroiHttpSecure.eraseAndAllocKlKey() || !TUTIL.getKlKeyIsValid());
    };
    DroiHttpSecure.eraseAndAllocKlKey = function () {
        TUTIL.klKeyFree();
        var keystr = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_KLKEY);
        if (!keystr)
            return false;
        TUTIL.klKeyAlloc(TUTIL.base64_to_bytes(keystr));
        return true;
    };
    DroiHttpSecure.invalidAndEraseKey = function () {
        TUTIL.setKlKeyInvalid();
        DroiHttpSecure.storeAndEraseKlKey();
    };
    DroiHttpSecure.storeAndEraseKlKey = function () {
        DroiHttpSecure.storeKlKey();
        TUTIL.klKeyFree();
    };
    DroiHttpSecure.storeKlKey = function () {
        var data = TUTIL.klKeyGet();
        var outStr = TUTIL.bytes_to_base64(data);
        droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_KLKEY, outStr);
    };
    DroiHttpSecure.DROI_SECURE_ENABLE = false;
    DroiHttpSecure.DROI_SECURE_CHECKED = false;
    DroiHttpSecure.LOG_TAG = "DroiSecure";
    return DroiHttpSecure;
}());
exports.DroiHttpSecure = DroiHttpSecure;
