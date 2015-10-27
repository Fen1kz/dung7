let Graphics = require('game/entities/graphics');
let Draggable = require('engine/mixin/entity/draggable');
let Clickable = require('engine/mixin/entity/clickable');

class Circle extends Graphics {
    constructor(game, x, y, r, color) {
        super(game, x, y);
        Draggable.mix(this);
        Clickable.mix(this);

        this.beginFill(color);
        this.drawCircle(0, 0, r);
        this.endFill();
    }
}

export default Circle;