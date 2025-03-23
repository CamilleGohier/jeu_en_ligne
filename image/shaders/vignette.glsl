precision mediump float;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
uniform float uVignetteIntensity;

void main(void) {
    vec2 uv = outTexCoord;
    vec4 color = texture2D(uMainSampler, uv);
    
    // Calcule la distance du pixel au centre
    float d = distance(uv, vec2(0.5, 0.5));
    // Applique un gradient de vignettage via smoothstep
    float vignette = smoothstep(0.2, 0.8, d) * uVignetteIntensity;
    color.rgb *= (1.0 - vignette);
    
    gl_FragColor = color;
}
