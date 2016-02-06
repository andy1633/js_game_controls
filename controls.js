"use strict";
var Controls = (function () {
  const KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
                 SPACE: 32, E: 69, W: 87, A: 65, S: 83, D: 68 }
  let watchKeyCodes = [];
  for (var k in KEYS) {
    if (KEYS.hasOwnProperty(k)) watchKeyCodes.push(KEYS[k]);
  }
  let keyStates = new Map();

  function isTracked (keyCode) { return watchKeyCodes.indexOf(keyCode) != -1 };
  function setKeyPressed (keyCode, pressed) {
    if (isTracked(keyCode)) {
      if (!keyStates.get(keyCode)) {
        keyStates.set(keyCode, { pressed: false, time: 0 });
      }
      keyStates.get(keyCode).pressed = pressed;
    }
  }

  window.addEventListener("keydown", function (e) {
    if (isTracked(e.keyCode)) e.preventDefault();
    setKeyPressed(e.keyCode, true);
  });
  window.addEventListener("keyup", function (e) {
    setKeyPressed(e.keyCode, false);
  });

  function isPressed (keyCode) {
    let keyState = keyStates.get(keyCode);
    return keyState && keyState.pressed;
  }

  function timePressed (keyCode) {
    let keyState = keyStates.get(keyCode);
    return keyState ? keyState.time : 0;
  }

  function update(deltaTime) {
    for (let state of keyStates.values()) {
      if (state.pressed) {
        state.time += deltaTime;
      }
    }
  }

  function reset () {
    for (let state of keyStates.values()) {
      state.time = 0;
    }
  }

  return {
    KEYS: KEYS,

    isPressed: isPressed,
    timePressed: timePressed,
    update: update,
    reset: reset
  }
})();
