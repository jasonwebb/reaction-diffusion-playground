//==============================================================
//  KEYBOARD CONTROLS
//==============================================================

export function setupKeyboard() {
  window.addEventListener('keyup', function(e) {
    if(e.key == ' ') {
      e.preventDefault();
      isPaused = !isPaused;
    }
  });
}