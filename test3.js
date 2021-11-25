const EPSILON = 1E-6;

const squareRoot3 = (x) => {
  let g = x / 2;
  let numOfStep = 0;

  while (Math.abs(g * g - x) > EPSILON) {
    g = g - ((g * g - x) / (g * 2)); // just 1 line here
    numOfStep += 1;
  }
  return [g, numOfStep];
};

const squareRootTest3 = (x) => {
  const result = squareRoot3(x);
  console.log(`Square roof of ${x} is ${result[0]}`);
  console.log(`The number of steps is ${result[1]}`);
};

squareRootTest3(1E9);
