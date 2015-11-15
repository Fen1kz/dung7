precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 gameResolution;
uniform vec2 rtSize;

uniform vec4 uLightPosition[LIGHTS_COUNT];
uniform vec4 uLightColor[LIGHTS_COUNT];

uniform sampler2D uLightMap;

const float PI = 3.141592653589793238462643383279502884197169399375105820974944592307816406286;
const float SIZE = 256.0;
const float THRESHOLD = 0.01;

//vec2 relativeResolution() {
//    return (max(gameResolution.x, gameResolution.y) / gameResolution);
//}

void main(void) {
    vec2 relativeResolution = (max(gameResolution.x, gameResolution.y) / gameResolution);
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    float yCoord = vTextureCoord.y;// * rtSize.y;
    int lightnum = int(floor(yCoord * float(LIGHTS_COUNT)));
    vec2 lightPosition;
    float lightSize;
    for (int i = 0; i < LIGHTS_COUNT; i += 1) {
        if (lightnum == i) {
            lightPosition = uLightPosition[i].xy / gameResolution;
            lightSize = uLightPosition[i].z / max(gameResolution.x, gameResolution.y);
            break;
        }
    }
    float dst = 1.0;
    for (float y = 0.0; y < SIZE; y += 1.0) {
        float distance = (y / SIZE);
//        float distance = vTextureCoord.y;
        float angle = vTextureCoord.x * (2.0 * PI);
//        float angle = vTextureCoord.x * (2.0 * PI);
        vec2 coord = vec2(cos(angle) * distance, sin(angle) * distance);
        coord = lightPosition + coord * relativeResolution;
        coord = clamp(coord, .0, 1.0);
        vec4 data = texture2D(uLightMap, coord);
//      color = data;
        if (data.a > THRESHOLD) {
            dst = min(dst, distance);
            break;
        }
    }
    color = vec4(vec3(0.0), dst / lightSize);
//    color = vec4(vec3(0.0), 1.0);
//    color.g = vTextureCoord.x;
//    if (lightnum)
//    color.g = yCoord;
//    color.g = yCoord;
//    color.g = vTextureCoord.y;
//    color.r = float(lightnum) / float(LIGHTS_COUNT);
//    color.r = lightSize;


    gl_FragColor = color;
//    gl_FragColor = vec4(vec3(dst * .25, dst / 4., dst / 4.), dst / 4.);

}