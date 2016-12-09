'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTokenPrefix = exports.setTokenPrefix = exports.setRefreshTokenName = exports.setTokenName = exports.Check = exports.Auth = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _reactCookie = require('react-cookie');

var _reactCookie2 = _interopRequireDefault(_reactCookie);

var _redux = require('react-isomorphic-render/redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tokenName = 'token';
var refreshTokenName = 'refreshToken';
var tokenPrefix = 'Bearer ';

var Auth = exports.Auth = {
    setToken: function setToken(token) {
        _reactCookie2.default.save(tokenName, token);
    },
    setRefreshToken: function setRefreshToken(refreshToken) {
        _reactCookie2.default.save(refreshTokenName, refreshToken);
    },
    getToken: function getToken() {
        return _reactCookie2.default.load(tokenName);
    },
    getRefreshToken: function getRefreshToken() {
        return _reactCookie2.default.load(refreshTokenName) || false;
    },
    isAuthenticated: function isAuthenticated() {
        return this.getToken() ? true : false;
    },
    logout: function logout() {
        _reactCookie2.default.remove(tokenName);
        _reactCookie2.default.remove(refreshTokenName);
    }
};

var Check = exports.Check = function Check(_ref) {
    var roles = _ref.roles;
    return function (Component) {
        return (0, _redux.onEnter)(function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref3, redirect) {
                var getState = _ref3.getState;

                var user, hasRole, i, role, _i;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (Auth.isAuthenticated()) {
                                    user = getState().authentication.user;
                                    hasRole = false;

                                    for (i in user.roles) {
                                        role = user.roles[i];

                                        for (_i in roles) {
                                            if (roles.hasOwnProperty(_i) && role == roles[_i]) {
                                                hasRole = true;
                                            }
                                        }
                                    }
                                    if (!hasRole) {
                                        redirect('/');
                                    }
                                } else {
                                    redirect('/');
                                }

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, undefined);
            }));

            return function (_x, _x2) {
                return _ref2.apply(this, arguments);
            };
        }())(Component);
    };
};

var setTokenName = exports.setTokenName = function setTokenName(name) {
    tokenName = name;
};
var setRefreshTokenName = exports.setRefreshTokenName = function setRefreshTokenName(name) {
    refreshTokenName = name;
};
var setTokenPrefix = exports.setTokenPrefix = function setTokenPrefix(prefix) {
    tokenPrefix = prefix;
};
var getTokenPrefix = exports.getTokenPrefix = function getTokenPrefix() {
    return tokenPrefix;
};