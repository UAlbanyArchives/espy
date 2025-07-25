"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _redux = require("redux");
var _reactRedux = require("react-redux");
var _reactI18next = require("react-i18next");
var _styles = require("@material-ui/core/styles");
var _withPlugins = require("../extend/withPlugins");
var actions = _interopRequireWildcard(require("../state/actions"));
var _ThumbnailNavigation = require("../components/ThumbnailNavigation");
var _selectors = require("../state/selectors");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/**
 * mapStateToProps - used to hook up state to props
 * @memberof ThumbnailNavigation
 * @private
 */
var mapStateToProps = function mapStateToProps(state, _ref) {
  var windowId = _ref.windowId;
  return {
    canvasGroupings: (0, _selectors.getCanvasGroupings)(state, {
      windowId: windowId
    }),
    canvasIndex: (0, _selectors.getCanvasIndex)(state, {
      windowId: windowId
    }),
    hasNextCanvas: !!(0, _selectors.getNextCanvasGrouping)(state, {
      windowId: windowId
    }),
    hasPreviousCanvas: !!(0, _selectors.getPreviousCanvasGrouping)(state, {
      windowId: windowId
    }),
    position: (0, _selectors.getCompanionWindow)(state, {
      companionWindowId: (0, _selectors.getWindow)(state, {
        windowId: windowId
      }).thumbnailNavigationId
    }).position,
    thumbnailNavigation: (0, _selectors.getConfig)(state).thumbnailNavigation,
    view: (0, _selectors.getWindowViewType)(state, {
      windowId: windowId
    }),
    viewingDirection: (0, _selectors.getSequenceViewingDirection)(state, {
      windowId: windowId
    })
  };
};

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ThumbnailNavigation
 * @private
 */
var mapDispatchToProps = function mapDispatchToProps(dispatch, _ref2) {
  var windowId = _ref2.windowId;
  return {
    setNextCanvas: function setNextCanvas() {
      return dispatch(actions.setNextCanvas(windowId));
    },
    setPreviousCanvas: function setPreviousCanvas() {
      return dispatch(actions.setPreviousCanvas(windowId));
    }
  };
};

/**
 * Styles for withStyles HOC
 */
var styles = function styles(theme) {
  return {
    thumbNavigation: {
      '&:focus': {
        boxShadow: 0,
        outline: 0
      }
    }
  };
};
var enhance = (0, _redux.compose)((0, _styles.withStyles)(styles), (0, _reactI18next.withTranslation)(), (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withPlugins.withPlugins)('ThumbnailNavigation'));
var _default = exports["default"] = enhance(_ThumbnailNavigation.ThumbnailNavigation);