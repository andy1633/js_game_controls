"use strict";
var Controls = (function () {
  // Handy object for looking up names of keys.
  const KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
                 SPACE: 32, E: 69, W: 87, A: 65, S: 83, D: 68 };
  // Map object that will store state of all keys that have been pressed.
  let keyStates = new Map();
  // Array containing all keys we should watch.
  let watchKeyCodes = [];
  for (var k in KEYS) {
    if (KEYS.hasOwnProperty(k)) watchKeyCodes.push(KEYS[k]);
  }

  let mouseRelative;
  let mousePos = { x: 0, y: 0 };
  let mousePressed = false;
  let mousePressedTime = 0;

  // Returns whether or not the key is in the watchKeyCodes array.
  function isTracked (keyCode) { return watchKeyCodes.indexOf(keyCode) != -1 };
  // Updates the keyStates with a new keyState as long as it is a tracked key.
  function setKeyPressed (keyCode, pressed) {
    if (isTracked(keyCode)) {
      if (!keyStates.get(keyCode)) {
        keyStates.set(keyCode, { pressed: false, time: 0 });
      }
      keyStates.get(keyCode).pressed = pressed;
    }
  }

  // Updates the key states when a button is pressed down.
  window.addEventListener("keydown", function (e) {
    if (isTracked(e.keyCode)) e.preventDefault();
    setKeyPressed(e.keyCode, true);
  });
  // Updates the key states when a button is released
  window.addEventListener("keyup", function (e) {
    setKeyPressed(e.keyCode, false);
  });

  // Returns whether or not the requested key is currently pressed.
  function isKeyPressed (keyCode) {
    let keyState = keyStates.get(keyCode);
    return keyState && keyState.pressed;
  }

  // Queries how long the key has been pressed for since the last time
  // reset was called.
  function timeKeyPressed (keyCode) {
    let keyState = keyStates.get(keyCode);
    return keyState ? keyState.time : 0;
  }

  // Function called when the mouse is pressed on the mouseRelative object.
  function onMouseDown (e) {
    e.preventDefault();
    mousePressed = true;
  }
  // Function called when the mouse is released or leaves the mouseRelative
  // object.
  function onMouseUp (e) { mousePressed = false; }
  // Function called when the mouse moves on the mouseRelative object.
  function onMouseMove (e) {
    let rect = mouseRelative.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
  }

  // Sets position for mouse to be detected on and for the mouse to be
  // positioned relative to.
  function setMouseRelative (object) {
    if (object !== mouseRelative) {
      mousePos = { x: 0, y: 0 };
      mousePressed = false;

      if (mouseRelative) {
        mouseRelative.removeEventListener("mousedown", onMouseDown);
        mouseRelative.removeEventListener("mouseup", onMouseUp);
        mouseRelative.removeEventListener("mouseleave", onMouseUp);
        mouseRelative.removeEventListener("mousemove", onMouseMove);
      }
      mouseRelative = object;
      mouseRelative.addEventListener("mousedown", onMouseDown);
      mouseRelative.addEventListener("mouseup", onMouseUp);
      mouseRelative.addEventListener("mouseleave", onMouseUp);
      mouseRelative.addEventListener("mousemove", onMouseMove);
    }
  }

  function isMousePressed () { return mousePressed; }
  function getMousePosition () { return mousePos; }

  // Increments every pressed key and the mouse's time value.
  function updateTimes(deltaTime) {
    for (let state of keyStates.values()) {
      if (state.pressed) {
        state.time += deltaTime;
      }
    }

    if (mousePressed) mousePressedTime += deltaTime;
  }

  // Reset every keyState and the mouse's time value.
  function resetTimes () {
    for (let state of keyStates.values()) {
      state.time = 0;
    }

    mousePressedTime = 0;
  }

  // Return the things we want to reveal to the world.
  return {
    // Public keyboard stuff.
    KEYS: KEYS,
    isKeyPressed: isKeyPressed,
    timeKeyPressed: timeKeyPressed,
    // Public mouse stuff.
    setMouseRelative: setMouseRelative,
    isMousePressed: isMousePressed,
    getMousePosition: getMousePosition,
    // General control stuff.
    updateTimes: updateTimes,
    resetTimes: resetTimes
  }
})();
