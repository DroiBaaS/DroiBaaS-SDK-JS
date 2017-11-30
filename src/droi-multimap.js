"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultimapEntry = /** @class */ (function () {
    function MultimapEntry(key, value) {
        this.key = key;
        this.value = value;
    }
    return MultimapEntry;
}());
exports.MultimapEntry = MultimapEntry;
var ArrayListMultimap = /** @class */ (function () {
    function ArrayListMultimap() {
        this._entries = [];
    }
    ArrayListMultimap.prototype.clear = function () {
        this._entries = [];
    };
    ArrayListMultimap.prototype.containsKey = function (key) {
        return this._entries
            .filter(function (entry) { return entry.key == key; })
            .length > 0;
    };
    ArrayListMultimap.prototype.containsEntry = function (key, value) {
        return this._entries
            .filter(function (entry) { return entry.key == key && entry.value == value; })
            .length > 0;
    };
    ArrayListMultimap.prototype.remove = function (key) {
        var temp = this._entries;
        this._entries = this._entries
            .filter(function (entry) {
            return entry.key != key;
        });
        return temp.length != this._entries.length;
    };
    Object.defineProperty(ArrayListMultimap.prototype, "entries", {
        get: function () {
            return this._entries;
        },
        enumerable: true,
        configurable: true
    });
    ArrayListMultimap.prototype.get = function (key) {
        return this._entries
            .filter(function (entry) { return entry.key == key; })
            .map(function (entry) { return entry.value; });
    };
    ArrayListMultimap.prototype.getElement = function (key, index) {
        var res = this.get(key);
        if (index < res.length)
            return res[index];
        return null;
    };
    ArrayListMultimap.prototype.put = function (key, value) {
        this._entries.push(new MultimapEntry(key, value));
    };
    return ArrayListMultimap;
}());
exports.ArrayListMultimap = ArrayListMultimap;
