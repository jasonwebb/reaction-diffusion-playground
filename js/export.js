//==============================================================
//  EXPORT
//  - Functions to export images or other data from the
//    simulation.
//==============================================================

export function exportImage() {
  let link = document.createElement('a');
  link.download = 'reaction-diffusion.png';
  link.href = renderer.domElement.toDataURL();
  link.click();
  link.remove();
}