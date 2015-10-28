let _ = require('lodash');
let Mixin = require('engine/mixin/mixin');

const createEventChain = (obj, index, array) => {
    let property = array[index];
    if (!obj[property]) {
        obj[property] = {
            callbacks: []
        }
    }
    if (index < array.length - 1) {
        obj[property] = createEventChain(obj[property], ++index, array);
    }
    return obj;
};

class Events extends Mixin {
    constructor(target) {
        super(target);
        this.$events = {};

        this.target.on = (name, callback) => {
            let names = name.split('.');
            this.$events = createEventChain(this.$events, 0, names);
            let data = _.get(this.$events, name);
            data.callbacks.push(callback);
            return () => {
                data.callbacks.splice(data.callbacks.indexOf(callback), 1);
            }
        };

        this.target.trigger = (name, ...args) => {
            let names = name.split('.');
            let stop = false;
            while (names.length > 0 && !stop) {
                let data = _.get(this.$events, names);
                //if (!data) console.warn(`Target has no event [${name}]`);
                if (data) {
                    stop = !data.callbacks.every(callback => false !== callback.call(this.target, ...args));
                }
                names.pop();
            }
        }
    }
}

export default Events;