'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @authors ZiQiangWang
 * @email   814120507@qq.com
 * @date    2017-08-04 16:09:17
 */
var w = require("global/window");

//  requestAnimationFrame兼容性写法
(function (win) {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !win.requestAnimationFrame; ++x) {
    win.requestAnimationFrame = win[vendors[x] + 'RequestAnimationFrame'];
    win.cancelAnimationFrame = win[vendors[x] + 'CancelAnimationFrame'] || win[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!win.requestAnimationFrame) {
    win.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = win.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!win.cancelAnimationFrame) {
    win.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})(w);

// 动画效果函数
var Tween = {
  linear: function linear(t, b, c, d) {
    return c * t / d + b;
  },
  easeIn: function easeIn(t, b, c, d) {
    return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOut: function easeOut(t, b, c, d) {
    return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  easeInOut: function easeInOut(t, b, c, d) {
    if (t === 0) return b;
    if (t === d) return b + c;
    var tm = t / (d / 2);
    if (tm < 1) return c / 2 * Math.pow(2, 10 * (tm - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * (t - 1)) + 2) + b;
  }
};

// 获取当前滚动条位置
var currentYPosition = exports.currentYPosition = function currentYPosition() {
  return document.documentElement.scrollTop || w.pageYOffset || document.body.scrollTop;
};

// 获取目标元素的位置
var _elmYPosition = function _elmYPosition(eId) {
  var ele = document.getElementById(eId);
  return ele.offsetTop + 1;
};

// 滚动到指定元素位置
var scrollTo = exports.scrollTo = function scrollTo(pos) {
  var during = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
  var ease = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';

  var scrollY = currentYPosition();
  var targetY = void 0;
  if (typeof pos === 'string') {
    targetY = _elmYPosition(pos);
  } else if (typeof pos === 'number') {
    targetY = pos;
  } else {
    throw new Error('Pos must be id or y position');
  }

  var start = 0;
  var stop = void 0;
  var _run = function _run() {
    start++;
    var top = Tween[ease](start, scrollY, targetY - scrollY, during);
    w.scrollTo(0, top);
    if (start < during) {
      stop = requestAnimationFrame(_run);
    }
  };
  _run();

  return stop;
};

var stopScroll = exports.stopScroll = function stopScroll(stop) {
  cancelAnimationFrame(stop);
};