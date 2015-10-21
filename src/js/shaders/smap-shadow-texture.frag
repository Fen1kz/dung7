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
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    vec2 localLightPosition = uLightPosition / gameResolution;
    float dst = 1.0;
    for (float y = 0.0; y < SIZE; y += 1.0) {
        float angle = vTextureCoord.x * (2.0 * PI);
//        float distance = vTextureCoord.y;
        float distance = y / SIZE;
        vec2 coord = vec2(cos(angle) * distance, sin(angle) * distance);
        coord = localLightPosition + coord / (gameResolution / rtResolution);
        coord = clamp(coord, .0, 1.0);
        vec4 data = texture2D(uSampler, coord);
//      color = data;

        if (data.a > THRESHOLD) {
            dst = min(dst, distance);
        }
    }
    gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), dst);

//    color.rg = localLightPosition + coord;;
//    color.a = 1.0;

//    color.r = fract(angle / (2.0 * PI));
//    color.g = fract(distance);
//    color.a = 1.0;
//    color = vec4(vec3(0.0, 0.0, 0.0), 1.5);
//    color.rg = fract(localLightPosition);
//    color = texture2D(uSampler, vTextureCoord);
//    gl_FragColor = color;
}