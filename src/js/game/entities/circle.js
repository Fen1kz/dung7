let Graphics = require('game/entities/graphics');
let Draggable = require('engine/mixin/entity/draggable');
let Clickable = require('engine/mixin/entity/clickable');

class Circle extends Graphics {
    constructor(game, x, y, radius, color) {
        super(game, x, y);
        Draggable.mix(this);
        Clickable.mix(this);

        this.color = color;
        this.radius = radius / 10;
        this.change();

        this.on('change', this.change)
    }

    change() {
        this.clear();
        this.beginFill(this.color);
        this.drawCircle(0, 0, 10);
        this.endFill();

        if (this.uLightPosition) {
            this.uLightPosition.value[2] = this.radius;
        }
    }

}

export default Circle;