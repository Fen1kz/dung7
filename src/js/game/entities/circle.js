let Graphics = require('game/entities/graphics');
let Draggable = require('game/entities/mixin.draggable');

class Circle extends Graphics {
    constructor(game, x, y, r, color) {
        super(game, x, y);
        Draggable(this);

        this.beginFill(color);
        this.drawCircle(0, 0, r);
        this.endFill();
    }
}

export default Circle;