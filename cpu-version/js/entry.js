let canvas, ctx;
let imageData, pixelData;
let current, next;

const Da = .42,
      Db = 0.125,
      f = .055,
      k = 0.0625;

const weights = {
  north: .2,
  south: .2,
  east: .2,
  west: .2,
  northwest: .05,
  northeast: .05,
  southeast: .05,
  southwest: .05,
  center: -1
};

let setup = () => {
  canvas = document.getElementById('sketch');
  ctx = canvas.getContext('2d');

  current = {
    A: [],
    B: []
  };

  next = {
    A: [],
    B: []
  };

  for(let x = 0; x < canvas.width; x++) {
    current.A[x] = [];
    current.B[x] = [];
    next.A[x] = [];
    next.B[x] = [];

    for(let y = 0; y < canvas.height; y++) {
      current.A[x][y] = 1;
      current.B[x][y] = 0;
      next.A[x][y] = 0;
      next.B[x][y] = 0;

      if(
        x >= canvas.width/2 - 10 &&
        x <= canvas.width/2 + 10 &&
        y >= canvas.height/2 - 10 &&
        y <= canvas.height/2 + 10
      ) {
        current.B[x][y] = 1;
      }
    }
  }

  requestAnimationFrame(update);
}

let update = (timestamp) => {
  // Calculate next A and B values
  for(let x = 1; x < canvas.width - 1; x++) {
    for(let y = 1; y < canvas.height - 1; y++) {
      let A = current.A[x][y],
          B = current.B[x][y],
          diffusionA = Da * laplacian('A', x, y),
          diffusionB = Db * laplacian('B', x, y),
          reaction = A * B * B;

      next.A[x][y] = A + diffusionA - reaction + f * (1 - A);
      next.B[x][y] = B + diffusionB + reaction - (k + f) * B;
    }
  }

  // Make the next values the current ones
  current = next;

  draw();
  requestAnimationFrame(update);
}

let draw = () => {
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pixelData = imageData.data;

  for(let x = 0; x < canvas.width; x++) {
    for(let y = 0; y < canvas.height; y++) {
      let i = (x + y * canvas.width) * 4;
      // let value = Math.floor(255 * 15 * current.B[x][y] * current.B[x][y] * current.B[x][y]);
      let value = Math.floor((current.A[x][y] - current.B[x][y]) * 255);

      pixelData[i] = value;     // red
      pixelData[i+1] = value;   // green
      pixelData[i+2] = value;   // blue
      pixelData[i+3] = 255;     // alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

let laplacian = (chemical, x, y) => {
  let north = current[chemical][x][y > 0 ? y - 1 : canvas.height - 1];
  let south = current[chemical][x][y < canvas.height ? y + 1 : 0];
  let east = current[chemical][x < canvas.width - 1 ? x + 1 : 0][y];
  let west = current[chemical][x > 0 ? x - 1 : canvas.width - 1][y];

  let northwest = current[chemical][x > 0 ? x - 1 : canvas.width - 1][y > 0 ? y - 1 : canvas.height - 1];
  let northeast = current[chemical][x < canvas.width - 1 ? x + 1 : 0][y > 0 ? y - 1 : canvas.height - 1];
  let southeast = current[chemical][x < canvas.width - 1 ? x + 1 : 0][y < canvas.height ? y + 1 : 0];
  let southwest = current[chemical][x > 0 ? x - 1 : canvas.width - 1][y < canvas.height ? y + 1 : 0];

  return north * weights.north +
         south * weights.south +
         east * weights.east +
         west * weights.west +
         northwest * weights.northwest +
         northeast * weights.northeast +
         southeast * weights.southeast +
         southwest * weights.southwest +
         current[chemical][x][y] * weights.center;
}

setup();