export default class CloudGenerator {
    constructor(width, height, fluctuation, radius, holeTreshold) {
        // Assertion
        if (width % 2 == 0) { throw new Error(`Only odd width is allowed.`) }
        if (height % 2 == 0) { throw new Error(`Only odd height is allowed.`) }
        
        // Settings props from args
        this.width = width;
        this.height = height;
        this.fluctuation = fluctuation;
        this.renderRadius = radius;
        this.holeTreshold = holeTreshold;

        // Calculated props
        this.renderDotDiameter = 2 * radius;
        this.center = Math.ceil(this.width / 2);
        this.renderWidth = this.width * this.renderDotDiameter;
        this.renderHeight = this.height * this.renderDotDiameter;
        this.points = [];
        this.holes = []; // {x1, x2, y}[]
    }

    /**
     * Generate points for the left and right side while balance distance
     * between sides.
     */
    generatePoints() {
        let last;

        // Left side (from top to bottom)
        for (let i = 0; i < this.height; i++) {
            const point = {
                x: 1 + Math.round(Math.random() * this.fluctuation) * (i % 2 ? 1 : -1),
                y: i
            };

            this.points.push(point);
            last = point;
        }

        last = null;
        // Right side (from bottom to top)
        for (let i = this.height - 1; i >= 0; i--) {
            const point = {
                x: this.width - Math.round(Math.random() * this.fluctuation) * (i % 2 ? 1 : -1),
                y: i
            };
            const left = this.points.find(item => item.y == point.y);
            point.x = Math.max(left.x + 2, point.x);

            this.points.push(point);
            last = point;
        }

        last;
    }

    /**
     * Finds complete solid parts of the matrix and puts holes into it based on the
     * hole treshold value.
     * Holes will be at least one row away from eachother.
     */
    generateCutouts() {
        // Go through each lines except top and bottom lines.
        // Skipping line if previous line has hole already
        for (let i = 1; i < this.height - 1; i++) {
            if (this.holes[i-1]) { continue; }

            const prev = this.getLineBoundaries(i-1);
            const next = this.getLineBoundaries(i+1);
            const line = this.getLineBoundaries(i);
            const space = Math.abs(line.right.x - line.left.x);

            if (space < this.holeTreshold) { continue; }

            let trialSlots = Array.from(Array(space - this.holeTreshold).keys());
            trialSlots = this.shuffle(trialSlots);

            for (let slot of trialSlots) {
                const y = line.left.y;
                const xLeft = line.left.x + slot;
                const xRight = xLeft + this.holeTreshold;

                if (xLeft <= Math.max(prev.left.x, next.left.x, line.left.x) + 1) { continue; }
                if (xRight >= Math.min(prev.right.x, next.right.x, line.right.x) - 1) { continue; }
                
                this.holes[y] = {x1: xLeft, x2: xRight, y};
                break;
            }
        }
    }

    /**
     * Return boundary elements of a row, y
     * @param {number} y 
     */
    getLineBoundaries(y) {
        let result = {};
        [result.left, result.right] = this.points.filter(point => point.y == y);
        return result;
    }

    /**
     * Returns pen down command for drawing svg path for render matrix.
     * @param {number} x 
     * @param {number} y 
     */
    pathPenDown(x, y) {
        const d = this.renderDotDiameter;
        return `M ${(x+.5) * d} ${(y+.5) * d}`;
    }

    /**
     * Returns line drawing command towards a coordinate for svg path for render matrix.
     * @param {number} x 
     * @param {number} y 
     */
    pathLineTo(x, y) {
        const d = this.renderDotDiameter;
        return `L ${(x+.5) * d} ${(y+.5) * d}`;
    }

    /**
     * Returns beizer curve command towards a coordinate for svg path for render matrix.
     * @param {number} aX 
     * @param {number} aY 
     * @param {number} bX 
     * @param {number} bY 
     * @param {number} exitX 
     * @param {number} exitY 
     */
    pathCurve(aX, aY, bX, bY, exitX, exitY) {
        const d = this.renderDotDiameter;
        return `C ${(aX+.5)*d} ${(aY+.5)*d}, ${(bX+.5)*d}, ${(bY+.5)*d}, ${(exitX+.5)*d} ${(exitY+.5)*d}`;
    }

    /**
     * Generates path for a ricle
     * @param {number} centerX 
     * @param {number} centerY 
     */
    pathCircle(centerX, centerY) {
        const x = centerX + .5, y = centerY + .5;
        const d = this.renderDotDiameter;
        let result = `M ${x*d} ${(y-.5)*d} `;
        result += `Q ${(x+.5)*d} ${(y-.5)*d} ${(x+.5)*d} ${y*d} `; // Top right
        result += `Q ${(x+.5)*d} ${(y+.5)*d} ${x*d} ${(y+.5)*d} `; // Bottom right
        result += `Q ${(x-.5)*d} ${(y+.5)*d} ${(x-.5)*d} ${y*d} `; // Bottom left
        result += `Q ${(x-.5)*d} ${(y-.5)*d} ${x*d} ${(y-.5)*d} `; // Top left
        return result + 'Z';
    }

    /**
     * Generates the outline path for the cloud
     * @return {array}
     */
    getShapePath() {
        let path = [];
        path.push(this.pathPenDown(this.center, -.5));

        let last;
        for (let i = 0; i < this.points.length; i++) {
            const current = this.points[i];
            const next = this.points[i+1];

            const hasNext = !!next;
            // const isTop = i == 0 || (i + 1 == this.height);
            // const isBottom = i + 1 == this.height || i == this.height;
            // const isInMid = !isTop && !isBottom;
            const isOnLeft = current.x < this.center || (hasNext && next.x < this.center);

            const entry = {x: current.x, y: current.y + (isOnLeft ? -.5 : .5)};
            const exit  = {x: current.x, y: current.y + (isOnLeft ? .5 : -.5)};

            path.push(this.pathLineTo(entry.x, entry.y));

            // Concave and Convex elements
            let handleA, handleB;
            if (isOnLeft) {
                if (current.y % 2) {
                    handleA = { x: current.x + .75, y: current.y - .5 };
                    handleB = { x: current.x + .75, y: current.y + .5 };
                } else {
                    handleA = { x: current.x - .75, y: current.y - .5 };
                    handleB = { x: current.x - .75, y: current.y + .5 };
                }
            } else if (!isOnLeft) {
                if (current.y % 2) {
                    handleA = { x: current.x - .75, y: current.y + .5 };
                    handleB = { x: current.x - .75, y: current.y - .5 };
                } else {
                    handleA = { x: current.x + .75, y: current.y + .5 };
                    handleB = { x: current.x + .75, y: current.y - .5 };
                }
            }

            // Squery corners:
            // path.push(this.pathLineTo(exit.x, exit.y));
            // Curvy clouds
            path.push(this.pathCurve(handleA.x, handleA.y, handleB.x, handleB.y, exit.x, exit.y));

            last = {x: current.x, y: current.y};
        }

        last;
        path.push('Z');
        return path;
    }

    /**
     * Finds complete solid parts of the matrix and puts holes into it based on the
     * hole treshold value.
     * Holes will be at least one row away from eachother.
     */
    getCutoutsPaths() {
        let path = [];

        for (let hole of this.holes) {
            if (this.holeTreshold == 1) {
                path.push(this.pathCircle(hole.x1, hole.y));
            } else {
                path.push(this.pathPenDown(hole.x1, hole.y - .5));
                path.push(this.pathLineTo(hole.x2, hole.y - .5));
                path.push(this.pathCurve(hole.x2 + .75, hole.y - .5, hole.x2 + .75, hole.y + .5, hole.x2, hole.y + .5));
                path.push(this.pathLineTo(hole.x1, hole.y + .5));
                path.push(this.pathCurve(hole.x1 - .75, hole.y + .5, hole.x1 - .75, hole.y - .5, hole.x1, hole.y - .5));
                path.push('Z');
            }
        }

        return path;
    }

    /**
     * Putting together parts of the cloud parts
     */
    render() {
        return this.getShapePath()
            .concat(this.getCutoutsPaths())
            .join(" \n");
    }

    /**
     * Thanks JS.
     * @param {number} a 
     * @param {number} b 
     */
    cp(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    /**
     * Fisher-yates shuffle algo
     * @param {*} a 
     */
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}