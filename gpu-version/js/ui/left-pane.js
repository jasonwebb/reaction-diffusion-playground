//==============================================================
//  EFFECTS PANE
//  - Tweakpane controls for visual effects like style map,
//    flow, and more.
//==============================================================

import * as THREE from 'three';
import Tweakpane from 'tweakpane';

import parameterValues from '../parameterValues';
import { simulationUniforms, displayUniforms } from '../uniforms';

let pane, paneContainer,
    styleMapChooser, styleMapPreviewImageContainer, styleMapPreviewImage;

export function setupLeftPane() {
  if(styleMapChooser === undefined) {
    styleMapChooser = document.getElementById('style-map-chooser');

    styleMapChooser.addEventListener('change', (e) => {
      if(e.target.files.length === 0) {
        return;
      }

      let reader = new FileReader();
      reader.onload = function() {
        // Create the DOM elements needd for the floating thumbnail, if they aren't already set up
        if(styleMapPreviewImageContainer === undefined) {
          styleMapPreviewImageContainer = document.createElement('div');
          styleMapPreviewImageContainer.setAttribute('id', 'style-map-preview-image-container');

          styleMapPreviewImage = document.createElement('img');
          styleMapPreviewImageContainer.appendChild(styleMapPreviewImage);

          document.body.appendChild(styleMapPreviewImageContainer);
        }

        // Load the image and pass it to the simulation shader as a texture uniform
        const loader = new THREE.TextureLoader();
        simulationUniforms.styleMapTexture.value = loader.load(reader.result);

        // Visually display the image as a thumbnail next to the UI
        styleMapPreviewImage.setAttribute('src', reader.result);
        styleMapPreviewImageContainer.style.height = styleMapPreviewImage.style.offsetHeight + 'px';

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

  // TODO: setupFlowFolder();
  // TODO: setupDirectionBiasFolder();
  // TODO: setupScaleFolder();
}

  export function rebuildLeftPane() {
    pane.dispose();
    setupLeftPane();
  }

function setupStyleMapFolder() {
  const styleMapFolder = pane.addFolder({ title: 'Style map' });

  // If an image has been loaded ...
  if(parameterValues.styleMap.imageLoaded) {
    // Scale range slider
    styleMapFolder.addInput(parameterValues.styleMap, 'scale', {
      label: 'Scale',
      min: 1.0,
      max: 5.0,
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
        console.log(simulationUniforms.styleMapTransforms);

        styleMapPreviewImage.style.transform = 'scale(' + parameterValues.styleMap.scale + ') ' +
                                               'rotate(' + parameterValues.styleMap.rotation + 'deg) ';
      });

    // X offset range slider
    styleMapFolder.addInput(parameterValues.styleMap.translate, 'x', {
      label: 'X offset',
      min: -parameterValues.canvas.width/2,
      max: parameterValues.canvas.width/2,
      step: .01
    })
      .on('change', () => {
        simulationUniforms.styleMapTransforms.value.z = parameterValues.styleMap.translate.x;
        styleMapPreviewImage.style.marginLeft = parameterValues.styleMap.translate.x + 'px';
      });

    // Y offset range slider
    styleMapFolder.addInput(parameterValues.styleMap.translate, 'y', {
      label: 'Y offset',
      min: -parameterValues.canvas.height/2,
      max: parameterValues.canvas.height/2,
      step: .01
    })
      .on('change', () => {
        simulationUniforms.styleMapTransforms.value.w = parameterValues.styleMap.translate.y;
        styleMapPreviewImage.style.marginTop = parameterValues.styleMap.translate.y + 'px';
      });

      styleMapFolder.addSeparator();

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
        label: 'Easing style',
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
  }

  // Load style map image button
  styleMapFolder.addButton({
    title: 'Load style map image'
  })
    .on('click', () => {
      styleMapChooser.click();
    });
}