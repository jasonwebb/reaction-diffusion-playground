import * as THREE from 'three';

export default {
  isPaused: false,
  currentRenderTargetIndex: 0,
  pingPongSteps: 60,
  clock: new THREE.Clock()
}