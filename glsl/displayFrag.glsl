varying vec2 v_uv;
uniform sampler2D textureToDisplay;
uniform sampler2D previousIterationTexture;
uniform float time;

uniform int renderingStyle;

uniform vec4 colorStop1;
uniform vec4 colorStop2;
uniform vec4 colorStop3;
uniform vec4 colorStop4;
uniform vec4 colorStop5;

uniform vec2 hslFrom;
uniform vec2 hslTo;
uniform float hslSaturation;
uniform float hslLuminosity;

// http://theorangeduck.com/page/avoiding-shader-conditionals
float when_eq(float x, float y)  { return 1.0 - abs(sign(x - y)); }
float when_neq(float x, float y) { return abs(sign(x - y)); }
float when_gt(float x, float y)  { return max(sign(x - y), 0.0); }
float when_lt(float x, float y)  { return max(sign(y - x), 0.0); }
float when_le(float x, float y)  { return 1.0 - max(sign(x - y), 0.0); }
float when_ge(float x, float y)  { return 1.0 - max(sign(y - x), 0.0); }

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
    6.0)-3.0)-1.0,
    0.0,
    1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

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

  // HSL mapping ==================================================================================
  if(renderingStyle == 0) {
    outputColor = vec4(hsb2rgb(vec3(
      // map(A, .6, 1., 0., .6),
      // map(B, .6, 1., 0.5, 1.),
      // map(B-A, 0.2, 1., .3, .8),
      map(B-A, hslFrom[0], hslFrom[1], hslTo[0], hslTo[1]),
      hslSaturation,
      hslLuminosity
    )), 1.);

  // Gradient color stops by @pmneila =============================================================
  // - https://github.com/pmneila/jsexp
  } else if(renderingStyle == 1) {
    vec3 color;

    if(B <= colorStop1.a) {
      color = colorStop1.rgb;
    } else if(B <= colorStop2.a) {
      color = mix(
        colorStop1.rgb,
        colorStop2.rgb,
        (B - colorStop1.a) / (colorStop2.a - colorStop1.a)
      );
    } else if(B <= colorStop3.a) {
      color = mix(
        colorStop2.rgb,
        colorStop3.rgb,
        (B - colorStop2.a) / (colorStop3.a - colorStop2.a)
      );
    } else if(B <= colorStop4.a) {
      color = mix(
        colorStop3.rgb,
        colorStop4.rgb,
        (B - colorStop3.a) / (colorStop4.a - colorStop3.a)
      );
    } else if(B <= colorStop5.a) {
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
  } else if(renderingStyle == 2) {
    outputColor = vec4(
      1000.0 * abs(pixel.x - previousPixel.x) + 1.0 * pixel.x - 0.5 * previousPixel.y,
      0.9 * pixel.x - 2.0 * pixel.y,
      10000.0 * abs(pixel.y - previousPixel.y),
      1.0
    );

  // Red Blob variant #1 - turquoise background, yellow-orange fire-like leading edges
  } else if(renderingStyle == 3) {
    outputColor = vec4(
      10000.0 * abs(pixel.y - previousPixel.y),
      1000.0 * abs(pixel.x - previousPixel.x) + 1.0 * pixel.x - 0.5 * previousPixel.y,
      0.9 * pixel.x - 2.0 * pixel.y,
      1.0
    );

  // Red Blob variant #2 - radioactive green on hot pink background
  } else if(renderingStyle == 4) {
    outputColor = vec4(
      1000.0 * abs(pixel.x - previousPixel.x) + 1.0 * pixel.x - 50000.0 * previousPixel.y,
      10000.0 * abs(pixel.y - previousPixel.y),
      0.6 * pixel.x - .1 * pixel.y,
      1.0
    );

  // Rainbow effect by Jonathon Cole ==============================================================
  // - https://github.com/colejd/Reaction-Diffusion-ThreeJS based on http://krazydad.com/tutorials/makecolors.php
  } else if(renderingStyle == 5) {
    float c = A - B;
    outputColor = vec4(c, c, c, 1.0);
    vec4 rainbow = rainbow(v_uv.xy + time*.5);
    float gBranch = when_gt(B, 0.01);
    outputColor = mix(outputColor, outputColor - rainbow, gBranch);

  // Black and white (soft) =======================================================================
  } else if(renderingStyle == 6) {
    float grayValue = pixel.r - pixel.g;  // black for B, white for A
    // float grayValue = 1.0 - pixel.r - pixel.g;  // white for B, black for A
    outputColor = vec4(grayValue, grayValue, grayValue, 1.0);

  // Black and white (sharp) ======================================================================
  } else if(renderingStyle == 7) {
    float grayValue = pixel.r - pixel.g;

    if(grayValue > .3) {
      outputColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
      outputColor = vec4(0.0, 0.0, 0.0, 1.0);
    }

  // No processing - red for chemical A, green for chemical B =====================================
  } else if(renderingStyle == 8) {
    outputColor = pixel;
  }

  gl_FragColor = outputColor;
}