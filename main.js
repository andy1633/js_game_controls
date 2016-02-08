window.onload = function () {
  "use strict";
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  const size = { x: canvas.width, y: canvas.height };

  Controls.setMouseRelative(canvas);

  ctx.fillStyle = "#4b0";

  const DATA_POINTS = 64;
  let data = [];
  for (let i = 0; i < DATA_POINTS; i++) data.push(0);
  setInterval(function () {
      let index = Math.floor(Math.random() * data.length);
      data[index] = 1
    }, 200)

  let lastTime = window.performance.now();

  function loop () {
    const deltaTime = (window.performance.now() - lastTime) * 0.001;
    lastTime = window.performance.now();

    ctx.clearRect(0, 0, size.x, size.y);

    Controls.updateTimes(deltaTime);

    data.forEach(function (v, i, a) {a[i] -= 0.6 * deltaTime});
    if(Controls.isMousePressed()) data[Math.floor(Controls.getMousePosition().x / size.x * data.length)] = 1;

    for (let i = 0; i < data.length; i++) {
      ctx.fillStyle = tinycolor({h: data[i] * 360, s: 40, v: 100}).toHexString();
      ctx.fillRect(i * (size.x / data.length),
                   size.y - (data[i] * size.y),
                   size.x / data.length,
                   data[i] * size.y);
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
