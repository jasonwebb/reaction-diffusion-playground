varying vec2 v_uv;
uniform sampler2D textureToDisplay;
uniform sampler2D previousIterationTexture;
uniform float time;

uniform vec4 colorStop1;
uniform vec4 colorStop2;
uniform vec4 colorStop3;
uniform vec4 colorStop4;
uniform vec4 colorStop5;

// http://theorangeduck.com/page/avoiding-shader-conditionals
float when_eq(float x, float y)  { return 1.0 - abs(sign(x - y)); }
float when_neq(float x, float y) { return abs(sign(x - y)); }
float when_gt(float x, float y)  { return max(sign(x - y), 0.0); }
float when_lt(float x, float y)  { return max(sign(y - x), 0.0); }
float when_le(float x, float y)  { return 1.0 - max(sign(x - y), 0.0); }
float when_ge(float x, float y)  { return 1.0 - max(sign(y - x), 0.0); }

vec4 rainbow(vec2 uv) {
  float PI = 3.1415926535897932384626433832795;
  float center = 0.1; //0.5
  float width = 1.0; //0.5
  float frequency = 1.5;
  float r1 = sin(frequency*uv.x + 0.0) * width + center;
  float g1 = sin(frequency*uv.x + 2.0*PI/3.0) * width + center;
  float b1 = sin(frequency*uv.x + 4.0*PI/3.0) * width + center;

  // return vec4(r1, g1, b1, 1.0);

  float r2 = sin(frequency*uv.y + 0.0) * width + center;
  float g2 = sin(frequency*uv.y + 2.0*PI/3.0) * width + center;
  float b2 = sin(frequency*uv.y + 4.0*PI/3.0) * width + center;

  return vec4(vec3(r1, g1, b1) * vec3(r2, g2, b2), 1.0);
}

void main() {
  vec4 previousPixel = texture2D(previousIterationTexture, v_uv);
  vec4 pixel = texture2D(textureToDisplay, v_uv);
  float A = pixel[0];
  float B = pixel[1];
  vec4 outputColor;

  // Rainbow effect by Jonathon Cole ==============================================================
  // - https://github.com/colejd/Reaction-Diffusion-ThreeJS based on http://krazydad.com/tutorials/makecolors.php
  // float c = A - B;
  // outputColor = vec4(c, c, c, 1.0);
  // vec4 rainbow = rainbow(v_uv.xy + time*.5);
  // float gBranch = when_gt(B, 0.01);
  // outputColor = mix(outputColor, outputColor - rainbow, gBranch);

  // Gradient color stops by @pmneila =============================================================
  // - https://github.com/pmneila/jsexp
  // vec3 color;

  // if(B <= colorStop1.a) {
  //   color = colorStop1.rgb;
  // } else if(B > colorStop1.a && B <= colorStop2.a) {
  //   color = mix(
  //     colorStop1.rgb,
  //     colorStop2.rgb,
  //     (B - colorStop1.a) / (colorStop2.a - colorStop1.a)
  //   );
  // } else if(B > colorStop2.a && B <= colorStop3.a) {
  //   color = mix(
  //     colorStop2.rgb,
  //     colorStop3.rgb,
  //     (B - colorStop2.a) / (colorStop3.a - colorStop2.a)
  //   );
  // } else if(B > colorStop3.a && B <= colorStop4.a) {
  //   color = mix(
  //     colorStop3.rgb,
  //     colorStop4.rgb,
  //     (B - colorStop3.a) / (colorStop4.a - colorStop3.a)
  //   );
  // } else if(B > colorStop4.a && B <= colorStop5.a) {
  //   color = mix(
  //     colorStop4.rgb,
  //     colorStop5.rgb,
  //     (B - colorStop4.a) / (colorStop5.a - colorStop4.a)
  //   );
  // } else if(B > colorStop5.a) {
  //   color = colorStop5.rgb;
  // }

  // outputColor = vec4(color.rgb, 1.0);

  // Purple and yellow by Amit Patel (Red Blob Games) =============================================
  // - https://www.redblobgames.com/x/1905-reaction-diffusion/
  // outputColor = vec4(
  //   1000.0 * abs(pixel.x - previousPixel.x) + 1.0 * pixel.x - 0.5 * previousPixel.y,
  //   0.9 * pixel.x - 2.0 * pixel.y,
  //   10000.0 * abs(pixel.y - previousPixel.y),
  //   1.0
  // );

  // Red Blob variant #1 - turquoise background, yellow-orange fire-like leading edges
  // outputColor = vec4(
  //   10000.0 * abs(pixel.y - previousPixel.y),
  //   1000.0 * abs(pixel.x - previousPixel.x) + 1.0 * pixel.x - 0.5 * previousPixel.y,
  //   0.9 * pixel.x - 2.0 * pixel.y,
  //   1.0
  // );

  // Red Blob variant #2 - radioactive green on hot pink background
  outputColor = vec4(
    1000.0 * abs(pixel.x - previousPixel.x) + 1.0 * pixel.x - 50000.0 * previousPixel.y,
    10000.0 * abs(pixel.y - previousPixel.y),
    0.6 * pixel.x - .1 * pixel.y,
    1.0
  );

  // Black and white ==============================================================================
  // float grayValue = pixel.r - pixel.g;  // black for B, white for A
  // float grayValue = 1.0 - pixel.r - pixel.g;  // white for B, black for A
  // outputColor = vec4(grayValue, grayValue, grayValue, 1.0);

  // No processing - red for chemical A, green for chemical B =====================================
  // outputColor = pixel;

  gl_FragColor = outputColor;
}