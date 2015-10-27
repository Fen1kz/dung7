class Selectable extends Mixin {
    constructor(target) {
        target.input.on();
        target.on('down', (event) => {
            console.log('selected! DOWN')
        });

        target.on('up', (event) => {
            console.log('selected! UP')
        });

        target.destroyDraggable = () => {
            delete target.$dragging;
            target.interactive = false;
            target.buttonMode = false;
            target.mousedown = target.touchstart = void 0;
            target.mouseup = target.mouseupoutside = target.touchend = target.touchendoutside = void 0;
            target.mousemove = target.touchmove = void 0;
        };
    }
}
export default Selectable;