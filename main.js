window.onload = function () {
  "use strict";
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  const size = { x: canvas.width, y: canvas.height };

  ctx.fillStyle = "#4b0";
  let x = 0;

  let lastTime = window.performance.now();
  function loop () {
    const deltaTime = (window.performance.now() - lastTime) * 0.001;
    lastTime = window.performance.now();

    ctx.clearRect(0, 0, size.x, size.y);

    Controls.update(deltaTime);
    if (Controls.isPressed(Controls.KEYS.SPACE)) Controls.reset();

    //let times = [ Controls.timePressed(Controls.KEYS.A),
    //              Controls.timePressed(Controls.KEYS.S),
    //              Controls.timePressed(Controls.KEYS.D) ];
    if(Controls.isPressed(Controls.KEYS.LEFT)) x-=0.05;
    if(Controls.isPressed(Controls.KEYS.RIGHT)) x+=0.05;
    let times = [];
    for (let i = 0; i < 100; i++) times.push((Math.sin(x+0.03*i)+1)/2);
    for (let i = 0; i < times.length; i++) {
      ctx.fillStyle = tinycolor({h: (i/times.length) * 360, s: 100, v: 100}).toHexString();
      ctx.fillRect(i * (size.x / times.length),
                   size.y - (times[i] * size.y),
                   size.x / times.length,
                   times[i] * size.y);
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // setInterval(function () { Controls.reset(); }, 1000);
}
