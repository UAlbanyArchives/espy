function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import { Canvas } from 'manifesto.js';
/**
 * MiradorCanvas - adds additional, testable logic around Manifesto's Canvas
 * https://iiif-commons.github.io/manifesto/classes/_canvas_.manifesto.canvas.html
 */
var MiradorCanvas = /*#__PURE__*/function () {
  /**
   * @param {MiradorCanvas} canvas
   */
  function MiradorCanvas(canvas) {
    _classCallCheck(this, MiradorCanvas);
    this.canvas = canvas;
  }

  /** */
  return _createClass(MiradorCanvas, [{
    key: "id",
    get: function get() {
      return this.canvas.id;
    }

    /** */
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.canvas.getWidth();
    }

    /** */
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.canvas.getHeight();
    }

    /**
     */
  }, {
    key: "aspectRatio",
    get: function get() {
      return this.canvas.getWidth() / this.canvas.getHeight();
    }

    /**
     * Fetches AnnotationList URIs from canvas's otherContent property
     *
     * Supported otherContent types:
     * - Objects having @type property of "sc:AnnotationList" and URI in @id
     * - Strings being the URIs
     */
  }, {
    key: "annotationListUris",
    get: function get() {
      return flatten(new Array(this.canvas.__jsonld.otherContent) // eslint-disable-line no-underscore-dangle
      ).filter(function (otherContent) {
        return otherContent && (typeof otherContent === 'string' || otherContent['@type'] === 'sc:AnnotationList');
      }).map(function (otherContent) {
        return typeof otherContent === 'string' ? otherContent : otherContent['@id'];
      });
    }

    /** */
  }, {
    key: "canvasAnnotationPages",
    get: function get() {
      return flatten(new Array(this.canvas.__jsonld.annotations) // eslint-disable-line no-underscore-dangle
      ).filter(function (annotations) {
        return annotations && annotations.type === 'AnnotationPage';
      });
    }

    /**
     * Will negotiate a v2 or v3 type of resource
     */
  }, {
    key: "imageResource",
    get: function get() {
      return this.imageResources[0];
    }

    /** */
  }, {
    key: "imageResources",
    get: function get() {
      var _this = this;
      var resources = flattenDeep([this.canvas.getImages().map(function (i) {
        return i.getResource();
      }), this.canvas.getContent().map(function (i) {
        return i.getBody();
      })]);
      return flatten(resources.map(function (resource) {
        switch (resource.getProperty('type')) {
          case 'oa:Choice':
            return new Canvas({
              images: flatten([resource.getProperty('default'), resource.getProperty('item')]).map(function (r) {
                return {
                  resource: r
                };
              })
            }, _this.canvas.options).getImages().map(function (i) {
              return i.getResource();
            });
          default:
            return resource;
        }
      }));
    }

    /** */
  }, {
    key: "videoResources",
    get: function get() {
      var resources = flattenDeep([this.canvas.getContent().map(function (i) {
        return i.getBody();
      })]);
      return flatten(resources.filter(function (resource) {
        return resource.getProperty('type') === 'Video';
      }));
    }

    /** */
  }, {
    key: "audioResources",
    get: function get() {
      var resources = flattenDeep([this.canvas.getContent().map(function (i) {
        return i.getBody();
      })]);
      return flatten(resources.filter(function (resource) {
        return resource.getProperty('type') === 'Sound';
      }));
    }

    /** */
  }, {
    key: "vttContent",
    get: function get() {
      var resources = flattenDeep([this.canvas.getContent().map(function (i) {
        return i.getBody();
      })]);
      return flatten(resources.filter(function (resource) {
        return resource.getProperty('format') === 'text/vtt';
      }));
    }

    /** */
  }, {
    key: "resourceAnnotations",
    get: function get() {
      return flattenDeep([this.canvas.getImages(), this.canvas.getContent()]);
    }

    /**
     * Returns a given resource Annotation, based on a contained resource or body
     * id
     */
  }, {
    key: "resourceAnnotation",
    value: function resourceAnnotation(id) {
      return this.resourceAnnotations.find(function (anno) {
        return anno.getResource().id === id || flatten(new Array(anno.getBody())).some(function (body) {
          return body.id === id;
        });
      });
    }

    /**
     * Returns the fragment placement values if a resourceAnnotation is placed on
     * a canvas somewhere besides the full extent
     */
  }, {
    key: "onFragment",
    value: function onFragment(id) {
      var resourceAnnotation = this.resourceAnnotation(id);
      if (!resourceAnnotation) return undefined;
      // IIIF v2
      var on = resourceAnnotation.getProperty('on');
      // IIIF v3
      var target = resourceAnnotation.getProperty('target');
      var fragmentMatch = (on || target).match(/xywh=(.*)$/);
      if (!fragmentMatch) return undefined;
      return fragmentMatch[1].split(',').map(function (str) {
        return parseInt(str, 10);
      });
    }

    /** */
  }, {
    key: "iiifImageResources",
    get: function get() {
      return this.imageResources.filter(function (r) {
        return r && r.getServices()[0] && r.getServices()[0].id;
      });
    }

    /** */
  }, {
    key: "imageServiceIds",
    get: function get() {
      return this.iiifImageResources.map(function (r) {
        return r.getServices()[0].id;
      });
    }

    /**
     * Get the canvas service
     */
  }, {
    key: "service",
    get: function get() {
      return this.canvas.__jsonld.service; // eslint-disable-line no-underscore-dangle
    }

    /**
     * Get the canvas label
     */
  }, {
    key: "getLabel",
    value: function getLabel() {
      return this.canvas.getLabel().length > 0 ? this.canvas.getLabel().getValue() : String(this.canvas.index + 1);
    }
  }]);
}();
export { MiradorCanvas as default };