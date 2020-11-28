import fps from 'fps';

let numIterations = 0, iterationsPerFrame;
let ticker = fps({ every: 60 });
let statsContainerEl, fpsEl, iterCountEl;

export function setupStats(_iterationsPerFrame) {
  iterationsPerFrame = _iterationsPerFrame;

  statsContainerEl = document.createElement('div');
  statsContainerEl.setAttribute('id', 'stats-container');
  document.body.appendChild(statsContainerEl);

  setupIterationsCounter();
  setupFPSCounter();
}

  function setupIterationsCounter() {
    iterCountEl = document.createElement('div');
    iterCountEl.setAttribute('id', 'iteration-counter');
    iterCountEl.innerHTML = 'test';
    statsContainerEl.appendChild(iterCountEl);
  }

  function setupFPSCounter() {
    fpsEl = document.createElement('div');
    fpsEl.setAttribute('id', 'fps-counter');
    statsContainerEl.appendChild(fpsEl);

    ticker.on('data', (framerate) => {
      fpsEl.innerHTML = String(Math.round(framerate)) + ' fps';
    });
  }

export function updateStats(isPaused) {
  ticker.tick();

  if(!isPaused) {
    numIterations += iterationsPerFrame;
    iterCountEl.innerHTML = 'iterations: ' + numIterations.toLocaleString() + ' <span aria-hidden="true">•</span>&nbsp;';
  }
}