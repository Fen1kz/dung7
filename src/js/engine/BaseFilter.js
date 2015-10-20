let PIXI = require('pixi.js');

class BaseFilter extends PIXI.AbstractFilter {
    constructor(game, fragmentSrc, uniforms) {
        super(null, fragmentSrc, uniforms);
        this.game = game;
    }
}

export default BaseFilter;