"use strict";
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
var droi_const_1 = require("./droi-const");
var droi_permission_1 = require("./droi-permission");
var droi_error_1 = require("./droi-error");
var droi_query_internal_1 = require("./droi-query-internal");
var droi_condition_1 = require("./droi-condition");
var Dictionary = /** @class */ (function () {
    function Dictionary() {
    }
    return Dictionary;
}());
// http://stackoverflow.com/questions/26501688/a-typescript-guid-class
var Guid = /** @class */ (function () {
    function Guid() {
    }
    Guid.newGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return Guid;
}());
exports.Guid = Guid;
var DirtyFlag;
(function (DirtyFlag) {
    DirtyFlag[DirtyFlag["DIRTY_FLAG_BODY"] = 1] = "DIRTY_FLAG_BODY";
    DirtyFlag[DirtyFlag["DIRTY_FLAG_REFERENCE"] = 2] = "DIRTY_FLAG_REFERENCE";
})(DirtyFlag || (DirtyFlag = {}));
;
/**
 *
 */
var DroiObject = /** @class */ (function () {
    function DroiObject(tableName) {
        this.properties = {};
        this.dirtyFlags = DirtyFlag.DIRTY_FLAG_BODY;
        // createdTime, modifiedTime
        var currentDate = new Date();
        this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_CLASSNAME] = tableName;
        this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_OBJECTID] = Guid.newGuid().replace(/-/g, "").substring(8);
        this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_CREATION_TIME] = currentDate.toISOString();
        this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_MODIFIED_TIME] = currentDate.toISOString();
    }
    /**
     * Create DroiObject instance by specific table name
     * @param tableName Table name of collection
     */
    DroiObject.createObject = function (tableName) {
        if (DroiObject.factoryies.hasOwnProperty(tableName)) {
            return DroiObject.factoryies[tableName]();
        }
        return new DroiObject(tableName);
    };
    /**
     * The object Id of DroiObject
     */
    DroiObject.prototype.objectId = function () {
        return this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_OBJECTID];
    };
    DroiObject.prototype.setObjectId = function (objectId) {
        this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_OBJECTID] = objectId;
    };
    DroiObject.prototype.creationTime = function () {
        var ct = this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_CREATION_TIME];
        var res = new Date(ct);
        return res;
    };
    DroiObject.prototype.modifiedTime = function () {
        var mt = this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_MODIFIED_TIME];
        var res = new Date(mt);
        return res;
    };
    DroiObject.prototype.tableName = function () {
        return this.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_CLASSNAME];
    };
    DroiObject.prototype.setValue = function (keyName, value) {
        if (keyName == droi_const_1.DroiConstant.DROI_KEY_JSON_OBJECTID ||
            keyName == droi_const_1.DroiConstant.DROI_KEY_JSON_CREATION_TIME ||
            keyName == droi_const_1.DroiConstant.DROI_KEY_JSON_MODIFIED_TIME ||
            keyName == droi_const_1.DroiConstant.DROI_KEY_JSON_CLASSNAME)
            return;
        if (value == null) {
            // Check whether the data is in properties
            if (this.properties.hasOwnProperty(keyName)) {
                delete this.properties[keyName];
                this.dirtyFlags |= DirtyFlag.DIRTY_FLAG_BODY;
            }
            return;
        }
        // TODO: Normally, we should check the datatype of all variables
        var val = null;
        if (value instanceof Date) {
            val = value.toISOString();
        }
        else if (value instanceof DroiObject) {
            val = value;
        }
        else if (value instanceof Array) {
            var r = [];
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var i = value_1[_i];
                r.push(i);
            }
            val = r;
        }
        else if (typeof value === 'object') {
            var dict = {};
            for (var item in value) {
                dict[item] = value[item];
            }
            val = dict;
        }
        else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
            val = value;
        // Return the value
        if (val != null) {
            if (val != this.properties[keyName])
                this.dirtyFlags |= DirtyFlag.DIRTY_FLAG_BODY;
            this.properties[keyName] = val;
        }
    };
    DroiObject.prototype.getValue = function (keyName) {
        if (keyName == droi_const_1.DroiConstant.DROI_KEY_JSON_OBJECTID ||
            keyName == droi_const_1.DroiConstant.DROI_KEY_JSON_CREATION_TIME ||
            keyName == droi_const_1.DroiConstant.DROI_KEY_JSON_MODIFIED_TIME ||
            keyName == droi_const_1.DroiConstant.DROI_KEY_JSON_CLASSNAME ||
            this.properties[keyName] === undefined)
            return null;
        return this.properties[keyName];
    };
    DroiObject.saveAll = function (items) {
        return null;
    };
    DroiObject.fetch = function (tableName, objectId) {
        return droi_query_internal_1.DroiQueryInternal.create(tableName).where(droi_condition_1.DroiCondition.cond(droi_const_1.DroiConstant.DROI_KEY_JSON_OBJECTID, droi_const_1.DroiConstant.DroiCondition_EQ, objectId)).runQuery().then(function (res) {
            if (res.length > 0)
                return res[0];
            return null;
        });
    };
    DroiObject.prototype.save = function () {
        return this.funcTemplate(this.saveToStorage);
    };
    DroiObject.prototype.delete = function () {
        return this.funcTemplate(this.deleteFromStorage);
    };
    DroiObject.prototype.atomicAdd = function (field, amount) {
        return this.funcTemplate(function (self) {
            return __awaiter(this, void 0, void 0, function () {
                var query, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            //
                            self.checkDirtyFlags();
                            if ((self.dirtyFlags & DirtyFlag.DIRTY_FLAG_BODY) != 0)
                                return [2 /*return*/, Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "DroiObject content dirty"))];
                            query = droi_query_internal_1.DroiQueryInternal.updateData(self.tableName()).atomic(self).add(field, amount);
                            return [4 /*yield*/, query.run()];
                        case 1:
                            error = _a.sent();
                            return [2 /*return*/, error];
                    }
                });
            });
        });
    };
    DroiObject.prototype.funcTemplate = function (func) {
        var _this = this;
        var _self = this;
        var handler = function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var error, e_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, func(_self)];
                    case 1:
                        error = _a.sent();
                        if (error.isOk) {
                            resolve(error);
                        }
                        else {
                            reject(error);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        error = void 0;
                        if (e_1 instanceof droi_error_1.DroiError)
                            error = e_1;
                        else {
                            error = new droi_error_1.DroiError(droi_error_1.DroiError.ERROR);
                        }
                        reject(error);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // Use Promise method
        return new Promise(handler);
    };
    DroiObject.prototype.saveToStorage = function (self) {
        self.checkDirtyFlags();
        // 
        if (self.dirtyFlags == 0) {
            return Promise.resolve(new droi_error_1.DroiError(droi_error_1.DroiError.OK));
        }
        var error = new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        var date = new Date();
        // date = new Date( date.getTime() + TIME_SHIFT );
        self.properties[droi_const_1.DroiConstant.DROI_KEY_JSON_MODIFIED_TIME] = date.toISOString();
        self.dirtyFlags |= DirtyFlag.DIRTY_FLAG_BODY;
        var query = droi_query_internal_1.DroiQueryInternal.upsert(self);
        return query.run().then(function (droiError) {
            self.dirtyFlags = 0;
            return droiError;
        });
    };
    DroiObject.prototype.deleteFromStorage = function (self) {
        var error = new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        var query = droi_query_internal_1.DroiQueryInternal.delete(self);
        return query.run();
    };
    DroiObject.prototype.isDirty = function () {
        return (this.dirtyFlags != 0) ? true : false;
    };
    Object.defineProperty(DroiObject.prototype, "permission", {
        get: function () {
            return this.perm;
        },
        set: function (p) {
            this.dirtyFlags |= DirtyFlag.DIRTY_FLAG_BODY;
            this.perm = p;
        },
        enumerable: true,
        configurable: true
    });
    DroiObject.prototype.checkDirtyFlags = function () {
        var referenceDirty = false;
        var self = this;
        // Check all children
        DroiObject.travelDroiObject(self, function (droiObject) {
            if (self == droiObject)
                return;
            droiObject.checkDirtyFlags();
            referenceDirty = droiObject.isDirty() || referenceDirty;
        });
        if (referenceDirty) {
            self.dirtyFlags |= DirtyFlag.DIRTY_FLAG_REFERENCE;
        }
    };
    DroiObject.prototype.toJson = function (withRef) {
        if (withRef === void 0) { withRef = false; }
        // 
        var clone = DroiObject.exportProperties(this.properties, 0, withRef);
        // Permission
        if (this.permission !== undefined) {
            clone[droi_const_1.DroiConstant.DROI_KEY_JSON_PERMISSION] = this.permission.toJsonObject();
        }
        else if (droi_permission_1.DroiPermission.getDefaultPermission() !== undefined) {
            var perm = droi_permission_1.DroiPermission.getDefaultPermission();
            clone[droi_const_1.DroiConstant.DROI_KEY_JSON_PERMISSION] = perm.toJsonObject();
        }
        return JSON.stringify(clone);
    };
    // For JSON.stringify function
    DroiObject.prototype.toJSON = function () {
        return this.toJson(true);
    };
    /**
     * Clone DroiObject
     * @param droiObject DroiObject
     */
    DroiObject.prototype.cloneFrom = function (droiObject) {
        this.properties = droiObject.properties;
        this.permission = droiObject.permission;
        this.dirtyFlags = droiObject.dirtyFlags;
    };
    DroiObject.fromJson = function (jobj) {
        var res = null;
        // Parse first..
        if (typeof jobj === 'string') {
            try {
                jobj = JSON.parse(jobj);
            }
            catch (e) {
                return null;
            }
        }
        if (jobj instanceof Array) {
            var array = new Array();
            for (var _i = 0, jobj_1 = jobj; _i < jobj_1.length; _i++) {
                var item = jobj_1[_i];
                var r = DroiObject.fromJson(item) || item;
                array.push(item);
            }
            res = array;
        }
        else if (typeof jobj === 'object') {
            // Check whether this object is DroiObject ??
            if (jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_CLASSNAME] !== undefined &&
                jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_OBJECTID] !== undefined &&
                jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_CREATION_TIME] !== undefined &&
                jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_MODIFIED_TIME] !== undefined) {
                var tableName = jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_CLASSNAME];
                // TODO: Check tableName
                var r = DroiObject.createObject(tableName);
                // Copy the key-Value into object
                for (var keyName in jobj) {
                    var v = jobj[keyName];
                    var o = DroiObject.fromJson(v) || v;
                    r.properties[keyName] = o;
                }
                res = r;
            }
            else {
                // Check whether this is reference data value
                if (jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_DATA_TYPE] !== undefined) {
                    var dataTypeName = jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_DATA_TYPE];
                    var r = null;
                    if (dataTypeName == droi_const_1.DroiConstant.DROI_KEY_JSON_REFERENCE_TYPE ||
                        dataTypeName == droi_const_1.DroiConstant.DROI_KEY_JSON_FILE_TYPE) {
                        var refValue = jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_REFERENCE_VALUE];
                        if (refValue !== undefined) {
                            // Error -> null
                            r = DroiObject.fromJson(refValue);
                        }
                    }
                    res = r;
                }
                if (res == null) {
                    // Normal Dictionary structure
                    var dict = {};
                    for (var keyName in jobj) {
                        var v = jobj[keyName];
                        var o = DroiObject.fromJson(v) || v;
                        dict[keyName] = o;
                    }
                    res = dict;
                }
            }
        }
        // Check whether the permission ??
        if (jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_PERMISSION] !== undefined) {
            res.permission = droi_permission_1.DroiPermission.restorePermission(jobj[droi_const_1.DroiConstant.DROI_KEY_JSON_PERMISSION]);
        }
        return res;
    };
    DroiObject.travelDroiObject = function (obj, cb, depthLimit, depth) {
        if (depthLimit === void 0) { depthLimit = 3; }
        if (depth === void 0) { depth = 0; }
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" !== typeof obj || depthLimit <= depth)
            return;
        var dobject = null;
        if (obj instanceof DroiObject) {
            dobject = obj;
            obj = obj.properties;
        }
        // 
        if (obj instanceof Array) {
            for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                var item = obj_1[_i];
                DroiObject.travelDroiObject(item, cb, depthLimit, depth + 1);
            }
        }
        else if (obj instanceof Object) {
            for (var key in obj) {
                DroiObject.travelDroiObject(obj[key], cb, depthLimit, depth + 1);
            }
        }
        //
        if (dobject != null)
            cb(dobject);
    };
    //
    DroiObject.exportProperties = function (obj, depth, withReference) {
        var copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" !== typeof obj)
            return obj;
        if (obj instanceof DroiObject) {
            if (depth == 0 || withReference) {
                return DroiObject.exportProperties(obj.properties, depth + 1, withReference);
            }
            else {
                // export reference only..
                copy = {};
                copy[droi_const_1.DroiConstant.DROI_KEY_JSON_OBJECTID] = obj.objectId();
                copy[droi_const_1.DroiConstant.DROI_KEY_JSON_DATA_TYPE] = droi_const_1.DroiConstant.DROI_KEY_JSON_REFERENCE_TYPE;
                copy[droi_const_1.DroiConstant.DROI_KEY_JSON_TABLE_NAME] = obj.tableName();
                return copy;
            }
        }
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy.toISOString();
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = DroiObject.exportProperties(obj[i], depth + 1, withReference);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = DroiObject.exportProperties(obj[attr], depth + 1, withReference);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    DroiObject.registerCreateFactory = function (tableName, factory) {
        DroiObject.factoryies[tableName] = factory;
    };
    DroiObject.TIME_SHIFT = 0;
    DroiObject.factoryies = {};
    return DroiObject;
}());
exports.DroiObject = DroiObject;
;
