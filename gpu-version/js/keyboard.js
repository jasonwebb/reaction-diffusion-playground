//==============================================================
//  KEYBOARD CONTROLS
//==============================================================

import { drawFirstFrame } from './firstFrame';
import { exportImage } from './export';

export function setupKeyboard() {
  window.addEventListener('keyup', function(e) {
    switch(e.key) {
      case ' ':
        e.preventDefault();
        isPaused = !isPaused;
        break;

      case 'r':
        drawFirstFrame(2);
        break;

      case 's':
        exportImage();
        break;
    }
  });
}