precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec2 gameResolution;
uniform vec2 shaderResolution;

uniform sampler2D shadowMapChannel;
uniform vec2 uLightPosition;
uniform vec4 uLightColor;

const float PI = 3.141592653589793238462643383279502884197169399375105820974944592307816406286;

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 localLightPosition = uLightPosition / gameResolution;
    vec2 toLight = vTextureCoord - localLightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);
//    color.rg = toLight;
    toLight = toLight * (gameResolution / shaderResolution);
    float angleToPoint = atan(toLight.y, toLight.x);

    float angleCoordOnMap = angleToPoint / (2.0 * PI);
//    angleToPoint = angleToPoint * .5;// * (gameResolution.x / rtResolution.x);
//    color.g = angleToPoint;
//    color.r = -angleToPoint;

    vec2 samplePoint = vec2(angleCoordOnMap, 0);
    vec4 LMapColor = texture2D(shadowMapChannel, samplePoint);

//    color = LMapColor;
    float light = length(toLight);
    float occluder = LMapColor.a;
    color.a = 0.0;
//    occluder = floor(occluder * 10.) / 10.;
    if (light > occluder) {
        color.a = 0.8;
    }
//    color.a = distanceToLight - distanceToOccluder;

//    color = texture2D(shadowMapChannel, vTextureCoord);

    gl_FragColor = color;
}