//==============================================================
//  KEYBOARD CONTROLS
//==============================================================

import globals from './globals';
import { drawFirstFrame } from './firstFrame';
import { exportImage } from './export';
import { toggleUI } from './ui';
import { currentSeedType } from './ui/right-pane';
import { setupRenderTargets } from './renderTargets';

export function setupKeyboard() {
  window.addEventListener('keyup', function(e) {
    switch(e.key) {
      case ' ':
        e.preventDefault();
        globals.isPaused = !globals.isPaused;
        break;

      case 'r':
        setupRenderTargets();
        drawFirstFrame(currentSeedType);
        break;

      case 's':
        exportImage();
        break;

      case 'u':
        toggleUI();
        break;
    }
  });
}