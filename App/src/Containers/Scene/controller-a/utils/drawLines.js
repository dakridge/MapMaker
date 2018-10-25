const drawLines = (ctx, pts) => {
    ctx.moveTo(pts[0], pts[1]);

    for (let ii = 2; ii < pts.length - 1; ii += 2) {
        ctx.lineTo(pts[ii], pts[ii + 1]);
    }
};

export default drawLines;
