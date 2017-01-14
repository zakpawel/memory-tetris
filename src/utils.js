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
  const newShapes = [];
  shapes.forEach(shape => {
    const newShape = chooseShape(shape, grid);
    const { location: [lx,ly] } = newShape;
    newShape.points.forEach(([x,y]) => {
      grid[y+ly][x+lx] = 1;
    });
    newShapes.push(newShape);
  });
  return newShapes;
}

export function randomGrid(shapes, n, m) {
  return makeGrid(shapes, n, m, randomShape);
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
