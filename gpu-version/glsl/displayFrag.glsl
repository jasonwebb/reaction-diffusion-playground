varying vec2 v_uv;
uniform sampler2D textureToDisplay;

void main() {
  // vec4 pixel = texture2D(textureToDisplay, v_uv);
  // float A = pixel.r;
  // float B = pixel.g;

  vec2 uv = v_uv;
  gl_FragColor = texture2D(textureToDisplay, uv);
}