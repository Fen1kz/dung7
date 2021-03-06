precision highp float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
uniform vec2 resolution;
uniform vec2 gameResolution;
uniform vec2 shaderResolution;

uniform sampler2D iChannel0;
uniform vec2 uLightPosition;
uniform vec4 uLightColor;

const float PI = 3.14159265358979323846;

vec2 globalToLocal() {
    return (gameResolution * vTextureCoord) / shaderResolution;
}

vec2 localToGlobal(vec2 local) {
    return (local * shaderResolution) / gameResolution;
}

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    float angleCoordOnMap = vTextureCoord.x;

    vec2 localLightPosition = uLightPosition / gameResolution;
//    localLightPosition.y = 1.0 - localLightPosition.y;

    float angleOfLMap = angleCoordOnMap * (2.0 * PI);
    vec2 toLight = vTextureCoord - localLightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);
    float angleToPoint = atan(toLight.y, toLight.x);

    angleToPoint = angleToPoint / (2.0 * PI);

    vec2 samplePoint = vec2(angleToPoint, 0);
    vec4 LMapColor = texture2D(iChannel0, samplePoint);

    color.a = 0.0;
    if (length(toLight) > LMapColor.r) {
        color.a = 0.8;
    }

    gl_FragColor = color;
}