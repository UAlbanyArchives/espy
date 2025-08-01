"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deselectAnnotation = deselectAnnotation;
exports.hoverAnnotation = hoverAnnotation;
exports.receiveAnnotation = receiveAnnotation;
exports.receiveAnnotationFailure = receiveAnnotationFailure;
exports.requestAnnotation = requestAnnotation;
exports.requestCanvasAnnotations = requestCanvasAnnotations;
exports.selectAnnotation = selectAnnotation;
exports.toggleAnnotationDisplay = toggleAnnotationDisplay;
var _actionTypes = _interopRequireDefault(require("./action-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Request annotations on a canvas
 *
 * NOTE: there is no corresponding reducer; the expected API is sagas will
 *  pick this action up and act on it accordingly.
 */
function requestCanvasAnnotations(windowId, canvasId) {
  return {
    canvasId: canvasId,
    type: _actionTypes["default"].REQUEST_CANVAS_ANNOTATIONS,
    windowId: windowId
  };
}

/**
 * requestAnnotation - action creator
 *
 * @param  {String} targetId
 * @param  {String} annotationId
 * @memberof ActionCreators
 */
function requestAnnotation(targetId, annotationId) {
  return {
    annotationId: annotationId,
    targetId: targetId,
    type: _actionTypes["default"].REQUEST_ANNOTATION
  };
}

/**
 * receiveAnnotation - action creator
 *
 * @param  {String} targetId
 * @param  {String} annotationId
 * @param  {Object} annotationJson
 * @memberof ActionCreators
 */
function receiveAnnotation(targetId, annotationId, annotationJson) {
  return {
    annotationId: annotationId,
    annotationJson: annotationJson,
    targetId: targetId,
    type: _actionTypes["default"].RECEIVE_ANNOTATION
  };
}

/**
 * receiveAnnotationFailure - action creator
 *
 * @param  {String} targetId
 * @param  {String} annotationId
 * @param  {String} error
 * @memberof ActionCreators
 */
function receiveAnnotationFailure(targetId, annotationId, error) {
  return {
    annotationId: annotationId,
    error: error,
    targetId: targetId,
    type: _actionTypes["default"].RECEIVE_ANNOTATION_FAILURE
  };
}

/**
 * selectAnnotation - action creator
 *
 * @param  {String} windowId
 * @param  {String} targetId
 * @param  {String} annotationId
 * @memberof ActionCreators
 */
function selectAnnotation(windowId, annotationId) {
  return {
    annotationId: annotationId,
    type: _actionTypes["default"].SELECT_ANNOTATION,
    windowId: windowId
  };
}

/**
 * deselectAnnotation - action creator
 *
 * @param  {String} windowId
 * @param  {String} targetId
 * @param  {String} annotationId
 * @memberof ActionCreators
 */
function deselectAnnotation(windowId, annotationId) {
  return {
    annotationId: annotationId,
    type: _actionTypes["default"].DESELECT_ANNOTATION,
    windowId: windowId
  };
}

/**
 * toggleAnnotationDisplay - action creator
 *
 * @param  {String} windowId
 * @memberof ActionCreators
 */
function toggleAnnotationDisplay(windowId) {
  return {
    type: _actionTypes["default"].TOGGLE_ANNOTATION_DISPLAY,
    windowId: windowId
  };
}

/**
 * toggleAnnotationDisplay - action creator
 *
 * @param  {String} windowId
 * @memberof ActionCreators
 */
function hoverAnnotation(windowId, annotationIds) {
  return {
    annotationIds: annotationIds,
    type: _actionTypes["default"].HOVER_ANNOTATION,
    windowId: windowId
  };
}