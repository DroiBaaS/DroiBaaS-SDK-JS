"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cloudcache_1 = require("./rest/cloudcache");
var DroiCloudCache = /** @class */ (function () {
    function DroiCloudCache() {
    }
    DroiCloudCache.getValue = function (key) {
        return cloudcache_1.RestCloudCache.instance().get(key);
    };
    DroiCloudCache.setValue = function (key, value) {
        return cloudcache_1.RestCloudCache.instance().set(key, value);
    };
    DroiCloudCache.removeValue = function (key) {
        return cloudcache_1.RestCloudCache.instance().remove(key);
    };
    return DroiCloudCache;
}());
exports.DroiCloudCache = DroiCloudCache;
