precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uAlpha;
uniform float uHover;

varying vec2 vUv;

float circle(in vec2 _st, in float _radius, in float blurriness) {
  vec2 dist = _st;
  return 1.0 - smoothstep(_radius - (_radius * blurriness), _radius + (_radius * blurriness), dot(dist, dist) * 4.0);
}

vec4 blur(sampler2D textureSampler, vec2 uv, float blurAmount)
{
    vec4 blurredColor = vec4(0.0);
    float samples = 50.0;  
    
    for (float i = 0.0; i < 50.0; i += 1.0) {
        float angle = i * 3.14159 * 2.0 / samples * 1.2;
        vec2 offset = vec2(cos(angle), sin(angle)) * blurAmount;
        blurredColor += texture2D(textureSampler, uv + offset);
    }
    
    blurredColor /= samples * 1.2; 
    
    return blurredColor;
}

void main() {
  vec4 texture = texture2D(uTexture, vUv);

  vec2 res = uRes * 1.0;

  vec2 st = gl_FragCoord.xy / res.xy - vec2(0.5);
  st.y *= uRes.y / uRes.x;

  vec2 mouse = uMouse * -0.5;
  mouse.y *= uRes.y / uRes.x;

  vec2 circlePos = (st + mouse) * 2.0;
  float c = circle(circlePos, 0.75, 0.5);

  vec4 blurredTexture = blur(uTexture, vUv, 0.015);

  gl_FragColor = mix(texture, blurredTexture, c * uAlpha * uHover);
}

