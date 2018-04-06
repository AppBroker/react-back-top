/**
 * @authors ZiQiangWang
 * @email   814120507@qq.com
 * @date    2017-08-04 16:09:17
 */
var w = require("global/window");


//  requestAnimationFrame兼容性写法
(function (win) {
  let lastTime = 0;
  const vendors = ['webkit', 'moz'];
  for (let x = 0; x < vendors.length && !win.requestAnimationFrame; ++x) {
    win.requestAnimationFrame = win[`${vendors[x]}RequestAnimationFrame`];
    win.cancelAnimationFrame =
          win[`${vendors[x]}CancelAnimationFrame`] || win[`${vendors[x]}CancelRequestAnimationFrame`];
  }

  if (!win.requestAnimationFrame) {
    win.requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = win.setTimeout(() => { callback(currTime + timeToCall); },
        timeToCall);
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
const Tween = {
  linear(t, b, c, d) { return c * t / d + b; },
  easeIn(t, b, c, d) {
    return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOut(t, b, c, d) {
    return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  easeInOut(t, b, c, d) {
    if (t === 0) return b;
    if (t === d) return b + c;
    const tm = t / (d / 2);
    if (tm < 1) return c / 2 * Math.pow(2, 10 * (tm - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * (t - 1)) + 2) + b;
  },
};

// 获取当前滚动条位置
export const currentYPosition = () => document.documentElement.scrollTop
  || w.pageYOffset
  || document.body.scrollTop;

// 获取目标元素的位置
const _elmYPosition = (eId) => {
  const ele = document.getElementById(eId);
  return ele.offsetTop + 1;
};

// 滚动到指定元素位置
export const scrollTo = (pos, during = 60, ease = 'linear') => {
  const scrollY = currentYPosition();
  let targetY;
  if (typeof pos === 'string') {
    targetY = _elmYPosition(pos);
  } else if (typeof pos === 'number') {
    targetY = pos;
  } else {
    throw new Error('Pos must be id or y position');
  }

  let start = 0;
  let stop;
  const _run = function () {
    start++;
    const top = Tween[ease](start, scrollY, targetY - scrollY, during);
    w.scrollTo(0, top);
    if (start < during) {
      stop = requestAnimationFrame(_run);
    }
  };
  _run();

  return stop;
};

export const stopScroll = (stop) => {
  cancelAnimationFrame(stop);
}
