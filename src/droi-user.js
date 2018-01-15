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
var droi_core_1 = require("./droi-core");
var user_1 = require("./rest/user");
var droi_persist_settings_1 = require("./droi-persist-settings");
var droi_const_1 = require("./droi-const");
var sha256 = require("sha256");
var DroiUser = /** @class */ (function (_super) {
    __extends(DroiUser, _super);
    function DroiUser() {
        var _this = _super.call(this, "_User") || this;
        _this.session = null;
        _this.setValue(DroiUser.KEY_ENABLE, true);
        _this.setValue(DroiUser.KEY_EMAIL_VERIFIED, false);
        _this.setValue(DroiUser.KEY_PHONE_VERIFIED, false);
        return _this;
    }
    DroiUser.createUser = function () {
        return new DroiUser();
    };
    DroiUser.saveUserCache = function (user) {
        var userData = user.toJson();
        var jdata = { userData: userData, session: user.session };
        droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_SAVED_USER, JSON.stringify(jdata));
    };
    DroiUser.loadUserCache = function () {
        var jstr = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_SAVED_USER);
        if (jstr == null || jstr.length == 0)
            return null;
        var jdata = JSON.parse(jstr);
        var obj = droi_object_1.DroiObject.fromJson(JSON.parse(jdata.userData));
        var user = DroiUser.createUser();
        user.cloneFrom(obj);
        user.session = jdata.session;
        return user;
    };
    DroiUser.cleanUserCache = function () {
        droi_persist_settings_1.DroiPersistSettings.removeItem(droi_persist_settings_1.DroiPersistSettings.KEY_SAVED_USER);
        DroiUser.currentUser = null;
    };
    DroiUser.setCurrentUserToken = function (userObjId, sessionToken) {
        return __awaiter(this, void 0, void 0, function () {
            var fakeUser, dobj, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeUser = DroiUser.createUser();
                        fakeUser.session = { Token: sessionToken, ExpiredAt: new Date((Date.now() + 2952000000)).toISOString() };
                        DroiUser.currentUser = fakeUser;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, DroiUser.fetch("_User", userObjId)];
                    case 2:
                        dobj = _a.sent();
                        user = DroiUser.createUser();
                        user.cloneFrom(dobj);
                        user.session = fakeUser.session;
                        DroiUser.currentUser = user;
                        DroiUser.saveUserCache(user);
                        return [2 /*return*/, Promise.resolve(user)];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DroiUser.getCurrentUser = function () {
        if (DroiUser.currentUser != null)
            return DroiUser.currentUser;
        var user = DroiUser.loadUserCache();
        if (user == null)
            return null;
        DroiUser.currentUser = user;
        return user;
    };
    DroiUser.loginAnonymous = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        user = DroiUser.getCurrentUser();
                        if (user != null && user.isLoggedIn) {
                            return [2 /*return*/, Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.USER_ALREADY_LOGIN))];
                        }
                        user = DroiUser.createUser();
                        _b = (_a = user).setValue;
                        _c = ["UserId"];
                        _d = droi_core_1.DroiCore.getInstallationId();
                        return [4 /*yield*/, droi_core_1.DroiCore.getDeviceId()];
                    case 1:
                        _b.apply(_a, _c.concat([_d + (_e.sent())]));
                        user.setValue("AuthData", { "anonymous": "1" });
                        return [2 /*return*/, user_1.RestUser.instance().loginAnonymous(user)
                                .then(function (jlogin) {
                                var token = jlogin["Token"];
                                var expired = jlogin["ExpiredAt"];
                                var juser = jlogin["Data"];
                                var user = droi_object_1.DroiObject.fromJson(juser);
                                user.session = { Token: token, ExpiredAt: expired };
                                DroiUser.currentUser = user;
                                DroiUser.saveUserCache(user);
                                return user;
                            })];
                }
            });
        });
    };
    DroiUser.login = function (userId, password) {
        if (userId == null || password == null) {
            return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.INVALID_PARAMETER, "Empty UserId or Password"));
        }
        // User already logged in
        var curUser = DroiUser.getCurrentUser();
        if (curUser != null && curUser.isLoggedIn() && !curUser.isAnonymous()) {
            return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.USER_ALREADY_LOGIN));
        }
        return user_1.RestUser.instance().loginUser(userId, sha256(password))
            .then(function (jresult) {
            var user = DroiUser.createUser();
            var obj = droi_object_1.DroiObject.fromJson(jresult["Data"]);
            user.cloneFrom(obj);
            user.session = { Token: jresult["Token"], ExpiredAt: jresult["ExpiredAt"] };
            DroiUser.saveUserCache(user);
            DroiUser.currentUser = user;
            return user;
        });
    };
    DroiUser.loginOTP = function (contact, type, otpCode, userId) {
        userId = userId || "droiotp_" + contact;
        var user = DroiUser.createUser();
        user.UserId = userId;
        if (type == user_1.OtpType.EMAIL) {
            user.Email = contact;
        }
        else {
            user.PhoneNum = contact;
        }
        return user_1.RestUser.instance().loginOTP(otpCode, type, JSON.parse(user.toJson()))
            .then(function (jdata) {
            var user = DroiUser.createUser();
            var obj = droi_object_1.DroiObject.fromJson(jdata["Data"]);
            user.cloneFrom(obj);
            user.session = { Token: jdata["Token"], ExpiredAt: jdata["ExpiredAt"] };
            DroiUser.saveUserCache(user);
            DroiUser.currentUser = user;
            return user;
        });
    };
    DroiUser.resetPassword = function (userId, type) {
        return user_1.RestUser.instance().resetPassword(userId, type)
            .then(function (_) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiUser.requestOTP = function (contact, type, userId) {
        userId = userId || "droiotp_" + contact;
        return user_1.RestUser.instance().requestOTP(userId, contact, type)
            .then(function (_) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiUser.prototype.signup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currUser, e_1, error, authData, _a, _b, _c, userData, juser, jresult, e_2, error;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Needed parameters check
                        if (this.getValue(DroiUser.KEY_USERID) == null || this.password == null) {
                            return [2 /*return*/, Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.INVALID_PARAMETER, "Empty UserId or Password."))];
                        }
                        currUser = DroiUser.getCurrentUser();
                        if (!(currUser != null && currUser.isLoggedIn())) return [3 /*break*/, 6];
                        if (!(currUser.objectId() === this.objectId() && currUser.isAnonymous()))
                            return [2 /*return*/, Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.USER_ALREADY_LOGIN))];
                        this.setValue(DroiUser.KEY_AUTHDATA, null);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, _super.prototype.save.call(this)];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _d.sent();
                        error = e_1;
                        if (error.code == droi_const_1.DroiConstant.DROI_API_RECORD_CONFLICT)
                            error.code = droi_error_1.DroiError.USER_ALREADY_EXISTS;
                        authData = {};
                        authData[user_1.RestUser.USER_TYPE_ANONYMOUS] = "1";
                        this.setValue(DroiUser.KEY_AUTHDATA, authData);
                        _a = this.setValue;
                        _b = [DroiUser.KEY_USERID];
                        _c = droi_core_1.DroiCore.getInstallationId();
                        return [4 /*yield*/, droi_core_1.DroiCore.getDeviceId()];
                    case 4:
                        _a.apply(this, _b.concat([_c + (_d.sent())]));
                        this.password = null;
                        return [2 /*return*/, Promise.reject(error)];
                    case 5:
                        DroiUser.saveUserCache(this);
                        return [2 /*return*/, this.changePassword("", this.password)];
                    case 6:
                        // Standard normal user signup
                        this.setValue(DroiUser.KEY_AUTHDATA, null);
                        userData = this.toJson();
                        juser = JSON.parse(userData);
                        juser["Password"] = sha256(this.password);
                        this.password = null;
                        _d.label = 7;
                    case 7:
                        _d.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, user_1.RestUser.instance().signupUser(juser)];
                    case 8:
                        jresult = _d.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        e_2 = _d.sent();
                        error = e_2;
                        if (error.code == droi_const_1.DroiConstant.DROI_API_RECORD_CONFLICT || error.code == droi_const_1.DroiConstant.DROI_API_USER_EXISTS)
                            error.code = droi_error_1.DroiError.USER_ALREADY_EXISTS;
                        return [2 /*return*/, Promise.reject(error)];
                    case 10:
                        this.session = { Token: jresult["Token"], ExpiredAt: jresult["ExpiredAt"] };
                        DroiUser.currentUser = this;
                        DroiUser.saveUserCache(this);
                        return [2 /*return*/, _super.prototype.save.call(this)];
                }
            });
        });
    };
    DroiUser.prototype.delete = function () {
        return _super.prototype.delete.call(this)
            .then(function (droiError) {
            DroiUser.cleanUserCache();
            return droiError;
        })
            .catch(function (error) {
            DroiUser.cleanUserCache();
            return error;
        });
    };
    DroiUser.prototype.logout = function () {
        if (!this.isLoggedIn()) {
            return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.USER_NOT_AUTHORIZED));
        }
        return user_1.RestUser.instance().logout(this.objectId())
            .then(function (_) {
            DroiUser.cleanUserCache();
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiUser.prototype.isLoggedIn = function () {
        if (this.session == null)
            return false;
        if (this.session["Token"] == null || this.session["ExpiredAt"] == null)
            return false;
        var date = Date.parse(this.session["ExpiredAt"]);
        if (isNaN(date))
            return false;
        if (Date.now() >= date)
            return false;
        return true;
    };
    DroiUser.prototype.isAnonymous = function () {
        var authData = this.getValue(DroiUser.KEY_AUTHDATA);
        return authData != null && authData[user_1.RestUser.USER_TYPE_ANONYMOUS] != null;
    };
    DroiUser.prototype.isEnable = function () {
        return this.getValue(DroiUser.KEY_ENABLE) || false;
    };
    DroiUser.prototype.isEmailVerified = function () {
        return this.getValue(DroiUser.KEY_EMAIL_VERIFIED) || false;
    };
    DroiUser.prototype.isPhoneNumVerified = function () {
        return this.getValue(DroiUser.KEY_PHONE_VERIFIED) || false;
    };
    DroiUser.prototype.changePassword = function (oldPassword, newPassword) {
        return user_1.RestUser.instance().changePassword(sha256(oldPassword), sha256(newPassword))
            .then(function (_) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiUser.prototype.validateEmail = function () {
        return user_1.RestUser.instance().validateEmail()
            .then(function (_) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiUser.prototype.validatePhoneNum = function () {
        return user_1.RestUser.instance().validatePhoneNum()
            .then(function (_) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiUser.prototype.confirmPhoneNumPin = function (pin) {
        return user_1.RestUser.instance().confirmPhoneNumPin(pin)
            .then(function (_) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiUser.prototype.cloneFrom = function (droiObject) {
        _super.prototype.cloneFrom.call(this, droiObject);
        if (droiObject instanceof DroiUser) {
            var user = droiObject;
            this.UserId = user.UserId;
            this.Password = user.Password;
            this.Email = user.Email;
            this.PhoneNum = user.PhoneNum;
            this.session = user.session;
            this.setValue(DroiUser.KEY_AUTHDATA, user.getValue(DroiUser.KEY_AUTHDATA));
        }
    };
    Object.defineProperty(DroiUser.prototype, "Password", {
        get: function () {
            return this.password;
        },
        set: function (password) {
            this.password = password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiUser.prototype, "UserId", {
        get: function () {
            return this.getValue(DroiUser.KEY_USERID);
        },
        set: function (id) {
            this.setValue(DroiUser.KEY_USERID, id);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiUser.prototype, "Email", {
        get: function () {
            return this.getValue(DroiUser.KEY_EMAIL);
        },
        set: function (email) {
            this.setValue(DroiUser.KEY_EMAIL, email);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiUser.prototype, "PhoneNum", {
        get: function () {
            return this.getValue(DroiUser.KEY_PHONENUM);
        },
        set: function (phone) {
            this.setValue(DroiUser.KEY_PHONENUM, phone);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiUser.prototype, "sessionToken", {
        get: function () {
            if (!this.isLoggedIn())
                return null;
            return this.session["Token"];
        },
        enumerable: true,
        configurable: true
    });
    DroiUser.KEY_USERID = "UserId";
    DroiUser.KEY_AUTHDATA = "AuthData";
    DroiUser.KEY_EMAIL = "Email";
    DroiUser.KEY_PHONENUM = "PhoneNum";
    DroiUser.KEY_ENABLE = "Enabled";
    DroiUser.KEY_EMAIL_VERIFIED = "EmailVerified";
    DroiUser.KEY_PHONE_VERIFIED = "PhoneNumVerified";
    DroiUser.currentUser = null;
    return DroiUser;
}(droi_object_1.DroiObject));
exports.DroiUser = DroiUser;
