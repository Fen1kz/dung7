let PIXI = require('pixi.js');
let Events = require('engine/core/events');

class D7Game {
    constructor() {
        this.width = 512;
        this.height = 512;
        this.renderer = new PIXI.WebGLRenderer(this.width, this.height, {backgroundColor: 0x1099bb});
        //this.renderer = new PIXI.CanvasRenderer(400, 300, {backgroundColor: 0x1099bb});
        this.state = new (require('engine/StateManager'))(this);

        Events.mix(this);
    }

    load(name, url) {
        url = url || name;
        this.loaders.Loader.add(name, url)
    }

    loop() {
        let game = this;
        (this.$loop = (() => {
            game.state.current.update();
            game.renderer.render(game.state.current.stage);
            window.requestAnimationFrame(this.$loop);
        }).bind(this))();
    }
}

export default D7Game;