varying vec2 v_uv;
uniform sampler2D textureToDisplay;

void main() {
  vec2 uv = v_uv;
  gl_FragColor = texture2D(textureToDisplay, uv);
}