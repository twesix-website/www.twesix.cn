// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"qJIH":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var prototype = {};

prototype.prepareAPI = function () {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || msAudioContext;
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

  try {
    new window.AudioContext();
    return true;
  } catch (e) {
    console.log(e);
    alert('浏览器颜值太低, 音乐不想来见你 ！');
    return false;
  }
};

prototype.init = function (that, audioSource, canvas, options) {
  if (!this.__prepareAPI()) {
    return false;
  }

  that.__audioSource = audioSource;
  that.__canvas = canvas;
  var __options = options;
  that.__options = __options;
  that.__ctx = that.__canvas.getContext('2d');
  that.__audioContext = new window.AudioContext();
  that.__dataSource = that.__audioContext.createMediaElementSource(that.__audioSource);
  that.__analyser = that.__audioContext.createAnalyser();

  that.__dataSource.connect(that.__analyser);

  that.__analyser.connect(that.__audioContext.destination);

  that.__interval = null;
  return true;
};

prototype.clearCanvas = function () {
  this.__ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);
};

prototype.getByteFrequencyData = function () {
  var array = new Uint8Array(this.__analyser.frequencyBinCount);

  this.__analyser.getByteFrequencyData(array);

  return array;
};

var _default = prototype;
exports.default = _default;
},{}],"V+lz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prototype = _interopRequireDefault(require("../prototype"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  meterWidth: 20,
  gapWidth: 2,
  capHeight: 3,
  capFallSpeed: 3,
  capColor: '#ff2f3f',
  gradientLength: 1080,
  gradientStartColor: '#5bbeff',
  gradientMiddleColor: '#aad8ff',
  gradientEndColor: '#fb9c7a' // TODO: design beautiful gradients
  // TODO: optimize rendering

};

var Spectrum = function Spectrum(audioSource, canvas) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var __options = Object.assign(defaultOptions, options);

  if (!this.__init(this, audioSource, canvas, __options)) return;

  this.__calculateSize();

  var gradient = this.__ctx.createLinearGradient(0, 0, 0, this.__options.gradientLength);

  gradient.addColorStop(1, this.__options.gradientStartColor);
  gradient.addColorStop(0.5, this.__options.gradientMiddleColor);
  gradient.addColorStop(0, this.__options.gradientEndColor);
  this.__options.gradient = gradient;
};

Spectrum.prototype = {
  __prepareAPI: _prototype.default.prepareAPI,
  __init: _prototype.default.init,
  __clearCanvas: _prototype.default.clearCanvas,
  __getByteFrequencyData: _prototype.default.getByteFrequencyData,
  __calculateSize: function __calculateSize() {
    var width = this.__canvas.width;
    var meter = this.__options.meterWidth;
    var gap = this.__options.gapWidth;
    var num;
    num = parseInt(width / (meter + gap));

    if (width % (num * (meter + gap)) < meter) {
      this.__options.meterNum = num;
    } else {
      this.__options.meterNUm = num + 1;
    }
  },
  resize: function resize() {
    var self = this;

    self.__calculateSize();
  },
  start: function start() {
    this.__draw();
  },
  stop: function stop() {
    clearInterval(this.__interval);
  },
  __draw: function __draw() {
    var self = this;
    var options = this.__options;
    var capPositions = [];
    var capInitialPosition = 0;
    var canvas = this.__canvas;
    var ctx = this.__ctx;

    var clearCanvas = this.__clearCanvas.bind(this);

    var getByteFrequencyData = this.__getByteFrequencyData.bind(this);

    while (capPositions.length < options.meterNum) {
      capPositions.push(capInitialPosition);
    }

    var draw_meter = function draw_meter() {
      var array = getByteFrequencyData();
      var step = Math.round(array.length / options.meterNum);
      clearCanvas();

      for (var i = 0; i < options.meterNum; i++) {
        var value = array[i * step] / 256 * canvas.height;
        ctx.fillStyle = options.capColor;

        if (value < capPositions[i]) {
          capPositions[i] = capPositions[i] - options.capFallSpeed > capInitialPosition ? capPositions[i] - options.capFallSpeed : capInitialPosition;
          var x = i * (options.meterWidth + options.gapWidth);
          var y = canvas.height - capPositions[i] - options.capHeight;
          ctx.fillRect(x, y, options.meterWidth, options.capHeight);
        } else {
          var _x = i * (options.meterWidth + options.gapWidth);

          var _y = canvas.height - value - options.capHeight;

          ctx.fillRect(_x, _y, options.meterWidth, options.capHeight);
          capPositions[i] = value;
        }

        ctx.fillStyle = options.gradient;
        ctx.fillRect(i * (options.meterWidth + options.gapWidth), canvas.height - value, options.meterWidth, value); // TODO: draw more small rectangles rather than one big
      }
    };

    self.__interval = setInterval(function () {
      requestAnimationFrame(draw_meter);
    }, 10);
  }
};
var _default = Spectrum;
exports.default = _default;
},{"../prototype":"qJIH"}],"p1KM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spectrum = _interopRequireDefault(require("./types/spectrum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AudioVisualizer = {};
window.AudioVisualizer = AudioVisualizer;
AudioVisualizer.Spectrum = _spectrum.default;
var _default = AudioVisualizer;
exports.default = _default;
},{"./types/spectrum":"V+lz"}],"6O/d":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _audioVisualization = _interopRequireDefault(require("../audio-visualization/"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var playlist = [];
var baseUrl = 'https://twesix.cn/music';
var playListId = 971042549;

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var result;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return $.getJSON("".concat(baseUrl, "/playlist/detail?id=").concat(playListId));

        case 2:
          result = _context.sent;
          playlist = JSON.parse(JSON.stringify(result.result.tracks));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

var _default = {
  name: 'music',
  data: function data() {
    return {
      audioName: ' 加载中 ',
      player: null,
      musicId: 31473269
    };
  },
  computed: {
    musicUrl: function musicUrl() {
      return "https://twesix.cn/proxy/?url=http://music.163.com/song/media/outer/url?id=".concat(this.musicId, ".mp3");
    }
  },
  mounted: function mounted() {
    var self = this;
    this.player = document.getElementById('player');
    this.switchMusic();

    function visualize() {
      var canvas = document.getElementById('music_canvas');

      function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      resize();
      var visualizer = new _audioVisualization.default.Spectrum(self.player, canvas);
      visualizer.start();
      window.addEventListener('resize', function () {
        resize();
        visualizer.resize();
      });
    }

    visualize();
  },
  methods: {
    switchMusic: function switchMusic() {
      var _this = this;

      this.player.pause();
      var music = playlist.shift();

      if (!music) {
        setTimeout(function () {
          console.log("music list loading, wait for 100ms to switch music");

          _this.switchMusic();
        }, 100);
        return;
      }

      playlist.push(music);
      this.audioName = music.name;
      this.musicId = music.id;
    },
    canplay: function canplay() {
      this.player.play();
    },
    ended: function ended() {
      this.switchMusic();
    },
    musicOff: function musicOff() {
      this.$emit('musicOff');
    },
    error: function error(e) {
      console.log(e);
      this.switchMusic();
    }
  }
};
exports.default = _default;
        var $f8d851 = exports.default || module.exports;
      
      if (typeof $f8d851 === 'function') {
        $f8d851 = $f8d851.options;
      }
    
        /* template */
        Object.assign($f8d851, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"music"}},[_c('div',{attrs:{"id":"panel"}},[_c('div',{staticClass:"background"}),_vm._v(" "),_c('div',{attrs:{"id":"music_info"}},[_c('h1',{staticClass:"title",attrs:{"id":"music_name"}},[_vm._v("\n                "+_vm._s(_vm.audioName)+"\n            ")])]),_vm._v(" "),_c('div',{attrs:{"id":"music_controls"}},[_c('button',{staticClass:"button is-success",on:{"click":_vm.switchMusic}},[_vm._v("  "),_c('i',{staticClass:"fa fa-fast-forward"}),_vm._v("  ")]),_vm._v("\n                     \n            "),_c('button',{staticClass:"button is-danger",on:{"click":_vm.musicOff}},[_vm._v("  "),_c('i',{staticClass:"fa fa-times"}),_vm._v("  ")])]),_vm._v(" "),_c('audio',{attrs:{"id":"player","controls":"","src":_vm.musicUrl,"crossOrigin":"anonymous"},on:{"error":_vm.error,"canplay":_vm.canplay,"ended":_vm.ended}})]),_vm._v(" "),_c('canvas',{attrs:{"id":"music_canvas"}})])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: "data-v-f8d851",
            functional: undefined
          };
        })());
      
},{"../audio-visualization/":"p1KM"}],"QKmi":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: 'content',
  methods: {
    musicOn: function musicOn() {
      this.$emit('musicOn');
    }
  }
};
exports.default = _default;
        var $e79389 = exports.default || module.exports;
      
      if (typeof $e79389 === 'function') {
        $e79389 = $e79389.options;
      }
    
        /* template */
        Object.assign($e79389, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"content"}},[_c('div',{staticClass:"content-wrapper"},[_c('div',{staticClass:"background"}),_vm._v(" "),_c('div',{staticClass:"content-inner"},[_c('h1',{staticClass:"title has-text-centered",attrs:{"id":"title"}},[_vm._v("孟政元的个人网站")]),_vm._v(" "),_c('br'),_vm._v(" "),_c('br'),_vm._v(" "),_c('div',{staticClass:"columns",attrs:{"id":"nav"}},[_c('div',{staticClass:"is-3 column"}),_vm._v(" "),_c('a',{staticClass:"is-2 column has-text-centered link",attrs:{"href":"https://github.com/twesix","target":"_blank"}},[_vm._v("\n                    代码\n                ")]),_vm._v(" "),_c('a',{staticClass:"is-2 column has-text-centered link",attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();return _vm.musicOn($event)}}},[_vm._v("\n                    音乐\n                ")]),_vm._v(" "),_c('a',{staticClass:"is-2 column has-text-centered link",attrs:{"href":"https://www.jianshu.com/u/a662a629db7d","target":"_blank"}},[_vm._v("\n                    远方\n                ")]),_vm._v(" "),_c('div',{staticClass:"is-3 column"})])])])])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: "data-v-e79389",
            functional: undefined
          };
        })());
      
},{}],"Nsrb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _music = _interopRequireDefault(require("./music.vue"));

var _myNavigation = _interopRequireDefault(require("./my-navigation.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
var _default = {
  name: 'root',
  data: function data() {
    return {
      playingMusic: false,
      day: false
    };
  },
  beforeMount: function beforeMount() {
    var day = new Date().getDate();

    if (day < 10) {
      day = '0' + day;
    }

    this.day = day;
  },
  components: {
    music: _music.default,
    'my-navigation': _myNavigation.default
  },
  computed: {
    backgroundImageUrl: function backgroundImageUrl() {
      return "url(https://cn-twesix-static.oss-cn-beijing.aliyuncs.com/homepage/background-images/".concat(this.day, ".jpg)");
    }
  },
  methods: {
    musicOn: function musicOn() {
      this.playingMusic = true;
    },
    musicOff: function musicOff() {
      this.playingMusic = false;
    }
  }
};
exports.default = _default;
        var $977b07 = exports.default || module.exports;
      
      if (typeof $977b07 === 'function') {
        $977b07 = $977b07.options;
      }
    
        /* template */
        Object.assign($977b07, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"has-text-centered",style:({backgroundImage: _vm.backgroundImageUrl}),attrs:{"id":"root"}},[(_vm.playingMusic)?_c('div',[_c('music',{on:{"musicOff":_vm.musicOff}})],1):_c('div',[_c('my-navigation',{on:{"musicOn":_vm.musicOn}})],1)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: "data-v-977b07",
            functional: undefined
          };
        })());
      
},{"./music.vue":"6O/d","./my-navigation.vue":"QKmi"}],"97BZ":[function(require,module,exports) {
"use strict";

var _root = _interopRequireDefault(require("./components/root.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new Vue({
  el: '#app',
  template: '<root></root>',
  name: 'app',
  components: {
    root: _root.default
  }
});
},{"./components/root.vue":"Nsrb"}]},{},["97BZ"], null)
//# sourceMappingURL=entry.c58eb246.js.map