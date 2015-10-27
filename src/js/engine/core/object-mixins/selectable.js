let Mixin = require('engine/core/mixin');
let Clickable = require('engine/core/object-mixins/clickable');

class Selectable extends Mixin {
    constructor(target) {
        super(target);
        Clickable.mix(target);
        target.on('mouse.click', () => {
            target.game.trigger('object.selected', target);
        });
    }
}
export default Selectable;