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
        this.change();

        this.on('change', this.change)
    }

    change() {
        this.clear();
        this.beginFill(this.color);
        this.drawCircle(0, 0, this.radius);
        this.endFill();
    }
}

export default Circle;