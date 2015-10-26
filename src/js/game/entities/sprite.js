let PIXI = require('pixi.js');

class Sprite extends PIXI.Sprite {
    constructor(game, x, y) {
        super();
        this.game = game;
        this.x = x;
        this.y = y;
        //this.init();
        console.log('Sprite');
    }
}

export default Sprite;