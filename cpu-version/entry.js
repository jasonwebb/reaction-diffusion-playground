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
  for(let x = 0; x < canvas.width; x++) {
    for(let y = 0; y < canvas.height; y++) {
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
  let prevCol = x > 0 ? x - 1 : canvas.width - 1,
      prevRow = y > 0 ? y - 1 : canvas.height - 1,
      nextCol = x < canvas.width - 1 ? x + 1 : 0,
      nextRow = y < canvas.height - 1 ? y + 1 : 0;

  let north = current[chemical][x][prevRow],
      south = current[chemical][x][nextRow],
      east = current[chemical][nextCol][y],
      west = current[chemical][prevCol][y];

  let northwest = current[chemical][prevCol][prevRow],
      northeast = current[chemical][nextCol][prevRow],
      southeast = current[chemical][nextCol][nextRow],
      southwest = current[chemical][prevCol][nextRow];

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