let PIXI = require('pixi.js');

class Graphics extends PIXI.Graphics {
    constructor(game, x, y) {
        super();
        this.game = game;
        this.x = x;
        this.y = y;
    }

    destroy() {
        if (this.parent) this.parent.removeChild(this);
    }
}

export default Graphics;