"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_const_1 = require("./droi-const");
/**
 *
 */
var DroiPermission = /** @class */ (function () {
    function DroiPermission() {
        this.userPermission = {};
        this.groupPermission = {};
    }
    DroiPermission.copyFrom = function (perm) {
        var newInstance = new DroiPermission();
        newInstance.creator = perm.creator;
        newInstance.userPermission = perm.userPermission;
        newInstance.groupPermission = perm.groupPermission;
        newInstance.publicPermission = perm.publicPermission;
        return newInstance;
    };
    DroiPermission.getDefaultPermission = function () {
        return DroiPermission.defaultPermission;
    };
    DroiPermission.setDefaultPermission = function (perm) {
        DroiPermission.defaultPermission = DroiPermission.copyFrom(perm);
    };
    DroiPermission.prototype.setUserReadPermission = function (id, flag) {
        this.setPermission(true, id, droi_const_1.DroiConstant.DROI_PERMISSION_READ, flag);
    };
    DroiPermission.prototype.setUserWritePermission = function (id, flag) {
        this.setPermission(true, id, droi_const_1.DroiConstant.DROI_PERMISSION_WRITE, flag);
    };
    DroiPermission.prototype.setGroupReadPermission = function (id, flag) {
        this.setPermission(false, id, droi_const_1.DroiConstant.DROI_PERMISSION_READ, flag);
    };
    DroiPermission.prototype.setGroupWritePermission = function (id, flag) {
        this.setPermission(false, id, droi_const_1.DroiConstant.DROI_PERMISSION_WRITE, flag);
    };
    DroiPermission.prototype.setPublicReadPermission = function (flag) {
        if (flag) {
            this.publicPermission |= droi_const_1.DroiConstant.DROI_PERMISSION_READ;
        }
        else {
            this.publicPermission &= ~droi_const_1.DroiConstant.DROI_PERMISSION_READ;
        }
    };
    DroiPermission.prototype.setPublicWritePermission = function (flag) {
        if (flag) {
            this.publicPermission |= droi_const_1.DroiConstant.DROI_PERMISSION_WRITE;
        }
        else {
            this.publicPermission &= ~droi_const_1.DroiConstant.DROI_PERMISSION_WRITE;
        }
    };
    DroiPermission.prototype.setPermission = function (isUser, id, mask, flag) {
        var obj = isUser ? this.userPermission[id] : this.groupPermission[id];
        var permission = obj || 0;
        if (flag) {
            permission |= mask;
        }
        else {
            permission &= ~mask;
        }
        if (isUser)
            this.userPermission[id] = permission;
        else
            this.groupPermission[id] = permission;
    };
    DroiPermission.prototype.setCreator = function (id) {
        this.creator = id;
    };
    DroiPermission.prototype.getCreator = function () {
        return this.creator;
    };
    DroiPermission.prototype.toJsonObject = function () {
        var dict = {};
        // Creator and Public R/W
        if (this.creator)
            dict["creator"] = this.creator;
        if (this.publicPermission & droi_const_1.DroiConstant.DROI_PERMISSION_READ)
            dict["pr"] = true;
        if (this.publicPermission & droi_const_1.DroiConstant.DROI_PERMISSION_WRITE)
            dict["pw"] = true;
        // User Read/Write permission
        var permission = this.extractPermission(this.userPermission);
        if (permission[0].length > 0)
            dict["ur"] = permission[0];
        if (permission[1].length > 0)
            dict["uw"] = permission[1];
        // Group Read/Write permission
        permission = this.extractPermission(this.groupPermission);
        if (permission[0].length > 0)
            dict["gr"] = permission[0];
        if (permission[1].length > 0)
            dict["gw"] = permission[1];
        //
        return dict;
    };
    DroiPermission.prototype.extractPermission = function (perms) {
        var readPermission = [];
        var writePermission = [];
        for (var userName in perms) {
            var perm = perms[userName];
            if (perm & droi_const_1.DroiConstant.DROI_PERMISSION_READ)
                readPermission.push(userName);
            if (perm & droi_const_1.DroiConstant.DROI_PERMISSION_WRITE)
                writePermission.push(userName);
        }
        return [readPermission, writePermission];
    };
    DroiPermission.restorePermission = function (dict) {
        var newInstance = new DroiPermission();
        // Creator and Public R/W
        if (dict.hasOwnProperty("creator")) {
            newInstance.creator = dict["creator"];
        }
        if (dict.hasOwnProperty("pr")) {
            newInstance.setPublicReadPermission(dict["pr"]);
        }
        if (dict.hasOwnProperty("pw")) {
            newInstance.setPublicWritePermission(dict["pw"]);
        }
        var setPermission = function (propName, dict, func) { return function (name, func) {
            if (dict.hashOwnProperty(propName)) {
                for (var _i = 0, _a = dict[propName]; _i < _a.length; _i++) {
                    var name_1 = _a[_i];
                    func(name_1, true);
                }
            }
        }; };
        // User Read/Write permission
        setPermission("ur", dict, newInstance.setUserReadPermission);
        setPermission("uw", dict, newInstance.setUserWritePermission);
        // Group Read/Write permission
        setPermission("gr", dict, newInstance.setGroupReadPermission);
        setPermission("gw", dict, newInstance.setGroupWritePermission);
        return newInstance;
    };
    return DroiPermission;
}());
exports.DroiPermission = DroiPermission;
;
