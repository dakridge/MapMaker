import drawLines from './drawLines';
import getCurvePoints from './getCurvePoints';

const drawCurve = (ctx, ptsa, tension, isClosed, numOfSegments, showPoints = true) => {
    ctx.beginPath();

    drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

    if (showPoints) {
        ctx.stroke();
        ctx.beginPath();

        for (let ii = 0; ii < ptsa.length - 1; ii += 2) {
            ctx.rect(ptsa[ii] - 2, ptsa[ii + 1] - 2, 4, 4);
        }
    }
};

export default drawCurve;
