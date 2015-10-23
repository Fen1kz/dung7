let _ = require('lodash');
let PIXI = require('pixi.js');

let fragShadowTexture = require('shaders/smap-shadow-texture.frag');
let fragShadowCast = require('shaders/smap-shadow-cast.frag');

class SMapFilter extends PIXI.AbstractFilter {
    constructor(game, uniforms) {
        super(null, null, uniforms);
        this.game = game;

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

        this.filterShadowTexture = new PIXI.AbstractFilter(
            null
            , fragShadowTexture
            , {
                'uLightPosition[0]': _.clone(this.uniforms['uLightPosition[0]'])
                , 'uLightPosition[1]': _.clone(this.uniforms['uLightPosition[1]'])
                , gameResolution: _.clone(this.uniforms.gameResolution)
                , shaderResolution: _.clone(this.uniforms.shaderResolution)
                , rtResolution: _.clone(this.uniforms.rtResolution)
            }
        );

        //let rt = new PIXI.RenderTexture();
        //debugger;

        this.filterShadowCast = new PIXI.AbstractFilter(
            null
            , fragShadowCast
            , {
                'uLightPosition[0]': _.clone(this.uniforms['uLightPosition[0]'])
                , 'uLightPosition[1]': _.clone(this.uniforms['uLightPosition[1]'])
                , gameResolution:   (this.uniforms.gameResolution)
                , shaderResolution: (this.uniforms.shaderResolution)
                , rtResolution:     (this.uniforms.rtResolution)
                , shadowMapChannel: {type: 'sampler2D',
                    value: {
                        baseTexture: {
                            hasLoaded: true
                            , _glTextures: [this.renderTarget.texture]
                        }
                    }
                }
            }//: this.renderTarget.texture
        );
    }


//    uLightPosition: _.clone(this.uniforms.uLightPosition)
//, gameResolution: _.clone(this.uniforms.gameResolution)
//, shaderResolution: _.clone(this.uniforms.shaderResolution)
//, rtResolution: _.clone(this.uniforms.rtResolution)

    update() {

    }

    applyFilter(renderer, input, output) {
        this.filterShadowTexture.applyFilter(renderer, input, this.renderTarget, true);

        this.filterShadowCast.applyFilter(renderer, input, output);
        //this.defaultFilter.applyFilter(renderer, this.renderTarget, output);
        //this.defaultFilter.applyFilter(renderer, input, output, true);
    }
}

class SMapShadowTexture extends PIXI.AbstractFilter {
}

class SMapShadowCast extends PIXI.AbstractFilter {

}

export default SMapFilter;