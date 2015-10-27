let PIXI = require('pixi.js');
let Events = require('engine/core/events');
let ObjectInput = require('engine/core/object.input');


class Graphics extends PIXI.Graphics {
    constructor(game, x, y) {
        super();
        this.game = game;
        this.x = x;
        this.y = y;
        Events.mix(this);
        ObjectInput.mix(this);
    }

    destroy() {
        this.events.fire('destroy');
        if (this.parent) this.parent.removeChild(this);
    }
}

export default Graphics;