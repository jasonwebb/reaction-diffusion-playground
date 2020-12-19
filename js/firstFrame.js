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
  CIRCLE: 0,
  SQUARE: 1,
  TEXT: 2,
  IMAGE: 3,
  EMPTY: 4
};

export function drawFirstFrame(type = InitialTextureTypes.CIRCLE) {
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
    case InitialTextureTypes.CIRCLE:
      bufferCanvasCtx.beginPath();
      bufferCanvasCtx.arc(centerX, centerY, parameterValues.seed.circle.radius, 0, Math.PI*2);
      bufferCanvasCtx.fillStyle = '#000';
      bufferCanvasCtx.fill();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialTextureTypes.SQUARE:
      bufferCanvasCtx.fillStyle = '#000';

      bufferCanvasCtx.translate(parameterValues.canvas.width/2, parameterValues.canvas.height/2);
      bufferCanvasCtx.rotate(parameterValues.seed.square.rotation * Math.PI / 180);
      bufferCanvasCtx.translate(-parameterValues.canvas.width/2, -parameterValues.canvas.height/2);

      bufferCanvasCtx.fillRect(
        centerX - parameterValues.seed.square.width/2,
        centerY - parameterValues.seed.square.height/2,
        parameterValues.seed.square.width,
        parameterValues.seed.square.height
      );

      bufferCanvasCtx.resetTransform();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialTextureTypes.TEXT:
      bufferCanvasCtx.fillStyle = '#000';
      bufferCanvasCtx.font = '900 ' + parameterValues.seed.text.size + 'px Arial';
      bufferCanvasCtx.textAlign = 'center';

      bufferCanvasCtx.translate(parameterValues.canvas.width/2, parameterValues.canvas.height/2);
      bufferCanvasCtx.rotate(parameterValues.seed.text.rotation * Math.PI / 180);
      bufferCanvasCtx.translate(-parameterValues.canvas.width/2, -parameterValues.canvas.height/2);

      bufferCanvasCtx.fillText(
        parameterValues.seed.text.value,
        centerX, centerY
      );

      bufferCanvasCtx.resetTransform();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialTextureTypes.IMAGE:
      getImagePixels('./images/seeds/test.png', centerX, centerY)
        .then((initialData) => {
          renderInitialDataToRenderTargets(initialData);
        })
        .catch(error => console.error(error));
      break;

    case InitialTextureTypes.EMPTY:
      bufferCanvasCtx.clearRect(0, 0, parameterValues.canvas.width, parameterValues.canvas.height);
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
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
        bufferCanvasCtx.translate(parameterValues.canvas.width/2 * parameterValues.seed.image.scale, parameterValues.canvas.height/2 * parameterValues.seed.image.scale);
        bufferCanvasCtx.rotate(parameterValues.seed.image.rotation * Math.PI / 180);
        bufferCanvasCtx.translate(-parameterValues.canvas.width/2 * parameterValues.seed.image.scale, -parameterValues.canvas.height/2 * parameterValues.seed.image.scale);

        bufferCanvasCtx.drawImage(
          bufferImage,
          centerX - bufferImage.width/2,
          centerY - bufferImage.height/2,
          bufferImage.width * parameterValues.seed.image.scale,
          bufferImage.height * parameterValues.seed.image.scale
        );

        bufferCanvasCtx.resetTransform();
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