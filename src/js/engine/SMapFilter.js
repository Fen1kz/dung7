let _ = require('lodash');
let PIXI = require('pixi.js');

let fragShadowTexture = require('shaders/smap-shadow-texture.frag');
let fragShadowCast = require('shaders/smap-shadow-cast.frag');

class SMapFilter extends PIXI.AbstractFilter {
    constructor(game, uniforms) {
        super(null, null, uniforms);
        this.game = game;

        let rtResolution = 512;

        this.filterShadowTexture = new PIXI.AbstractFilter(
            null
            , fragShadowTexture
            , {
                uLightPosition: _.clone(this.uniforms.uLightPosition)
                , gameResolution: _.clone(this.uniforms.gameResolution)
                , rtResolution: {type: '2fv', value: [rtResolution, rtResolution]}
            }
        )

        this.filterShadowCast = new PIXI.AbstractFilter(
            null
            , fragShadowCast
            , {
                uLightPosition: _.clone(this.uniforms.uLightPosition)
                , gameResolution: _.clone(this.uniforms.gameResolution)
                , rtResolution: {type: '2fv', value: [rtResolution, rtResolution]}
            }
        );

        this.renderTarget = new PIXI.RenderTarget(
            this.game.renderer.gl
            , rtResolution
            , rtResolution
            , PIXI.SCALE_MODES.LINEAR
            , this.game.renderer.resolution * 1.0);
    }

    update() {

    }

    applyFilter(renderer, input, output) {
        let renderTarget = this.renderTarget;
        renderTarget.clear(true);

        //let renderTarget = renderer.filterManager.getRenderTarget(true);

        ////TODO - copyTexSubImage2D could be used here?
        //this.defaultFilter.applyFilter(renderer, input, output);
        //
        this.filterShadowTexture.applyFilter(renderer, input, renderTarget);
        //this.filterShadowTexture.applyFilter(renderer, input, output);

        //debugger;
        this.filterShadowCast.applyFilter(renderer, renderTarget, output);

        //renderer.filterManager.returnRenderTarget(renderTarget);
    }
}

class SMapShadowTexture extends PIXI.AbstractFilter {
}

class SMapShadowCast extends PIXI.AbstractFilter {

}

export default SMapFilter;