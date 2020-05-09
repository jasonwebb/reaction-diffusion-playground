/**

- Red channel = concentration of chemical A (0.0 - 1.0)
- Green channel = concentration of chemical B (0.0 - 1.0)
*/

uniform sampler2D previousIterationTexture;

uniform float f;
uniform float k;
uniform float dA;
uniform float dB;
uniform float timestep;

varying vec2 v_uv;
varying vec2 v_uvs[9];

vec3 weights[3];

void setWeights(int type) {
  // Karl Sim's weights from http://www.karlsims.com/rd.html
  if(type == 0) {
    weights[0] = vec3(0.2,   0.05,  0.2);
    weights[1] = vec3(0.05, -1.0,   0.05);
    weights[2] = vec3(0.2,   0.05,  0.2);

  // Standard (?) 9-point stencil from https://en.wikipedia.org/wiki/Discrete_Laplace_operator
  } else if(type == 1) {
    weights[0] = vec3(0.25,  0.5,  0.25);
    weights[1] = vec3(0.5,  -3.0,  0.5);
    weights[2] = vec3(0.25,  0.5,  0.25);

  // 5-point stencil
  } else if(type == 2) {
    weights[0] = vec3(0.0,  1.0,  0.0);
    weights[1] = vec3(1.0, -4.0,  1.0);
    weights[2] = vec3(0.0,  1.0,  0.0);
  }
}

vec4 getLaplacian(vec4 centerPixel) {
  // Begin by setting up the Laplacian stencil weights based on desired model
  setWeights(0);

  // Start with center value
  vec4 laplacian = centerPixel * weights[1][1];  // center

  // Add in orthogonal values
  laplacian += texture2D(previousIterationTexture, v_uvs[1]) * weights[0][1];  // top
  laplacian += texture2D(previousIterationTexture, v_uvs[2]) * weights[1][2];  // right
  laplacian += texture2D(previousIterationTexture, v_uvs[3]) * weights[2][1];  // bottom
  laplacian += texture2D(previousIterationTexture, v_uvs[4]) * weights[1][0];  // left

  // Add in diagonal values
  laplacian += texture2D(previousIterationTexture, v_uvs[5]) * weights[0][2];  // top-right
  laplacian += texture2D(previousIterationTexture, v_uvs[6]) * weights[2][2];  // bottom-right
  laplacian += texture2D(previousIterationTexture, v_uvs[7]) * weights[2][0];  // bottom-left
  laplacian += texture2D(previousIterationTexture, v_uvs[8]) * weights[0][0];  // top-left

  return laplacian;
}

void main() {
  vec4 centerTexel = texture2D(previousIterationTexture, v_uvs[0]);
  float A = centerTexel[0];
  float B = centerTexel[1];

  // Pre-calculate more complex and repeated terms
  vec4 laplacian = getLaplacian(centerTexel);
  float reactionTerm = A * B * B;

  // Calculate the next A and B values
  A += dA * laplacian[0] - reactionTerm + f * (1.0 - A);
  B += dB * laplacian[1] + reactionTerm + (k + f) * B;

  gl_FragColor = saturate(vec4(A, B, centerTexel.b, 1.0));
  // gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}