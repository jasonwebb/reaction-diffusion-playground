import { simulationUniforms } from "./uniforms";
import { rebuildUI } from './ui';
import parameterValues from "./parameterValues";
import parameterMetadata from "./parameterMetadata";

let mapDialog = document.querySelector('#map-dialog');
let closeButton = mapDialog.querySelector('.close-button');
let mapImageContainer = document.querySelector('.image-container');
let mapImage = mapDialog.querySelector('img');
let horizontalLine, verticalLine;
let horizontalLabel, verticalLabel;
let horizontalLabelValue, verticalLabelValue;

export function setupMap() {
  // Create crosshair lines
  horizontalLine = document.createElement('div');
  horizontalLine.classList.add('horizontal-line', 'crosshair-line', 'is-hidden');
  horizontalLine.style.width = mapImage.scrollWidth + 'px';

  verticalLine = document.createElement('div');
  verticalLine.classList.add('vertical-line', 'crosshair-line', 'is-hidden');
  verticalLine.style.height = mapImage.scrollHeight + 'px';

  // Create crosshair labels
  horizontalLabel = document.createElement('div');
  horizontalLabel.classList.add('horizontal-line-label', 'crosshair-label');
  horizontalLabel.innerHTML = '<em>f</em> = <span></span>';
  horizontalLabelValue = horizontalLabel.querySelector('span');

  verticalLabel = document.createElement('div');
  verticalLabel.classList.add('vertical-line-label', 'crosshair-label');
  verticalLabel.innerHTML = '<em>k</em> = <span></span>';
  verticalLabelValue = verticalLabel.querySelector('span');

  // Add labels to line elements
  horizontalLine.appendChild(horizontalLabel);
  verticalLine.appendChild(verticalLabel);

  // Add lines (with labels) to DOM
  mapImageContainer.appendChild(horizontalLine);
  mapImageContainer.appendChild(verticalLine);

  mapImage.addEventListener('mousemove', (e) => {
    horizontalLine.style.top = e.offsetY + 'px';
    verticalLine.style.left = e.offsetX + 'px';

    const y = e.offsetX / mapImage.scrollWidth,
          x = Math.abs(mapImage.scrollHeight - e.offsetY) / mapImage.scrollHeight;

    const f = y.map(0, 1, parameterMetadata.f.min, parameterMetadata.f.max),
          k = x.map(0, 1, parameterMetadata.k.min, parameterMetadata.k.max);

    horizontalLabelValue.innerHTML = f.toString().substring(0,5);
    verticalLabelValue.innerHTML = k.toString().substring(0,5);
  });

  mapImage.addEventListener('mouseover', (e) => {
    horizontalLine.classList.remove('is-hidden');
    verticalLine.classList.remove('is-hidden');
  });

  mapImage.addEventListener('mouseout', (e) => {
    horizontalLine.classList.add('is-hidden');
    verticalLine.classList.add('is-hidden');
  });

  mapImage.addEventListener('click', (e) => {
    const x = e.offsetX / mapImage.scrollWidth,
          y = Math.abs(mapImage.scrollHeight - e.offsetY) / mapImage.scrollHeight;

    const newF = y.map(0, 1, parameterMetadata.f.min, parameterMetadata.f.max),
          newK = x.map(0, 1, parameterMetadata.k.min, parameterMetadata.k.max);

    parameterValues.f = newF;
    parameterValues.k = newK;
    rebuildUI();

    simulationUniforms.f.value = newF;
    simulationUniforms.k.value = newK;

    // Best guesses of limits of map based on links
    // f: { min: .002, max: .11 }
    // k: { min: .019, max: .073 }

    collapseMap();
  });

  mapDialog.addEventListener('click', (e) => {
    collapseMap();
  });

  closeButton.addEventListener('click', (e) => {
    collapseMap();
  });

  collapseMap();
}

export function expandMap() {
  document.body.classList.add('modal-open');
  mapDialog.classList.remove('is-hidden');
}

export function collapseMap() {
  document.body.classList.remove('modal-open');
  mapDialog.classList.add('is-hidden');
}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}