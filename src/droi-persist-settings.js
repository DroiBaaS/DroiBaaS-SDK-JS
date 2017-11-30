"use strict";
// Persist data 
Object.defineProperty(exports, "__esModule", { value: true });
var DroiPersistSettings = /** @class */ (function () {
    function DroiPersistSettings() {
    }
    DroiPersistSettings.getItem = function (key) {
        return localStorage.getItem(key);
    };
    DroiPersistSettings.setItem = function (key, value) {
        localStorage.setItem(key, value);
    };
    DroiPersistSettings.removeItem = function (key) {
        localStorage.removeItem(key);
    };
    DroiPersistSettings.KEY_DEVICE_ID = "did";
    DroiPersistSettings.KEY_DEVICE_ID_HIGH = "didu";
    DroiPersistSettings.KEY_DEVICE_ID_LOW = "didl";
    DroiPersistSettings.KEY_INSTALLATION_ID = "iid";
    DroiPersistSettings.KEY_SAVED_USER = "susr";
    DroiPersistSettings.KEY_IPLIST = "ipl";
    DroiPersistSettings.KEY_KLKEY = "kkl";
    DroiPersistSettings.KEY_KL_TIMESTAMPV2 = "klt2";
    DroiPersistSettings.KEY_PREFERENCE = "dcp";
    DroiPersistSettings.KEY_APP_ID = "apid";
    return DroiPersistSettings;
}());
exports.DroiPersistSettings = DroiPersistSettings;
