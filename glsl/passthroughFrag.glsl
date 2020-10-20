varying vec2 v_uv;
uniform sampler2D textureToDisplay;

void main() {
  gl_FragColor = texture2D(textureToDisplay, v_uv);
}