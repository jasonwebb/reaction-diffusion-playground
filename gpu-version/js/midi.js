//==============================================================
//  MIDI CONTROL
//==============================================================

import WebMIDI from 'webmidi';
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

    let lpd8 = WebMIDI.getInputByName('Akai LPD8 Wireless');

    if(lpd8) {
      lpd8.addListener('noteon', 'all', (e) => {
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
            isPaused = !isPaused;
            break;
        }
      });

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
            simulationUniforms.dA.value = e.value.map(0, 127, parameterMetadata.dA.min, parameterMetadata.dA.max);
            parameterValues.dA = simulationUniforms.dA.value;
            break;

          case 4:
            simulationUniforms.dB.value = e.value.map(0, 127, parameterMetadata.dB.min, parameterMetadata.dB.max);
            parameterValues.dB = simulationUniforms.dB.value;
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
  });
}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}