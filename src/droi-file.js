"use strict";
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
var droi_object_1 = require("./droi-object");
var droi_error_1 = require("./droi-error");
var md5_1 = require("ts-md5/dist/md5");
var file_1 = require("./rest/file");
var droi_log_1 = require("./droi-log");
var DroiFile = /** @class */ (function (_super) {
    __extends(DroiFile, _super);
    function DroiFile(buffer, name, mimeType) {
        if (name === void 0) { name = null; }
        if (mimeType === void 0) { mimeType = "application/octet-stream"; }
        var _this = _super.call(this, "_File") || this;
        _this.contentDirty = true;
        _this.contentBuffer = null;
        _this.newFile = true;
        name = name || "DroiFile-".concat(_this.objectId());
        _this.contentBuffer = buffer;
        _this.contentDirty = true;
        _this.mimeType = mimeType;
        //
        _this.setValue(DroiFile.DROI_KEY_FILE_NAME, name);
        _this.setValue(DroiFile.DROI_KEY_FILE_FID, 0);
        if (buffer != null) {
            var md5 = new md5_1.Md5().start().appendByteArray(buffer).end();
            _this.setValue(DroiFile.DROI_KEY_FILE_MD5, md5);
            _this.setValue(DroiFile.DROI_KEY_FILE_SIZE, buffer.length);
        }
        else {
            _this.setValue(DroiFile.DROI_KEY_FILE_MD5, 0);
            _this.setValue(DroiFile.DROI_KEY_FILE_SIZE, 0);
        }
        return _this;
    }
    DroiFile.createFile = function (buffer, name, mimeType) {
        if (buffer === void 0) { buffer = null; }
        if (name === void 0) { name = null; }
        if (mimeType === void 0) { mimeType = "application/octet-stream"; }
        var df = new DroiFile(buffer, name, mimeType);
        // Reset newFile flag
        if (buffer == null && name == null)
            df.newFile = false;
        return df;
    };
    Object.defineProperty(DroiFile.prototype, "Size", {
        get: function () {
            var size = this.getValue(DroiFile.DROI_KEY_FILE_SIZE);
            return Number(size);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiFile.prototype, "MD5", {
        get: function () {
            return this.getValue(DroiFile.DROI_KEY_FILE_MD5);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiFile.prototype, "Name", {
        get: function () {
            return this.getValue(DroiFile.DROI_KEY_FILE_NAME);
        },
        enumerable: true,
        configurable: true
    });
    DroiFile.prototype.getUris = function (forceUpdate) {
        // Return value from Dmd extra data set
        if (!forceUpdate) {
            var Dmd = this.getValue(DroiFile.DROI_KEY_FILE_EXTRA);
            if (Dmd !== undefined && Dmd !== null) {
                var uri = Dmd["CDN"];
                if (uri !== undefined)
                    return Promise.resolve([uri]);
            }
        }
        return file_1.RestFile.instance().getUri(this.objectId());
    };
    DroiFile.prototype.update = function (buffer, progress, mimeType) {
        if (progress === void 0) { progress = null; }
        if (mimeType === void 0) { mimeType = "application/octet-stream"; }
        if (buffer == null || buffer.length == 0) {
            return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "The size is zero."));
        }
        var md5 = new md5_1.Md5().start().appendByteArray(buffer).end();
        if (md5 == this.MD5) {
            return Promise.resolve(new droi_error_1.DroiError(droi_error_1.DroiError.OK));
        }
        this.mimeType = mimeType;
        this.contentBuffer = buffer;
        this.contentDirty = true;
        this.mimeType = mimeType;
        //
        this.setValue(DroiFile.DROI_KEY_FILE_MD5, md5);
        this.setValue(DroiFile.DROI_KEY_FILE_SIZE, buffer.length);
        return this.save(progress);
    };
    DroiFile.prototype.save = function (progress) {
        if (progress === void 0) { progress = null; }
        return __awaiter(this, void 0, void 0, function () {
            var error, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Check whether the parameter is correct..
                        if (this.contentDirty && (this.contentBuffer == null || this.contentBuffer.length == 0)) {
                            return [2 /*return*/, Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "The size is zero."))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.saveInternal(this.contentBuffer, progress)];
                    case 2:
                        error = _a.sent();
                        if (error.isOk == false) {
                            return [2 /*return*/, Promise.reject(error)];
                        }
                        this.newFile = false;
                        this.contentDirty = false;
                        return [4 /*yield*/, _super.prototype.save.call(this)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        e_1 = _a.sent();
                        return [2 /*return*/, Promise.reject(e_1)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DroiFile.prototype.delete = function () {
        return file_1.RestFile.instance().delete(this.objectId());
    };
    DroiFile.prototype.isContentDirty = function () {
        return this.contentDirty;
    };
    DroiFile.prototype.saveInternal = function (buffer, progress) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenResults, fileToken, uploadUrl, sessionId, response, result, Dmd, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (buffer == null || buffer.length == 0) {
                            return [2 /*return*/, Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "File content is empty. (No update)"))];
                        }
                        if (this.contentDirty == false) {
                            return [2 /*return*/, Promise.resolve(new droi_error_1.DroiError(droi_error_1.DroiError.OK))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, file_1.RestFile.instance().getUploadToken(this.objectId(), this.Name, this.mimeType, this.Size, this.MD5, this.newFile)];
                    case 2:
                        tokenResults = _a.sent();
                        fileToken = tokenResults["Token"];
                        uploadUrl = tokenResults["UploadUrl"];
                        sessionId = tokenResults["SessionId"];
                        if (tokenResults["Id"] !== undefined) {
                            droi_log_1.DroiLog.d(DroiFile.LOG_TAG, "Replace by new Id: " + tokenResults["Id"]);
                            this.setObjectId(tokenResults["Id"]);
                        }
                        // Upload data to CDN
                        droi_log_1.DroiLog.d(DroiFile.LOG_TAG, "Upload data to CDN");
                        return [4 /*yield*/, file_1.RestFile.instance().upload(uploadUrl, fileToken, sessionId, this.objectId(), this.Name, this.mimeType, this.contentBuffer, progress)];
                    case 3:
                        response = _a.sent();
                        result = JSON.parse(response.data).Result;
                        if (result["FId"] !== undefined) {
                            this.setValue(DroiFile.DROI_KEY_FILE_FID, result["FId"]);
                        }
                        if (result["CDN"] !== undefined) {
                            Dmd = { "CDN": result["CDN"] };
                            this.setValue(DroiFile.DROI_KEY_FILE_EXTRA, Dmd);
                            droi_log_1.DroiLog.d(DroiFile.LOG_TAG, "The CDN link is " + result["CDN"]);
                        }
                        this.contentDirty = false;
                        return [2 /*return*/, Promise.resolve(new droi_error_1.DroiError(droi_error_1.DroiError.OK))];
                    case 4:
                        e_2 = _a.sent();
                        droi_log_1.DroiLog.e(DroiFile.LOG_TAG, " There is an error." + e_2);
                        return [2 /*return*/, Promise.reject(e_2)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DroiFile.DROI_KEY_FILE_NAME = "Name";
    DroiFile.DROI_KEY_FILE_MD5 = "MD5";
    DroiFile.DROI_KEY_FILE_SIZE = "Size";
    DroiFile.DROI_KEY_FILE_FID = "Fid";
    DroiFile.DROI_KEY_FILE_EXTRA = "_MongoDmd";
    DroiFile.LOG_TAG = "DroiFile";
    return DroiFile;
}(droi_object_1.DroiObject));
exports.DroiFile = DroiFile;
