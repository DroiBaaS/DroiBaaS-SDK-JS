"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Errors for DroiBaaS JS SDK.
 *
 * @export
 * @class DroiError
 */
var DroiError = /** @class */ (function () {
    /**
     * Creates an instance of DroiError.
     * @param {number} code Error code
     * @param {string} [msg] Appended message
     * @param {string} [ticket] Server ticket
     * @memberof DroiError
     */
    function DroiError(code, msg, ticket) {
        this._code = code;
        this._appendMessage = msg;
        this._ticket = ticket;
    }
    DroiError.fillMessages = function () {
        var result = {};
        result[DroiError.OK] = "OK.";
        result[DroiError.UNKNOWN_ERROR] = "Unknown error.";
        result[DroiError.ERROR] = "Error.";
        result[DroiError.USER_NOT_EXISTS] = "User is not exists.";
        result[DroiError.USER_PASSWORD_INCORRECT] = "Password is not correct.";
        result[DroiError.USER_ALREADY_EXISTS] = "User is already exists.";
        result[DroiError.NETWORK_NOT_AVAILABLE] = "Network is not available.";
        result[DroiError.USER_NOT_AUTHORIZED] = "User is not authorized.";
        result[DroiError.SERVER_NOT_REACHABLE] = "Server is not reachable.";
        result[DroiError.HTTP_SERVER_ERROR] = "Error happened in Server side.";
        result[DroiError.SERVICE_NOT_ALLOWED] = "Service is not allowed.";
        result[DroiError.SERVICE_NOT_FOUND] = "Service is not found.";
        result[DroiError.INTERNAL_SERVER_ERROR] = "Internal server error.";
        result[DroiError.INVALID_PARAMETER] = "Invalid parameters.";
        result[DroiError.USER_DISABLE] = "User is in disable state.";
        result[DroiError.EXCEED_MAX_SIZE] = "Exceed max size.";
        result[DroiError.FILE_NOT_READY] = "File is not ready.";
        result[DroiError.CORE_NOT_INITIALIZED] = "DroiBaaS SDK is not initialized.";
        result[DroiError.USER_CANCELED] = "User is canceled.";
        result[DroiError.BANDWIDTH_LIMIT_EXCEED] = "Bandwidth limit exceed.";
        result[DroiError.TIME_UNCORRECTED] = "Incorrected time, please correct time first.";
        result[DroiError.APPLICATION_ID_UNCORRECTED] = "Incorrected application id.";
        result[DroiError.TIMEOUT] = "Network timeout.";
        result[DroiError.USER_ALREADY_LOGIN] = "Already logged in a valid user.";
        result[DroiError.USER_CONTACT_HAD_VERIFIED] = "User contact had verified.";
        result[DroiError.USER_CONTACT_EMPTY] = "User contact is empty.";
        result[DroiError.USER_FUNCTION_NOT_ALLOWED] = "The function is not allowed for current user.";
        result[DroiError.READ_CACHE_FAILED] = "Read cache fail.";
        result[DroiError.UPLOAD_FAILED] = "Upload file failed.";
        result[DroiError.FIELD_NOT_FOUND] = "Field not found.";
        result[DroiError.NATIVE_LIBRARY_NOT_LOADED] = "Native plugin is not loaded.";
        result[DroiError.DROI_SECURE_NOT_SUPPORT] = "The current runtime not support DroiSecure";
        return result;
    };
    Object.defineProperty(DroiError.prototype, "code", {
        /**
         * Error code
         *
         * @type {number}
         * @memberof DroiError
         */
        get: function () {
            return this._code;
        },
        /**
         * Set error code
         *
         * @memberof DroiError
         */
        set: function (v) {
            this._code = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiError.prototype, "ticket", {
        /**
         * Server ticket
         *
         * @type {string}
         * @memberof DroiError
         */
        get: function () {
            return this._ticket;
        },
        /**
         * Set server ticket
         *
         * @memberof DroiError
         */
        set: function (v) {
            this._ticket = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiError.prototype, "appendMessage", {
        /**
         * Appended message
         *
         * @type {string}
         * @memberof DroiError
         */
        get: function () {
            return this._appendMessage;
        },
        /**
         * Set appended message
         *
         * @memberof DroiError
         */
        set: function (v) {
            this._appendMessage = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroiError.prototype, "isOk", {
        /**
         * Check result
         *
         * @readonly
         * @type {boolean}
         * @memberof DroiError
         */
        get: function () {
            return this._code == 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Format error string
     *
     * @returns {string}
     * @memberof DroiError
     */
    DroiError.prototype.toString = function () {
        var message = DroiError.MESSAGES[this._code];
        if (!message)
            message = "Error code: " + this._code;
        if (this._ticket)
            message = message + " Ticket: " + this._ticket;
        if (this._appendMessage)
            message = message + " " + this._appendMessage;
        return message;
    };
    DroiError.OK = 0;
    DroiError.UNKNOWN_ERROR = 1070000;
    DroiError.ERROR = 1070001;
    DroiError.USER_NOT_EXISTS = 1070002;
    DroiError.USER_PASSWORD_INCORRECT = 1070003;
    DroiError.USER_ALREADY_EXISTS = 1070004;
    DroiError.NETWORK_NOT_AVAILABLE = 1070005;
    DroiError.USER_NOT_AUTHORIZED = 1070006;
    DroiError.SERVER_NOT_REACHABLE = 1070007;
    DroiError.HTTP_SERVER_ERROR = 1070008;
    DroiError.SERVICE_NOT_ALLOWED = 1070009;
    DroiError.SERVICE_NOT_FOUND = 1070010;
    DroiError.INTERNAL_SERVER_ERROR = 1070011;
    DroiError.INVALID_PARAMETER = 1070012;
    DroiError.NO_PERMISSION = 1070013;
    DroiError.USER_DISABLE = 1070014;
    DroiError.EXCEED_MAX_SIZE = 1070015;
    DroiError.FILE_NOT_READY = 1070016;
    DroiError.CORE_NOT_INITIALIZED = 1070017;
    DroiError.USER_CANCELED = 1070018;
    DroiError.BANDWIDTH_LIMIT_EXCEED = 1070019;
    DroiError.APPLICATION_ID_UNCORRECTED = 1070101;
    DroiError.NATIVE_LIBRARY_NOT_LOADED = 1070103;
    DroiError.DROI_SECURE_NOT_SUPPORT = 1070104;
    DroiError.TIME_UNCORRECTED = 1070201;
    DroiError.TIMEOUT = 1070202;
    DroiError.USER_ALREADY_LOGIN = 1070301;
    DroiError.USER_CONTACT_HAD_VERIFIED = 1070302;
    DroiError.USER_CONTACT_EMPTY = 1070303;
    DroiError.USER_FUNCTION_NOT_ALLOWED = 1070304;
    DroiError.FIELD_NOT_FOUND = 1070401;
    DroiError.READ_CACHE_FAILED = 1070501;
    DroiError.UPLOAD_FAILED = 1070502;
    DroiError.MESSAGES = DroiError.fillMessages();
    return DroiError;
}());
exports.DroiError = DroiError;
