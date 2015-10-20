let PIXI = require('pixi.js');
let Promise = require('bluebird');

class State {
    constructor(game) {
        this.game = game;
        this.stage = new PIXI.Container();
        this.$preloadPromise = new Promise((resolve, reject) => {
            this.$preloadPromiseResolve = resolve;
            this.$preloadPromiseReject = resolve;
        });
    }

    preload() {

    }

    create() {

    }

    update() {

    }

    render() {

    }
}

export default State;