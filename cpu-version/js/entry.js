let canvas, ctx;

let setup = () => {
  canvas = document.getElementById('sketch');
  ctx = canvas.getContext('2d');

  requestAnimationFrame(update);
}

let update = (timestamp) => {
  var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  var data = imageData.data;

  for(let i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    var a = data[i+3];
  }

  ctx.putImageData(imageData, 0, 0);

  requestAnimationFrame(update);
}

setup();