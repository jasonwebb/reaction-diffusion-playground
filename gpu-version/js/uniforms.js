//==============================================================
//  UNIFORMS
//  - Uniforms are custom variables that get passed to the
//    shaders. They get set on the CPU, then used on the GPU.
//==============================================================

import * as THREE from 'three';
import parameterValues from './parameterValues';
import { containerSize } from './globals';

export let simulationUniforms = {
  previousIterationTexture: {
    type: "t",
    value: undefined
  },
  resolution: {
    type: "v2",
    value: new THREE.Vector2(containerSize.width, containerSize.height)
  },
  mousePosition: {
    type: "v2",
    value: new THREE.Vector2(-1,-1)
  },

  // Reaction-diffusion equation parameters
  f: {   // feed rate
    type: "f",
    value: parameterValues.f
  },
  k: {   // kill rate
    type: "f",
    value: parameterValues.k
  },
  dA: {  // diffusion rate for chemical A
    type: "f",
    value: parameterValues.dA
  },
  dB: {  // diffusion rate for chemical B
    type: "f",
    value: parameterValues.dB
  },
  timestep: {
    type: "f",
    value: parameterValues.timestep
  }
};

export let displayUniforms = {
  textureToDisplay: {
    value: null
  },
  previousIterationTexture: {
    value: null
  },
  time: {
    type: "f",
    value: 0
  },
  renderingStyle: {
    type: "i",
    value: 0
  },

  // Gradient color stops - RGB channels represent real color values, but A channel is for B threshold
  // via https://github.com/pmneila/jsexp
  colorStop1: {
    type: "v4",
    value: new THREE.Vector4(
      parameterValues.gradientColors.color1RGB.r/255,
      parameterValues.gradientColors.color1RGB.g/255,
      parameterValues.gradientColors.color1RGB.b/255,
      parameterValues.gradientColors.color1Stop
    )
  },
  colorStop2: {
    type: "v4",
    value: new THREE.Vector4(
      parameterValues.gradientColors.color2RGB.r/255,
      parameterValues.gradientColors.color2RGB.g/255,
      parameterValues.gradientColors.color2RGB.b/255,
      parameterValues.gradientColors.color2Stop
    )
  },
  colorStop3: {
    type: "v4",
    value: new THREE.Vector4(
      parameterValues.gradientColors.color3RGB.r/255,
      parameterValues.gradientColors.color3RGB.g/255,
      parameterValues.gradientColors.color3RGB.b/255,
      parameterValues.gradientColors.color3Stop
    )
  },
  colorStop4: {
    type: "v4",
    value: new THREE.Vector4(
      parameterValues.gradientColors.color4RGB.r/255,
      parameterValues.gradientColors.color4RGB.g/255,
      parameterValues.gradientColors.color4RGB.b/255,
      parameterValues.gradientColors.color4Stop
    )
  },
  colorStop5: {
    type: "v4",
    value: new THREE.Vector4(
      parameterValues.gradientColors.color5RGB.r/255,
      parameterValues.gradientColors.color5RGB.g/255,
      parameterValues.gradientColors.color5RGB.b/255,
      parameterValues.gradientColors.color5Stop
    )
  }
};

export let passthroughUniforms = {
  textureToDisplay: {
    value: null
  }
};