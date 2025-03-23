precision mediump float;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
uniform float uTime;
uniform float uDistortionIntensity;

void main(void) {
    vec2 uv = outTexCoord;
    // Applique une distorsion basée sur une sinusoïde
    uv.x += sin(uv.y * 19.0 + uTime) * 0.005 * uDistortionIntensity;
    uv.y += cos(uv.x * 10.0 + uTime) * 0.005 * uDistortionIntensity;
    vec4 color = texture2D(uMainSampler, uv);
    
    // Optionnel : ajoute des scan-lines pour accentuer l'effet « film ancien »
    float scanline = sin(uv.y * 800.0) * 0.015;
    color.rgb -= scanline;
    
    gl_FragColor = color;
}
