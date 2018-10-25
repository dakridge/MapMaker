import drawCurve from './utils/drawCurve';

class MapController {
    constructor(canvasContainer) {
        const canvasList = ['Main'];

        this.canvases = {};
        this.contexts = {};
        this.canvasWidth = canvasContainer.getBoundingClientRect().width;
        this.canvasHeight = canvasContainer.getBoundingClientRect().height;

        // generate our canvases
        canvasList.forEach((name) => {
            this.canvases[name] = document.createElement('canvas');
            this.canvases[name].width = this.canvasWidth;
            this.canvases[name].height = this.canvasHeight;
            this.canvases[name].classList.add(`${name}`);

            canvasContainer.append(this.canvases[name]);
            this.contexts[name] = this.canvases[name].getContext('2d');
        });

        // state
        this.state = {
            lastX         : 0,
            lastY         : 0,
            isMousePressed: false,
        };

        this.init();
    }

    draw(x, y, isDown) {
        const { lastX, lastY } = this.state;

        const ctx = this.contexts.Main;

        if (isDown) {
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 4;
            ctx.lineJoin = 'round';
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }

        this.state.lastX = x;
        this.state.lastY = y;
    }

    init() {
        const canvas = this.canvases.Main;
        const ctx = this.contexts.Main;

        canvas.addEventListener('mousemove', (e) => {
            const y = e.clientY - canvas.offsetTop;
            const x = e.clientX - canvas.offsetLeft;

            if (this.state.isMousePressed) {
                this.draw(x, y, true);
            }
        }, false);

        canvas.addEventListener('mousedown', (e) => {
            const y = e.clientY - canvas.offsetTop;
            const x = e.clientX - canvas.offsetLeft;

            this.state.isMousePressed = true;
            this.draw(x, y, false);
        }, false);

        canvas.addEventListener('mouseup', () => {
            this.state.isMousePressed = false;
        }, false);

        canvas.addEventListener('mouseout', () => {
            this.state.isMousePressed = false;
        }, false);

        // const tension = 1;
        // const myPoints = [10, 10, 40, 30, 100, 10, 200, 100, 200, 50, 250, 120];
        // drawCurve(ctx, myPoints, tension);
    }
}

export default MapController;
