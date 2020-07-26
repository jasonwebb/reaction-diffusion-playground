//==============================================================
//  MOUSE CONTROLS
//==============================================================

import { simulationUniforms } from './uniforms';
import parameterValues from './parameterValues';

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
      simulationUniforms.mousePosition.value.x = e.offsetX / parameterValues.canvas.width;
      simulationUniforms.mousePosition.value.y = 1 - e.offsetY / parameterValues.canvas.height;
    } else {
      simulationUniforms.mousePosition.value.x = -1;
      simulationUniforms.mousePosition.value.y = -1;
    }
  });

  // Adjust brush radius using the mouse wheel
  window.addEventListener('wheel', function(e) {
    simulationUniforms.brushRadius.value += e.deltaY/100;
  });
}