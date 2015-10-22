let _ = require('lodash');
let PIXI = require('pixi.js');

let fragShadowTexture = require('shaders/smap-shadow-texture.frag');
let fragShadowCast = require('shaders/smap-shadow-cast.frag');

class SMapFilter extends PIXI.AbstractFilter {
    constructor(game, uniforms) {
        super(null, null, uniforms);
        this.game = game;

        let rtSize = 256;

        this.filterShadowTexture = new PIXI.AbstractFilter(
            null
            , fragShadowTexture
            , {
                uLightPosition: _.clone(this.uniforms.uLightPosition)
                , gameResolution: _.clone(this.uniforms.gameResolution)
                , rtResolution: {type: '2fv', value: [rtSize, rtSize]}
            }
        )

        this.filterShadowCast = new PIXI.AbstractFilter(
            null
            , fragShadowCast
            , {
                uLightPosition: _.clone(this.uniforms.uLightPosition)
                , gameResolution: _.clone(this.uniforms.gameResolution)
                , rtResolution: {type: '2fv', value: [rtSize, rtSize]}
            }
        );

        this.renderTarget = new PIXI.RenderTarget(
            this.game.renderer.gl
            , rtSize
            , rtSize
            , PIXI.SCALE_MODES.LINEAR
            , this.game.renderer.resolution);

        this.defaultFilter = new PIXI.AbstractFilter(null, require('shaders/smap-test.frag'));
        //debugger;
        //console.log(this.renderTarget.projectionMatrix);
        //0.03125
        let mx = new PIXI.Matrix().scale(rtSize / 512, rtSize / 512);
        this.renderTarget.transform = mx;
        //this.renderTarget.projectionMatrix.d = 0.00390625;
        //console.log(this.renderTarget.projectionMatrix);
        //console.log(x);
        //this.renderTarget.frame = new PIXI.Rectangle(0, 0, 512, 512);
    }

    update() {

    }

    applyFilter(renderer, input, output) {
        let renderTarget = this.renderTarget;
        this.filterShadowTexture.applyFilter(renderer, input, renderTarget, true);
        this.filterShadowCast.applyFilter(renderer, renderTarget, output);
    }
}

class SMapShadowTexture extends PIXI.AbstractFilter {
}

class SMapShadowCast extends PIXI.AbstractFilter {

}

export default SMapFilter;