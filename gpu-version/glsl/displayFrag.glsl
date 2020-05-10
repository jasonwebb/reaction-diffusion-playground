varying vec2 v_uv;
uniform sampler2D textureToDisplay;
uniform sampler2D previousIterationTexture;

uniform vec4 colorStop1;
uniform vec4 colorStop2;
uniform vec4 colorStop3;
uniform vec4 colorStop4;
uniform vec4 colorStop5;

void main() {
  vec4 previousPixel = texture2D(previousIterationTexture, v_uv);
  vec4 pixel = texture2D(textureToDisplay, v_uv);
  float A = pixel[0];
  float B = pixel[1];
  vec4 outputColor;

  // Gradient color stops by @pmneila =============================================================
  // - https://github.com/pmneila/jsexp
  vec3 color;

  if(B <= colorStop1.a) {
    color = colorStop1.rgb;
  } else if(B > colorStop1.a && B <= colorStop2.a) {
    color = mix(
      colorStop1.rgb,
      colorStop2.rgb,
      (B - colorStop1.a) / (colorStop2.a - colorStop1.a)
    );
  } else if(B > colorStop2.a && B <= colorStop3.a) {
    color = mix(
      colorStop2.rgb,
      colorStop3.rgb,
      (B - colorStop2.a) / (colorStop3.a - colorStop2.a)
    );
  } else if(B > colorStop3.a && B <= colorStop4.a) {
    color = mix(
      colorStop3.rgb,
      colorStop4.rgb,
      (B - colorStop3.a) / (colorStop4.a - colorStop3.a)
    );
  } else if(B > colorStop4.a && B <= colorStop5.a) {
    color = mix(
      colorStop4.rgb,
      colorStop5.rgb,
      (B - colorStop4.a) / (colorStop5.a - colorStop4.a)
    );
  } else if(B > colorStop5.a) {
    color = colorStop5.rgb;
  }

  outputColor = vec4(color.rgb, 1.0);

  // Purple and yellow by Amit Patel (Red Blob Games) =============================================
  // - https://www.redblobgames.com/x/1905-reaction-diffusion/
  // outputColor = vec4(
  //   1000.0 * abs(pixel.x - previousPixel.x) + 1.0 * pixel.x - 0.5 * previousPixel.y,
  //   0.9 * pixel.x - 2.0 * pixel.y,
  //   10000.0 * abs(pixel.y - previousPixel.y),
  //   1.0
  // );

  // Black and white ==============================================================================
  // float grayValue = pixel.r - pixel.g;  // black for B, white for A
  // float grayValue = 1.0 - pixel.r - pixel.g;  // white for B, black for A
  // outputColor = vec4(grayValue, grayValue, grayValue, 1.0);

  // No processing - red for chemical A, green for chemical B =====================================
  // outputColor = pixel;

  gl_FragColor = outputColor;
}