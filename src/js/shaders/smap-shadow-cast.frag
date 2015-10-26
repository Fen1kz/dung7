precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec2 gameResolution;
uniform vec2 shaderResolution;

uniform sampler2D shadowMapChannel;

uniform vec3 uLightPosition[LIGHTS_COUNT];
uniform vec4 uLightColor[LIGHTS_COUNT];

const float PI = 3.141592653589793238462643383279502884197169399375105820974944592307816406286;

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
//    color.a = 0.0;;
    float allLuminosity = 0.0;

    float lightLookupHalfStep = (1.0 / float(LIGHTS_COUNT)) * .5;

    for (int lightNumber = 0; lightNumber < LIGHTS_COUNT; lightNumber += 1) {
        vec2 lightPosition = uLightPosition[lightNumber].xy;
        vec4 lightColor = uLightColor[lightNumber];
        if (lightColor.a == 0.) {
            continue;
        }
        float lightLuminosity = 0.0;
        float yCoord = float(lightNumber) / float(LIGHTS_COUNT) + lightLookupHalfStep;

        vec2 localLightPosition = lightPosition / gameResolution;
        vec2 toLight = vTextureCoord - localLightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);
        toLight = toLight * (gameResolution / shaderResolution);
        float angleToPoint = atan(toLight.y, toLight.x);

        float angleCoordOnMap = angleToPoint / (2.0 * PI);

        vec2 samplePoint = vec2(angleCoordOnMap, yCoord);
        vec4 LMapColor = texture2D(shadowMapChannel, samplePoint);

        float light = length(toLight);
        float occluder = LMapColor.a;
        if (light < occluder) {
            lightLuminosity += max(0.0, 1.0 - light * 1.1);
        }
        allLuminosity += lightLuminosity;

//        color = vec4(0.0, 0.0, 0.0, 1.0);
//        if (floor(yCoord * 10.) == floor(vTextureCoord.y * 10.)) {
//            color.r = yCoord * .5;
//        }
//        color.r = floor(vTextureCoord.y * 10.) / 10.;
//        color.r = floor(yCoord * 10.) / 10.;
    }
    color.a -= allLuminosity;
//    color = texture2D(shadowMapChannel, vTextureCoord);

    gl_FragColor = color;
}