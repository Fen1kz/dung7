let Graphics = require('game/entities/graphics');
let Draggable = require('engine/core/object-mixins/draggable');
let Selectable = require('engine/core/object-mixins/selectable');
class Circle extends Graphics {
    constructor(game, x, y, r, color) {
        super(game, x, y);
        Draggable.mix(this);
        Selectable.mix(this);

        this.beginFill(color);
        this.drawCircle(0, 0, r);
        this.endFill();
    }
}

export default Circle;