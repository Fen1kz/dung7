let PIXI = require('pixi.js');
let State = require('engine/State');

let BaseFilter = require('engine/BaseFilter');
let SMapFilter = require('engine/SMapFilter');

class Test1 extends State {
    preload(loader) {
        loader.add('assets/gfx/texture1.png');
        loader.add('assets/gfx/mansionNormals.png');
    }

    create() {
        this.mansion = PIXI.Sprite.fromImage('assets/gfx/texture1.png');

        this.SHADER_SIZE = 256;

        this.SMapFilter = new SMapFilter(this.game, {
            uLightColor: {type: '4fv', value: [1, 1, 1, 1.0]}
            , uLightPosition: {type: '2fv', value: [0.5, 0.5]}
            , gameResolution: {type: '2fv', value: [this.game.width, this.game.height]}
            , shaderResolution: {type: '2fv', value: [this.SHADER_SIZE, this.SHADER_SIZE]}
            , rtResolution: {type: '2fv', value: [this.SHADER_SIZE, 2]}
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

        this.c4 = new PIXI.Graphics();
        this.c4.beginFill(0x00FFFF);
        this.c4.drawCircle(80, 120, 10);
        this.c4.endFill();
        this.renderGroup.addChild(this.c4);

        this.stage.addChild(this.renderGroup);

        this.lightMapRT = new PIXI.RenderTexture(this.game.renderer, this.game.width, this.game.height);
        this.lightMapSprite = new PIXI.Sprite(this.lightMapRT);
        this.stage.addChild(this.lightMapSprite);
        this.lightMapSprite.filters = [this.SMapFilter];

        window.state = this;
        this.timer = new Date();

        this.l4 = new PIXI.Graphics();
        this.l4.beginFill(0xFFFF00);
        this.l4.drawCircle(80, 120, 10);
        this.l4.endFill();
        this.stage.addChild(this.l4);
    }

    update() {
        let now = new Date();
        let time = (now - this.timer);
        this.c4.x = 200 + 100 * Math.cos(time * 0.1 * Math.PI / 180);
        this.c4.y = 200 + 100 * Math.sin(time * 0.1 * Math.PI / 180);
        this.l4.x = 120 + 80 * Math.cos(-time * 0.1 * Math.PI / 180);
        this.l4.y = 120 + 80 * Math.sin(-time * 0.1 * Math.PI / 180);

        let pointer = this.game.renderer.plugins.interaction.mouse.global;
        this.SMapFilter.uniforms.uLightPosition.value[0] = pointer.x;
        this.SMapFilter.uniforms.uLightPosition.value[1] = pointer.y;
        this.lightMapRT.render(this.renderGroup, null, true);

        this.SMapFilter.update();
        //console.log(this.game.renderer.plugins.interaction.mouse.global.x, this.game.renderer.plugins.interaction.mouse.global.y);
    }
}

export default Test1;