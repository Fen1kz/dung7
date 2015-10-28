let Mixin = require('engine/mixin/mixin');
let Clickable = require('engine/mixin/entity/clickable');

class Selectable extends Mixin {
    constructor(target, data) {
        super(target);
        Clickable.mix(target);
        let self = this;
        this.type = data.type;
        target.on('mouse.click', (event1, event2) => {
            target.game.trigger(`object.selected.${self.type}`, {event1: event1, event2: event2}, target, self.type);
        });
    }
}
export default Selectable;