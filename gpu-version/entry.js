import * as THREE from '../node_modules/three/build/three.module.js';
import Stats from '../node_modules/stats.js/src/Stats.js'
import WebMIDI from '../node_modules/webmidi';
import simulationFragShader from './glsl/simulationFrag.glsl';
import simulationVertShader from './glsl/simulationVert.glsl';
import displayFragShader from './glsl/displayFrag.glsl';
import displayVertShader from './glsl/displayVert.glsl';
import passthroughVertShader from './glsl/passthroughVert.glsl';
import passthroughFragShader from './glsl/passthroughFrag.glsl';

const InitialTextureTypes = {
  CIRCLE: 0,
  SQUARE: 1,
  TEXT: 2,
  IMAGE: 3,
};

const containerSize = {
  // width: window.innerWidth,
  // height: window.innerHeight

  width: 1024,
  height: 1024
};

const parameterLimits = {
  f: {
    min: 0.01,
    max: 0.1,

    range: 0.1,
    initial: 0.054
  },
  k: {
    min: 0.05,
    max: 0.1,

    range: 0.1,
    initial: 0.062
  },
  dA: {
    min: 0.2,
    max: 0.25,

    range: 0.1,
    initial: 0.2097
  },
  dB: {
    min: 0.5,
    max: 0.8,

    range: 0.1,
    initial: 0.105
  }
};

let container;                                                 // the DOM element that ThreeJS loads into
let bufferCanvas, bufferCanvasCtx, bufferImage;                // invisible canvas and <img> element used to draw initial texture data
let camera, scene, renderer, displayMesh;                      // ThreeJS basics needed to show stuff on the screen
let simulationUniforms, displayUniforms, passthroughUniforms;  // uniforms are constants that get passed into shaders
let simulationMaterial, displayMaterial, passthroughMaterial;  // materials associate uniforms to vert/frag shaders
let renderTargets, currentRenderTargetIndex = 0;               // render targets are invisible meshes that allow shaders to generate textures for computation, not display
const pingPongSteps = 128;                                     // number of times per frame that the simulation is run before being displayed
let isPaused = false;

// FPS counter via Stats.js
let stats = new Stats();
document.body.appendChild(stats.dom);

let clock = new THREE.Clock();

setupEnvironment();
setupUniforms();
setupMaterials();
setupRenderTargets();
setupInitialTexture();
render();

//==============================================================
//  RENDER
//==============================================================
function render() {
  if(!isPaused) {
    stats.begin();

    // Activate the simulation shaders
    displayMesh.material = simulationMaterial;

    // Run the simulation multiple times by feeding the result of one iteration (a render target's texture) into the next render target
    for(let i=0; i<pingPongSteps; i++) {
      var nextRenderTargetIndex = currentRenderTargetIndex === 0 ? 1 : 0;

      simulationUniforms.previousIterationTexture.value = renderTargets[currentRenderTargetIndex].texture;  // grab the result of the last iteration
      renderer.setRenderTarget(renderTargets[nextRenderTargetIndex]);                                       // prepare to render into the next render target
      renderer.render(scene, camera);                                                                       // run the simulation shader on that texture
      simulationUniforms.previousIterationTexture.value = renderTargets[nextRenderTargetIndex].texture;     // save the result of this simulation step for use in the next step
      displayUniforms.textureToDisplay.value = renderTargets[nextRenderTargetIndex].texture;                // pass this result to the display material too
      displayUniforms.previousIterationTexture.value = renderTargets[currentRenderTargetIndex].texture;     // pass the previous iteration result too for history-based rendering effects

      currentRenderTargetIndex = nextRenderTargetIndex;
    }

    // Activate the display shaders
    displayUniforms.time.value = clock.getElapsedTime();
    displayMesh.material = displayMaterial;

    // Render the latest iteration to the screen
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    stats.end();

    requestAnimationFrame(render);   // kick off the next iteration
  }
}

//==============================================================
//  UNIFORMS
//==============================================================
function setupUniforms() {
  setupSimulationUniforms();
  setupDisplayUniforms();
  setupPassthroughUniforms();
}

  function setupSimulationUniforms() {
    simulationUniforms = {
      previousIterationTexture: {
        type: "t",
        value: undefined
      },
      resolution: {
        type: "v2",
        value: new THREE.Vector2(containerSize.width, containerSize.height)
      },

      // Reaction-diffusion equation parameters
      f: {   // feed rate
        type: "f",
        value: parameterLimits.f.initial
      },
      k: {   // kill rate
        type: "f",
        value: parameterLimits.k.initial
      },
      dA: {  // diffusion rate for chemical A
        type: "f",
        value: parameterLimits.dA.initial
      },
      dB: {  // diffusion rate for chemical B
        type: "f",
        value: parameterLimits.dB.initial
      },
      timestep: {
        type: "f",
        value: 1.0
      }
    };
  }

  function setupDisplayUniforms() {
    displayUniforms = {
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

      // Gradient color stops - RGB channels represent real color values, but A channel is for B threshold
      // via https://github.com/pmneila/jsexp
      colorStop1: {
        type: "v4",
        value: new THREE.Vector4(0.0, 0.0, 0.0, 0.0)
      },
      // colorStop2: {
      //   type: "v4",
      //   value: new THREE.Vector4(0.0, 0.5, .01, 0.5)
      // },
      // colorStop3: {
      //   type: "v4",
      //   value: new THREE.Vector4(0.0, 1.0, 1.0, 0.55)
      // },
      // colorStop4: {
      //   type: "v4",
      //   value: new THREE.Vector4(0.3, 0.0, 0.6, 0.7)
      // },
      colorStop5: {
        type: "v4",
        value: new THREE.Vector4(1.0, 1.0, 1.0, 0.3)
      }
    };
  }

  function setupPassthroughUniforms() {
    passthroughUniforms = {
      textureToDisplay: {
        value: null
      }
    };
  }

//==============================================================
//  MATERIALS
//==============================================================
function setupMaterials() {
  /**
    Create the simulation material
    - This material takes a texture full of data (assumed to be
      the previous iteration result), then applies the reaction-
      diffusion equation to each pixel.
  */
  simulationMaterial = new THREE.ShaderMaterial({
    uniforms: simulationUniforms,
    vertexShader: simulationVertShader,
    fragmentShader: simulationFragShader,
  });
  simulationMaterial.blending = THREE.NoBlending;

  /**
    Create the display material
    - This material reads the data encoded in the texture
      generated by the simulation material's fragment shader
      and converts it into meaningful color data to show on
      the screen.
  */
  displayMaterial = new THREE.ShaderMaterial({
    uniforms: displayUniforms,
    vertexShader: displayVertShader,
    fragmentShader: displayFragShader,
  });
  displayMaterial.blending = THREE.NoBlending;

  /**
    Create the passthrough material
    - This material just displays a texture without any
      modifications or processing. Used when creating
      the initial texture.
  */
  passthroughMaterial = new THREE.ShaderMaterial({
    uniforms: passthroughUniforms,
    vertexShader: passthroughVertShader,
    fragmentShader: passthroughFragShader,
  });
  passthroughMaterial.blending = THREE.NoBlending;
}

//==============================================================
//  RENDER TARGETS
//==============================================================
function setupRenderTargets() {
  renderTargets = [];

  // Create two render targets so we can "ping pong" between them and run multiple iterations per frame
  for(let i=0; i<2; i++) {
    let nextRenderTarget = new THREE.WebGLRenderTarget(containerSize.width, containerSize.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    });

    // Enable texture wrapping
    // - Referencing a texture coordinate that is out-of-bounds will automatically make it wrap!
    nextRenderTarget.texture.name = `render texture ${i}`;

    renderTargets.push(nextRenderTarget);
  }
}

//==============================================================
//  ENVIRONMENT (scene, camera, display mesh, etc)
//==============================================================
function setupEnvironment() {
  // Set up the camera and scene
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene = new THREE.Scene();

  // Create a plane and orient it perpendicular to the camera so it seems 2D
  displayMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), displayMaterial);
  scene.add(displayMesh);

  // Set up the renderer (a WebGL context inside a <canvas>)
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(containerSize.width, containerSize.height);

  // Uncomment this line to see how many shader varyings your GPU supports.
  // console.log(renderer.capabilities.maxVaryings);

  // Grab the container DOM element and inject the <canvas> element generated by the renderer
  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  // Grab the invisible canvas context that we can draw initial image data into
  bufferCanvas = document.querySelector('#buffer-canvas');
  bufferCanvasCtx = bufferCanvas.getContext('2d');

  bufferImage = document.querySelector('#buffer-image');

  // Update the renderer dimensions whenever the browser is resized
  window.addEventListener('resize', resetTextureSizes, false);
  resetTextureSizes();
}

  function resetTextureSizes() {
    // Resize the ThreeJS (WebGL) canvas
    renderer.setSize(containerSize.width, containerSize.height);

    // Resize render targets
    setupRenderTargets();

    // Resize the buffer canvas
    bufferCanvas.width = containerSize.width;
    bufferCanvas.height = containerSize.height;
  }

//==============================================================
//  INITIAL TEXTURE
//==============================================================
function setupInitialTexture(type = InitialTextureTypes.IMAGE) {
  // Clear the invisible canvas
  bufferCanvasCtx.fillStyle = '#fff';
  bufferCanvasCtx.fillRect(0, 0, containerSize.width, containerSize.height);

  // Build initial simulation texture data and pass it on to the render targets
  const centerX = containerSize.width/2,
        centerY = containerSize.height/2;

  switch(type) {
    case InitialTextureTypes.CIRCLE:
      bufferCanvasCtx.beginPath();
      bufferCanvasCtx.arc(centerX, centerY, 100, 0, Math.PI*2);
      bufferCanvasCtx.fillStyle = '#000';
      bufferCanvasCtx.fill();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialTextureTypes.SQUARE:
      bufferCanvasCtx.fillStyle = '#000';
      bufferCanvasCtx.fillRect(centerX - 50, centerY - 50, 100, 100);
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialTextureTypes.TEXT:
      bufferCanvasCtx.fillStyle = '#000';
      bufferCanvasCtx.font = '900 120px Arial';
      bufferCanvasCtx.textAlign = 'center';
      bufferCanvasCtx.fillText('REACTION', centerX - 18, centerY - 50);
      bufferCanvasCtx.fillText('DIFFUSION', centerX, centerY + 50);
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialTextureTypes.IMAGE:
      getImagePixels('./seed-images/test.png', centerX, centerY)
        .then((initialData) => {
          renderInitialDataToRenderTargets(initialData);
        })
        .catch(error => console.error(error));

      break;
  }
}

  function renderInitialDataToRenderTargets(initialData) {
    // Put the initial data into a texture format that ThreeJS can pass into the render targets
    let texture = new THREE.DataTexture(initialData, containerSize.width, containerSize.height, THREE.RGBAFormat, THREE.FloatType);
    texture.flipY = true;  // DataTexture coordinates are vertically inverted compared to canvas coordinates
    texture.needsUpdate = true;

    // Pass the DataTexture to the passthrough material
    passthroughUniforms.textureToDisplay.value = texture;

    // Activate the passthrough material
    displayMesh.material = passthroughMaterial;

    // Render the DataTexture into both of the render targets
    for(let i=0; i<2; i++) {
      renderer.setRenderTarget(renderTargets[i]);
      renderer.render(scene, camera);
    }

    // Switch back to the display material and pass along the initial rendered texture
    displayUniforms.textureToDisplay.value = renderTargets[0].texture;
    displayUniforms.previousIterationTexture.value = renderTargets[0].texture;
    displayMesh.material = displayMaterial;

    // Set the render target back to the default display buffer and render the first frame
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  function getImagePixels(path, centerX, centerY) {
    // Create an asynchronous Promise that can be used to wait for the image to load
    return new Promise((resolve, reject) => {
      bufferImage.src = path;

      bufferImage.addEventListener('load', () => {
        bufferCanvasCtx.drawImage(bufferImage, centerX - bufferImage.width/2, centerY - bufferImage.height/2);
        resolve(convertPixelsToTextureData());
      });
    });
  }

  // Create initial data based on the current content of the invisible canvas
  function convertPixelsToTextureData() {
    let pixels = bufferCanvasCtx.getImageData(0, 0, containerSize.width, containerSize.height).data;
    let data = new Float32Array(pixels.length);

    for(let i=0; i<data.length; i+=4) {
      data[i] = 1.0;
      data[i+1] = pixels[i+1] == 0 ? 0.5 : 0.0;
      data[i+2] = 0.0;
      data[i+3] = 0.0;
    }

    return data;
  }

//==============================================================
//  KEYBOARD CONTROLS
//==============================================================
window.addEventListener('keyup', function(e) {
  if(e.key == ' ') {
    e.preventDefault();
    isPaused = !isPaused;

    if(!isPaused) {
      render();
    }
  }
});

//==============================================================
//  MIDI CONTROL
//==============================================================
WebMIDI.enable((error) => {
  let lpd8 = WebMIDI.getInputByName('Akai LPD8 Wireless');

  if(lpd8) {
    lpd8.addListener('noteon', 'all', (e) => {
      switch(e.note.number) {
        // Top row = 40-43 -------------------
        case 40:
          setupInitialTexture(InitialTextureTypes.CIRCLE);
          break;

        case 41:
          setupInitialTexture(InitialTextureTypes.SQUARE);
          break;

        case 42:
          setupInitialTexture(InitialTextureTypes.TEXT);
          break;

        // Bottom row = 36-39 ----------------
        case 36:
          isPaused = !isPaused;

          if(!isPaused) {
            render();
          }
          break;
      }
    });

    lpd8.addListener('controlchange', 'all', (e) => {
      switch(e.controller.number) {
        // Top row = 1-4 -------------------------------------------------------------------------------------------
        case 1:
          simulationUniforms.f.value = e.value.map(0, 127, parameterLimits.f.initial - parameterLimits.f.range/2, parameterLimits.f.initial + parameterLimits.f.range/2);
          break;

        case 2:
          simulationUniforms.k.value = e.value.map(0, 127, parameterLimits.k.initial - parameterLimits.k.range/2, parameterLimits.k.initial + parameterLimits.k.range/2);
          break;

        case 3:
          simulationUniforms.dA.value = e.value.map(0, 127, parameterLimits.dA.initial - parameterLimits.dA.range/2, parameterLimits.dA.initial + parameterLimits.dA.range/2);
          break;

        case 4:
          simulationUniforms.dB.value = e.value.map(0, 127, parameterLimits.dB.initial - parameterLimits.dB.range/2, parameterLimits.dB.initial + parameterLimits.dB.range/2);
          break;

        // Bottom row = 5-8 ----------------------------------------------------------------------------------------
      }
    });
  }
});

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}