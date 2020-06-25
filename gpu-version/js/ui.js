import * as THREE from 'three';
import Tweakpane from 'tweakpane';

import parameterValues from './parameterValues';
import parameterMetadata from './parameterMetadata';

import { simulationUniforms, displayUniforms } from './uniforms';

import { drawFirstFrame } from './firstFrame';

let currentSeedType = 0;

export function setupUI() {
  global.pane = new Tweakpane({ title: 'Parameters' });

  setupReactionDiffusionParameters();
  setupSeedFolder();
  setupRenderingFolder();
  setupActions();
}


//==============================================================
//  REACTION-DIFFUSION PARAMETERS
//==============================================================
function setupReactionDiffusionParameters() {
  pane.addInput(parameterValues, 'presets', {
    label: 'Presets',
    options: {
      none: ''
    }
  });

  pane.addInput(parameterValues, 'f', {
    label: 'f',
    min: parameterMetadata.f.min,
    max: parameterMetadata.f.max,
    step: .0001
  }).on('change', (value) => {
    simulationUniforms.f.value = value;
  });

  pane.addInput(parameterValues, 'k', {
    label: 'k',
    min: parameterMetadata.k.min,
    max: parameterMetadata.k.max,
    step: .0001
  }).on('change', (value) => {
    simulationUniforms.k.value = value;
  });

  pane.addInput(parameterValues, 'dA', {
    label: 'dA',
    min: parameterMetadata.dA.min,
    max: parameterMetadata.dA.max,
    step: .0001
  }).on('change', (value) => {
    simulationUniforms.dA.value = value;
  });

  pane.addInput(parameterValues, 'dB', {
    label: 'dB',
    min: parameterMetadata.dB.min,
    max: parameterMetadata.dB.max,
    step: .0001
  }).on('change', (value) => {
    simulationUniforms.dB.value = value;
  });

  pane.addInput(parameterValues, 'timestep', {
    label: 'Timestep',
    min: parameterMetadata.timestep.min,
    max: parameterMetadata.timestep.max
  }).on('change', (value) => {
    simulationUniforms.timestep.value = value;
  });
}


//==============================================================
//  SEED
//==============================================================
function setupSeedFolder() {
  const seedFolder = pane.addFolder({ title: 'Seed pattern' });

  seedFolder.addInput(parameterValues.seed, 'type', {
    label: 'Type',
    options: {
      Circle: 0,
      Square: 1,
      Image: 2,
    }
  }).on('change', (value) => {
    currentSeedType = parseInt(value);
    pane.dispose();
    setupUI();
  });

  seedFolder.addButton({
    title: 'Restart with this pattern'
  }).on('click', () => {
    drawFirstFrame(currentSeedType);
  });
}


//==============================================================
//  RENDERING
//==============================================================
function setupRenderingFolder() {
  const renderingFolder = pane.addFolder({ title: 'Rendering' });

  renderingFolder.addInput(parameterValues, 'renderingStyle', {
    label: 'Style',
    options: {
      'Gradient': 0,
      'Red Blob Games (original)': 1,
      'Red Blob Games (alt 1)': 2,
      'Red Blob Games (alt 2)': 3,
      'Rainbow': 4,
      'Black and white': 5,
      'Raw': 6
    }
  }).on('change', (value) => {
    displayUniforms.renderingStyle.value = value;
    pane.dispose();
    setupUI();
  });

  renderingFolder.addSeparator();

  addRenderingStyleOptions(renderingFolder);
}

  function addRenderingStyleOptions(folder) {
    switch(parseInt(displayUniforms.renderingStyle.value)) {
      case 0:
        addGradientOptions(folder);
        break;

      case 1:
        break;

      case 2:
        break;

      case 3:
        break;

      case 4:
        break;

      case 5:
        break;

      case 6:
        break;

      default:
        console.log('test');
    }
  }

    function addGradientOptions(folder) {
      // Color 1 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color1RGB', { label: 'Color 1' })
      .on('change', (value) => {
        displayUniforms.colorStop1.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop1.value.w);
      });

      folder.addInput(parameterValues.gradientColors, 'color1Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
      .on('change', (value) => { displayUniforms.colorStop1.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color1Enabled', { label: 'Enabled' })
      .on('change', (checked) => {
        if(checked) {
          displayUniforms.colorStop1.value = parameterValues.lastColorStop1;
        } else {
          parameterValues.lastColorStop1 = displayUniforms.colorStop1.value;
          displayUniforms.colorStop1.value = new THREE.Vector4(-1, -1, -1, -1);
        }
      });

      folder.addSeparator();

      // Color 2 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color2RGB', { label: 'Color 2' })
      .on('change', (value) => {
        displayUniforms.colorStop2.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop2.value.w);
      });

      folder.addInput(parameterValues.gradientColors, 'color2Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
      .on('change', (value) => { displayUniforms.colorStop2.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color2Enabled', { label: 'Enabled' })
      .on('change', (checked) => {
        if(checked) {
          displayUniforms.colorStop2.value = parameterValues.lastColorStop2;
        } else {
          parameterValues.lastColorStop2 = displayUniforms.colorStop2.value;
          displayUniforms.colorStop2.value = new THREE.Vector4(-1, -1, -1, -1);
        }
      });

      folder.addSeparator();

      // Color 3 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color3RGB', { label: 'Color 3' })
      .on('change', (value) => {
        displayUniforms.colorStop3.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop3.value.w);
      });

      folder.addInput(parameterValues.gradientColors, 'color3Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
      .on('change', (value) => { displayUniforms.colorStop3.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color3Enabled', { label: 'Enabled' })
      .on('change', (checked) => {
        if(checked) {
          displayUniforms.colorStop3.value = parameterValues.lastColorStop3;
        } else {
          parameterValues.lastColorStop3 = displayUniforms.colorStop3.value;
          displayUniforms.colorStop3 = undefined;
        }
      });

      folder.addSeparator();

      // Color 4 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color4RGB', { label: 'Color 4' })
      .on('change', (value) => {
        displayUniforms.colorStop4.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop4.value.w);
      });

      folder.addInput(parameterValues.gradientColors, 'color4Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
      .on('change', (value) => { displayUniforms.colorStop4.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color4Enabled', { label: 'Enabled' })
      .on('change', (checked) => {
        if(checked) {
          displayUniforms.colorStop4.value = parameterValues.lastColorStop4;
        } else {
          parameterValues.lastColorStop4 = displayUniforms.colorStop4.value;
          displayUniforms.colorStop4.value = new THREE.Vector4(-1, -1, -1, -1);
        }
      });

      folder.addSeparator();

      // Color 5 --------------------------------------------
      folder.addInput(parameterValues.gradientColors, 'color5RGB', { label: 'Color 5' })
      .on('change', (value) => {
        displayUniforms.colorStop5.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop5.value.w);
      });

      folder.addInput(parameterValues.gradientColors, 'color5Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
      .on('change', (value) => { displayUniforms.colorStop5.value.w = value; });

      folder.addInput(parameterValues.gradientColors, 'color5Enabled', { label: 'Enabled' })
      .on('change', (checked) => {
        if(checked) {
          displayUniforms.colorStop5.value = parameterValues.lastColorStop5;
        } else {
          parameterValues.lastColorStop5 = displayUniforms.colorStop5.value;
          displayUniforms.colorStop5.value = new THREE.Vector4(-1, -1, -1, -1);
        }
      });
    }


//==============================================================
//  ACTIONS
//==============================================================
function setupActions() {
  const actionsFolder = pane.addFolder({ title: 'Actions' });

  actionsFolder.addSeparator();

  actionsFolder.addButton({
    title: 'Pause/play'
  }).on('click', () => {
    isPaused = !isPaused;
  });

  actionsFolder.addButton({
    title: 'Save as image'
  }).on('click', () => {
    let link = document.createElement('a');
    link.download = 'reaction-diffusion.png';
    link.href = renderer.domElement.toDataURL();
    link.click();
  });

  actionsFolder.addSeparator();
}