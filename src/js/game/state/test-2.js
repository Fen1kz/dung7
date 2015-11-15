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
        require('engine/mixin/entity/input').mix(this.stage);
        this.stage.on('mouse.down', ($event) => {
            this.pressed = true;
        });
        this.stage.on('mouse.up', ($event) => {
            this.pressed = false;
        });
        this.brushGroup = new PIXI.Container();
        this.stage.addChild(this.brushGroup);
        this.game.on('draw', ($event) => {
            if (!this.brush) {
                $event.currentTarget.classList.add('md-warn');
                $event.currentTarget.innerHTML = 'Draw (ON)';
                this.brush = new Circle(this.game, this.game.width / 2, this.game.height / 2, 5, 0x0);
                this.brushGroup.addChild(this.brush);
                this.stage.input.on();
            } else {
                $event.currentTarget.classList.remove('md-warn');
                $event.currentTarget.innerHTML = 'Draw (OFF)';
                this.brush.destroy();
                this.brush = void 0;
                this.stage.input.off();
            }
        });

        this.SHADER_SIZE = 256;

        this.SMapFilter = new SMapFilter(this.game, {
            gameResolution: {type: '2fv', value: [this.game.width, this.game.height]}
            , shaderResolution: {type: '2fv', value: [0,0]}
            , rtSize: {type: '2fv', value: [1024, 16]}
        }, {
            LIGHTS_COUNT: 8
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
            light.uLightPosition = this.SMapFilter.uniforms[`uLightPosition[${this.lights.length - 1}]`];
            light.uLightColor = this.SMapFilter.uniforms[`uLightColor[${this.lights.length - 1}]`];
            light.change();
            this.stage.addChild(light);
            Selectable.mix(light, {
                type: 'light'
            });
        });
        this.game.on('light.remove', () => {
            let light = this.lights.pop();
            light.uLightPosition.value[2] = 0.0;
            if (light) {
                light.destroy();
            }
        });

        let floorTexture = PIXI.Texture.fromImage('assets/gfx/brickFloor.png');
        this.floor = new PIXI.Sprite(floorTexture, this.game.width, this.game.height);
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

        this.paintRT = new PIXI.RenderTexture(this.game.renderer, this.game.width, this.game.height);
        this.paintSprite = new PIXI.Sprite(this.paintRT);
        //this.stage.addChild(this.paintSprite);

        this.globalRT = new PIXI.RenderTexture(this.game.renderer, this.game.width, this.game.height);
        this.globalSprite = new PIXI.Sprite(this.globalRT);
        this.globalSprite.filters = [this.SMapFilter];
        this.stage.addChild(this.globalSprite);

        this.stage.addChild(this.renderGroup);

        window.state = this;
        this.timer = new Date();

        this.l4 = new Circle(this.game, 200, 200, 10, 0xFFFF00);
        //this.l4.D();
        Selectable.mix(this.l4, {
            type: 'light'
        });
        this.l4.update = () => {
        //    let now = new Date();
        //    let time = (now - this.timer);
        //    this.l4.x = 200 + 80 * Math.cos(-time * 0.05 * Math.PI / 180);
        //    this.l4.y = 200 + 80 * Math.sin(-time * 0.05 * Math.PI / 180);
        };
        this.lights.push(this.l4);
        this.l4.uLightPosition = this.SMapFilter.uniforms[`uLightPosition[0]`];
        this.l4.uLightColor = this.SMapFilter.uniforms[`uLightColor[0]`];
        this.l4.change();
        this.stage.addChild(this.l4);

        this.renderGroup.addChild(this.paintSprite);
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
        //this.SMapFilter.uniforms['uLightPosition[0]'].value[0] = pointer.x;
        //this.SMapFilter.uniforms['uLightPosition[0]'].value[1] = pointer.y;
        this.lights.forEach((light, index) => {
            light.uLightPosition.value[0] = light.x;
            light.uLightPosition.value[1] = light.y;
        });
        //console.log(this.game.renderer.plugins.interaction.mouse.global.x, this.game.renderer.plugins.interaction.mouse.global.y);

        if (this.brush) {
            this.brush.x = pointer.x;
            this.brush.y = pointer.y;
            if (this.pressed) {
                //this.brush.x = 40;
                //this.paintRT.render(this.brush, pointer);
                this.paintRT.render(this.brushGroup);
                //this.paintRT.render(this.brush);
            }
        }
    }
}

export default Test1;