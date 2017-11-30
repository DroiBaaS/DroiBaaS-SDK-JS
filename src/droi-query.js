"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_error_1 = require("./droi-error");
var droi_multimap_1 = require("./droi-multimap");
var droi_const_1 = require("./droi-const");
var droi_cloud_storage_data_provider_1 = require("./droi-cloud-storage-data-provider");
var DroiQuery = /** @class */ (function () {
    function DroiQuery(tableName) {
        this.queryCommand = new droi_multimap_1.ArrayListMultimap();
        //
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_SELECT, tableName);
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, tableName);
    }
    DroiQuery.create = function (tableName) {
        return new DroiQuery(tableName);
    };
    DroiQuery.updateData = function (tableName) {
        var query = new DroiQuery(tableName);
        query.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_UPDATE_DATA, 0);
        query.queryCommand.remove(droi_const_1.DroiConstant.DroiQuery_SELECT);
        query.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, tableName);
        return query;
    };
    DroiQuery.prototype.run = function () {
        return this.runQuery().then(function (res) {
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiQuery.prototype.count = function () {
        if (!this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_SELECT)) {
            return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.INVALID_PARAMETER, "Only support Query command"));
        }
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_COUNT, 1);
        return this.runQuery().then(function (res) {
            if (res.length <= 0)
                throw new droi_error_1.DroiError(droi_error_1.DroiError.ERROR);
            var counter = res[0];
            return counter;
        });
    };
    DroiQuery.prototype.runQuery = function () {
        try {
            this.throwIfTheCommandInvalid();
        }
        catch (e) {
            return Promise.reject(new droi_error_1.DroiError(droi_error_1.DroiError.ERROR, e.message));
        }
        // 
        var dp = droi_cloud_storage_data_provider_1.CloudStorageDataProvider.create();
        if (this.queryAction == droi_const_1.DroiConstant.DroiQuery_UPDATE_DATA) {
            return dp.updateData(this.queryCommand).then(function (_) {
                return null;
            });
        }
        else {
            this.queryCommand.remove(droi_const_1.DroiConstant.DroiQuery_SET);
            this.queryCommand.remove(droi_const_1.DroiConstant.DroiQuery_ATOMIC);
            this.queryCommand.remove(droi_const_1.DroiConstant.DroiQuery_ADD);
            this.queryCommand.remove(droi_const_1.DroiConstant.DroiQuery_UPDATE_DATA);
            //
            var callback = null;
            switch (this.queryAction) {
                case droi_const_1.DroiConstant.DroiQuery_SELECT:
                    return dp.query(this.queryCommand);
                case droi_const_1.DroiConstant.DroiQuery_INSERT:
                case droi_const_1.DroiConstant.DroiQuery_UPDATE:
                    return dp.upsert(this.queryCommand).then(function () {
                        return null;
                    });
                case droi_const_1.DroiConstant.DroiQuery_DELETE:
                    return dp.delete(this.queryCommand).then(function () {
                        return null;
                    });
            }
        }
    };
    //
    DroiQuery.prototype.where = function (cond) {
        if (this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_WHERE)) {
            throw "There is WHERE condition object in command queue.";
        }
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_WHERE, cond);
        return this;
    };
    DroiQuery.prototype.orderBy = function (fieldName, ascending) {
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_ORDERBY, [fieldName, ascending ? droi_const_1.DroiConstant.DroiQuery_ASC : droi_const_1.DroiConstant.DroiQuery_DESC]);
        return this;
    };
    DroiQuery.prototype.limit = function (limitSize) {
        if (this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_LIMIT)) {
            throw "There is LIMIT condition object in command queue.";
        }
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_LIMIT, limitSize);
        return this;
    };
    DroiQuery.prototype.offset = function (position) {
        if (this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_OFFSET)) {
            throw "There is OFFSET condition object in command queue.";
        }
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_OFFSET, position);
        return this;
    };
    DroiQuery.prototype.add = function (field, amount) {
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_ADD, [field, amount]);
        return this;
    };
    DroiQuery.prototype.set = function (field, value) {
        this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_SET, [field, value]);
        return this;
    };
    DroiQuery.prototype.getTableName = function () {
        // 
        var tableName = this.queryCommand.getElement(droi_const_1.DroiConstant.DroiQuery_TABLE_NAME, 0);
        return tableName;
    };
    DroiQuery.prototype.throwIfTheCommandInvalid = function () {
        // Check whether the action is correct
        var actionList = [droi_const_1.DroiConstant.DroiQuery_SELECT, droi_const_1.DroiConstant.DroiQuery_INSERT, droi_const_1.DroiConstant.DroiQuery_DELETE, droi_const_1.DroiConstant.DroiQuery_UPDATE, droi_const_1.DroiConstant.DroiQuery_UPDATE_DATA];
        var fs_counter = 0;
        for (var _i = 0, actionList_1 = actionList; _i < actionList_1.length; _i++) {
            var action = actionList_1[_i];
            if (this.queryCommand.containsKey(action)) {
                fs_counter++;
                this.queryAction = action;
            }
        }
        if (fs_counter > 1) {
            throw "Your query needs only one of SELECT, DELETE, INSERT or UPDATE";
        }
        else if (fs_counter == 0) {
            this.queryCommand.put(droi_const_1.DroiConstant.DroiQuery_SELECT, "*");
            this.queryAction = droi_const_1.DroiConstant.DroiQuery_SELECT;
        }
        // Check whether Insertion operation is correct
        if (this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_INSERT) &&
            (this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_OR) || this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_AND) ||
                this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_WHERE) || this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_INC) ||
                this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_DEC) || this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_SET) ||
                this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_ADD))) {
            throw "Insert command cannot combine with OR/AND/WHERE command.";
        }
        if ((this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_OR) || this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_AND)) && !this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_WHERE)) {
            throw "Your query should one of WHERE statement for OR/AND statement.";
        }
        if (this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_UPDATE_DATA) && this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_ADD)
            && this.queryCommand.containsKey(droi_const_1.DroiConstant.DroiQuery_SET)) {
            throw "Your query must one update statement. (add / set)";
        }
    };
    return DroiQuery;
}());
exports.DroiQuery = DroiQuery;
