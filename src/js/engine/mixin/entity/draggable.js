let Mixin = require('engine/mixin/mixin');

class Draggable extends Mixin {
    constructor(target) {
        super(target);
        let self = this;
        target.input.on();
        target.on('mouse.down', (event) => {
            target.input.mouseMove(true);
            target.on('mouse.move', (event) => {
                target.x = event.data.global.x;
                target.y = event.data.global.y;
            });
            target.on('mouse.up', (event) => {
                target.input.mouseMove(false);
            });
        });
    }
}

export default Draggable;