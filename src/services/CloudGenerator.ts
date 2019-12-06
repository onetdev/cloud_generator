import _ from 'lodash';

interface Coordinate {
  x: number;
  y: number;
}

interface Hole {
  x1: number;
  x2: number;
  y: number;
}

interface Line {
  left: Coordinate;
  right: Coordinate;
}

export interface CloudGeneratorConfig {
  width: number;
  height: number;
  fluctuation: number;
  renderRadius: number;
  holeTreshold: number;
}

/**
 * Class that reponsible for mapping the cloud points to a actual render grid.
 */
class RenderMapper {
  config: CloudGeneratorConfig;
  dotDiameter: number;
  totalWidth: number;
  totalHeight: number;

  constructor(config: CloudGeneratorConfig) {
    this.config = config;
    this.dotDiameter = 2 * this.config.renderRadius;
    this.totalWidth = this.config.width * this.dotDiameter;
    this.totalHeight = this.config.height * this.dotDiameter;
  }

  /**
   * Returns pen down command for drawing svg path for render matrix.
   * @param {number} x
   * @param {number} y
   * @returns {string}
   */
  pathPenDown(x: number, y: number): string {
    const d = this.dotDiameter;
    return `M ${(x + 0.5) * d} ${(y + 0.5) * d}`;
  }

  /**
   * Returns line drawing command towards a coordinate for svg path for render matrix.
   * @param {number} x
   * @param {number} y
   * @returns {string}
   */
  pathLineTo(x: number, y: number): string {
    const d = this.dotDiameter;
    return `L ${(x + 0.5) * d} ${(y + 0.5) * d}`;
  }

  /**
   * Returns Bezier curve command towards a coordinate including two control points
   * @param {number} aX
   * @param {number} aY
   * @param {number} bX
   * @param {number} bY
   * @param {number} exitX
   * @param {number} exitY
   * @returns {string}
   */
  pathCurve(aX: number, aY: number, bX: number, bY: number, exitX: number, exitY: number): string {
    const d = this.dotDiameter;
    let result = 'C ';
    result += `${(aX + 0.5) * d} ${(aY + 0.5) * d}, `; // Handle A
    result += `${(bX + 0.5) * d}, ${(bY + 0.5) * d}, `; // Handle B
    result += `${(exitX + 0.5) * d} ${(exitY + 0.5) * d}`; // Exit point
    return result;
  }

  /**
   * Generates path for a circle using the coordinate as the center of the rendering
   * @param {number} centerX
   * @param {number} centerY
   * @returns {string}
   */
  pathCircle(centerX: number, centerY: number): string {
    const x = centerX + 0.5,
      y = centerY + 0.5;
    const d = this.dotDiameter;
    let result = `M ${x * d} ${(y - 0.5) * d} `;
    result += `Q ${(x + 0.5) * d} ${(y - 0.5) * d} ${(x + 0.5) * d} ${y * d} `; // Top right
    result += `Q ${(x + 0.5) * d} ${(y + 0.5) * d} ${x * d} ${(y + 0.5) * d} `; // Bottom right
    result += `Q ${(x - 0.5) * d} ${(y + 0.5) * d} ${(x - 0.5) * d} ${y * d} `; // Bottom left
    result += `Q ${(x - 0.5) * d} ${(y - 0.5) * d} ${x * d} ${(y - 0.5) * d} `; // Top left
    return result + "Z";
  }
}

export default class CloudGenerator {
  config: CloudGeneratorConfig;
  renderer: RenderMapper;
  center: number;
  holes: Hole[] = [];
  points: Coordinate[] = [];

  constructor(config: CloudGeneratorConfig) {
    // Assertion
    if (config.width % 2 == 0) {
      throw new Error(`Only odd width is allowed.`);
    }
    if (config.height % 2 == 0) {
      throw new Error(`Only odd height is allowed.`);
    }

    this.config = config;
    this.center = Math.ceil(this.config.width / 2);
    this.renderer = new RenderMapper(this.config);
  }

  /**
   * Generate points for the left and right side while balance distance
   * between sides.
   */
  generatePoints() {
    // Left side (from top to bottom)
    for (let i = 0; i < this.config.height; i++) {
      const point = {
        x: 1 + Math.round(Math.random() * this.config.fluctuation) * (i % 2 ? 1 : -1),
        y: i
      };

      this.points.push(point);
    }

    // Right side (from bottom to top)
    for (let i = this.config.height - 1; i >= 0; i--) {
      const point = {
        x:
          this.config.width -
          Math.round(Math.random() * this.config.fluctuation) * (i % 2 ? 1 : -1),
        y: i
      };
      const left = this.points.find(item => item.y == point.y);
      if (!left) { continue; }
      point.x = Math.max(left.x + 2, point.x);

      this.points.push(point);
    }
  }

  /**
   * Finds complete solid parts of the matrix and puts holes into it based on the
   * hole treshold value.
   * Holes will be at least one row away from eachother.
   */
  generateCutouts(): void {
    const holes: Hole[] = [];
    // Go through each lines except top and bottom lines.
    // Skipping line if previous line has hole already
    for (let i = 1; i < this.config.height - 1; i++) {
      if (holes[i - 1]) {
        continue;
      }

      const prev = this.getLineBoundaries(i - 1);
      const next = this.getLineBoundaries(i + 1);
      const line = this.getLineBoundaries(i);
      const space = Math.abs(line.right.x - line.left.x);

      if (space < this.config.holeTreshold) {
        continue;
      }

      let trialSlots = Array.from(Array(space - this.config.holeTreshold).keys());
      trialSlots =  _.shuffle(trialSlots);

      for (let slot of trialSlots) {
        const y = line.left.y;
        const xLeft = line.left.x + slot;
        const xRight = xLeft + this.config.holeTreshold;

        if (xLeft <= Math.max(prev.left.x, next.left.x, line.left.x) + 1) {
          continue;
        }
        if (xRight >= Math.min(prev.right.x, next.right.x, line.right.x) - 1) {
          continue;
        }

        holes[y] = { x1: xLeft, x2: xRight, y };
        break;
      }
    }

    this.holes = holes.filter(hole => hole); // Reindex
  }

  /**
   * Return boundary elements of a row, y
   * @param {number} y
   * @returns {Line}
   */
  getLineBoundaries(y: number): Line {
    const result = this.points.filter(point => point.y == y);
    return { left: result[0], right: result[1] };
  }

  /**
   * Generates the outline path for the cloud
   * @return {array}
   */
  getShapePath(): string[] {
    let path = [];
    path.push(this.renderer.pathPenDown(this.center, -0.5));

    for (let i = 0; i < this.points.length; i++) {
      const current = this.points[i];
      const next = this.points[i + 1];

      const hasNext = !!next;
      // const isTop = i == 0 || (i + 1 == this.height);
      // const isBottom = i + 1 == this.height || i == this.height;
      // const isInMid = !isTop && !isBottom;
      const isOnLeft =
        current.x < this.center || (hasNext && next.x < this.center);

      const entry = { x: current.x, y: current.y + (isOnLeft ? -0.5 : 0.5) };
      const exit = { x: current.x, y: current.y + (isOnLeft ? 0.5 : -0.5) };

      path.push(this.renderer.pathLineTo(entry.x, entry.y));

      // Concave and Convex elements
      let handleA, handleB;
      if (isOnLeft) {
        if (current.y % 2) {
          handleA = { x: current.x + 0.75, y: current.y - 0.5 };
          handleB = { x: current.x + 0.75, y: current.y + 0.5 };
        } else {
          handleA = { x: current.x - 0.75, y: current.y - 0.5 };
          handleB = { x: current.x - 0.75, y: current.y + 0.5 };
        }
      } else if (!isOnLeft) {
        if (current.y % 2) {
          handleA = { x: current.x - 0.75, y: current.y + 0.5 };
          handleB = { x: current.x - 0.75, y: current.y - 0.5 };
        } else {
          handleA = { x: current.x + 0.75, y: current.y + 0.5 };
          handleB = { x: current.x + 0.75, y: current.y - 0.5 };
        }
      }

      // Squery corners:
      // path.push(this.pathLineTo(exit.x, exit.y));
      // Curvy clouds
      if (handleA && handleB) {
        path.push(
          this.renderer.pathCurve(
            handleA.x,
            handleA.y,
            handleB.x,
            handleB.y,
            exit.x,
            exit.y
          )
        );
      }
    }

    path.push("Z");
    return path;
  }

  /**
   * Finds complete solid parts of the matrix and puts holes into it based on the
   * hole treshold value.
   * Holes will be at least one row away from eachother.
   */
  getCutoutsPaths(): string[] {
    let path = [];

    for (let hole of this.holes) {
      if (this.config.holeTreshold == 1) {
        path.push(this.renderer.pathCircle(hole.x1, hole.y));
      } else {
        path.push(this.renderer.pathPenDown(hole.x1, hole.y - 0.5));
        path.push(this.renderer.pathLineTo(hole.x2, hole.y - 0.5));
        path.push(
          this.renderer.pathCurve(
            hole.x2 + 0.75,
            hole.y - 0.5,
            hole.x2 + 0.75,
            hole.y + 0.5,
            hole.x2,
            hole.y + 0.5
          )
        );
        path.push(this.renderer.pathLineTo(hole.x1, hole.y + 0.5));
        path.push(
          this.renderer.pathCurve(
            hole.x1 - 0.75,
            hole.y + 0.5,
            hole.x1 - 0.75,
            hole.y - 0.5,
            hole.x1,
            hole.y - 0.5
          )
        );
        path.push("Z");
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
   * Spaceship operator? Anyone? I'm gonna switch to C++20 then.
   * https://github.com/Microsoft/TypeScript/issues/24451
   * @param {number} a
   * @param {number} b
   */
  cp(a: number, b: number): number {
    return a < b ? -1 : a > b ? 1 : 0;
  }
}
