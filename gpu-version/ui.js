import * as THREE from 'three';
import Tweakpane from 'tweakpane';

import parameterValues from './parameterValues';
import parameterMetadata from './parameterMetadata';

import { simulationUniforms } from './uniforms';

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
  const seedFolder = pane.addFolder({ title: 'Seed' });

  seedFolder.addInput(parameterValues.seed, 'type', {
    label: 'Type',
    options: {
      Circle: 'Circle',
      Square: 'Square',
      Image: 'Image',
    }
  });

  seedFolder.addButton({
    title: 'Restart'
  }).on('click', () => {
    setupInitialTexture();
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
      'Gradient': 'Gradient',
      'Red Blob Games (original)': 'test',
      'Red Blob Games #1': 'test2',
      'Red Blob Games #2': 'test3',
      Raw: 'Raw'
    }
  });

  renderingFolder.addSeparator();

  // Color 1 --------------------------------------------
  renderingFolder.addInput(parameterValues.gradientColors, 'color1RGB', { label: 'Color 1' })
    .on('change', (value) => {
      displayUniforms.colorStop1.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop1.value.w);
    });

  renderingFolder.addInput(parameterValues.gradientColors, 'color1Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
    .on('change', (value) => { displayUniforms.colorStop1.value.w = value; });

  renderingFolder.addInput(parameterValues.gradientColors, 'color1Enabled', { label: 'Enabled' })
    .on('change', (checked) => {
      if(checked) {
        displayUniforms.colorStop1.value = parameterValues.lastColorStop1;
      } else {
        parameterValues.lastColorStop1 = displayUniforms.colorStop1.value;
        displayUniforms.colorStop1.value = new THREE.Vector4(-1, -1, -1, -1);
      }
    });

  renderingFolder.addSeparator();

  // Color 2 --------------------------------------------
  renderingFolder.addInput(parameterValues.gradientColors, 'color2RGB', { label: 'Color 2' })
    .on('change', (value) => {
      displayUniforms.colorStop2.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop2.value.w);
    });

  renderingFolder.addInput(parameterValues.gradientColors, 'color2Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
    .on('change', (value) => { displayUniforms.colorStop2.value.w = value; });

  renderingFolder.addInput(parameterValues.gradientColors, 'color2Enabled', { label: 'Enabled' })
    .on('change', (checked) => {
      if(checked) {
        displayUniforms.colorStop2.value = parameterValues.lastColorStop2;
      } else {
        parameterValues.lastColorStop2 = displayUniforms.colorStop2.value;
        displayUniforms.colorStop2.value = new THREE.Vector4(-1, -1, -1, -1);
      }
    });

  renderingFolder.addSeparator();

  // Color 3 --------------------------------------------
  renderingFolder.addInput(parameterValues.gradientColors, 'color3RGB', { label: 'Color 3' })
    .on('change', (value) => {
      displayUniforms.colorStop3.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop3.value.w);
    });

  renderingFolder.addInput(parameterValues.gradientColors, 'color3Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
    .on('change', (value) => { displayUniforms.colorStop3.value.w = value; });

  renderingFolder.addInput(parameterValues.gradientColors, 'color3Enabled', { label: 'Enabled' })
    .on('change', (checked) => {
      if(checked) {
        displayUniforms.colorStop3.value = parameterValues.lastColorStop3;
      } else {
        parameterValues.lastColorStop3 = displayUniforms.colorStop3.value;
        displayUniforms.colorStop3 = undefined;
      }
    });

  renderingFolder.addSeparator();

  // Color 4 --------------------------------------------
  renderingFolder.addInput(parameterValues.gradientColors, 'color4RGB', { label: 'Color 4' })
    .on('change', (value) => {
      displayUniforms.colorStop4.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop4.value.w);
    });

  renderingFolder.addInput(parameterValues.gradientColors, 'color4Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
    .on('change', (value) => { displayUniforms.colorStop4.value.w = value; });

  renderingFolder.addInput(parameterValues.gradientColors, 'color4Enabled', { label: 'Enabled' })
    .on('change', (checked) => {
      if(checked) {
        displayUniforms.colorStop4.value = parameterValues.lastColorStop4;
      } else {
        parameterValues.lastColorStop4 = displayUniforms.colorStop4.value;
        displayUniforms.colorStop4.value = new THREE.Vector4(-1, -1, -1, -1);
      }
    });

  renderingFolder.addSeparator();

  // Color 5 --------------------------------------------
  renderingFolder.addInput(parameterValues.gradientColors, 'color5RGB', { label: 'Color 5' })
    .on('change', (value) => {
      displayUniforms.colorStop5.value = new THREE.Vector4(value.r/255, value.g/255, value.b/255, displayUniforms.colorStop5.value.w);
    });

  renderingFolder.addInput(parameterValues.gradientColors, 'color5Stop', { label: 'Threshold', min: 0.0, max: 1.0 })
    .on('change', (value) => { displayUniforms.colorStop5.value.w = value; });

  renderingFolder.addInput(parameterValues.gradientColors, 'color5Enabled', { label: 'Enabled' })
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
}