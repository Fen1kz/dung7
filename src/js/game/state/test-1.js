let PIXI = require('pixi.js');
let State = require('engine/State');

let BaseFilter = require('engine/BaseFilter');

class Test1 extends State {
    preload(loader) {
        loader.add('assets/gfx/texture1.png');
        loader.add('assets/gfx/mansionNormals.png');
    }

    create() {
        this.mansion = PIXI.Sprite.fromImage('assets/gfx/texture1.png');

        this.SHADER_SIZE = 512;

        this.shadowTexureShader = new BaseFilter(this.game,
            require('shaders/shadow.frag'), {
                uLightColor: {type: '4fv', value: [1, 1, 1, 1.0]}
                , uLightPosition: {type: '2fv', value: [0.5, 0.5]}
                , gameResolution: {type: '2fv', value: [this.game.width, this.game.height]}
                , shaderResolution: {type: '2fv', value: [this.SHADER_SIZE, this.SHADER_SIZE]}
                , iChannel0: {type: 'sampler2D', value: void 0}
            });

        this.shadowCastShader = new BaseFilter(this.game,
            require('shaders/cast-shadow.frag'), {
                uLightColor: {type: '4fv', value: [1, 1, 1, 1.0]}
                , uLightPosition: {type: '2fv', value: [0.5, 0.5]}
                , gameResolution: {type: '2fv', value: [this.game.width, this.game.height]}
                , shaderResolution: {type: '2fv', value: [this.SHADER_SIZE, this.SHADER_SIZE]}
                , iChannel0: {type: 'sampler2D', value: void 0}
            });

        this.renderGroup = new PIXI.Container();
        this.c1 = new PIXI.Graphics();
        this.c1.beginFill(0xFF0000);
        this.c1.drawCircle(80, 40, 10);
        this.c1.endFill();
        this.renderGroup.addChild(this.c1);
        this.c2 = new PIXI.Graphics();
        this.c2.beginFill(0x00FF00);
        this.c2.drawCircle(40, 80, 10);
        this.c2.endFill();
        this.renderGroup.addChild(this.c2);
        this.c3 = new PIXI.Graphics();
        this.c3.beginFill(0x0000FF);
        this.c3.drawCircle(80, 120, 10);
        this.c3.endFill();
        this.renderGroup.addChild(this.c3);
        //this.stage.addChild(this.renderGroup);

        this.sourceRT = new PIXI.RenderTexture(this.game.renderer, this.game.width, this.game.height);
        this.sourceSprite = new PIXI.Sprite(this.sourceRT);
        this.stage.addChild(this.sourceSprite);

        this.shadowMapRT = new PIXI.RenderTexture(this.game.renderer, this.SHADER_SIZE, this.SHADER_SIZE);
        this.shadowMapSprite = new PIXI.Sprite(this.shadowMapRT);
        //this.stage.addChild(this.shadowMapSprite);
        this.shadowMapSprite.filters = [this.shadowTexureShader];

        this.shaderedRT = new PIXI.RenderTexture(this.game.renderer, this.SHADER_SIZE, this.SHADER_SIZE);
        this.shaderedSprite = new PIXI.Sprite(this.shaderedRT);
        this.shaderedSprite.x = 50;
        this.shaderedSprite.y = 50;
        //this.stage.addChild(this.shaderedSprite);
        //this.shadowMapSprite.filters = [this.shadowTexureShader];

        this.lightMapRT = new PIXI.RenderTexture(this.game.renderer, this.game.width, this.game.height);
        //this.lightMapRT.render(this.renderGroup, null, true);
        this.lightMapSprite = new PIXI.Sprite(this.lightMapRT);
        this.stage.addChild(this.lightMapSprite);
        this.lightMapSprite.filters = [this.shadowCastShader];
        //this.lightMapSprite.filters = [this.shadowCastShader, this.shadowMapSprite, this.shadowMapSprite, true);

        //console.log(this.game.renderer.plugins.interaction.mouse.global.x, this.game.renderer.plugins.interaction.mouse.global.y);
        this.shadowTexureShader.uniforms.iChannel0.value = this.sourceRT;
        this.shadowCastShader.uniforms.iChannel0.value = this.shaderedRT;
        window.state = this;

        //let rtarget = new PIXI.RenderTarget(this.game.renderer.gl, 500, 500);
        //console.log(rtarget)

        //debugger;
        //this.shadowTexureShader.applyFilter(this.game.renderer, this.shadowMapRT, this.game.renderer.filterManager.getRenderTarget(true), false);

        //this.shadowMapRT.applyFilter(this.game.renderer, )
    }

    update() {
        this.sourceRT.render(this.renderGroup, null, true);
        this.shaderedRT.render(this.shadowMapSprite, null, true);


        let pointer = this.game.renderer.plugins.interaction.mouse.global;
        this.shadowTexureShader.uniforms.uLightPosition.value[0] = pointer.x;
        this.shadowTexureShader.uniforms.uLightPosition.value[1] = pointer.y;
        this.shadowCastShader.uniforms.uLightPosition.value[0] = pointer.x;
        this.shadowCastShader.uniforms.uLightPosition.value[1] = pointer.y;
        //console.log(this.game.renderer.plugins.interaction.mouse.global.x, this.game.renderer.plugins.interaction.mouse.global.y);
    }
}

export default Test1;