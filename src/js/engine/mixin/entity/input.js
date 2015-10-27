let Mixin = require('engine/mixin/mixin');

class Input extends Mixin {
    constructor(target) {
        super(target);
        //Events.mix()
        target.input = this;
    }

    on() {
        if (!this.target.interactive) {
            this.target.interactive = true;
            this.target.buttonMode = true;
            this.target.mousedown = this.target.touchstart = (event) => {
                this.target.trigger('mouse.down', event);
            };
            //this.target.mousemove = this.target.touchmove = (event) => {
            //    this.target.trigger('mouse.move', event);
            //};
            this.target.mouseup = this.target.mouseupoutside = this.target.touchend = this.target.touchendoutside = (event) => {
                this.target.trigger('mouse.up', event);
            };
        }
    }

    mouseMove(enable) {
        this.target.mousemove = this.target.touchmove = (enable
            ? (event) => this.target.trigger('mouse.move', event)
            : void 0);
    }

    destroy() {
        super.destroy();
        delete this.target.input;
    }
}

export default Input;