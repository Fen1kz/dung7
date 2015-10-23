precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec2 gameResolution;
uniform vec2 shaderResolution;

uniform sampler2D shadowMapChannel;
uniform vec2 uLightPosition[2];
uniform vec4 uLightColor;

const float PI = 3.141592653589793238462643383279502884197169399375105820974944592307816406286;

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    color.a = 0.0;

    for (int lightNumber = 0; lightNumber < 2; lightNumber += 1) {
        float yCoord = 0.1;
        if (lightNumber == 1) {
            yCoord += 0.8;
        }
        vec2 lightPosition = uLightPosition[lightNumber];

        vec2 localLightPosition = lightPosition / gameResolution;
        vec2 toLight = vTextureCoord - localLightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);
    //    color.rg = toLight;
        toLight = toLight * (gameResolution / shaderResolution);
        float angleToPoint = atan(toLight.y, toLight.x);

        float angleCoordOnMap = angleToPoint / (2.0 * PI);
    //    angleToPoint = angleToPoint * .5;// * (gameResolution.x / rtResolution.x);
    //    color.g = angleToPoint;
    //    color.r = -angleToPoint;

        vec2 samplePoint = vec2(angleCoordOnMap, yCoord);
    //    color.rg = samplePoint;
        vec4 LMapColor = texture2D(shadowMapChannel, samplePoint);
//        color = LMapColor;

        float light = length(toLight);
        float occluder = LMapColor.a;
        if (light > occluder) {
            color.a += 0.4;
        }
    }
//    gl_FragColor = color;


//    color = texture2D(shadowMapChannel, vec2(vTextureCoord.x, yCoord));
//    color = texture2D(shadowMapChannel, vTextureCoord);
//    color.a = 1.0;
    gl_FragColor = color;
}


//void main() {
//    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
////    color.a = 0.0;
//    const int i = 0;
//
////    for (int i = 0; i < 2; i += 1) {
//        vec2 lightPosition = uLightPosition[i];
//        vec2 localLightPosition = lightPosition / gameResolution;
//        vec2 toLight = vTextureCoord - localLightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);
////    //    color.rg = toLight;
//        toLight = toLight * (gameResolution / shaderResolution);
//        float angleToPoint = atan(toLight.y, toLight.x);
//        if (i == 0) {
//            color.r = angleToPoint;
//        }
//
//        float angleCoordOnMap = angleToPoint / (2.0 * PI);
//    //    angleToPoint = angleToPoint * .5;// * (gameResolution.x / rtResolution.x);
//    //    color.g = angleToPoint;
//    //    color.r = -angleToPoint;
//
//        vec2 samplePoint = vec2(angleCoordOnMap, float(i + 1) * 64.0);
//        vec4 LMapColor = texture2D(shadowMapChannel, samplePoint);
//
//    //    color = LMapColor;
//        float light = length(toLight);
//        float occluder = LMapColor.a;
//    //    occluder = floor(occluder * 10.) / 10.;
//        if (light > occluder) {
////            color.a += 0.4;
//        }
////    }
//
//    gl_FragColor = color;
//}