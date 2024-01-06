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
})({"src/dictionary.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ["the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line"];
},{}],"src/utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = void 0;
var shuffle = function shuffle(array) {
  var result = array.slice();
  for (var i = result.length - 1; i > 0; i--) {
    var idx = Math.floor(Math.random() * (i + 1));
    var tmp = result[i];
    result[i] = result[idx];
    result[idx] = tmp;
  }
  return result;
};
exports.shuffle = shuffle;
},{}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
var dictionary_1 = __importDefault(require("./dictionary"));
var utils_1 = require("./utils");
// build datastructure for game state
var State;
(function (State) {
  State[State["REMAINING"] = 0] = "REMAINING";
  State[State["ERROR"] = 1] = "ERROR";
  State[State["TYPED"] = 2] = "TYPED";
  State[State["SKIPPED"] = 3] = "SKIPPED";
})(State || (State = {}));
var intro_elm = document.getElementById("intro");
var game_elm = document.getElementById("game");
var text_elm = document.getElementById("text");
var caret_elm = document.getElementById("caret");
var score_elm = document.getElementById("score");
var wpm_elem = document.getElementById("wpm");
var acc_elem = document.getElementById("accuracy");
var render = function render(game_state) {
  var text_html = game_state.sequence.map(function (_a, idx) {
    var character = _a.character,
      state = _a.state;
    var cls = [];
    switch (state) {
      case State.REMAINING:
        break;
      case State.ERROR:
        cls.push("error");
        break;
      case State.TYPED:
        cls.push("correct");
        break;
      case State.SKIPPED:
        cls.push("skipped");
        break;
    }
    if (idx === game_state.position) {
      cls.push("current");
    }
    return "<span class=\"" + cls.join(" ") + "\">" + character + "</span>";
  }).join("");
  text_elm.innerHTML = text_html;
  var current_elm = text_elm.querySelector(".current");
  if (current_elm !== null) {
    var bbox = current_elm.getBoundingClientRect();
    caret_elm.style.left = bbox.left - 1 + "px";
    caret_elm.style.top = bbox.top + "px";
    caret_elm.style.height = bbox.height + "px";
  } else {
    console.info(text_html);
  }
};
var alphabet = new Set(__spreadArray([], Array(26), true).map(function (_, i) {
  return String.fromCharCode(i + "a".charCodeAt(0));
}));
alphabet.add(" ");
var score;
var start = function start() {
  var words = (0, utils_1.shuffle)(dictionary_1.default).slice(0, 20);
  document.getElementById("game").style.display = "";
  var text = words.join(" ");
  var game_state = {
    position: 0,
    sequence: Array.from(text).map(function (character) {
      return {
        character: character,
        state: State.REMAINING
      };
    })
  };
  var letter_count = text.length;
  var get_at = function get_at(position) {
    return game_state.sequence[position];
  };
  var get_current = function get_current() {
    return get_at(game_state.position);
  };
  var word_count = 0;
  var done;
  var start_time = null;
  var error_pos = new Set();
  var was_skipped = false;
  var onkeydown = function onkeydown(e) {
    e.preventDefault();
    var key = e.key.toLowerCase();
    console.log(key);
    console.log("position:", game_state.position);
    var last_position = game_state.position;
    if (key === "backspace") {
      console.log("processing backspace");
      if (game_state.position > 0) {
        game_state.position--;
        game_state.sequence[game_state.position].state = State.REMAINING;
      }
    } else if (alphabet.has(key)) {
      console.log("processing letter");
      var current = get_current();
      if (current.character === key) {
        current.state = State.TYPED;
        if (key === " ") {
          word_count++;
        }
        game_state.position++;
      } else if (key === " ") {
        if (game_state.position > 0 && get_at(game_state.position - 1).character !== " ") {
          var position = game_state.position;
          while (position < game_state.sequence.length && get_at(position).character !== " ") {
            error_pos.add(position);
            get_at(position).state = State.SKIPPED;
            was_skipped = true;
            position++;
          }
          game_state.position = position;
          game_state.position++;
        }
      } else {
        current.state = State.ERROR;
        error_pos.add(game_state.position);
        game_state.position++;
      }
    }
    if (last_position !== game_state.position) {
      render(game_state);
    }
    if (game_state.position > 0 && start_time === null) {
      start_time = performance.now();
    }
    if (game_state.position >= game_state.sequence.length) {
      if (!was_skipped) {
        // for the last word we don't type space so
        // we count it at the end unless it's skipped
        word_count++;
      }
      done();
    }
  };
  done = function done() {
    window.removeEventListener("keydown", onkeydown);
    console.log("done");
    game_elm.style.display = "none";
    var end_time = performance.now();
    score(end_time - start_time, word_count, error_pos.size, letter_count);
  };
  window.addEventListener("keydown", onkeydown);
  render(game_state);
};
var bind_play = function bind_play(elm) {
  var onkeydown = function onkeydown(e) {
    if (e.key === " ") {
      e.preventDefault();
      elm.style.display = "none";
      window.removeEventListener("keydown", onkeydown);
      start();
    }
  };
  window.addEventListener("keydown", onkeydown);
};
score = function score(duration, word_count, errors, letter_count) {
  bind_play(score_elm);
  score_elm.style.display = "";
  var wpm = word_count / (duration / 60000);
  var acc = 1 - errors / letter_count;
  wpm_elem.textContent = "" + Math.round(wpm);
  acc_elem.textContent = Math.round(acc * 100) + "%";
};
var init = function init() {
  bind_play(intro_elm);
};
init();
},{"./dictionary":"src/dictionary.ts","./utils":"src/utils.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52532" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map