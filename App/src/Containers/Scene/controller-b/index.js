// dependencies
import { LazyBrush } from 'lazy-brush';

const midPointBtw = (p1, p2) => ({
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
});

/**
 * This controls the Scene.
 * We need multiple canvases so we don't have to keep redrawing things like the
 * grid. We will have a canvas for:
 *
 *      - Grid: renders a bunch of grid squares to aid the user in designing the
 *      scene
 *
 *      - Main: renders the main scene the user is drawing.
 *
 *      - Temp: Shows the current line the user is actively drawing. When the
 *      user finishes the active brush, it will be copied to the 'Main' canvas
 *      and then removed from the 'Temp' canvas.
 */
class SceneController {
    constructor(canvasContainer) {
        const canvasList = ['Main', 'Grid', 'Temp', 'UI'];

        // state
        this.state = {
            isDrawing    : false,
            isPressing   : false,
            mouseHasMoved: false,
            valuesChanged: false,
        };

        // props
        this.props = {
            padding    : 100,
            gridBoxSize: 25,
            isDebug    : true,
            lazyRadius : 80,
            brushRadius: 10,
            colorDebug : '#FF44B1',
            colorBrush : '#043EC7',
            colorInk   : '#0799EE',
        };

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

        this.points = [];

        this.mapSize = Math.min(this.canvasWidth, this.canvasHeight) - (this.props.padding * 2);
        this.position0 = [
            (this.canvasWidth - this.mapSize) * 0.5,
            (this.canvasHeight - this.mapSize) * 0.5,
        ];

        // brush
        this.brush = new LazyBrush({
            radius      : this.props.lazyRadius,
            enabled     : true,
            initialPoint: {
                x: this.canvasWidth / 2,
                y: this.canvasHeight / 2,
            },
        });

        this.init();
    }

    init() {
        this.drawGrid();

        this.canvases.UI.addEventListener('mousedown', this.handlePointerDown.bind(this));
        this.canvases.UI.addEventListener('mouseup', this.handlePointerUp.bind(this));
        this.canvases.UI.addEventListener('mousemove', e => this.handlePointerMove(e.clientX, e.clientY));
        // canvas.addEventListener('contextmenu', e => this.handleContextMenu(e));

        this.loop();

        window.setTimeout(() => {
            const initX = window.innerWidth / 2;
            const initY = window.innerHeight / 2;

            this.brush.update({ x: initX - (this.props.lazyRadius / 4), y: initY }, { both: true });
            this.brush.update({ x: initX + (this.props.lazyRadius / 4), y: initY }, { both: false });

            this.state.mouseHasMoved = true;
            this.state.valuesChanged = true;

            this.clearCanvas();
        }, 100);
    }

    loop({ once = false } = {}) {
        if (this.state.mouseHasMoved || this.state.valuesChanged) {
            const pointer = this.brush.getPointerCoordinates();
            const brush = this.brush.getBrushCoordinates();

            this.drawInterface(pointer, brush);
            this.state.mouseHasMoved = false;
            this.state.valuesChanged = false;
        }

        if (!once) {
            window.requestAnimationFrame(() => {
                this.loop();
            });
        }
    }

    clearCanvas() {
        this.state.valuesChanged = true;
        this.contexts.Main.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.contexts.Temp.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    handlePointerMove(x, y) {
        const hasChanged = this.brush.update({ x, y });
        const isDisabled = !this.brush.isEnabled();

        // styles
        this.contexts.Temp.lineJoin = 'round';
        this.contexts.Temp.lineCap = 'round';
        this.contexts.Temp.strokeStyle = this.props.colorInk;

        if ((this.state.isPressing && hasChanged && !this.state.isDrawing) || (isDisabled && this.state.isPressing)) {
            this.state.isDrawing = true;
            this.points.push(this.brush.brush.toObject());
        }

        if (this.state.isDrawing && (this.brush.brushHasMoved() || isDisabled)) {
            this.contexts.Temp.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.contexts.Temp.lineWidth = this.props.brushRadius * 2;
            this.points.push(this.brush.brush.toObject());

            let p1 = this.points[0];
            let p2 = this.points[1];

            this.contexts.Temp.moveTo(p2.x, p2.y);
            this.contexts.Temp.beginPath();

            for (let i = 1, len = this.points.length; i < len; i++) {
                // we pick the point between pi+1 & pi+2 as the
                // end point and p1 as our control point
                const midPoint = midPointBtw(p1, p2);
                this.contexts.Temp.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                p1 = this.points[i];
                p2 = this.points[i + 1];
            }

            // Draw last line as a straight line while
            // we wait for the next point to be able to calculate
            // the bezier control point
            this.contexts.Temp.lineTo(p1.x, p1.y);
            this.contexts.Temp.stroke();
        }

        this.state.mouseHasMoved = true;
    }

    handlePointerDown(e) {
        e.preventDefault();

        this.state.isPressing = true;
    }

    handlePointerUp(e) {
        e.preventDefault();

        this.state.isDrawing = false;
        this.state.isPressing = false;
        this.points.length = 0;

        const dpi = window.innerWidth > 1024 ? 1 : window.devicePixelRatio;
        const width = this.canvases.Temp.width / dpi;
        const height = this.canvases.Temp.height / dpi;

        // this.contexts.Main.drawImage(this.canvases.Temp, 0, 0, width, height);
        this.contexts.Temp.clearRect(0, 0, width, height);
    }

    drawGrid() {
        const { contexts, props, mapSize, position0 } = this;
        const { gridBoxSize } = props;

        const context = contexts.Grid;
        context.clearRect(0, 0, mapSize, mapSize);

        // draw grass
        context.fillStyle = '#85D853';
        context.fillRect(position0[0], position0[1], this.mapSize, this.mapSize);

        // If debug, draw the corners of the grid
        if (this.props.isDebug) {
            context.fillStyle = this.props.colorDebug;

            context.fillRect(position0[0] - 2, position0[1] - 2, 5, 5);
            context.fillRect(position0[0] + mapSize - 2, position0[1] - 2, 5, 5);
            context.fillRect(position0[0] - 2, position0[1] + mapSize - 2, 5, 5);
            context.fillRect(position0[0] + mapSize - 2, position0[1] + mapSize - 2, 5, 5);
        }

        context.beginPath();
        context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        context.lineWidth = 0.5;

        /** DRAW GRID */
        // vertical lines
        let countX = position0[0];
        while (countX < mapSize + position0[0] + gridBoxSize) {
            context.moveTo(countX, position0[1]);
            context.lineTo(countX, mapSize + position0[1]);
            countX += gridBoxSize;
        }
        context.stroke();

        // horizontal lines
        let countY = position0[1];
        while (countY < mapSize + position0[1] + gridBoxSize) {
            context.moveTo(position0[0], countY);
            context.lineTo(mapSize + position0[0], countY);
            countY += gridBoxSize;
        }
        context.stroke();
    }

    drawInterface(pointer, brush) {
        const context = this.contexts.UI;

        context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // debug stuff
        if (this.props.isDebug) {
            context.fillStyle = this.props.colorDebug;
            context.fillText(`[${brush.x}, ${brush.y}]`, 10, 15);
        }

        // Draw the brush point
        context.beginPath();
        context.fillStyle = this.props.colorBrush;
        context.arc(brush.x, brush.y, this.props.brushRadius, 0, Math.PI * 2, true);
        context.fill();
    }
}

export default SceneController;
