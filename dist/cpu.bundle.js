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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cpu-version/entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cpu-version/entry.js":
/*!******************************!*\
  !*** ./cpu-version/entry.js ***!
  \******************************/
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
  for(let x = 0; x < canvas.width; x++) {
    for(let y = 0; y < canvas.height; y++) {
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
  let prevCol = x > 0 ? x - 1 : canvas.width - 1,
      prevRow = y > 0 ? y - 1 : canvas.height - 1,
      nextCol = x < canvas.width - 1 ? x + 1 : 0,
      nextRow = y < canvas.height - 1 ? y + 1 : 0;

  let north = current[chemical][x][prevRow],
      south = current[chemical][x][nextRow],
      east = current[chemical][nextCol][y],
      west = current[chemical][prevCol][y];

  let northwest = current[chemical][prevCol][prevRow],
      northeast = current[chemical][nextCol][prevRow],
      southeast = current[chemical][nextCol][nextRow],
      southwest = current[chemical][prevCol][nextRow];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY3B1LXZlcnNpb24vZW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixtQkFBbUI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLGtCQUFrQjtBQUNsQyxrQkFBa0IsbUJBQW1CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixrQkFBa0I7QUFDbEMsa0JBQWtCLG1CQUFtQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsMkJBQTJCO0FBQzNCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFEiLCJmaWxlIjoiY3B1LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY3B1LXZlcnNpb24vZW50cnkuanNcIik7XG4iLCJsZXQgY2FudmFzLCBjdHg7XG5sZXQgaW1hZ2VEYXRhLCBwaXhlbERhdGE7XG5sZXQgY3VycmVudCwgbmV4dDtcblxuY29uc3QgRGEgPSAuNDIsXG4gICAgICBEYiA9IDAuMTI1LFxuICAgICAgZiA9IC4wNTUsXG4gICAgICBrID0gMC4wNjI1O1xuXG5jb25zdCB3ZWlnaHRzID0ge1xuICBub3J0aDogLjIsXG4gIHNvdXRoOiAuMixcbiAgZWFzdDogLjIsXG4gIHdlc3Q6IC4yLFxuICBub3J0aHdlc3Q6IC4wNSxcbiAgbm9ydGhlYXN0OiAuMDUsXG4gIHNvdXRoZWFzdDogLjA1LFxuICBzb3V0aHdlc3Q6IC4wNSxcbiAgY2VudGVyOiAtMVxufTtcblxubGV0IHNldHVwID0gKCkgPT4ge1xuICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tldGNoJyk7XG4gIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gIGN1cnJlbnQgPSB7XG4gICAgQTogW10sXG4gICAgQjogW11cbiAgfTtcblxuICBuZXh0ID0ge1xuICAgIEE6IFtdLFxuICAgIEI6IFtdXG4gIH07XG5cbiAgZm9yKGxldCB4ID0gMDsgeCA8IGNhbnZhcy53aWR0aDsgeCsrKSB7XG4gICAgY3VycmVudC5BW3hdID0gW107XG4gICAgY3VycmVudC5CW3hdID0gW107XG4gICAgbmV4dC5BW3hdID0gW107XG4gICAgbmV4dC5CW3hdID0gW107XG5cbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgY2FudmFzLmhlaWdodDsgeSsrKSB7XG4gICAgICBjdXJyZW50LkFbeF1beV0gPSAxO1xuICAgICAgY3VycmVudC5CW3hdW3ldID0gMDtcbiAgICAgIG5leHQuQVt4XVt5XSA9IDA7XG4gICAgICBuZXh0LkJbeF1beV0gPSAwO1xuXG4gICAgICBpZihcbiAgICAgICAgeCA+PSBjYW52YXMud2lkdGgvMiAtIDEwICYmXG4gICAgICAgIHggPD0gY2FudmFzLndpZHRoLzIgKyAxMCAmJlxuICAgICAgICB5ID49IGNhbnZhcy5oZWlnaHQvMiAtIDEwICYmXG4gICAgICAgIHkgPD0gY2FudmFzLmhlaWdodC8yICsgMTBcbiAgICAgICkge1xuICAgICAgICBjdXJyZW50LkJbeF1beV0gPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xufVxuXG5sZXQgdXBkYXRlID0gKHRpbWVzdGFtcCkgPT4ge1xuICAvLyBDYWxjdWxhdGUgbmV4dCBBIGFuZCBCIHZhbHVlc1xuICBmb3IobGV0IHggPSAwOyB4IDwgY2FudmFzLndpZHRoOyB4KyspIHtcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgY2FudmFzLmhlaWdodDsgeSsrKSB7XG4gICAgICBsZXQgQSA9IGN1cnJlbnQuQVt4XVt5XSxcbiAgICAgICAgICBCID0gY3VycmVudC5CW3hdW3ldLFxuICAgICAgICAgIGRpZmZ1c2lvbkEgPSBEYSAqIGxhcGxhY2lhbignQScsIHgsIHkpLFxuICAgICAgICAgIGRpZmZ1c2lvbkIgPSBEYiAqIGxhcGxhY2lhbignQicsIHgsIHkpLFxuICAgICAgICAgIHJlYWN0aW9uID0gQSAqIEIgKiBCO1xuXG4gICAgICBuZXh0LkFbeF1beV0gPSBBICsgZGlmZnVzaW9uQSAtIHJlYWN0aW9uICsgZiAqICgxIC0gQSk7XG4gICAgICBuZXh0LkJbeF1beV0gPSBCICsgZGlmZnVzaW9uQiArIHJlYWN0aW9uIC0gKGsgKyBmKSAqIEI7XG4gICAgfVxuICB9XG5cbiAgLy8gTWFrZSB0aGUgbmV4dCB2YWx1ZXMgdGhlIGN1cnJlbnQgb25lc1xuICBjdXJyZW50ID0gbmV4dDtcblxuICBkcmF3KCk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xufVxuXG5sZXQgZHJhdyA9ICgpID0+IHtcbiAgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBwaXhlbERhdGEgPSBpbWFnZURhdGEuZGF0YTtcblxuICBmb3IobGV0IHggPSAwOyB4IDwgY2FudmFzLndpZHRoOyB4KyspIHtcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgY2FudmFzLmhlaWdodDsgeSsrKSB7XG4gICAgICBsZXQgaSA9ICh4ICsgeSAqIGNhbnZhcy53aWR0aCkgKiA0O1xuICAgICAgLy8gbGV0IHZhbHVlID0gTWF0aC5mbG9vcigyNTUgKiAxNSAqIGN1cnJlbnQuQlt4XVt5XSAqIGN1cnJlbnQuQlt4XVt5XSAqIGN1cnJlbnQuQlt4XVt5XSk7XG4gICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKChjdXJyZW50LkFbeF1beV0gLSBjdXJyZW50LkJbeF1beV0pICogMjU1KTtcblxuICAgICAgcGl4ZWxEYXRhW2ldID0gdmFsdWU7ICAgICAvLyByZWRcbiAgICAgIHBpeGVsRGF0YVtpKzFdID0gdmFsdWU7ICAgLy8gZ3JlZW5cbiAgICAgIHBpeGVsRGF0YVtpKzJdID0gdmFsdWU7ICAgLy8gYmx1ZVxuICAgICAgcGl4ZWxEYXRhW2krM10gPSAyNTU7ICAgICAvLyBhbHBoYVxuICAgIH1cbiAgfVxuXG4gIGN0eC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcbn1cblxubGV0IGxhcGxhY2lhbiA9IChjaGVtaWNhbCwgeCwgeSkgPT4ge1xuICBsZXQgcHJldkNvbCA9IHggPiAwID8geCAtIDEgOiBjYW52YXMud2lkdGggLSAxLFxuICAgICAgcHJldlJvdyA9IHkgPiAwID8geSAtIDEgOiBjYW52YXMuaGVpZ2h0IC0gMSxcbiAgICAgIG5leHRDb2wgPSB4IDwgY2FudmFzLndpZHRoIC0gMSA/IHggKyAxIDogMCxcbiAgICAgIG5leHRSb3cgPSB5IDwgY2FudmFzLmhlaWdodCAtIDEgPyB5ICsgMSA6IDA7XG5cbiAgbGV0IG5vcnRoID0gY3VycmVudFtjaGVtaWNhbF1beF1bcHJldlJvd10sXG4gICAgICBzb3V0aCA9IGN1cnJlbnRbY2hlbWljYWxdW3hdW25leHRSb3ddLFxuICAgICAgZWFzdCA9IGN1cnJlbnRbY2hlbWljYWxdW25leHRDb2xdW3ldLFxuICAgICAgd2VzdCA9IGN1cnJlbnRbY2hlbWljYWxdW3ByZXZDb2xdW3ldO1xuXG4gIGxldCBub3J0aHdlc3QgPSBjdXJyZW50W2NoZW1pY2FsXVtwcmV2Q29sXVtwcmV2Um93XSxcbiAgICAgIG5vcnRoZWFzdCA9IGN1cnJlbnRbY2hlbWljYWxdW25leHRDb2xdW3ByZXZSb3ddLFxuICAgICAgc291dGhlYXN0ID0gY3VycmVudFtjaGVtaWNhbF1bbmV4dENvbF1bbmV4dFJvd10sXG4gICAgICBzb3V0aHdlc3QgPSBjdXJyZW50W2NoZW1pY2FsXVtwcmV2Q29sXVtuZXh0Um93XTtcblxuICByZXR1cm4gbm9ydGggKiB3ZWlnaHRzLm5vcnRoICtcbiAgICAgICAgIHNvdXRoICogd2VpZ2h0cy5zb3V0aCArXG4gICAgICAgICBlYXN0ICogd2VpZ2h0cy5lYXN0ICtcbiAgICAgICAgIHdlc3QgKiB3ZWlnaHRzLndlc3QgK1xuICAgICAgICAgbm9ydGh3ZXN0ICogd2VpZ2h0cy5ub3J0aHdlc3QgK1xuICAgICAgICAgbm9ydGhlYXN0ICogd2VpZ2h0cy5ub3J0aGVhc3QgK1xuICAgICAgICAgc291dGhlYXN0ICogd2VpZ2h0cy5zb3V0aGVhc3QgK1xuICAgICAgICAgc291dGh3ZXN0ICogd2VpZ2h0cy5zb3V0aHdlc3QgK1xuICAgICAgICAgY3VycmVudFtjaGVtaWNhbF1beF1beV0gKiB3ZWlnaHRzLmNlbnRlcjtcbn1cblxuc2V0dXAoKTsiXSwic291cmNlUm9vdCI6IiJ9