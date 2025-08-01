"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readImageMetadata = readImageMetadata;
/** Extract metadata from an image File */
function readImageMetadata(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      var image = new Image();
      image.addEventListener('load', function () {
        resolve({
          height: image.height,
          name: file.name,
          type: file.type,
          url: reader.result,
          width: image.width
        });
      });
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}