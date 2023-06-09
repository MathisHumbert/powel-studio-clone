precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uPlaneSizes;
uniform vec2 uImageSizes;
uniform float uHover;

varying vec2 vUv;
varying float vDistortion;

vec3 adjustSaturation(vec3 color, float value) {
  const vec3 luminosityFactor = vec3(0.2126, 0.7152, 0.0722);
  vec3 grayscale = vec3(dot(color, luminosityFactor));

  return mix(grayscale, color, 1.0 + value);
}

vec2 getCorrectUv (vec2 planeSizes, vec2 imageSizes, vec2 uv){
  vec2 ratio = vec2(
    min(((planeSizes.x / planeSizes.y) / (imageSizes.x / imageSizes.y)), 1.),
    min(((planeSizes.y / planeSizes.x) / (imageSizes.y / imageSizes.x)), 1.)
  );

  return vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main(){
  vec2 uv = getCorrectUv(uPlaneSizes, uImageSizes, vUv);

  uv.y += vDistortion * 1.5;

  vec4 texture = texture2D(uTexture, uv);
  vec3 color = texture.rgb;

  vec3 saturatedColor = adjustSaturation(color, -1. + uHover);

  gl_FragColor = vec4(saturatedColor, 1.0);
}