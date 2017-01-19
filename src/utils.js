export function debounce(fn, timeout = 500) {
  let ready = true;
  let lastArgs = null;
  let timer = null;

  function call() {
    fn.apply(fn, lastArgs);
    lastArgs = null;
    ready = false;
    timer = startTimer();
  }

  function f() {
    lastArgs = arguments;
    if (ready) {
      call();
    } else {
      timer = startTimer();
    }
  }
  function startTimer() {
    let t = setTimeout(() => {
      if (t === timer) {
        ready = true;
        if (lastArgs !== null) {
          call();
        }
      }
    }, timeout);
    return t;
  }
  return f;
}

function mean(values) {
  if (!values.length) throw new Error('Cannot compute mean on empty array');

  const sum = values.reduce((b,a) => b+a);
  return sum / values.length;
}

function variance(values) {
  const m = mean(values);
  return mean(values.map(x => (x-m)*(x-m)));
}

function stdDeviation(values) {
  return Math.sqrt(variance(values));
}

function stdDeviation2d(points) {
  const [xs,ys] = points.reduce(([xs,ys],[ax,ay]) => {
    xs.push(ax);
    ys.push(ay);
    return [xs,ys];
  }, [[],[]]);

  return [stdDeviation(xs),stdDeviation(ys)];
}

function isEqual(sh1, sh2) {
  if (sh1.length !== sh2.length) return false;
  for (let i=0; i<sh1.length; i++) {
    const [x1,y1] = sh1[i];
    const [x2,y2] = sh2[i];
    if (x1 !== x2 || y1 !== y2) return false;
  }
  return true;
}

export function checkShapes(shapes, correctShapes) {
  const wrongShapes = [];
  shapes.forEach((shape, idx) => {
    const correctShape = correctShapes[idx];
    const absPoints1 = absoluteShapePoints(shape.points, shape.location)
      .sort(([x1,y1],[x2,y2]) => x1 === x2 ? y1 < y2 : x1 < x2);
    const absPoints2 = absoluteShapePoints(correctShape.points, correctShape.location)
      .sort(([x1,y1],[x2,y2]) => x1 === x2 ? y1 < y2 : x1 < x2);

    if (!isEqual(absPoints1, absPoints2)) {
      wrongShapes.push(shape);
    }
  });
  return wrongShapes;
}

export function mod(n, m) {
  return ((n % m) + m) % m;
}

export function rotateShape(shape, rotationAngle) {
  rotationAngle = mod(rotationAngle, 360);
  let { points, center: [cx,cy], relAngle } = shape;
  points = points.map(([x,y]) => {
    let [px,py] = [x-cx, y-cy];
    if (rotationAngle === 90) {
      [px,py] = [-py-1, px];
    } else if (rotationAngle === 180) {
      [px,py] = [-px-1, -py-1];
    } else if (rotationAngle === 270) {
      [px,py] = [py, -px-1];
    }
    return [px+cx, py+cy];
  });
  relAngle = (relAngle + rotationAngle) % 360;
  return { ...shape, points, angle: 0, relAngle };
}

export function absoluteShapePoints(points, [lx,ly]) {
  return points.map(([px,py]) => [px+lx, py+ly]);
}

export function pointEquals([p1x,p1y], [p2x, p2y]) {
  return (p1x === p2x && p1y === p2y);
}

export function validLocation({ points, location }, grid) {
  const absolutePoints = absoluteShapePoints(points, location)
  for (let pi=0; pi<absolutePoints.length; pi++) {
    const [x,y] = absolutePoints[pi];
    if (y < 0 || y >= grid.length || x < 0 || x >= grid[y].length || grid[y][x] === 1) {
      return false;
    }
  }
  return true;
}

export function possibleShapes(shape, grid) {
  const validShapes = [];
  for (let c=0; c<grid.length; c++) {
    const row = grid[c];
    for (let r=0; r<row.length; r++) {
      const location = [r,c];
      let nextShape = {
        ...shape,
        location
      };
      for (let count=0; count<4; count++) {
        nextShape = rotateShape(nextShape, 90);
        if (validLocation(nextShape, grid)) {
          validShapes.push(nextShape);
        }
      }
    }
  }
  return validShapes;
}

export function random(from, to) {
  return Math.round(Math.random()*to*1000) % to;
}

export function randomShape(shape, grid) {
  const validShapes = possibleShapes(shape, grid);
  const r = random(0, validShapes.length);
  // check if validShapes not empty
  const randomShape = validShapes[r];
  return randomShape;
}

export function shapesStdDeviation(shapes) {
  const allPoints = shapes.reduce(
    (allPoints,shape) =>
      allPoints
        .concat(absoluteShapePoints(shape.points, shape.location)), []);
  const stdDev = stdDeviation2d(allPoints);
  return stdDev;
}

export function normalizeRanks(shapesStdDev) {
  const rankedShapes = shapesStdDev.map(([shape,[stdx,stdy]]) => [shape,stdx*stdy]);
  const maxRank = rankedShapes.reduce((b,[shape,rank]) => Math.max(b,rank), -Infinity);
  return rankedShapes.map(([shape, rank]) => {
    let x = rank / maxRank;
    x = (1-x);
    x = Math.pow(x,12);
    return [shape,x];
  });
}

export function randomShapeByRank(rankedShapes) {
  const rankSum = rankedShapes.reduce((b,[shape, rank]) => b+rank, 0);
  const randSum = random(0, rankSum);

  let currentSum = 0;
  for (let i=0; i<rankedShapes.length; i++) {
    const [shape,rank] = rankedShapes[i];
    currentSum += rank;
    if (currentSum > randSum) {
      return shape;
    }
  }
  return rankedShapes[random(0, rankedShapes.length)][0];
}

export function randomClusteredShape(shape, grid, existingShapes) {
  if (!existingShapes.length) {
    const firstShape = randomShape(shape, grid);
    return firstShape;
  } else {
    const validPossibleShapes = possibleShapes(shape, grid);
    const rankedShapes = validPossibleShapes.map(nextShape => {
      const nextShapes = [...existingShapes, nextShape];
      const stdDev = shapesStdDeviation(nextShapes);
      return [nextShape,stdDev];
    });
    return randomShapeByRank(normalizeRanks(rankedShapes));
  }
}

export function emptyGrid(n,m) {
  const grid = [];
  for (let i=0; i<n; i++) {
    const row = [];
    for (let j=0; j<m; j++) {
      row[j] = 0;
    }
    grid[i] = row;
  }
  return grid;
}

export function makeGrid(shapes, n, m, chooseShape) {
  const grid = emptyGrid(n,m);
  const nextShapes = [];
  shapes.forEach(shape => {
    const nextShape = chooseShape(shape, grid, nextShapes);
    const { location: [lx,ly] } = nextShape;
    nextShape.points.forEach(([x,y]) => {
      grid[y+ly][x+lx] = 1;
    });
    nextShapes.push(nextShape);
  });
  return nextShapes;
}

export function randomGrid(shapes, n, m) {
  return makeGrid(shapes, n, m, randomClusteredShape);
}

export function orderedGrid(shapes, n, m) {
  return makeGrid(shapes, n, m, (shape, grid) => {
    const validShapes = possibleShapes(shape, grid);
    // check if validShapes not empty
    const randomShape = validShapes[0];
    return randomShape;
  });
}

export function transformToPx(x, y, svg) {
  const point = svg.createSVGPoint();
  const matrix = svg.getScreenCTM();
  return transformByMatrix(x, y, point, matrix);
}

export function transformToSvg(x, y, svg) {
  const point = svg.createSVGPoint();
  const matrix = svg.getScreenCTM().inverse();
  return transformByMatrix(x, y, point, matrix);
}

export function transformByMatrix(x, y, point, matrix) {
  point.x = x;
  point.y = y;
  const newPoint = point.matrixTransform(matrix)
  const tx = newPoint.x;
  const ty = newPoint.y;
  return [tx,ty];
}

export function transform(x, y, cx, cy, a) {
  return `translate(${x}, ${y}) rotate(${a} ${cx} ${cy})`;
 }
