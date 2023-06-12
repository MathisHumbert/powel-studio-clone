attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uVelocity;

varying vec2 vUv;
varying float vDistortion;

void main(){
  vec3 newPosition = position;

  float distortion = sin(newPosition.x * 6.) * 0.02 * uVelocity;

  newPosition.y += distortion;

  vUv = uv;
  vDistortion = distortion;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);
}