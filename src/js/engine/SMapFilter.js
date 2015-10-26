let _ = require('lodash');
let PIXI = require('pixi.js');

let fragShadowTexture = require('shaders/smap-shadow-texture.frag');
let fragShadowCast = require('shaders/smap-shadow-cast.frag');

class SMapFilter extends PIXI.AbstractFilter {
    constructor(game, uniforms, definitions) {
        super(null, null, uniforms);
        this.game = game;

        this.definitions = definitions;

        this.renderTarget = new PIXI.RenderTarget(
            this.game.renderer.gl
            , this.uniforms.rtResolution.value[0]
            , this.uniforms.rtResolution.value[1]
            , PIXI.SCALE_MODES.LINEAR
            , 4);

        this.renderTarget.transform = new PIXI.Matrix()
            .scale(
                this.uniforms.shaderResolution.value[0] / this.game.width
                , this.uniforms.shaderResolution.value[1] / this.game.height);

        this.defaultFilter = new PIXI.AbstractFilter(null, require('shaders/smap-test.frag'));

        //this.uniforms = {
        //    gameResolution: _.clone(uniforms.gameResolution)
        //    , shaderResolution: _.clone(uniforms.shaderResolution)
        //    , rtResolution: _.clone(uniforms.rtResolution)
        //};
        _.range(this.definitions.LIGHTS_COUNT).forEach(i => {
            this.uniforms[`uLightPosition[${i}]`] = {type: '3fv', value: [0, 0, 0]};
            this.uniforms[`uLightColor[${i}]`] = {type: '4fv', value: [0, 0, 0, 0]};
        });
        this.uniforms[`uLightColor[0]`].value[3] = 1.0;
        this.uniforms[`uLightColor[1]`].value[3] = 1.0;
        this.filterShadowTexture = new PIXI.AbstractFilter(
            null
            , this.applyDefinitions(fragShadowTexture)
            , Object.assign(_.mapValues(this.uniforms, (v) => _.clone(v)), {})
        );

        this.filterShadowCast = new PIXI.AbstractFilter(
            null
            , this.applyDefinitions(fragShadowCast)
            , Object.assign(_.mapValues(this.uniforms, (v) => _.clone(v)), {
                shadowMapChannel: {
                    type: 'sampler2D',
                    value: {
                        baseTexture: {
                            hasLoaded: true
                            , _glTextures: [this.renderTarget.texture]
                        }
                    }
                }
            })
        );
    }

    applyFilter(renderer, input, output) {
        this.filterShadowTexture.applyFilter(renderer, input, this.renderTarget, true);

        this.filterShadowCast.applyFilter(renderer, input, output);
        //this.defaultFilter.applyFilter(renderer, this.renderTarget, output);

        //this.defaultFilter.applyFilter(renderer, input, output, true);
    }

    applyDefinitions(shader) {
        return _.reduce(this.definitions, (result, def, key) => result.replace(new RegExp(key, 'g'), def), shader);
    }
}

export default SMapFilter;