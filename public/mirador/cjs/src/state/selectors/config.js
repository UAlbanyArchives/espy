"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
exports.getContainerId = void 0;
exports.getExportableState = getExportableState;
exports.getThemeIds = exports.getThemeDirection = exports.getTheme = exports.getShowZoomControlsConfig = exports.getRequestsConfig = exports.getLanguagesFromConfigWithCurrent = void 0;
var _reselect = require("reselect");
var _deepmerge = _interopRequireDefault(require("deepmerge"));
var _utils = require("./utils");
var _getters = require("./getters");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/** */
function getConfig(state) {
  var slice = (0, _utils.miradorSlice)(state || {});
  return slice.config || {};
}

/**
 * Extract an exportable version of state using the configuration from the config.
 */
function getExportableState(state) {
  var exportConfig = getConfig(state)["export"];
  return Object.entries(exportConfig).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      stem = _ref2[0],
      value = _ref2[1];
    if (value === true) {
      acc[stem] = state[stem];
    } else if (value.filter) {
      acc[stem] = Object.entries(state[stem]).filter(value.filter).reduce(function (stemAcc, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          k = _ref4[0],
          v = _ref4[1];
        stemAcc[k] = v; // eslint-disable-line no-param-reassign
        return stemAcc;
      }, {});
    }
    return acc;
  }, {});
}

/**
* Return languages from config (in state) and indicate which is currently set
* @param {object} state
* @return {Array} [ {locale: 'de', label: 'Deutsch', current: true}, ... ]
*/
var getLanguagesFromConfigWithCurrent = exports.getLanguagesFromConfigWithCurrent = (0, _reselect.createSelector)([getConfig], function (_ref5) {
  var availableLanguages = _ref5.availableLanguages,
    language = _ref5.language;
  return Object.keys(availableLanguages).map(function (key) {
    return {
      current: key === language,
      label: availableLanguages[key],
      locale: key
    };
  });
});
var getShowZoomControlsConfig = exports.getShowZoomControlsConfig = (0, _reselect.createSelector)([_getters.getWorkspace, getConfig], function (workspace, config) {
  return workspace.showZoomControls === undefined ? config.workspace.showZoomControls : workspace.showZoomControls;
});
var getTheme = exports.getTheme = (0, _reselect.createSelector)([getConfig], function (_ref6) {
  var theme = _ref6.theme,
    themes = _ref6.themes,
    selectedTheme = _ref6.selectedTheme;
  return (0, _deepmerge["default"])(theme, themes[selectedTheme] || {});
});
var getThemeIds = exports.getThemeIds = (0, _reselect.createSelector)([getConfig], function (_ref7) {
  var themes = _ref7.themes;
  return Object.keys(themes);
});
var getContainerId = exports.getContainerId = (0, _reselect.createSelector)([getConfig], function (_ref8) {
  var id = _ref8.id;
  return id;
});
var getThemeDirection = exports.getThemeDirection = (0, _reselect.createSelector)([getConfig], function (_ref9) {
  var theme = _ref9.theme;
  return theme.direction || 'ltr';
});
var getRequestsConfig = exports.getRequestsConfig = (0, _reselect.createSelector)([getConfig], function (_ref10) {
  var requests = _ref10.requests;
  return requests || {};
});