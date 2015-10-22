precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 gameResolution;
uniform vec2 rtResolution;
uniform vec2 shaderResolution;

uniform vec2 uLightPosition;
uniform vec4 uLightColor;

uniform sampler2D iChannel0;

const float PI = 3.14159265358979323846;
const float SIZE = 512.0;
const float THRESHOLD = 0.1;

void main(void) {
    vec2 position = vTextureCoord * 2.;
    vec4 color = texture2D(uSampler, position);
    gl_FragColor = color;
}