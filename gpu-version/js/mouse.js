//==============================================================
//  MOUSE CONTROLS
//==============================================================

import { containerSize } from "./globals";
import { simulationUniforms } from './uniforms';

export function setupMouse() {
  let mouseDown = false;

  canvas.addEventListener('mousedown', function(e) {
    mouseDown = true;
  });

  canvas.addEventListener('mouseup', function(e) {
    mouseDown = false;
  });

  canvas.addEventListener('mousemove', function(e) {
    if(mouseDown) {
      simulationUniforms.mousePosition.value.x = e.offsetX / containerSize.width;
      simulationUniforms.mousePosition.value.y = 1 - e.offsetY / containerSize.height;
    } else {
      simulationUniforms.mousePosition.value.x = -1;
      simulationUniforms.mousePosition.value.y = -1;
    }
  });
}