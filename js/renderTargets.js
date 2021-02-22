//==============================================================
//  RENDER TARGETS
//  - Render targets are specialized, invisible buffers that
//    we can send data to in the form of textures.
//  - In the main update() method (in entry.js), the simulation
//    shaders store computation results as textures and pass
//    these results between two render targets to run multiple
//    iterations per frame.
//  - See https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget
//==============================================================

import * as THREE from 'three';

import parameterValues from './parameterValues';

export function setupRenderTargets() {
  global.renderTargets = [];

  // Create two globally-available render targets so we can "ping pong" between them (pass the result of one as input to the other, as many times as needed) and run multiple iterations per frame
  for(let i=0; i<2; i++) {
    let nextRenderTarget = new THREE.WebGLRenderTarget(parameterValues.canvas.width, parameterValues.canvas.height, {
      minFilter: parameterValues.useSmoothing ? THREE.LinearFilter : THREE.NearestFilter,
      magFilter: parameterValues.useSmoothing ? THREE.LinearFilter : THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });

    renderTargets.push(nextRenderTarget);
  }
}