precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec2 gameResolution;

uniform sampler2D shadowMapChannel;

uniform vec4 uAmbient;
uniform vec4 uLightPosition[LIGHTS_COUNT];
uniform vec4 uLightColor[LIGHTS_COUNT];

const float PI = 3.14159265358;//9793238462643383279502884197169399375105820974944592307816406286;

float snoise(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;
}

float noise() {
    return snoise(vTextureCoord);
}

vec4 takeSample(in sampler2D texture, in vec2 coord, in float light) {
    return step(light, texture2D(texture, coord));
//    return texture2D(texture, coord);
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
    vec2 relativeResolution = (max(gameResolution.x, gameResolution.y) / gameResolution);
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
//    color.a = 0.0;;
    vec3 allLuminosity = vec3(0.0);

    float lightLookupHalfStep = (1.0 / float(LIGHTS_COUNT)) * .5;

//    const int lightNumber = 0;
    for (int lightNumber = 0; lightNumber < LIGHTS_COUNT; lightNumber += 1) {
        float lightSize = uLightPosition[lightNumber].z / max(gameResolution.x, gameResolution.y);
        float lightFalloff = min(0.99, uLightPosition[lightNumber].a);
        if (lightSize == 0.) {
            continue;
        }
        vec2 lightPosition = uLightPosition[lightNumber].xy / gameResolution;
        vec4 lightColor = uLightColor[lightNumber];
        vec3 lightLuminosity = vec3(0.0);

        float yCoord = float(lightNumber) / float(LIGHTS_COUNT) + lightLookupHalfStep;

        vec2 toLight = vTextureCoord - lightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);

//        toLight = toLight * (gameResolution / max(gameResolution.x, gameResolution.y)) / lightSize;
        toLight = toLight / relativeResolution / lightSize;

        float light = length(toLight);
        float angleToPoint = atan(toLight.y, toLight.x);

        float angleCoordOnMap = angleToPoint / (2.0 * PI);// + 0.00075 * snoise(-toLight);

        vec2 samplePoint = vec2(angleCoordOnMap, yCoord);
//        vec4 LMapColor = texture2D(shadowMapChannel, samplePoint);

//        float shadowcaster = texture2D(shadowMapChannel, samplePoint).a;

//        float blur = 2. * smoothstep(0., 1.0, light - shadowcaster)
//        float blur = 2. * smoothstep(0., 1.0, light)
//            * step(shadowcaster, light)
//            * (1.0 - step(1.0, shadowcaster));

        float blur = smoothstep(0., 5., light);
//        float blur = 1. * smoothstep(lightFalloff, 1., light);// * (1.0 + 1.0 * lightColor.a);

        float sum = blurH2(shadowMapChannel, samplePoint, light, blur).a;
//        allLuminosity = sum;
        sum = max(sum, lightColor.a);

        lightLuminosity = lightColor.rgb * vec3(sum) * smoothstep(1.0, lightFalloff, light);

        allLuminosity += lightLuminosity;
    }

    color = vec4(allLuminosity, 1.0);
    color = max(color, uAmbient);
//    color = clamp(color, uAmbient, vec4(1.1));


//    color.a = 1.0 - allLuminosity;
//    color = texture2D(shadowMapChannel, vTextureCoord);

    vec4 base = texture2D(uSampler, vTextureCoord);
    //color = blurH(uSampler, vTextureCoord, 1.0);

    gl_FragColor = vec4(base.rgb * sqrt(color.rgb), 1.0);
//    gl_FragColor = vec4(base.rgb * color.rgb, 1.0);
//    color = vec4(vec3(0.0), 1.0);
//    color.r = light;
//    gl_FragColor = color;
}