import { resetTextureSizes } from '../entry';
import { containerSize } from './globals';
import { drawFirstFrame } from './firstFrame';

export function setupCanvasResize() {
  let mousePressed = false;
  let edgeDistanceThreshold = 20;
  let isNearLeftEdge = false, isNearRightEdge = false, isNearTopEdge = false, isNearBottomEdge = false;

  document.addEventListener('mousedown', (e) => {
    mousePressed = true;

    let style = window.getComputedStyle(canvas);

    isNearLeftEdge = Math.abs(e.clientX - (window.innerWidth/2 - parseInt(style.width)/2)) < edgeDistanceThreshold ? true : false;
    isNearRightEdge = Math.abs(e.clientX - (window.innerWidth/2 + parseInt(style.width)/2)) < edgeDistanceThreshold ? true : false;
    isNearTopEdge = Math.abs(e.clientY - (window.innerHeight/2 - parseInt(style.height)/2)) < edgeDistanceThreshold ? true : false;
    isNearBottomEdge = Math.abs(e.clientY - (window.innerHeight/2 + parseInt(style.height)/2)) < edgeDistanceThreshold ? true : false;
  });

  document.addEventListener('mouseup', (e) => {
    mousePressed = false;
  });

  document.addEventListener('mousemove', (e) => {
    if(mousePressed) {
      if(isNearLeftEdge || isNearRightEdge) {
        if(parseInt(canvas.style.width) < window.innerWidth) {
          canvas.style.width = (Math.abs(e.clientX - window.innerWidth/2) * 2) + 'px';
          containerSize.width = canvas.style.width;
          resetTextureSizes();
          drawFirstFrame();
        }
      }

      if(isNearTopEdge || isNearBottomEdge) {
        if(parseInt(canvas.style.height) < window.innerHeight) {
          canvas.style.height = (Math.abs(e.clientY - window.innerHeight/2) * 2) + 'px';
        }
      }
    }
  });
}