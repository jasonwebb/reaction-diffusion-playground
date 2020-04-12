let canvas, ctx;
let pixels;

let setup = () => {
  canvas = document.getElementById('sketch');
  ctx = canvas.getContext('2d');

  requestAnimationFrame(update);
}

let update = (timestamp) => {
  pixels = ctx.getImageData(0,0,500,500);

  ctx.putImageData(pixels, 0, 0);

  requestAnimationFrame(update);
}

setup();