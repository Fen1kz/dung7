function Draggable(target) {
    target.interactive = true;
    target.buttonMode = true;
    //target.anchor.x = 0.5;
    //target.anchor.y = 0.5;
    target.mousedown = target.touchstart = (event) => {
        target.mousemove = target.touchmove = (event) => {
            target.x = event.data.global.x;
            target.y = event.data.global.y;
        };
        target.$dragging = true;
    };
    target.mouseup = target.mouseupoutside = target.touchend = target.touchendoutside = (event) => {
        target.$dragging = false;
        target.mousemove = target.touchmove = void 0;
    };

    target.destroyDraggable = () => {
        delete target.$dragging;
        target.interactive = false;
        target.buttonMode = false;
        target.mousedown = target.touchstart = void 0;
        target.mouseup = target.mouseupoutside = target.touchend = target.touchendoutside = void 0;
        target.mousemove = target.touchmove = void 0;
    };
}

export default Draggable;