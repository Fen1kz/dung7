let Promise = require('bluebird');

class StateManager {
    constructor(game) {
        this.game = game;
        this.states = {};
    }

    add(name, State) {
        this.states[name] = new State(this.game);

        this.states[name].preload(PIXI.loader);

        if (PIXI.loader._numToLoad > 0) {
            PIXI.loader.load(() => {
                this.states[name].$preloadPromiseResolve();
            });
        } else {
            this.states[name].$preloadPromiseResolve();
        }

        //loader.add('assets/gfx/texture1.png');
        //loader.once('complete', this.start.bind(this));
        //loader.load();
    }

    start(name) {
        this.current = this.states[name];

        this.current.$preloadPromise
            .then(() => {
                this.current.create();
                this.game.loop();
            })
            .catch(console.error.bind(console));
    }
}

export default StateManager;