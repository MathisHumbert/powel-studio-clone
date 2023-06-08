attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;


varying vec2 vUv;

void main(){
  vec4 newPosition = modelViewMatrix * vec4(position, 1.);

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}