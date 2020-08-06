//==================================================================
//  PARAMETERS PANE
//  - Tweakpane with core reaction-diffusion equation parameters,
//    seed patterns, rendering styles, canvas sizing, and more.
//==================================================================

import * as THREE from 'three';
import Tweakpane from 'tweakpane';

import parameterValues from '../parameterValues';
import parameterMetadata from '../parameterMetadata';
import parameterPresets from '../parameterPresets';

import { simulationUniforms, displayUniforms } from '../uniforms';

import { InitialTextureTypes, drawFirstFrame } from '../firstFrame';
import { resetTextureSizes } from '../../entry';
import { setupRenderTargets } from '../renderTargets';
import { expandMap } from '../map';
import { exportImage } from '../export';

let pane;
let currentSeedType = InitialTextureTypes.CIRCLE;

export function setupRightPane() {
  pane = new Tweakpane({ title: 'Parameters' });

  setupReactionDiffusionParameters();
  setupSeedFolder();
  setupRenderingFolder();
  setupCanvasSize();
  setupActions();
}

  export function rebuildRightPane() {
    pane.dispose();
    setupRightPane();
  }

  export function hideRightPane() {
    pane.containerElem_.style.display = 'none';
  }

  export function showRightPane() {
    pane.containerElem_.style.display = 'block';
  }


//==============================================================
//  REACTION-DIFFUSION PARAMETERS
//==============================================================
function setupReactionDiffusionParameters() {
  let parameterPresetsSimpleList = {};
  Object.values(parameterPresets).forEach((preset, i) => {
    parameterPresetsSimpleList[preset.name] = i
  });

  // Presets dropdown
  pane.addInput(parameterValues, 'presets', {
    label: 'Presets',
    options: parameterPresetsSimpleList
  })
    .on('change', (index) => {
      parameterValues.f = parameterPresets[index].f;
      parameterValues.k = parameterPresets[index].k;

      simulationUniforms.f.value = parameterPresets[index].f;
      simulationUniforms.k.value = parameterPresets[index].k;

      rebuildRightPane();
    });

  // f
  pane.addInput(parameterValues, 'f', {
    label: 'Feed rate',
    min: parameterMetadata.f.min,
    max: parameterMetadata.f.max,
    step: .0001
  })
    .on('change', (value) => {
      simulationUniforms.f.value = value;
    });

  // k
  pane.addInput(parameterValues, 'k', {
    label: 'Kill rate',
    min: parameterMetadata.k.min,
    max: parameterMetadata.k.max,
    step: .0001
  })
    .on('change', (value) => {
      simulationUniforms.k.value = value;
    });

  // dA
  pane.addInput(parameterValues, 'dA', {
    label: 'dA',
    min: parameterMetadata.dA.min,
    max: parameterMetadata.dA.max,
    step: .0001
  }
    ).on('change', (value) => {
      simulationUniforms.dA.value = value;
    });

  // dB
  pane.addInput(parameterValues, 'dB', {
    label: 'dB',
    min: parameterMetadata.dB.min,
    max: parameterMetadata.dB.max,
    step: .0001
  })
    .on('change', (value) => {
      simulationUniforms.dB.value = value;
    });

  // Timestep
  pane.addInput(parameterValues, 'timestep', {
    label: 'Timestep',
    min: parameterMetadata.timestep.min,
    max: parameterMetadata.timestep.max
  })
    .on('change', (value) => {
      simulationUniforms.timestep.value = value;
    });

  // Parameter map dialog launcher button
  pane.addButton({
    title: 'Pick parameter values from map'
  })
    .on('click', () => {
      expandMap();
    });
}


//==============================================================
//  SEED
//==============================================================
function setupSeedFolder() {
  const seedFolder = pane.addFolder({ title: 'Seed pattern' });

  // Seed type dropdown
  seedFolder.addInput(parameterValues.seed, 'type', {
    label: 'Type',
    options: {
      SinglePoint: InitialTextureTypes.SINGLE_POINT,
      RandomPoints: InitialTextureTypes.RANDOM_POINTS,
      Circle: InitialTextureTypes.CIRCLE,
      Square: InitialTextureTypes.SQUARE,
      Text: InitialTextureTypes.TEXT,
      Image: InitialTextureTypes.IMAGE,
    }
  })
    .on('change', (value) => {
      currentSeedType = parseInt(value);
      rebuildRightPane();
    });

  // Restart button
  seedFolder.addButton({
    title: '⟳ Restart with this pattern'
  })
    .on('click', () => {
      drawFirstFrame(currentSeedType);
    });
}


//==============================================================
//  RENDERING
//==============================================================
function setupRenderingFolder() {
  const renderingFolder = pane.addFolder({ title: 'Rendering' });

  // Rendering style dropdown
  renderingFolder.addInput(parameterValues, 'renderingStyle', {
    label: 'Style',
    options: {
      'Gradient': 0,
      'Red Blob Games (original)': 1,
      'Red Blob Games (alt 1)': 2,
      'Red Blob Games (alt 2)': 3,
      'Rainbow': 4,
      'Black and white (soft)': 5,
      'Black and white (hard)': 6,
      'Raw': 7
    }
  })
    .on('change', (value) => {
      displayUniforms.renderingStyle.value = value;
      rebuildRightPane();
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
            displayUniforms.colorStop3.value = new THREE.Vector4(-1, -1, -1, -1);
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
//  CANVAS SIZE
//==============================================================
function setupCanvasSize() {
  const canvasSizeFolder = pane.addFolder({ title: 'Canvas size' });

  if(!parameterValues.canvas.isMaximized) {
    // Width range slider
    canvasSizeFolder.addInput(parameterValues.canvas, 'width', {
      label: 'Width',
      min: parameterMetadata.canvas.width.min,
      max: parameterMetadata.canvas.width.max,
      step: 1
    })
      .on('change', (value) => {
        parameterValues.canvas.width = parseInt(value);
        canvas.style.width = parameterValues.canvas.width + 'px';

        renderer.setSize(parameterValues.canvas.width, parameterValues.canvas.height, false);
        camera.aspect = parameterValues.canvas.width / parameterValues.canvas.height;
        camera.updateProjectionMatrix();
        setupRenderTargets();
        resetTextureSizes();
        drawFirstFrame(currentSeedType);
      });

    // Height range slider
    canvasSizeFolder.addInput(parameterValues.canvas, 'height', {
      label: 'Height',
      min: parameterMetadata.canvas.height.min,
      max: parameterMetadata.canvas.height.max,
      step: 1
    })
      .on('change', (value) => {
        parameterValues.canvas.height = parseInt(value);
        canvas.style.height = parameterValues.canvas.height + 'px';

        renderer.setSize(parameterValues.canvas.width, parameterValues.canvas.height, false);
        camera.aspect = parameterValues.canvas.width / parameterValues.canvas.height;
        camera.updateProjectionMatrix();
        setupRenderTargets();
        resetTextureSizes();
        drawFirstFrame(currentSeedType);
      });
  }

  // Maximized checkbox
  canvasSizeFolder.addInput(parameterValues.canvas, 'isMaximized', { label: 'Maximize' })
    .on('change', (checked) => {
      if(checked) {
        parameterValues.canvas._lastWidth = parameterValues.canvas.width;
        parameterValues.canvas._lastHeight = parameterValues.canvas.height;  // change to this for 1D glitch parameterValues._lastHeight = parameterValues.canvas.height;

        parameterValues.canvas.width = window.innerWidth;
        parameterValues.canvas.height = window.innerHeight;
      } else {
        parameterValues.canvas.width = parameterValues.canvas._lastWidth;
        parameterValues.canvas.height = parameterValues.canvas._lastHeight;
      }

      canvas.style.width = parameterValues.canvas.width + 'px';
      canvas.style.height = parameterValues.canvas.height + 'px';

      renderer.setSize(parameterValues.canvas.width, parameterValues.canvas.height, false);
      camera.aspect = parameterValues.canvas.width / parameterValues.canvas.height;
      camera.updateProjectionMatrix();
      setupRenderTargets();
      resetTextureSizes();
      drawFirstFrame(currentSeedType);

      rebuildRightPane();
    });
}


//==============================================================
//  ACTIONS
//==============================================================
function setupActions() {
  const actionsFolder = pane.addFolder({ title: 'Actions' });

  // Pause / play button
  actionsFolder.addButton({
    title: '⏸ Pause/play'
  })
    .on('click', () => {
      isPaused = !isPaused;
    });

  // Save as image button
  actionsFolder.addButton({
    title: '💾 Save as image'
  })
    .on('click', () => {
      exportImage();
    });
}