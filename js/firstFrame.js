//==============================================================
//  INITIAL TEXTURE
//  - To start (or reset) the simulation, we need to "seed"
//    the very first frame with some pattern of data.
//==============================================================

import * as THREE from 'three';

import parameterValues from './parameterValues';
import { displayUniforms, passthroughUniforms } from './uniforms';
import { displayMaterial, passthroughMaterial } from './materials';

let bufferImage, bufferCanvasCtx;

export const InitialTextureTypes = {
  SINGLE_POINT: 0,
  RANDOM_POINTS: 1,
  CIRCLE: 2,
  SQUARE: 3,
  TEXT: 4,
  IMAGE: 5,
};

export function drawFirstFrame(type = InitialTextureTypes.IMAGE) {
  // Grab the invisible canvas context that we can draw initial image data into
  global.bufferCanvas = document.querySelector('#buffer-canvas');
  bufferCanvasCtx = bufferCanvas.getContext('2d');

  // Grab the invisible <img> tag that we can use to draw images from the file system, then copy into the buffer canvas
  bufferImage = document.querySelector('#buffer-image');

  // Clear the invisible canvas
  bufferCanvasCtx.fillStyle = '#fff';
  bufferCanvasCtx.fillRect(0, 0, parameterValues.canvas.width, parameterValues.canvas.height);

  // Build initial simulation texture data and pass it on to the render targets
  const centerX = parameterValues.canvas.width/2,
        centerY = parameterValues.canvas.height/2;

  switch(type) {
    case InitialTextureTypes.SINGLE_POINT:
      bufferCanvasCtx.fillStyle = '#000';
      bufferCanvasCtx.fillRect(Math.round(centerX), Math.round(centerY), 1, 1);
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialTextureTypes.RANDOM_POINTS:
      bufferCanvasCtx.fillStyle = '#000';

      for(let i=0; i<randomInt(1,10); i++) {
        bufferCanvasCtx.fillRect(
          randomInt(0, parameterValues.canvas.width),
          randomInt(0, parameterValues.canvas.height),
          1,1
        );
      }

      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

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
      getImagePixels('./images/seeds/test.png', centerX, centerY)
        .then((initialData) => {
          renderInitialDataToRenderTargets(initialData);
        })
        .catch(error => console.error(error));
      break;
  }
}

  function renderInitialDataToRenderTargets(initialData) {
    // Put the initial data into a texture format that ThreeJS can pass into the render targets
    let texture = new THREE.DataTexture(initialData, parameterValues.canvas.width, parameterValues.canvas.height, THREE.RGBAFormat, THREE.FloatType);
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
    let pixels = bufferCanvasCtx.getImageData(0, 0, parameterValues.canvas.width, parameterValues.canvas.height).data;
    let data = new Float32Array(pixels.length);

    for(let i=0; i<data.length; i+=4) {
      data[i] = 1.0;
      data[i+1] = pixels[i+1] == 0 ? 0.5 : 0.0;
      data[i+2] = 0.0;
      data[i+3] = 0.0;
    }

    return data;
  }

  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }