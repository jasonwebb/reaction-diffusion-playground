//==============================================================
//  RENDER TARGETS
//  - Render targets are invisible buffers that we can send
//    data to in the form of textures.
//  - In render(), the simulation shaders store computation
//    results as textures and pass these results between two
//    render targets to run multiple iterations per frame.
//==============================================================

import * as THREE from 'three';
import { containerSize } from './globals';

export function setupRenderTargets() {
  global.renderTargets = [];

  // Create two render targets so we can "ping pong" between them and run multiple iterations per frame
  for(let i=0; i<2; i++) {
    let nextRenderTarget = new THREE.WebGLRenderTarget(containerSize.width, containerSize.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });

    renderTargets.push(nextRenderTarget);
  }
}