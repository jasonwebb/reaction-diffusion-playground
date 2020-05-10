varying vec2 v_uv;
uniform sampler2D textureToDisplay;
uniform sampler2D previousIterationTexture;

void main() {
  vec2 uv = v_uv;
  vec4 pixel = texture2D(textureToDisplay, v_uv);
  vec4 previousPixel = texture2D(previousIterationTexture, v_uv);

  // Purple and yellow by Amit Patel (Red Blob Games): https://www.redblobgames.com/x/1905-reaction-diffusion/
  // gl_FragColor = vec4(
  //   1000.0 * abs(pixel.x - previousPixel.x) + 1.0 * pixel.x - 0.5 * previousPixel.y,
  //   0.9 * pixel.x - 2.0 * pixel.y,
  //   10000.0 * abs(pixel.y - previousPixel.y),
  //   1.0
  // );

  // Black and white ================================================================
  // float grayValue = pixel.r - pixel.g;  // black for B, white for A
  // float grayValue = 1.0 - pixel.r - pixel.g;  // white for B, black for A
  // gl_FragColor = vec4(grayValue, grayValue, grayValue, 1.0);

  // No processing - red for chemical A, green for chemical B =========================
  gl_FragColor = pixel;
}