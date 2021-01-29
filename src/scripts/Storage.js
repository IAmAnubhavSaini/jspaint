"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStorage = exports.LocalStorage = void 0;
var CommonStorage = (function () {
    function CommonStorage() {
    }
    CommonStorage.exists = function (storage) {
        return storage !== undefined && storage !== null;
    };
    CommonStorage.default = function () {
        return { key: null, value: null };
    };
    return CommonStorage;
}());
var LocalStorage = (function (_super) {
    __extends(LocalStorage, _super);
    function LocalStorage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocalStorage.exists = function () {
        return _super.exists.call(this, localStorage);
    };
    LocalStorage.get = function (key) {
        return LocalStorage.exists() ? { key: key, value: localStorage.getItem(key) } : '';
    };
    LocalStorage.set = function (key, value) {
        if (LocalStorage.exists()) {
            localStorage.setItem(key, value);
            return { key: key, value: value };
        }
        return LocalStorage.default();
    };
    LocalStorage.all = function () {
        if (LocalStorage.exists()) {
            return Object.keys(localStorage).reduce(function (a, c) {
                var _a;
                return (__assign(__assign({}, a), (_a = {}, _a[c] = localStorage.getItem(c), _a)));
            }, {});
        }
        return LocalStorage.default();
    };
    return LocalStorage;
}(CommonStorage));
exports.LocalStorage = LocalStorage;
var SessionStorage = (function (_super) {
    __extends(SessionStorage, _super);
    function SessionStorage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SessionStorage.exists = function () {
        return _super.exists.call(this, sessionStorage);
    };
    SessionStorage.get = function (key) {
        return SessionStorage.exists() ? { key: key, value: sessionStorage.getItem(key) } : '';
    };
    SessionStorage.set = function (key, value) {
        if (SessionStorage.exists()) {
            sessionStorage.setItem(key, value);
            return { key: key, value: value };
        }
        return SessionStorage.default();
    };
    SessionStorage.all = function () {
        if (sessionStorage.exists()) {
            return Object.keys(sessionStorage).reduce(function (a, c) {
                var _a;
                return (__assign(__assign({}, a), (_a = {}, _a[c] = sessionStorage.getItem(c), _a)));
            }, {});
        }
        return sessionStorage.default();
    };
    return SessionStorage;
}(CommonStorage));
exports.SessionStorage = SessionStorage;
//# sourceMappingURL=Storage.js.map