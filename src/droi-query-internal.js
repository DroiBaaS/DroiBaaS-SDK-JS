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
Object.defineProperty(exports, "__esModule", { value: true });
var droi_query_1 = require("./droi-query");
var droi_const_1 = require("./droi-const");
var DroiQueryInternal = /** @class */ (function (_super) {
    __extends(DroiQueryInternal, _super);
    function DroiQueryInternal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DroiQueryInternal.create = function (tableName) {
        return new DroiQueryInternal(tableName);
    };
    // Duplicate for create DroiQueryInternal instance (for atomic api)
    DroiQueryInternal.updateData = function (tableName) {
        var query = new DroiQueryInternal(tableName);
        query.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_UPDATE_DATA, 0);
        query.queryCommand.remove(droi_const_1.DroiConstant.DroiQuery_SELECT);
        query.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, tableName);
        return query;
    };
    DroiQueryInternal.upsert = function (droiObject) {
        var query = new DroiQueryInternal(droiObject.tableName());
        query.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_INSERT, [droiObject]);
        query.queryCommand.remove(droi_const_1.DroiConstant.DroiQuery_SELECT);
        query.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, droiObject.tableName());
        return query;
    };
    DroiQueryInternal.delete = function (droiObject) {
        var query = new DroiQueryInternal(droiObject.tableName());
        query.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_DELETE, [droiObject]);
        query.queryCommand.remove(droi_const_1.DroiConstant.DroiQuery_SELECT);
        query.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, droiObject.tableName());
        return query;
    };
    DroiQueryInternal.prototype.atomic = function (droiObject) {
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_ATOMIC, droiObject);
        return this;
    };
    return DroiQueryInternal;
}(droi_query_1.DroiQuery));
exports.DroiQueryInternal = DroiQueryInternal;
