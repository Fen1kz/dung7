let Mixin = require('engine/mixin/mixin');
let Clickable = require('engine/mixin/entity/clickable');

class Selectable extends Mixin {
    constructor(target, type) {
        super(target);
        Clickable.mix(target);
        this.type = type;
        target.on('mouse.click', (event1, event2) => {
            target.game.trigger(`object.selected.${this.type}`, {event1: event1, event2: event2}, target, type);
        });
    }
}
export default Selectable;