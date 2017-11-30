"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_const_1 = require("./droi-const");
var DroiCondition = /** @class */ (function () {
    function DroiCondition() {
        var _this = this;
        // or( arg: DroiCondition): DroiCondition {
        //     return this.add( DroiConstant.DroiQuery_OR, arg );
        // }
        this.or = function (arg) { return _this.add(droi_const_1.DroiConstant.DroiQuery_OR, arg); };
        this.and = function (arg) { return _this.add(droi_const_1.DroiConstant.DroiQuery_AND, arg); };
        this.conditions = [];
        this.type = droi_const_1.DroiConstant.DroiQuery_COND;
    }
    DroiCondition.prototype.add = function (type, arg) {
        var res = new DroiCondition();
        res.type = type;
        if (this.type == type) {
            this.conditions.forEach(function (item) { return res.conditions.push(item); });
        }
        else {
            res.conditions.push(this);
        }
        if (arg.type == type) {
            arg.conditions.forEach(function (item) { return res.conditions.push(item); });
        }
        else {
            res.conditions.push(arg);
        }
        return res;
    };
    DroiCondition.cond = function (arg1, type, arg2) {
        var args = (arg2 === undefined || arg2 == null) ? [arg1, type] : [arg1, type, arg2];
        var newInstance = new DroiCondition();
        newInstance.conditions.push(args);
        return newInstance;
    };
    DroiCondition.selectIn = function (arg1, items) {
        var args = [arg1, droi_const_1.DroiConstant.DroiCondition_IN, items];
        var newInstance = new DroiCondition();
        newInstance.conditions.push(args);
        return newInstance;
    };
    DroiCondition.notSelectIn = function (arg1, items) {
        var args = [arg1, droi_const_1.DroiConstant.DroiCondition_NOTIN, items];
        var newInstance = new DroiCondition();
        newInstance.conditions.push(args);
        return newInstance;
    };
    //
    DroiCondition.lt = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_LT, arg2); };
    DroiCondition.ltOrEq = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_LT_OR_EQ, arg2); };
    DroiCondition.eq = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_EQ, arg2); };
    DroiCondition.neq = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_NEQ, arg2); };
    DroiCondition.gtOrEq = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_GT_OR_EQ, arg2); };
    DroiCondition.gt = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_GT, arg2); };
    DroiCondition.isNull = function (arg1) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_ISNULL, null); };
    DroiCondition.isNotNull = function (arg1) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_ISNOTNULL, null); };
    DroiCondition.contains = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_CONTAINS, arg2); };
    DroiCondition.notContains = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_NOTCONTAINS, arg2); };
    DroiCondition.startsWith = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_STARTSWITH, arg2); };
    DroiCondition.notStartsWith = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_NOTSTARTSWITH, arg2); };
    DroiCondition.endsWith = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_ENDSWITH, arg2); };
    DroiCondition.notEndsWith = function (arg1, arg2) { return DroiCondition.cond(arg1, droi_const_1.DroiConstant.DroiCondition_NOTENDSWITH, arg2); };
    return DroiCondition;
}());
exports.DroiCondition = DroiCondition;
