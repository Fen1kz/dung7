let PIXI = require('pixi.js');

class D7Game {
    constructor() {
        this.width = 512;
        this.height = 512;
        this.renderer = new PIXI.WebGLRenderer(this.width, this.height, {backgroundColor: 0x1099bb});
        //this.renderer = new PIXI.CanvasRenderer(400, 300, {backgroundColor: 0x1099bb});
        this.state = new (require('engine/StateManager'))(this);

        this.$events = {}
        this.events = {
            on: (name, callback) => {
                if (!this.$events[name]) this.$events[name] = [];
                this.$events[name].push(callback);
            }
            , trigger: (name, ...args) => {
                return (this.$events[name]
                    ? this.$events[name].map(callback => callback.apply(null, ...args))
                    : console.warn(`Game has no event [${name}]`));
            }
        }
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