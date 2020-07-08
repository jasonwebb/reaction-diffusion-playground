//==============================================================
//  MOUSE CONTROLS
//==============================================================

import { simulationUniforms } from './uniforms';

export function setupMouse() {
  let mouseDown = false;

  window.addEventListener('mousedown', function(e) {
    mouseDown = true;
  });

  window.addEventListener('mouseup', function(e) {
    mouseDown = false;
  });

  window.addEventListener('mousemove', function(e) {
    if(mouseDown) {
      simulationUniforms.mousePosition.value.x = e.clientX / window.innerWidth;
      simulationUniforms.mousePosition.value.y = 1 - e.clientY / window.innerHeight;
    } else {
      simulationUniforms.mousePosition.value.x = -1;
      simulationUniforms.mousePosition.value.y = -1;
    }
  });
}