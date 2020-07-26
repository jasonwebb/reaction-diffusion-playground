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
uniform vec2 mousePosition;
uniform float brushRadius;
uniform sampler2D styleMapTexture;
uniform vec4 styleMapTransforms;
uniform vec2 resolution;

varying vec2 v_uvs[9];

vec3 weights[3];

void setWeights(int type) {
  // Karl Sim's weights from http://www.karlsims.com/rd.html
  if(type == 0) {
    weights[0] = vec3(0.05,  0.2,  0.05);
    weights[1] = vec3(0.2,  -1.0,  0.2);
    weights[2] = vec3(0.05,  0.2,  0.05);

  // Standard (?) 9-point stencil from https://en.wikipedia.org/wiki/Discrete_Laplace_operator
  } else if(type == 1) {
    weights[0] = vec3(0.25,  0.5,  0.25);
    weights[1] = vec3(0.5,  -3.0,  0.5);
    weights[2] = vec3(0.25,  0.5,  0.25);

  // 5-point stencil from Xmoprhoa/pmneila source code
  } else if(type == 2) {
    weights[0] = vec3(0.0,  1.0,  0.0);
    weights[1] = vec3(1.0, -4.0,  1.0);
    weights[2] = vec3(0.0,  1.0,  0.0);
  }
}

vec2 getLaplacian(vec4 centerTexel) {
  // Begin by setting up the Laplacian stencil weights based on desired model
  setWeights(2);

  // Start with center value
  vec2 laplacian = centerTexel.xy * weights[1][1];  // center

  // Add in orthogonal values
  laplacian += texture2D(previousIterationTexture, v_uvs[1]).xy * weights[0][1];  // top
  laplacian += texture2D(previousIterationTexture, v_uvs[2]).xy * weights[1][2];  // right
  laplacian += texture2D(previousIterationTexture, v_uvs[3]).xy * weights[2][1];  // bottom
  laplacian += texture2D(previousIterationTexture, v_uvs[4]).xy * weights[1][0];  // left

  // Add in diagonal values
  laplacian += texture2D(previousIterationTexture, v_uvs[5]).xy * weights[0][2];  // top-right
  laplacian += texture2D(previousIterationTexture, v_uvs[6]).xy * weights[2][2];  // bottom-right
  laplacian += texture2D(previousIterationTexture, v_uvs[7]).xy * weights[2][0];  // bottom-left
  laplacian += texture2D(previousIterationTexture, v_uvs[8]).xy * weights[0][0];  // top-left

  return laplacian;
}

vec4 getStyleMapTexel(vec2 uv) {
  float scale = styleMapTransforms[0];
  float angle = styleMapTransforms[1];
  float xOffset = - styleMapTransforms[2] / resolution.x;
  float yOffset = styleMapTransforms[3] / resolution.y;

  vec2 transformedUV = uv;

  // Calculate translation (X and Y)
  transformedUV.x += xOffset;
  transformedUV.y += yOffset;

  // Calculate scale
  transformedUV /= scale;

  // Calculate rotation
  float s = sin(angle);
  float c = cos(angle);
  mat2 rotationMatrix = mat2(c, s,
                            -s, c);
  vec2 pivot = vec2(0.5, 0.5);
  transformedUV = rotationMatrix * (transformedUV - pivot) + pivot;

  return texture2D(styleMapTexture, transformedUV);
}

void main() {
  // A/B chemical data
  vec4 centerTexel = texture2D(previousIterationTexture, v_uvs[0]);
  float A = centerTexel[0];
  float B = centerTexel[1];

  // Get the style map texel that corresponds with this location
  vec4 styleMapTexel = getStyleMapTexel(v_uvs[0]);

  // DEBUG: "skip" this pixel if its white in the style map
  if(styleMapTexel == vec4(1,1,1,1)) {
    gl_FragColor = vec4(0,0,0,0);
    return;
  }

  // Draw more of the B chemical around the mouse on mouse down
  if(mousePosition.x > 0.0 && mousePosition.y > 0.0) {
    float distToMouse = distance(mousePosition * resolution, v_uvs[0] * resolution);

    if(distToMouse < brushRadius) {
      gl_FragColor = vec4(0.0, 0.9, 0.0, 1.0);
      return;
    }
  }

  // DEBUGGING: override f/k uniforms to generate parameter map
  // float f = 0.1 * v_uvs[0].y;
  // float k = 0.03 + 0.04 * v_uvs[0].x;

  // Pre-calculate complex and repeated terms
  vec2 laplacian = getLaplacian(centerTexel);
  float reactionTerm = A * B * B;

  gl_FragColor = vec4(
    A + ((dA * laplacian[0] - reactionTerm + f * (1.0 - A)) * timestep),
    B + ((dB * laplacian[1] + reactionTerm - (k + f) * B) * timestep),
    centerTexel.b,
    1.0
  );
}