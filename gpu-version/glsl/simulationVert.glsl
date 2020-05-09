varying vec2 v_uv;
varying vec2 v_uvs[9];

void main() {
  // Pass the uv coordinates provided by ThreeJS over to the frag shader.
  // - These values will get interpolated automagically into unique values for each fragment (pixel)
  v_uv = uv;

  // Center texel
  v_uvs[0] = uv;

  // Orthogonal texels
  v_uvs[1] = uv + vec2(0.0, -1.0);  // top
  v_uvs[2] = uv + vec2(1.0, 0.0);   // right
  v_uvs[3] = uv + vec2(0.0, 1.0);   // bottom
  v_uvs[4] = uv + vec2(-1.0, 0.0);  // left

  // Diagonal texels
  v_uvs[5] = uv + vec2(1.0, -1.0);  // top-right
  v_uvs[6] = uv + vec2(1.0, 1.0);   // bottom-right
  v_uvs[7] = uv + vec2(-1.0, 1.0);  // bottom-left
  v_uvs[8] = uv + vec2(-1.0, -1.0); // top-left

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}