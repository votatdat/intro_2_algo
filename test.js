const EPSILON = 0.1;
const STEP = 0.01;

const squareRoot = (x) => {
  let g = 0;
  let numOfStep = 0;
  while (Math.abs(g * g - x) > EPSILON) {
    g += STEP;
    numOfStep++;
  }
  return [g, numOfStep];
};

const squareRootTest = (x) => {
  const result = squareRoot(x);
  console.log(`Square roof of ${x} is ${result[0]}`);
  console.log(`The number of steps is ${result[1]}`);
};

squareRootTest(47);
