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
var droi_error_1 = require("./droi-error");
var droi_object_1 = require("./droi-object");
var group_1 = require("./rest/group");
var DroiGroup = /** @class */ (function (_super) {
    __extends(DroiGroup, _super);
    function DroiGroup(name) {
        var _this = _super.call(this, "_Group") || this;
        _this.fetchReady = false;
        if (name) {
            _this.Name = name;
        }
        return _this;
    }
    DroiGroup.createGroup = function (name) {
        name = name || "";
        return new DroiGroup(name);
    };
    DroiGroup.getGroupIdByObjectId = function (type, objectId) {
        return group_1.RestGroup.instance().getGroupIdByObjectId(type, objectId);
    };
    DroiGroup.getGroupIdsByUserObjectId = function (objectId) {
        return DroiGroup.getGroupIdByObjectId(0, objectId);
    };
    DroiGroup.getGroupIdsByGroupObjectId = function (objectId) {
        return DroiGroup.getGroupIdByObjectId(1, objectId);
    };
    DroiGroup.prototype.fetchRelation = function () {
        var _this = this;
        return group_1.RestGroup.instance().fetch(this.Name)
            .then(function (json) {
            var group = DroiGroup.fromJson(json);
            _this.cloneFrom(group);
            _this.fetchReady = true;
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        });
    };
    DroiGroup.prototype.addUser = function (objectId) {
        return this.addData(DroiGroup.KEY_USERS, objectId);
    };
    DroiGroup.prototype.removeUser = function (objectId) {
        this.removeData(DroiGroup.KEY_USERS, objectId);
    };
    DroiGroup.prototype.addGroup = function (objectId) {
        return this.addData(DroiGroup.KEY_GROUPS, objectId);
    };
    DroiGroup.prototype.removeGroup = function (objectId) {
        this.removeData(DroiGroup.KEY_GROUPS, objectId);
    };
    DroiGroup.prototype.addData = function (listName, objectId) {
        var users = this.getValue(listName);
        if (users == null) {
            users = [objectId];
            this.setValue(listName, users);
        }
        if (users.indexOf(objectId) >= 0)
            return new droi_error_1.DroiError(droi_error_1.DroiError.INVALID_PARAMETER, "User object id was already existed");
        users.push(objectId);
        this.setValue(listName, users);
    };
    DroiGroup.prototype.removeData = function (listName, objectId) {
        var users = this.getValue(listName);
        if (users == null)
            return;
        var index = users.indexOf(objectId);
        if (index < 0)
            return;
        users.splice(index, 1);
        this.setValue(listName, users);
    };
    Object.defineProperty(DroiGroup.prototype, "isReady", {
        get: function () {
            return this.fetchReady;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiGroup.prototype, "Name", {
        get: function () {
            return this.getValue(DroiGroup.KEY_NAME);
        },
        set: function (name) {
            this.setValue(DroiGroup.KEY_NAME, name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiGroup.prototype, "userIdList", {
        get: function () {
            var ids = this.getValue(DroiGroup.KEY_USERS);
            if (ids == null)
                return null;
            return JSON.parse(JSON.stringify(ids));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiGroup.prototype, "groupIdList", {
        get: function () {
            var ids = this.getValue(DroiGroup.KEY_GROUPS);
            if (ids == null)
                return null;
            return JSON.parse(JSON.stringify(ids));
        },
        enumerable: true,
        configurable: true
    });
    DroiGroup.KEY_NAME = "Name";
    DroiGroup.KEY_USERS = "Users";
    DroiGroup.KEY_GROUPS = "Groups";
    return DroiGroup;
}(droi_object_1.DroiObject));
exports.DroiGroup = DroiGroup;
