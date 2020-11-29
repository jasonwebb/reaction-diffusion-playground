//==============================================================
//  UNIFORMS
//  - Uniforms are custom variables that get passed to the
//    shaders. They get set on the CPU, then used on the GPU.
//  - Many of these uniforms get modified by the UI.
//  - See https://threejs.org/docs/index.html#api/en/core/Uniform
//==============================================================

import * as THREE from 'three';
import parameterValues from './parameterValues';

export let simulationUniforms = {
  previousIterationTexture: {
    type: "t",
    value: undefined
  },
  resolution: {
    type: "v2",
    value: new THREE.Vector2(parameterValues.canvas.width, parameterValues.canvas.height)
  },
  mousePosition: {
    type: "v2",
    value: new THREE.Vector2(-1,-1)
  },
  brushRadius: {
    type: "f",
    value: 10.0
  },
  styleMapTexture: {
    type: "t",
    value: undefined
  },
  styleMapResolution: {
    type: "vec2",
    value: new THREE.Vector2(-1,-1)
  },
  styleMapTransforms: {
    type: "v4",
    value: new THREE.Vector4(1.0, 0.0, 0.0, 0.0)  // {scale, rotation, xOffset, yOffset}
  },
  styleMapParameters: {
    type: "v4",
    value: new THREE.Vector4(parameterValues.f, parameterValues.k, parameterValues.dA, parameterValues.dB)
  },
  bias: {
    type: 'vec2',
    value: new THREE.Vector2(parameterValues.bias.x, parameterValues.bias.y)
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
  },

  // HSL mapping
  hslFrom: {
    type: 'vec2',
    value: new THREE.Vector2(
      parameterValues.hsl.from.min,
      parameterValues.hsl.from.max
    )
  },
  hslTo: {
    type: 'vec2',
    value: new THREE.Vector2(
      parameterValues.hsl.to.min,
      parameterValues.hsl.to.max
    )
  },
  hslSaturation: {
    type: 'f',
    value: parameterValues.hsl.saturation
  },
  hslLuminosity: {
    type: 'f',
    value: parameterValues.hsl.luminosity
  }
};

export let passthroughUniforms = {
  textureToDisplay: {
    value: null
  }
};