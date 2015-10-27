let PIXI = require('pixi.js');
let State = require('engine/State');
let Selectable = require('engine/mixin/entity/selectable');

let BaseFilter = require('engine/BaseFilter');
let SMapFilter = require('engine/SMapFilter');

let Circle = require('game/entities/circle');


class Test1 extends State {
    preload(loader) {
        loader.add('assets/gfx/texture1.png');
        loader.add('assets/gfx/brickFloor.png');
    }

    create() {
        this.SHADER_SIZE = 256;

        this.SMapFilter = new SMapFilter(this.game, {
            gameResolution: {type: '2fv', value: [this.game.width, this.game.height]}
            , shaderResolution: {type: '2fv', value: [this.SHADER_SIZE, this.SHADER_SIZE]}
            , rtResolution: {type: '2fv', value: [this.SHADER_SIZE, 64]}
        }, {
            LIGHTS_COUNT: 64
        });

        let spheres = [];
        this.game.on('sphere.add', () => {
            let sphere = new Circle(this.game, this.game.width / 2, this.game.height / 2, 10, Math.random() * 0xFFFFFF);
            spheres.push(sphere);
            this.renderGroup.addChild(sphere);
        });
        this.game.on('sphere.remove', () => {
            let sphere = spheres.pop();
            if (sphere) {
                sphere.destroy();
            }
        });
        this.lights = [];
        this.game.on('light.add', () => {
            let light = new Circle(this.game, this.game.width / 2, this.game.height / 2, 10, 0xFFFF00);
            this.lights.push(light);
            this.stage.addChild(light);
            Selectable.mix(light, {
                type: 'light'
            });
            this.SMapFilter.uniforms[`uLightColor[${this.lights.length}]`].value[3] = 1;
        });
        this.game.on('light.remove', () => {
            this.SMapFilter.uniforms[`uLightColor[${this.lights.length}]`].value[3] = 0.0;
            let light = this.lights.pop();
            if (light) {
                light.destroy();
            }
        });

        this.floor = PIXI.Sprite.fromImage('assets/gfx/brickFloor.png');
        this.stage.addChild(this.floor);

        this.renderGroup = new PIXI.Container();

        this.c1 = new Circle(this.game, 80, 40, 10, 0xFF0000);
        spheres.push(this.c1);
        this.renderGroup.addChild(this.c1);

        this.c2 = new Circle(this.game, 40, 80, 10, 0x00FF00);
        spheres.push(this.c2);
        this.renderGroup.addChild(this.c2);

        this.c3 = new Circle(this.game, 80, 120, 10, 0x0000FF);
        spheres.push(this.c3);
        this.renderGroup.addChild(this.c3);

        this.c4 = new Circle(this.game, 80, 120, 10, 0x00FFFF);
        spheres.push(this.c4);
        //this.c4.destroyDraggable();
        this.renderGroup.addChild(this.c4);


        this.globalRT = new PIXI.RenderTexture(this.game.renderer, this.game.width, this.game.height);
        this.globalSprite = new PIXI.Sprite(this.globalRT);
        this.globalSprite.filters = [this.SMapFilter];
        this.stage.addChild(this.globalSprite);

        this.stage.addChild(this.renderGroup);

        window.state = this;
        this.timer = new Date();

        this.l4 = new Circle(this.game, 0, 0, 10, 0xFFFF00);
        //this.l4.D();
        this.l4.update = () => {
            let now = new Date();
            let time = (now - this.timer);
            this.l4.x = 200 + 80 * Math.cos(-time * 0.05 * Math.PI / 180);
            this.l4.y = 200 + 80 * Math.sin(-time * 0.05 * Math.PI / 180);
        };
        this.lights.push(this.l4);
        this.stage.addChild(this.l4);
    }

    update() {
        let now = new Date();
        let time = (now - this.timer);
        if (this.l4) this.l4.update();
        this.c4.x = 200 + 100 * Math.cos(time * 0.05 * Math.PI / 180);
        this.c4.y = 200 + 100 * Math.sin(time * 0.05 * Math.PI / 180);

        this.globalRT.render(this.stage, null, true);
        this.SMapFilter.render(this.renderGroup);

        let pointer = this.game.renderer.plugins.interaction.mouse.global;
        this.SMapFilter.uniforms['uLightPosition[0]'].value[0] = pointer.x;
        this.SMapFilter.uniforms['uLightPosition[0]'].value[1] = pointer.y;
        this.lights.forEach((light, index) => {
            this.SMapFilter.uniforms[`uLightPosition[${index + 1}]`].value[0] = light.x;
            this.SMapFilter.uniforms[`uLightPosition[${index + 1}]`].value[1] = light.y;
        });
        //console.log(this.game.renderer.plugins.interaction.mouse.global.x, this.game.renderer.plugins.interaction.mouse.global.y);
    }
}

export default Test1;