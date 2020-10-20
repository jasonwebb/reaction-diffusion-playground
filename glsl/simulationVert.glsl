uniform vec2 resolution;

varying vec2 v_uvs[9];
varying vec2 texelStep;

void main() {
  texelStep = 1.0 / resolution.xy;

  // Center texel
  v_uvs[0] = uv;

  // Orthogonal texels
  v_uvs[1] = uv + vec2(0.0, -texelStep.y);  // top
  v_uvs[2] = uv + vec2(texelStep.x, 0.0);   // right
  v_uvs[3] = uv + vec2(0.0, texelStep.y);   // bottom
  v_uvs[4] = uv + vec2(-texelStep.x, 0.0);  // left

  // Diagonal texels
  v_uvs[5] = uv + vec2(texelStep.x, -texelStep.y);   // top-right
  v_uvs[6] = uv + vec2(texelStep.x, texelStep.y);    // bottom-right
  v_uvs[7] = uv + vec2(-texelStep.x, texelStep.y);   // bottom-left
  v_uvs[8] = uv + vec2(-texelStep.x, -texelStep.y);  // top-left

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}