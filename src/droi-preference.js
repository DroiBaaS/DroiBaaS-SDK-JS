"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_error_1 = require("./droi-error");
var droi_persist_settings_1 = require("./droi-persist-settings");
var preference_1 = require("./rest/preference");
var DroiPreference = /** @class */ (function () {
    function DroiPreference() {
        this.dataReady = false;
        // Load cache first
        var data = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_PREFERENCE);
        if (data != null) {
            this.map = JSON.parse(data);
        }
    }
    DroiPreference.instance = function () {
        if (DroiPreference.INSTANCE == null)
            DroiPreference.INSTANCE = new DroiPreference();
        return DroiPreference.INSTANCE;
    };
    DroiPreference.prototype.refresh = function () {
        var _this = this;
        this.dataReady = false;
        return preference_1.RestPreference.instance().get().then(function (json) {
            _this.dataReady = true;
            _this.map = json;
            droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_PREFERENCE, JSON.stringify(json));
            return new droi_error_1.DroiError(droi_error_1.DroiError.OK);
        }).catch(function (error) {
            _this.dataReady = _this.map != null;
            return error;
        });
    };
    DroiPreference.prototype.getValue = function (key) {
        return this.map[key];
    };
    DroiPreference.INSTANCE = null;
    return DroiPreference;
}());
exports.DroiPreference = DroiPreference;
