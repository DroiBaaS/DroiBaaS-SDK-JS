"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var DroiLog = /** @class */ (function () {
    function DroiLog() {
    }
    DroiLog.setLogLevel = function (level) {
        DroiLog.LOG_LEVEL = level;
    };
    DroiLog.getLogLevel = function () {
        return DroiLog.LOG_LEVEL;
    };
    DroiLog.enableColor = function () {
        DroiLog.ISCOLOR = true;
    };
    DroiLog.disableColor = function () {
        DroiLog.ISCOLOR = false;
    };
    DroiLog.v = function (tag, msg) {
        DroiLog.log(LogLevel.Verbose, tag, msg);
    };
    DroiLog.d = function (tag, msg) {
        DroiLog.log(LogLevel.Debug, tag, msg);
    };
    DroiLog.i = function (tag, msg) {
        DroiLog.log(LogLevel.Info, tag, msg);
    };
    DroiLog.w = function (tag, msg) {
        DroiLog.log(LogLevel.Warning, tag, msg);
    };
    DroiLog.e = function (tag, msg) {
        DroiLog.log(LogLevel.Error, tag, msg);
    };
    DroiLog.log = function (level, tag, msg) {
        if (DroiLog.LOG_LEVEL > level)
            return;
        var levelStr = DroiLog.LOG_LEVEL_STR[level];
        var outmsg = new Date().toString() + " " + levelStr + "/" + tag + ": " + msg;
        if (DroiLog.ISCOLOR) {
            var color = DroiLog.COLORS_16_MAP[level];
            outmsg = "\u001B[" + color + "m" + outmsg + "\u001B[0;37m";
        }
        console.log(outmsg);
    };
    DroiLog.LOG_LEVEL = LogLevel.Error;
    DroiLog.ISCOLOR = true;
    DroiLog.COLORS_16_MAP = ["1;37", "1;34", "1;32", "33", "31"];
    DroiLog.LOG_LEVEL_STR = ["V", "D", "I", "W", "E"];
    return DroiLog;
}());
exports.DroiLog = DroiLog;
