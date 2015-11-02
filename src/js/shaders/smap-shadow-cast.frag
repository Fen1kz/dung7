precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec2 gameResolution;
uniform vec2 shaderResolution;

uniform sampler2D shadowMapChannel;

uniform vec4 uAmbient;
uniform vec4 uLightPosition[LIGHTS_COUNT];
uniform vec4 uLightColor[LIGHTS_COUNT];

const float PI = 3.14159265358;//9793238462643383279502884197169399375105820974944592307816406286;

vec4 blurH(in sampler2D texture, in vec2 tc, in float iBlur) {
    float blur = iBlur / gameResolution.x;
    vec4 sum = vec4(0.0);
//    sum += texture2D(texture, vec2(tc.x - 4.0*blur, tc.y)) * 0.0162162162;
//    sum += texture2D(texture, vec2(tc.x - 3.0*blur, tc.y)) * 0.0540540541;
//    sum += texture2D(texture, vec2(tc.x - 2.0*blur, tc.y)) * 0.1216216216;
//    sum += texture2D(texture, vec2(tc.x - 1.0*blur, tc.y)) * 0.1945945946;
//
//    sum += texture2D(texture, vec2(tc.x, tc.y)) * 0.2270270270;
//
//    sum += texture2D(texture, vec2(tc.x + 1.0*blur, tc.y)) * 0.1945945946;
//    sum += texture2D(texture, vec2(tc.x + 2.0*blur, tc.y)) * 0.1216216216;
//    sum += texture2D(texture, vec2(tc.x + 3.0*blur, tc.y)) * 0.0540540541;
//    sum += texture2D(texture, vec2(tc.x + 4.0*blur, tc.y)) * 0.0162162162;
    sum += texture2D(texture, vec2(tc.x - 5.0*blur, tc.y)) * 0.022657;
    sum += texture2D(texture, vec2(tc.x - 4.0*blur, tc.y)) * 0.046108;
    sum += texture2D(texture, vec2(tc.x - 3.0*blur, tc.y)) * 0.080127;
    sum += texture2D(texture, vec2(tc.x - 2.0*blur, tc.y)) * 0.118904;
    sum += texture2D(texture, vec2(tc.x - 1.0*blur, tc.y)) * 0.150677;

    sum += texture2D(texture, vec2(tc.x, tc.y)) * 0.163053;

    sum += texture2D(texture, vec2(tc.x + 1.0*blur, tc.y)) * 0.150677;
    sum += texture2D(texture, vec2(tc.x + 2.0*blur, tc.y)) * 0.118904;
    sum += texture2D(texture, vec2(tc.x + 3.0*blur, tc.y)) * 0.080127;
    sum += texture2D(texture, vec2(tc.x + 4.0*blur, tc.y)) * 0.046108;
    sum += texture2D(texture, vec2(tc.x + 5.0*blur, tc.y)) * 0.022657;
    return sum;
}

float takeSample(in sampler2D texture, in vec2 coord, in float light) {
    return step(light, texture2D(texture, coord).a);
}

vec4 blurH2(in sampler2D texture, in vec2 tc, in float light, in float iBlur) {
    float blur = iBlur / gameResolution.x;
    vec4 sum = vec4(0.0);
    sum += takeSample(texture, vec2(tc.x - 5.0*blur, tc.y), light) * 0.022657;
    sum += takeSample(texture, vec2(tc.x - 4.0*blur, tc.y), light) * 0.046108;
    sum += takeSample(texture, vec2(tc.x - 3.0*blur, tc.y), light) * 0.080127;
    sum += takeSample(texture, vec2(tc.x - 2.0*blur, tc.y), light) * 0.118904;
    sum += takeSample(texture, vec2(tc.x - 1.0*blur, tc.y), light) * 0.150677;

    sum += takeSample(texture, vec2(tc.x, tc.y), light) * 0.163053;

    sum += takeSample(texture, vec2(tc.x + 1.0*blur, tc.y), light) * 0.150677;
    sum += takeSample(texture, vec2(tc.x + 2.0*blur, tc.y), light) * 0.118904;
    sum += takeSample(texture, vec2(tc.x + 3.0*blur, tc.y), light) * 0.080127;
    sum += takeSample(texture, vec2(tc.x + 4.0*blur, tc.y), light) * 0.046108;
    sum += takeSample(texture, vec2(tc.x + 5.0*blur, tc.y), light) * 0.022657;
    return sum;
}

float noise(in vec2 source) {
    return fract(9567. * sin(source.x + 5943. * source.y));
//    return fract(1. * sin(source.x + 1. * source.y));
}

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
//    color.a = 0.0;;
    float allLuminosity = 0.0;

    float lightLookupHalfStep = (1.0 / float(LIGHTS_COUNT)) * .5;

//    const int lightNumber = 0;
    for (int lightNumber = 0; lightNumber < LIGHTS_COUNT; lightNumber += 1) {
        float lightSize = uLightPosition[lightNumber].z;
        float lightFalloff = min(0.99, uLightPosition[lightNumber].a);
        if (lightSize == 0.) {
            continue;
        }
        vec2 lightPosition = uLightPosition[lightNumber].xy;
        vec4 lightColor = uLightColor[lightNumber];
        float lightLuminosity = 0.0;

        float yCoord = float(lightNumber) / float(LIGHTS_COUNT) + lightLookupHalfStep;

        vec2 localLightPosition = lightPosition / gameResolution;
        vec2 toLight = vTextureCoord - localLightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);
        toLight = toLight * (gameResolution / shaderResolution) / lightSize;
        float angleToPoint = atan(toLight.y, toLight.x);

        float angleCoordOnMap = angleToPoint / (2.0 * PI);

        vec2 samplePoint = vec2(angleCoordOnMap, yCoord);
//        vec4 LMapColor = texture2D(shadowMapChannel, samplePoint);

        float shadowcaster = texture2D(shadowMapChannel, samplePoint).a;
        float light = length(toLight);

//        float blur = 2. * smoothstep(0., 1.0, light - shadowcaster)
//        float blur = 2. * smoothstep(0., 1.0, light)
//            * step(shadowcaster, light)
//            * (1.0 - step(1.0, shadowcaster));

        float blur = 1. * smoothstep(lightFalloff, 1., light);

        float sum = blurH2(shadowMapChannel, samplePoint, light, blur).a;
//        allLuminosity = sum;

        lightLuminosity = sum * smoothstep(1.0, lightFalloff, light);

        allLuminosity += lightLuminosity;
    }

    color = vec4(vec3(allLuminosity), 1.0);
    color = clamp(color, uAmbient, vec4(1.1));
//    color.a = 1.0 - allLuminosity;
//    color = texture2D(shadowMapChannel, vTextureCoord);

    vec4 base = texture2D(uSampler, vTextureCoord);
    //color = blurH(uSampler, vTextureCoord, 1.0);

    gl_FragColor = vec4(base.rgb * color.rgb, 1.0);
//    gl_FragColor = color;
}