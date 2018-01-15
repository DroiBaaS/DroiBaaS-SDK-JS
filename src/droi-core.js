"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var droi_persist_settings_1 = require("./droi-persist-settings");
var droi_api_1 = require("./droi-api");
var droi_user_1 = require("./droi-user");
var droi_file_1 = require("./droi-file");
var droi_object_1 = require("./droi-object");
var droi_group_1 = require("./droi-group");
var version = "1.0.80";
/**
 *
 */
var DroiCore = /** @class */ (function () {
    function DroiCore() {
    }
    /**
     * Initiate DroiCore SDK
     * @param appid The application identifier
     */
    DroiCore.initializeCore = function (appid, apikey) {
        var cacheAppId = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_APP_ID);
        if (appid !== cacheAppId) {
            droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_APP_ID, appid);
            droi_persist_settings_1.DroiPersistSettings.removeItem(droi_persist_settings_1.DroiPersistSettings.KEY_IPLIST);
            droi_persist_settings_1.DroiPersistSettings.removeItem(droi_persist_settings_1.DroiPersistSettings.KEY_KL_TIMESTAMPV2);
            droi_persist_settings_1.DroiPersistSettings.removeItem(droi_persist_settings_1.DroiPersistSettings.KEY_KLKEY);
            droi_persist_settings_1.DroiPersistSettings.removeItem(droi_persist_settings_1.DroiPersistSettings.KEY_PREFERENCE);
            droi_persist_settings_1.DroiPersistSettings.removeItem(droi_persist_settings_1.DroiPersistSettings.KEY_SAVED_USER);
        }
        DroiCore.appId = appid;
        DroiCore.apiKey = apikey;
        droi_object_1.DroiObject.registerCreateFactory("_User", function () { return droi_user_1.DroiUser.createUser(); });
        droi_object_1.DroiObject.registerCreateFactory("_File", function () { return droi_file_1.DroiFile.createEmptyFile(); });
        droi_object_1.DroiObject.registerCreateFactory("_Group", function () { return droi_group_1.DroiGroup.createGroup(); });
    };
    /**
     * Get the version of DroiCore SDK
     */
    DroiCore.getVersion = function () {
        return version;
    };
    /**
     * Get device id
     */
    DroiCore.getDeviceId = function () {
        var did = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_DEVICE_ID);
        // Already fetched device id.
        if (did) {
            return Promise.resolve(did);
        }
        return droi_api_1.RemoteServiceHelper.fetchHttpsDeviceId()
            .then(function (didFormat) {
            droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_DEVICE_ID, didFormat.string);
            droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_DEVICE_ID_HIGH, didFormat.uidh);
            droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_DEVICE_ID_LOW, didFormat.uidl);
            return didFormat.string;
        });
    };
    /**
     * Get installation id
     */
    DroiCore.getInstallationId = function () {
        var iid = droi_persist_settings_1.DroiPersistSettings.getItem(droi_persist_settings_1.DroiPersistSettings.KEY_INSTALLATION_ID);
        if (!iid) {
            iid = droi_object_1.Guid.newGuid();
            droi_persist_settings_1.DroiPersistSettings.setItem(droi_persist_settings_1.DroiPersistSettings.KEY_INSTALLATION_ID, iid);
        }
        return iid;
    };
    /**
     * Get application id
     */
    DroiCore.getAppId = function () {
        return DroiCore.appId;
    };
    /**
     * Get api key
     */
    DroiCore.getApiKey = function () {
        return DroiCore.apiKey;
    };
    return DroiCore;
}());
exports.DroiCore = DroiCore;
;
