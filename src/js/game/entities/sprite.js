let PIXI = require('pixi.js');
let Draggable = require('game/entities/mixin.draggable');

class Circle extends Sprite {
    constructor(x, y, r, color) {
        console.log('circle');
    }
}

export default Circle;