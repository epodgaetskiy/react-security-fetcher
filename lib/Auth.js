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
    var roles = _ref.roles,
        denyRoles = _ref.denyRoles,
        cb = _ref.cb;
    return function (Component) {
        return (0, _redux.onEnter)(function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref3, redirect) {
                var getState = _ref3.getState;

                var user, hasRole, i, role, _i, _i2;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!Auth.isAuthenticated()) {
                                    _context.next = 21;
                                    break;
                                }

                                user = getState().authentication.user;
                                hasRole = false;
                                _context.t0 = _regenerator2.default.keys(user.roles);

                            case 4:
                                if ((_context.t1 = _context.t0()).done) {
                                    _context.next = 18;
                                    break;
                                }

                                i = _context.t1.value;
                                role = user.roles[i];
                                _context.t2 = _regenerator2.default.keys(denyRoles);

                            case 8:
                                if ((_context.t3 = _context.t2()).done) {
                                    _context.next = 15;
                                    break;
                                }

                                _i = _context.t3.value;

                                if (!(denyRoles.hasOwnProperty(_i) && role == denyRoles[_i])) {
                                    _context.next = 13;
                                    break;
                                }

                                typeof cb == 'function' && cb({ getState: getState, redirect: redirect }) || redirect('/');
                                return _context.abrupt('return');

                            case 13:
                                _context.next = 8;
                                break;

                            case 15:
                                for (_i2 in roles) {
                                    if (roles.hasOwnProperty(_i2) && role == roles[_i2]) {
                                        hasRole = true;
                                    }
                                }
                                _context.next = 4;
                                break;

                            case 18:
                                if (!hasRole) {
                                    typeof cb == 'function' && cb({ getState: getState, redirect: redirect }) || redirect('/');
                                }
                                _context.next = 22;
                                break;

                            case 21:
                                typeof cb == 'function' && cb({ getState: getState, redirect: redirect }) || redirect('/');

                            case 22:
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