attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;
uniform float uVelocity;

varying vec2 vUv;

void main(){
  vec3 newPosition = position;

  float distortion = sin(newPosition.x  * PI + PI / 2.) * 0.015 * uVelocity;

  newPosition.y += distortion;

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);
}