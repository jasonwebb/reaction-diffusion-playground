//==============================================================
//  MIDI CONTROL
//==============================================================

import WebMIDI from 'webmidi';
import globals from './globals';
import parameterMetadata from './parameterMetadata';
import { InitialTextureTypes, drawFirstFrame } from './firstFrame';
import { simulationUniforms, displayUniforms } from './uniforms';
import { refreshUI } from './ui';
import parameterValues from './parameterValues';

export function setupMIDI() {
  WebMIDI.enable((error) => {
    if(error) {
      console.error(error);
      return;
    }

    // Akai LPD8 Wireless ---------------------------------------------------
    let lpd8 = WebMIDI.getInputByName('Akai LPD8 Wireless');

    if(lpd8) {
      setupLPD8(lpd8);
    }

    // Novation Launch Control XL ----------------------------------------------------
    let launchControlXL = WebMIDI.getInputByName('Launch Control XL');

    if(launchControlXL) {
      setupLaunchControlXL(launchControlXL);
    }
  });
}


/**
  Akai LPD8 Wireless
  ==================
*/
function setupLPD8(lpd8) {
  lpd8.addListener('noteon', 'all', (e) => {
    // Pads ===============================================
    switch(e.note.number) {
      // Top row = 40-43 -------------------
      case 40:
        drawFirstFrame(InitialTextureTypes.CIRCLE);
        break;

      case 41:
        drawFirstFrame(InitialTextureTypes.SQUARE);
        break;

      case 42:
        drawFirstFrame(InitialTextureTypes.TEXT);
        break;

      case 43:
        drawFirstFrame(InitialTextureTypes.IMAGE);
        break;

      // Bottom row = 36-39 ----------------
      case 36:
        globals.isPaused = !globals.isPaused;
        break;
    }
  });

  // Knobs ================================================
  lpd8.addListener('controlchange', 'all', (e) => {
    switch(e.controller.number) {
      // Top row = 1-4 -------------------------------------------------------------------------------------------
      case 1:
        simulationUniforms.f.value = e.value.map(0, 127, parameterMetadata.f.min, parameterMetadata.f.max);
        parameterValues.f = simulationUniforms.f.value;
        break;

      case 2:
        simulationUniforms.k.value = e.value.map(0, 127, parameterMetadata.k.min, parameterMetadata.k.max);
        parameterValues.k = simulationUniforms.k.value;
        break;

      case 3:
        simulationUniforms.styleMapParameters.value.x = e.value.map(0, 127, parameterMetadata.f.min, parameterMetadata.f.max);
        parameterValues.styleMap.f = simulationUniforms.styleMapParameters.value.x;

        // simulationUniforms.dA.value = e.value.map(0, 127, parameterMetadata.dA.min, parameterMetadata.dA.max);
        // parameterValues.dA = simulationUniforms.dA.value;
        break;

      case 4:
        simulationUniforms.styleMapParameters.value.y = e.value.map(0, 127, parameterMetadata.k.min, parameterMetadata.k.max);
        parameterValues.styleMap.k = simulationUniforms.styleMapParameters.value.y;

        // simulationUniforms.dB.value = e.value.map(0, 127, parameterMetadata.dB.min, parameterMetadata.dB.max);
        // parameterValues.dB = simulationUniforms.dB.value;
        break;

      // Bottom row = 5-8 ----------------------------------------------------------------------------------------
      case 5:
        displayUniforms.hslFrom.value.x = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.from.min = displayUniforms.hslFrom.value.x;
        break;

      case 6:
        displayUniforms.hslFrom.value.y = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.from.max = displayUniforms.hslFrom.value.y;
        break;

      case 7:
        displayUniforms.hslTo.value.x = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.to.min = displayUniforms.hslTo.value.x;
        break;

      case 8:
        displayUniforms.hslTo.value.y = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.to.max = displayUniforms.hslTo.value.y;
        break;
    }

    refreshUI();
  });
}


/**
  Novation Launch Control XL
  ==========================
*/
function setupLaunchControlXL(launchControlXL) {
  // PADS =====================================================================
  launchControlXL.addListener('noteon', 'all', (e) => {
    switch(e.note.number) {
      // Top row (41-44, 57-60)
      case 41:
        drawFirstFrame(InitialTextureTypes.CIRCLE);
        break;

      case 42:
        drawFirstFrame(InitialTextureTypes.SQUARE);
        break;

      case 43:
        drawFirstFrame(InitialTextureTypes.TEXT);
        break;

      case 44:
        drawFirstFrame(InitialTextureTypes.IMAGE);
        break;

      // Bottom row (73-76, 89-92)
      case 73:
        globals.isPaused = !globals.isPaused;
        break;
    }
  });

  launchControlXL.addListener('controlchange', 'all', (e) => {
    switch(e.controller.number) {
      // KNOBS ================================================================
      // Top row (13-20) - equation parameters ----------------------------------------
      case 13:  // f
        simulationUniforms.f.value = e.value.map(0, 127, parameterMetadata.f.min, parameterMetadata.f.max);
        parameterValues.f = simulationUniforms.f.value;
        break;

      case 14:  // k
        simulationUniforms.k.value = e.value.map(0, 127, parameterMetadata.k.min, parameterMetadata.k.max);
        parameterValues.k = simulationUniforms.k.value;
        break;

      case 15:  // dA
        simulationUniforms.dA.value = e.value.map(0, 127, parameterMetadata.dA.min, parameterMetadata.dA.max);
        parameterValues.dA = simulationUniforms.dA.value;
        break;

      case 16:  // dB
        simulationUniforms.dB.value = e.value.map(0, 127, parameterMetadata.dB.min, parameterMetadata.dB.max);
        parameterValues.dB = simulationUniforms.dB.value;
        break;


      // Middle row (29-36) - style map parameters ------------------------------------
      case 29:  // f
        simulationUniforms.styleMapParameters.value.x = e.value.map(0, 127, parameterMetadata.f.min, parameterMetadata.f.max);
        parameterValues.styleMap.f = simulationUniforms.styleMapParameters.value.x;
        break;

      case 30:  // k
        simulationUniforms.styleMapParameters.value.y = e.value.map(0, 127, parameterMetadata.k.min, parameterMetadata.k.max);
        parameterValues.styleMap.k = simulationUniforms.styleMapParameters.value.y;
        break;

      case 31:  // dA
        simulationUniforms.styleMapParameters.value.z = e.value.map(0, 127, parameterMetadata.dA.min, parameterMetadata.dA.max);
        parameterValues.styleMap.dA = simulationUniforms.styleMapParameters.value.z;
        break;

      case 32:  // dB
        simulationUniforms.styleMapParameters.value.w = e.value.map(0, 127, parameterMetadata.dB.min, parameterMetadata.dB.max);
        parameterValues.styleMap.dB = simulationUniforms.styleMapParameters.value.w;
        break;

      case 33:  // scale
        simulationUniforms.styleMapTransforms.value.x = e.value.map(0, 127, .1, 3.0);
        parameterValues.styleMap.scale = simulationUniforms.styleMapTransforms.value.x;
        break;

      case 34:  // rotation
        simulationUniforms.styleMapTransforms.value.y = e.value.map(0, 127, -180, 180);
        parameterValues.styleMap.rotation = simulationUniforms.styleMapTransforms.value.y;
        break;

      case 35:  // offset (X)
        simulationUniforms.styleMapTransforms.value.z = e.value.map(0, 127, -parameterValues.canvas.width/2, parameterValues.canvas.width/2);
        parameterValues.styleMap.translate.x = simulationUniforms.styleMapTransforms.value.z;
        break;

      case 36:  // offset (Y)
        simulationUniforms.styleMapTransforms.value.w = e.value.map(0, 127, -parameterValues.canvas.height/2, parameterValues.canvas.height/2);
        parameterValues.styleMap.translate.y = simulationUniforms.styleMapTransforms.value.w;
        break;


      // Bottom row (49-56) - color mapping -------------------------------------------
      case 49:  // chemical range (low)
        displayUniforms.hslFrom.value.x = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.from.min = displayUniforms.hslFrom.value.x;
        break;

      case 50:  // chemical range (high)
        displayUniforms.hslFrom.value.y = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.from.max = displayUniforms.hslFrom.value.y;
        break;

      case 51:  // h range (low)
        displayUniforms.hslTo.value.x = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.to.min = displayUniforms.hslTo.value.x;
        break;

      case 52:  // h range (high)
        displayUniforms.hslTo.value.y = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.to.max = displayUniforms.hslTo.value.y;
        break;

      case 53:  // saturation
        displayUniforms.hslSaturation.value = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.saturation = displayUniforms.hslSaturation.value
        break;

      case 54:  // luminosity
        displayUniforms.hslLuminosity.value = e.value.map(0, 127, 0.0, 1.0);
        parameterValues.hsl.luminosity = displayUniforms.hslLuminosity.value
        break;
    }

    refreshUI();
  });
}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}