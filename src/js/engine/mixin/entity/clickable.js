let Mixin = require('engine/mixin/mixin');

class Clickable extends Mixin {
    constructor(target) {
        super(target);
        target.input.on();
        target.on('mouse.down', (event1) => {
            let off = target.on('mouse.up', (event2) => {
                target.trigger('mouse.click', event1, event2);
            });
            this.timer = setTimeout(() => {
                off();
            }, 200);
        });
    }
}
export default Clickable;