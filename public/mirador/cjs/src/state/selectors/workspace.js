"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElasticLayout = getElasticLayout;
exports.getFullScreenEnabled = void 0;
exports.getLatestError = getLatestError;
exports.isFocused = exports.getWorkspaceType = void 0;
var _reselect = require("reselect");
var _getters = require("./getters");
var _utils = require("./utils");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/** */
function getElasticLayout(state) {
  return (0, _utils.miradorSlice)(state).elasticLayout;
}
var getFullScreenEnabled = exports.getFullScreenEnabled = (0, _reselect.createSelector)([_getters.getWorkspace], function (workspace) {
  return workspace.isFullscreenEnabled;
});

/** Returns the latest error from the state
 * @param {object} state
 */
function getLatestError(state) {
  var _miradorSlice$errors$ = _slicedToArray((0, _utils.miradorSlice)(state).errors.items, 1),
    errorId = _miradorSlice$errors$[0];
  return (0, _utils.miradorSlice)(state).errors[errorId];
}
var getWorkspaceType = exports.getWorkspaceType = (0, _reselect.createSelector)([_getters.getWorkspace], function (_ref) {
  var type = _ref.type;
  return type;
});
var getFocusedWindowId = (0, _reselect.createSelector)([_getters.getWorkspace], function (_ref2) {
  var focusedWindowId = _ref2.focusedWindowId;
  return focusedWindowId;
});

/** Check if the current window is focused */
var isFocused = exports.isFocused = function isFocused(state, _ref3) {
  var windowId = _ref3.windowId;
  return getFocusedWindowId(state) === windowId;
};