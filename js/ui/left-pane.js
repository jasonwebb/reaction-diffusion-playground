//==============================================================
//  EFFECTS PANE
//  - Tweakpane controls for visual effects like style map,
//    flow, and more.
//==============================================================

import * as THREE from 'three';
import Tweakpane from 'tweakpane';

import parameterValues from '../parameterValues';
import { simulationUniforms } from '../uniforms';
import parameterMetadata from '../parameterMetadata';

let pane, paneContainer,
    styleMapChooser, styleMapPreviewImageContainer, styleMapPreviewImage;

export function setupLeftPane() {
  if(styleMapChooser === undefined || styleMapChooser === null) {
    styleMapChooser = document.getElementById('style-map-chooser');

    styleMapChooser.addEventListener('change', (e) => {
      if(e.target.files.length === 0) {
        return;
      }

      let reader = new FileReader();
      reader.onload = function() {
        // Create the DOM elements needed for the floating thumbnail, if they aren't already set up
        if(styleMapPreviewImageContainer === undefined) {
          styleMapPreviewImageContainer = document.createElement('div');
          styleMapPreviewImageContainer.setAttribute('id', 'style-map-preview-image-container');

          styleMapPreviewImage = document.createElement('img');
          styleMapPreviewImageContainer.appendChild(styleMapPreviewImage);

          document.body.appendChild(styleMapPreviewImageContainer);

        // If the container has been set up previously, that means the user has probably loaded a new image, so we just need to make sure the container is visible.
        } else {
          styleMapPreviewImageContainer.style.display = 'block';
        }

        // Load the image and pass it to the simulation shader as a texture uniform
        const loader = new THREE.TextureLoader();
        simulationUniforms.styleMapTexture.value = loader.load(reader.result);

        // Also pass the width and height of the image into the shader as uniforms
        const img = new Image();
        img.onload = function() {
          simulationUniforms.styleMapResolution.value = new THREE.Vector2(
            parseFloat(img.width),
            parseFloat(img.height)
          );
        };
        img.src = reader.result;

        // Visually display the image as a thumbnail next to the UI
        styleMapPreviewImage.setAttribute('src', reader.result);

        parameterValues.styleMap.imageLoaded = true;
        rebuildLeftPane();
      };

      reader.readAsDataURL(e.target.files[0]);
    });
  }

  if(paneContainer === undefined) {
    paneContainer = document.createElement('div');
    paneContainer.setAttribute('id', 'left-pane-container');
    document.body.appendChild(paneContainer);
  }

  pane = new Tweakpane({
    title: 'Effects',
    container: paneContainer
  });

  setupStyleMapFolder();
  setupBiasFolder();

  // TODO: setupFlowFolder();
  // TODO: setupScaleFolder();
}

  export function rebuildLeftPane() {
    pane.dispose();
    setupLeftPane();
  }

  export function refreshLeftPane() {
    pane.refresh();
  }

  export function hideLeftPane() {
    pane.containerElem_.style.display = 'none';
  }

  export function showLeftPane() {
    pane.containerElem_.style.display = 'block';
  }


//===========================================================
//  STYLE MAP
//===========================================================
function setupStyleMapFolder() {
  const styleMapFolder = pane.addFolder({ title: 'Style map' });

  // If an image has been loaded ...
  if(parameterValues.styleMap.imageLoaded) {
    // Scale range slider
    styleMapFolder.addInput(parameterValues.styleMap, 'scale', {
      label: 'Scale',
      min: .1,
      max: 3.0,
      step: .01
    })
      .on('change', () => {
        simulationUniforms.styleMapTransforms.value.x = parameterValues.styleMap.scale;

        styleMapPreviewImage.style.transform = 'scale(' + parameterValues.styleMap.scale + ') ' +
                                               'rotate(' + parameterValues.styleMap.rotation + 'deg) ';
      });

    // Rotation range slider
    styleMapFolder.addInput(parameterValues.styleMap, 'rotation', {
      label: 'Rotation',
      min: -180.0,
      max: 180.0,
      step: .001
    })
      .on('change', () => {
        simulationUniforms.styleMapTransforms.value.y = parameterValues.styleMap.rotation * 3.14159265359/180;

        styleMapPreviewImage.style.transform = 'scale(' + parameterValues.styleMap.scale + ') ' +
                                               'rotate(' + parameterValues.styleMap.rotation + 'deg) ';
      });

    // X/Y offset 2D slider
    styleMapFolder.addInput(parameterValues.styleMap, 'translate', {
      label: 'Offset',
      x: {
        min: -parameterValues.canvas.width/2,
        max: parameterValues.canvas.width/2,
        step: .01
      },
      y: {
        min: -parameterValues.canvas.height/2,
        max: parameterValues.canvas.height/2,
        step: .01
      }
    })
      .on('change', (value) => {
        // X component
        simulationUniforms.styleMapTransforms.value.z = value.x;
        styleMapPreviewImage.style.marginLeft = value.x + 'px';

        // Y component
        simulationUniforms.styleMapTransforms.value.w = value.y;
        styleMapPreviewImage.style.marginTop = value.y + 'px';
      });

      styleMapFolder.addSeparator();

    // f/k/dA/dB PARAMETERS ----------------------------------------------------------------------
    styleMapFolder.addInput(parameterValues.styleMap, 'f', {
      label: 'Feed (#2)',
      min: parameterMetadata.f.min,
      max: parameterMetadata.f.max,
      initial: parameterValues.f.value,
      step: .0001
    })
      .on('change', (value) => {
        simulationUniforms.styleMapParameters.value.x = value;
      });

    styleMapFolder.addInput(parameterValues.styleMap, 'k', {
      label: 'Kill (#2)',
      min: parameterMetadata.k.min,
      max: parameterMetadata.k.max,
      initial: parameterValues.k.value,
      step: .0001
    })
      .on('change', (value) => {
        simulationUniforms.styleMapParameters.value.y = value;
      });

    styleMapFolder.addInput(parameterValues.styleMap, 'dA', {
      label: 'dA (#2)',
      min: parameterMetadata.dA.min,
      max: parameterMetadata.dA.max,
      initial: parameterValues.dA.value,
      step: .0001
    })
      .on('change', (value) => {
        simulationUniforms.styleMapParameters.value.z = value;
      });

    styleMapFolder.addInput(parameterValues.styleMap, 'dB', {
      label: 'dB (#2)',
      min: parameterMetadata.dB.min,
      max: parameterMetadata.dB.max,
      initial: parameterValues.dB.value,
      step: .0001
    })
      .on('change', (value) => {
        simulationUniforms.styleMapParameters.value.w = value;
      });

      styleMapFolder.addSeparator();

    /*
    // ANIMATION ----------------------------------------------------------------------
    // Animate checkbox
    styleMapFolder.addInput(parameterValues.styleMap.animation, 'enabled', { label: 'Animate' })
      .on('change', () => {
        rebuildLeftPane();
      });

    // If animation has been enabled ...
    if(parameterValues.styleMap.animation.enabled) {
      // Parameter dropdown
      styleMapFolder.addInput(parameterValues.styleMap.animation, 'parameter', {
        label: 'Parameter',
        options: {
          'Scale': 0,
          'Rotation': 1,
          'X offset': 2,
          'Y offset': 3,
        }
      });

      // Easing equation dropdown
      styleMapFolder.addInput(parameterValues.styleMap.animation, 'easingEquation', {
        label: 'Easing',
        options: {
          'Linear': 0
        }
      });

      // Speed range slider
      styleMapFolder.addInput(parameterValues.styleMap.animation, 'speed', {
        label: 'Speed',
        min: 0.1,
        max: 5.0,
        step: .1
      });
    }

      styleMapFolder.addSeparator();
    */
  }

  // Unload style map button (only when a style map has been loaded)
  if(parameterValues.styleMap.imageLoaded) {
    styleMapFolder.addButton({
      title: 'Unload style map image'
    })
      .on('click', () => {
        styleMapPreviewImageContainer.style.display = 'none';
        simulationUniforms.styleMapTexture.value = undefined;
        simulationUniforms.styleMapResolution.value = new THREE.Vector2(-1,-1);
        parameterValues.styleMap.imageLoaded = false;

        styleMapChooser.value = null;
        rebuildLeftPane();
      });
  }

  // Load style map image button
  styleMapFolder.addButton({
    title: 'Load style map image'
  })
    .on('click', () => {
      styleMapChooser.click();
    });
}


//===========================================================
//  Bias (orientation)
//===========================================================
function setupBiasFolder() {
  const biasFolder = pane.addFolder({ title: 'Bias' });

  // X/Y bias direction 2D pad
  biasFolder.addInput(parameterValues, 'bias', {
    label: 'Direction',
    x: {
      min: -parameterMetadata.bias.x.max,
      max: parameterMetadata.bias.x.max,
      step: .001
    },
    y: {
      min: -parameterMetadata.bias.y.max,
      max: parameterMetadata.bias.y.max,
      step: .001
    }
  })
    .on('change', (value) => {
      simulationUniforms.bias.value.x = value.x;
      simulationUniforms.bias.value.y = value.y;
    });
}