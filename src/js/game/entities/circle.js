let Sprite = require('game/entities/sprite');
let Draggable = require('game/entities/mixin.draggable');

class Circle extends Sprite {
    constructor(x, y, r, color) {
        console.log('circle');
    }
}

export default Circle;