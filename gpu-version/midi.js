//==============================================================
//  MIDI CONTROL
//==============================================================

import WebMIDI from 'webmidi';
import parameterMetadata from './parameterMetadata';

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
            setupInitialTexture(InitialTextureTypes.CIRCLE);
            break;

          case 41:
            setupInitialTexture(InitialTextureTypes.SQUARE);
            break;

          case 42:
            setupInitialTexture(InitialTextureTypes.TEXT);
            break;

          case 43:
            setupInitialTexture(InitialTextureTypes.IMAGE);
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
            break;

          case 2:
            simulationUniforms.k.value = e.value.map(0, 127, parameterMetadata.k.min, parameterMetadata.k.max);
            break;

          case 3:
            simulationUniforms.dA.value = e.value.map(0, 127, parameterMetadata.dA.min, parameterMetadata.dA.max);
            break;

          case 4:
            simulationUniforms.dB.value = e.value.map(0, 127, parameterMetadata.dB.min, parameterMetadata.dB.max);
            break;

          // Bottom row = 5-8 ----------------------------------------------------------------------------------------
        }
      });
    }
  });
}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}