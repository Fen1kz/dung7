let Graphics = require('game/entities/graphics');
let Draggable = require('engine/mixin/entity/draggable');
let Clickable = require('engine/mixin/entity/clickable');

class Circle extends Graphics {
    constructor(game, x, y, radius, color) {
        super(game, x, y);
        Draggable.mix(this);
        Clickable.mix(this);

        this.color = color;
        this.radius = radius;

        this.falloff = 0;
        this.ambient = .5;
        this.lightSize = .5;
        this.lightRadius = .5;

        this.change();

        this.on('change', this.change)
    }

    change() {
        this.clear();
        this.beginFill(this.color);
        this.drawCircle(0, 0, this.radius);
        this.endFill();

        if (this.uLightPosition) {
            this.uLightColor.value[0] = (this.color >> 0x10) / 255;
            this.uLightColor.value[1] = ((this.color >> 0x8) % 0x100) / 255;
            this.uLightColor.value[2] = (this.color % 0x100) / 255;
            this.uLightColor.value[3] = this.ambient;

            this.uLightPosition.value[2] = this.lightRadius;
            this.uLightPosition.value[3] = this.falloff;
        }
    }

}

export default Circle;