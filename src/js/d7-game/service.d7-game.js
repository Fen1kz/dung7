let angular = require('angular');
let Game = require('engine/game');

D7Game.$inject = ['$window'];
function D7Game($window) {
    return {
        init: (ngScope, element) => {
            this.game = new Game(800, 600, {backgroundColor: 0x1099bb});
            angular.element(element[0].querySelector('#canvas')).append(this.game.renderer.view);

            this.game.state.add('test1', require('game/state/test-2'));
            this.game.state.start('test1');

            return this.game;
        }
    }
}

export default D7Game;