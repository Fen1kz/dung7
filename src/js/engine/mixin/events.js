let Mixin = require('engine/mixin/mixin');

class Events extends Mixin {
    constructor(target) {
        super(target);
        this.$events = {};

        this.target.on = (name, callback) => {
            if (!this.$events[name]) this.$events[name] = [];
            this.$events[name].push(callback);
            return () => {
                this.$events[name].splice(this.$events[name].indexOf(callback), 1);
            }
        };

        this.target.trigger = (name, ...args) => (this.$events[name]
                ? this.$events[name].map(callback => callback.call(this.target, ...args))
                : console.warn(`Target has no event [${name}]`)
        );
    }
}

export default Events;