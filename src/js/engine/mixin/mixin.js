class Mixin {
    constructor(target) {
        let name = this.constructor.getName();
        if (target.mixins[name]) {
            throw 'Mixin already exists!'
        }
        target.mixins[name] = this;

        this.target = target;
    }

    static getName () {
        return this.name.toLowerCase();
    }

    static mix(target, ...args) {
        let name = this.getName();

        if (!target.mixins) {
            target.mixins = {};
        }

        if (target.mixins[name]) {
            return target.mixins[name];
        } else {
            return new this(target, ...args);
        }
    }

    destroy() {
        delete this.target.mixins[this.constructor.getName()];
        delete this.target;
    }
}
export default Mixin;