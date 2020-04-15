/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cpu-version/js/entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cpu-version/js/entry.js":
/*!*********************************!*\
  !*** ./cpu-version/js/entry.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

let canvas, ctx;
let imageData, pixelData;
let current, next;

const Da = .42,
      Db = 0.125,
      f = .055,
      k = 0.0625;

const weights = {
  north: .2,
  south: .2,
  east: .2,
  west: .2,
  northwest: .05,
  northeast: .05,
  southeast: .05,
  southwest: .05,
  center: -1
};

let setup = () => {
  canvas = document.getElementById('sketch');
  ctx = canvas.getContext('2d');

  current = {
    A: [],
    B: []
  };

  next = {
    A: [],
    B: []
  };

  for(let x = 0; x < canvas.width; x++) {
    current.A[x] = [];
    current.B[x] = [];
    next.A[x] = [];
    next.B[x] = [];

    for(let y = 0; y < canvas.height; y++) {
      current.A[x][y] = 1;
      current.B[x][y] = 0;
      next.A[x][y] = 0;
      next.B[x][y] = 0;

      if(
        x >= canvas.width/2 - 10 &&
        x <= canvas.width/2 + 10 &&
        y >= canvas.height/2 - 10 &&
        y <= canvas.height/2 + 10
      ) {
        current.B[x][y] = 1;
      }
    }
  }

  requestAnimationFrame(update);
}

let update = (timestamp) => {
  // Calculate next A and B values
  for(let x = 1; x < canvas.width - 1; x++) {
    for(let y = 1; y < canvas.height - 1; y++) {
      let A = current.A[x][y],
          B = current.B[x][y],
          diffusionA = Da * laplacian('A', x, y),
          diffusionB = Db * laplacian('B', x, y),
          reaction = A * B * B;

      next.A[x][y] = A + diffusionA - reaction + f * (1 - A);
      next.B[x][y] = B + diffusionB + reaction - (k + f) * B;
    }
  }

  // Make the next values the current ones
  current = next;

  draw();
  requestAnimationFrame(update);
}

let draw = () => {
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixelData = imageData.data;

  for(let x = 0; x < canvas.width; x++) {
    for(let y = 0; y < canvas.height; y++) {
      let i = (x + y * canvas.width) * 4;
      // let value = Math.floor(255 * 15 * current.B[x][y] * current.B[x][y] * current.B[x][y]);
      let value = Math.floor((current.A[x][y] - current.B[x][y]) * 255);

      pixelData[i] = value;     // red
      pixelData[i+1] = value;   // green
      pixelData[i+2] = value;   // blue
      pixelData[i+3] = 255;     // alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

let laplacian = (chemical, x, y) => {
  let north = current[chemical][x][y > 0 ? y - 1 : canvas.height - 1];
  let south = current[chemical][x][y < canvas.height ? y + 1 : 0];
  let east = current[chemical][x < canvas.width - 1 ? x + 1 : 0][y];
  let west = current[chemical][x > 0 ? x - 1 : canvas.width - 1][y];

  let northwest = current[chemical][x > 0 ? x - 1 : canvas.width - 1][y > 0 ? y - 1 : canvas.height - 1];
  let northeast = current[chemical][x < canvas.width - 1 ? x + 1 : 0][y > 0 ? y - 1 : canvas.height - 1];
  let southeast = current[chemical][x < canvas.width - 1 ? x + 1 : 0][y < canvas.height ? y + 1 : 0];
  let southwest = current[chemical][x > 0 ? x - 1 : canvas.width - 1][y < canvas.height ? y + 1 : 0];

  return north * weights.north +
         south * weights.south +
         east * weights.east +
         west * weights.west +
         northwest * weights.northwest +
         northeast * weights.northeast +
         southeast * weights.southeast +
         southwest * weights.southwest +
         current[chemical][x][y] * weights.center;
}

setup();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY3B1LXZlcnNpb24vanMvZW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixtQkFBbUI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLHNCQUFzQjtBQUN0QyxrQkFBa0IsdUJBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixrQkFBa0I7QUFDbEMsa0JBQWtCLG1CQUFtQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsMkJBQTJCO0FBQzNCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFEiLCJmaWxlIjoiY3B1LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY3B1LXZlcnNpb24vanMvZW50cnkuanNcIik7XG4iLCJsZXQgY2FudmFzLCBjdHg7XHJcbmxldCBpbWFnZURhdGEsIHBpeGVsRGF0YTtcclxubGV0IGN1cnJlbnQsIG5leHQ7XHJcblxyXG5jb25zdCBEYSA9IC40MixcclxuICAgICAgRGIgPSAwLjEyNSxcclxuICAgICAgZiA9IC4wNTUsXHJcbiAgICAgIGsgPSAwLjA2MjU7XHJcblxyXG5jb25zdCB3ZWlnaHRzID0ge1xyXG4gIG5vcnRoOiAuMixcclxuICBzb3V0aDogLjIsXHJcbiAgZWFzdDogLjIsXHJcbiAgd2VzdDogLjIsXHJcbiAgbm9ydGh3ZXN0OiAuMDUsXHJcbiAgbm9ydGhlYXN0OiAuMDUsXHJcbiAgc291dGhlYXN0OiAuMDUsXHJcbiAgc291dGh3ZXN0OiAuMDUsXHJcbiAgY2VudGVyOiAtMVxyXG59O1xyXG5cclxubGV0IHNldHVwID0gKCkgPT4ge1xyXG4gIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdza2V0Y2gnKTtcclxuICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgY3VycmVudCA9IHtcclxuICAgIEE6IFtdLFxyXG4gICAgQjogW11cclxuICB9O1xyXG5cclxuICBuZXh0ID0ge1xyXG4gICAgQTogW10sXHJcbiAgICBCOiBbXVxyXG4gIH07XHJcblxyXG4gIGZvcihsZXQgeCA9IDA7IHggPCBjYW52YXMud2lkdGg7IHgrKykge1xyXG4gICAgY3VycmVudC5BW3hdID0gW107XHJcbiAgICBjdXJyZW50LkJbeF0gPSBbXTtcclxuICAgIG5leHQuQVt4XSA9IFtdO1xyXG4gICAgbmV4dC5CW3hdID0gW107XHJcblxyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IGNhbnZhcy5oZWlnaHQ7IHkrKykge1xyXG4gICAgICBjdXJyZW50LkFbeF1beV0gPSAxO1xyXG4gICAgICBjdXJyZW50LkJbeF1beV0gPSAwO1xyXG4gICAgICBuZXh0LkFbeF1beV0gPSAwO1xyXG4gICAgICBuZXh0LkJbeF1beV0gPSAwO1xyXG5cclxuICAgICAgaWYoXHJcbiAgICAgICAgeCA+PSBjYW52YXMud2lkdGgvMiAtIDEwICYmXHJcbiAgICAgICAgeCA8PSBjYW52YXMud2lkdGgvMiArIDEwICYmXHJcbiAgICAgICAgeSA+PSBjYW52YXMuaGVpZ2h0LzIgLSAxMCAmJlxyXG4gICAgICAgIHkgPD0gY2FudmFzLmhlaWdodC8yICsgMTBcclxuICAgICAgKSB7XHJcbiAgICAgICAgY3VycmVudC5CW3hdW3ldID0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XHJcbn1cclxuXHJcbmxldCB1cGRhdGUgPSAodGltZXN0YW1wKSA9PiB7XHJcbiAgLy8gQ2FsY3VsYXRlIG5leHQgQSBhbmQgQiB2YWx1ZXNcclxuICBmb3IobGV0IHggPSAxOyB4IDwgY2FudmFzLndpZHRoIC0gMTsgeCsrKSB7XHJcbiAgICBmb3IobGV0IHkgPSAxOyB5IDwgY2FudmFzLmhlaWdodCAtIDE7IHkrKykge1xyXG4gICAgICBsZXQgQSA9IGN1cnJlbnQuQVt4XVt5XSxcclxuICAgICAgICAgIEIgPSBjdXJyZW50LkJbeF1beV0sXHJcbiAgICAgICAgICBkaWZmdXNpb25BID0gRGEgKiBsYXBsYWNpYW4oJ0EnLCB4LCB5KSxcclxuICAgICAgICAgIGRpZmZ1c2lvbkIgPSBEYiAqIGxhcGxhY2lhbignQicsIHgsIHkpLFxyXG4gICAgICAgICAgcmVhY3Rpb24gPSBBICogQiAqIEI7XHJcblxyXG4gICAgICBuZXh0LkFbeF1beV0gPSBBICsgZGlmZnVzaW9uQSAtIHJlYWN0aW9uICsgZiAqICgxIC0gQSk7XHJcbiAgICAgIG5leHQuQlt4XVt5XSA9IEIgKyBkaWZmdXNpb25CICsgcmVhY3Rpb24gLSAoayArIGYpICogQjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE1ha2UgdGhlIG5leHQgdmFsdWVzIHRoZSBjdXJyZW50IG9uZXNcclxuICBjdXJyZW50ID0gbmV4dDtcclxuXHJcbiAgZHJhdygpO1xyXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xyXG59XHJcblxyXG5sZXQgZHJhdyA9ICgpID0+IHtcclxuICBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgcGl4ZWxEYXRhID0gaW1hZ2VEYXRhLmRhdGE7XHJcblxyXG4gIGZvcihsZXQgeCA9IDA7IHggPCBjYW52YXMud2lkdGg7IHgrKykge1xyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IGNhbnZhcy5oZWlnaHQ7IHkrKykge1xyXG4gICAgICBsZXQgaSA9ICh4ICsgeSAqIGNhbnZhcy53aWR0aCkgKiA0O1xyXG4gICAgICAvLyBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKDI1NSAqIDE1ICogY3VycmVudC5CW3hdW3ldICogY3VycmVudC5CW3hdW3ldICogY3VycmVudC5CW3hdW3ldKTtcclxuICAgICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcigoY3VycmVudC5BW3hdW3ldIC0gY3VycmVudC5CW3hdW3ldKSAqIDI1NSk7XHJcblxyXG4gICAgICBwaXhlbERhdGFbaV0gPSB2YWx1ZTsgICAgIC8vIHJlZFxyXG4gICAgICBwaXhlbERhdGFbaSsxXSA9IHZhbHVlOyAgIC8vIGdyZWVuXHJcbiAgICAgIHBpeGVsRGF0YVtpKzJdID0gdmFsdWU7ICAgLy8gYmx1ZVxyXG4gICAgICBwaXhlbERhdGFbaSszXSA9IDI1NTsgICAgIC8vIGFscGhhXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjdHgucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbn1cclxuXHJcbmxldCBsYXBsYWNpYW4gPSAoY2hlbWljYWwsIHgsIHkpID0+IHtcclxuICBsZXQgbm9ydGggPSBjdXJyZW50W2NoZW1pY2FsXVt4XVt5ID4gMCA/IHkgLSAxIDogY2FudmFzLmhlaWdodCAtIDFdO1xyXG4gIGxldCBzb3V0aCA9IGN1cnJlbnRbY2hlbWljYWxdW3hdW3kgPCBjYW52YXMuaGVpZ2h0ID8geSArIDEgOiAwXTtcclxuICBsZXQgZWFzdCA9IGN1cnJlbnRbY2hlbWljYWxdW3ggPCBjYW52YXMud2lkdGggLSAxID8geCArIDEgOiAwXVt5XTtcclxuICBsZXQgd2VzdCA9IGN1cnJlbnRbY2hlbWljYWxdW3ggPiAwID8geCAtIDEgOiBjYW52YXMud2lkdGggLSAxXVt5XTtcclxuXHJcbiAgbGV0IG5vcnRod2VzdCA9IGN1cnJlbnRbY2hlbWljYWxdW3ggPiAwID8geCAtIDEgOiBjYW52YXMud2lkdGggLSAxXVt5ID4gMCA/IHkgLSAxIDogY2FudmFzLmhlaWdodCAtIDFdO1xyXG4gIGxldCBub3J0aGVhc3QgPSBjdXJyZW50W2NoZW1pY2FsXVt4IDwgY2FudmFzLndpZHRoIC0gMSA/IHggKyAxIDogMF1beSA+IDAgPyB5IC0gMSA6IGNhbnZhcy5oZWlnaHQgLSAxXTtcclxuICBsZXQgc291dGhlYXN0ID0gY3VycmVudFtjaGVtaWNhbF1beCA8IGNhbnZhcy53aWR0aCAtIDEgPyB4ICsgMSA6IDBdW3kgPCBjYW52YXMuaGVpZ2h0ID8geSArIDEgOiAwXTtcclxuICBsZXQgc291dGh3ZXN0ID0gY3VycmVudFtjaGVtaWNhbF1beCA+IDAgPyB4IC0gMSA6IGNhbnZhcy53aWR0aCAtIDFdW3kgPCBjYW52YXMuaGVpZ2h0ID8geSArIDEgOiAwXTtcclxuXHJcbiAgcmV0dXJuIG5vcnRoICogd2VpZ2h0cy5ub3J0aCArXHJcbiAgICAgICAgIHNvdXRoICogd2VpZ2h0cy5zb3V0aCArXHJcbiAgICAgICAgIGVhc3QgKiB3ZWlnaHRzLmVhc3QgK1xyXG4gICAgICAgICB3ZXN0ICogd2VpZ2h0cy53ZXN0ICtcclxuICAgICAgICAgbm9ydGh3ZXN0ICogd2VpZ2h0cy5ub3J0aHdlc3QgK1xyXG4gICAgICAgICBub3J0aGVhc3QgKiB3ZWlnaHRzLm5vcnRoZWFzdCArXHJcbiAgICAgICAgIHNvdXRoZWFzdCAqIHdlaWdodHMuc291dGhlYXN0ICtcclxuICAgICAgICAgc291dGh3ZXN0ICogd2VpZ2h0cy5zb3V0aHdlc3QgK1xyXG4gICAgICAgICBjdXJyZW50W2NoZW1pY2FsXVt4XVt5XSAqIHdlaWdodHMuY2VudGVyO1xyXG59XHJcblxyXG5zZXR1cCgpOyJdLCJzb3VyY2VSb290IjoiIn0=