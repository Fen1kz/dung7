let Mixin = require('engine/mixin/mixin');
let Events = require('engine/mixin/events');

class Input extends Mixin {
    constructor(target) {
        super(target);
        Events.mix(target);
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

    off() {
        if (this.target.interactive) {
            this.target.interactive = false;
            this.target.buttonMode = false;
            this.target.mousedown = this.target.touchstart = void 0;
            this.target.mousemove = this.target.touchmove = void 0;
            this.target.mouseup = this.target.mouseupoutside = this.target.touchend = this.target.touchendoutside = void 0;
        }
    }

    mouseMove(enable) {
        this.target.mousemove = this.target.touchmove = (enable
            ? (event) => this.target.trigger('mouse.move', event)
            : void 0);
    }

    destroy() {
        this.off();
        delete this.target.input;
        super.destroy();
    }
}

export default Input;