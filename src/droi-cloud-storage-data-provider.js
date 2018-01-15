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
var droi_error_1 = require("./droi-error");
var droi_object_1 = require("./droi-object");
var droi_const_1 = require("./droi-const");
var object_1 = require("./rest/object");
var user_1 = require("./rest/user");
var group_1 = require("./rest/group");
var CloudStorageDataProvider = /** @class */ (function () {
    function CloudStorageDataProvider() {
    }
    CloudStorageDataProvider.prototype.getRestHandler = function (tableName) {
        if (tableName === user_1.RestUser.TABLE_NAME)
            return user_1.RestUser.instance();
        else if (tableName === group_1.RestGroup.TABLE_NAME)
            return group_1.RestGroup.instance();
        else
            return object_1.RestObject.instance();
    };
    CloudStorageDataProvider.prototype.upsert = function (commands) {
        return __awaiter(this, void 0, void 0, function () {
            var error, obj, referenceObjs, _i, referenceObjs_1, dobj, tableName, restHandler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new droi_error_1.DroiError(droi_error_1.DroiError.OK);
                        obj = commands.getElement(droi_const_1.DroiConstant.DroiQuery_INSERT, 0)[0];
                        referenceObjs = [];
                        droi_object_1.DroiObject.travelDroiObject(obj, function (dobj) {
                            if (obj == dobj)
                                return;
                            referenceObjs.push(dobj);
                        });
                        _i = 0, referenceObjs_1 = referenceObjs;
                        _a.label = 1;
                    case 1:
                        if (!(_i < referenceObjs_1.length)) return [3 /*break*/, 4];
                        dobj = referenceObjs_1[_i];
                        if (!dobj.isDirty) return [3 /*break*/, 3];
                        return [4 /*yield*/, dobj.save()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        // Not dirty, return OK directly
                        if (!obj.isDirty()) {
                            return [2 /*return*/, Promise.resolve(error)];
                        }
                        tableName = commands.getElement(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, 0);
                        restHandler = this.getRestHandler(tableName);
                        return [2 /*return*/, restHandler.upsert(obj.toJson(), obj.objectId(), tableName).then(function (isOk) {
                                return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
                            })];
                }
            });
        });
    };
    CloudStorageDataProvider.prototype.query = function (commands) {
        var tableName = null;
        var res = [];
        if (commands.containsKey(droi_const_1.DroiConstant.DroiQuery_SELECT)) {
            var list = commands.get(droi_const_1.DroiConstant.DroiQuery_SELECT);
            if (list == null || list.length != 1)
                return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.INVALID_PARAMETER, "No table name in query."));
            tableName = list[0];
        }
        var restHandler = this.getRestHandler(tableName);
        var where = this.generateWhere(commands);
        var order = this.generateOrder(commands);
        var offset = NaN;
        var limit = NaN;
        if (commands.containsKey(droi_const_1.DroiConstant.DroiQuery_OFFSET))
            offset = commands.get(droi_const_1.DroiConstant.DroiQuery_OFFSET)[0];
        if (commands.containsKey(droi_const_1.DroiConstant.DroiQuery_LIMIT))
            limit = commands.get(droi_const_1.DroiConstant.DroiQuery_LIMIT)[0];
        var countOnly = commands.containsKey(droi_const_1.DroiConstant.DroiQuery_COUNT);
        return restHandler.query(tableName, where, offset, limit, order, countOnly).then(function (jResult) {
            // Return count only
            if (countOnly && typeof jResult["Count"] !== 'undefined') {
                var count = jResult["Count"];
                delete jResult["Count"];
                return [count];
            }
            var result = [];
            for (var _i = 0, jResult_1 = jResult; _i < jResult_1.length; _i++) {
                var jobj = jResult_1[_i];
                var dobj = droi_object_1.DroiObject.fromJson(jobj);
                if (dobj == null)
                    throw new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, "form droiobject fail. " + JSON.stringify(jobj));
                result.push(dobj);
            }
            return result;
        });
    };
    CloudStorageDataProvider.prototype.updateData = function (commands) {
        var error = new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        var isAtomic = commands.containsKey(droi_const_1.DroiConstant.DroiQuery_ATOMIC);
        var tableName = commands.getElement(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, 0);
        var restHandler = this.getRestHandler(tableName);
        if (isAtomic) {
            var obj = commands.getElement(droi_const_1.DroiConstant.DroiQuery_ATOMIC, 0);
            var list = commands.getElement(droi_const_1.DroiConstant.DroiQuery_ADD, 0);
            var data = {};
            data[list[0]] = list[1];
            return object_1.RestObject.instance().atomicAdd(tableName, obj.objectId(), data)
                .then(function (_) {
                return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
            });
        }
        else {
            var listAdd = commands.get(droi_const_1.DroiConstant.DroiQuery_ADD);
            var listSet = commands.get(droi_const_1.DroiConstant.DroiQuery_SET);
            var jcmd = {};
            if (listAdd != null) {
                for (var _i = 0, listAdd_1 = listAdd; _i < listAdd_1.length; _i++) {
                    var list = listAdd_1[_i];
                    jcmd[list[0]] = { "__op": "Increment", "amount": list[1] };
                }
            }
            if (listSet != null) {
                for (var _a = 0, listSet_1 = listSet; _a < listSet_1.length; _a++) {
                    var list = listSet_1[_a];
                    jcmd[list[0]] = list[1];
                }
            }
            if (Object.keys(jcmd).length == 0) {
                return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.INVALID_PARAMETER, "No set / add in updating"));
            }
            var where = this.generateWhere(commands);
            var order = this.generateOrder(commands);
            var offset = NaN;
            var limit = NaN;
            if (commands.containsKey(droi_const_1.DroiConstant.DroiQuery_OFFSET))
                offset = commands.get(droi_const_1.DroiConstant.DroiQuery_OFFSET)[0];
            if (commands.containsKey(droi_const_1.DroiConstant.DroiQuery_LIMIT))
                limit = commands.get(droi_const_1.DroiConstant.DroiQuery_LIMIT)[0];
            return restHandler.updateData(tableName, JSON.stringify(jcmd), where, offset, limit, order)
                .then(function (_) {
                return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
            });
        }
    };
    CloudStorageDataProvider.prototype.delete = function (commands) {
        var error = new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        var obj = commands.getElement(droi_const_1.DroiConstant.DroiQuery_DELETE, 0)[0];
        // Not dirty, return OK directly
        if (!obj.isDirty()) {
            return Promise.resolve(error);
        }
        var tableName = commands.getElement(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, 0);
        var restHandler = this.getRestHandler(tableName);
        return restHandler.delete(obj.objectId(), tableName).then(function (isOk) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    CloudStorageDataProvider.prototype.generateWhere = function (commands) {
        if (!commands.containsKey(droi_const_1.DroiConstant.DroiQuery_WHERE))
            return null;
        var cond = commands.get(droi_const_1.DroiConstant.DroiQuery_WHERE)[0];
        var jobj = {};
        if (cond.type === droi_const_1.DroiConstant.DroiQuery_COND) {
            var jcond = {};
            var arr = cond.conditions[0];
            arr = this.convertArgumentsFormat(arr);
            if (arr.length < 3) {
                var type = arr[1];
                if (type === droi_const_1.DroiConstant.DroiCondition_ISNULL)
                    jcond[type] = false;
                else if (type === droi_const_1.DroiConstant.DroiCondition_ISNOTNULL)
                    jcond[droi_const_1.DroiConstant.DroiCondition_ISNULL] = true;
            }
            else {
                jcond[arr[1]] = arr[2];
            }
            jobj[arr[0]] = jcond;
        }
        else {
            jobj = this.travel(cond);
        }
        return JSON.stringify(jobj);
    };
    CloudStorageDataProvider.prototype.generateOrder = function (commands) {
        if (!commands.containsKey(droi_const_1.DroiConstant.DroiQuery_ORDERBY))
            return null;
        var list = commands.get(droi_const_1.DroiConstant.DroiQuery_ORDERBY);
        var sb = "";
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var obj = list_1[_i];
            var subList = obj;
            if (subList[1] === droi_const_1.DroiConstant.DroiQuery_DESC)
                sb = sb + "-";
            sb = sb + (subList[0] + ",");
        }
        return sb.substring(0, sb.length - 1);
    };
    CloudStorageDataProvider.prototype.travel = function (cond) {
        var res = {};
        var type = cond.type;
        var conditions = cond.conditions;
        if (type === droi_const_1.DroiConstant.DroiQuery_COND) {
            var args = conditions[0];
            args = this.convertArgumentsFormat(args);
            var jcond = {};
            if (args.length < 3) {
                var condtype = args[1];
                if (condtype === droi_const_1.DroiConstant.DroiCondition_ISNULL)
                    jcond[condtype] = false;
                else if (condtype === droi_const_1.DroiConstant.DroiCondition_ISNOTNULL)
                    jcond[droi_const_1.DroiConstant.DroiCondition_ISNULL] = true;
            }
            else {
                jcond[args[1]] = args[2];
            }
            res[args[0]] = jcond;
        }
        else {
            var values = [];
            for (var _i = 0, conditions_1 = conditions; _i < conditions_1.length; _i++) {
                var subItem = conditions_1[_i];
                if (subItem instanceof Array)
                    values.push(subItem);
                else
                    values.push(this.travel(subItem));
            }
            res[type] = values;
        }
        return res;
    };
    CloudStorageDataProvider.prototype.convertArgumentsFormat = function (arr) {
        if (arr.length < 3)
            return arr;
        var arg = arr[2];
        if (arg instanceof Date)
            arr[2] = arg.toISOString();
        return arr;
    };
    CloudStorageDataProvider.create = function () {
        if (CloudStorageDataProvider.instance == null)
            CloudStorageDataProvider.instance = new CloudStorageDataProvider();
        return CloudStorageDataProvider.instance;
    };
    return CloudStorageDataProvider;
}());
exports.CloudStorageDataProvider = CloudStorageDataProvider;
