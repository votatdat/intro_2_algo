const EPSILON = 0.1;

const squareRoot2 = (x) => {
  let g = 0;
  let numOfStep = 0;
  let low = 0;
  let high = Math.max(1, x);

  while (Math.abs(g * g - x) > EPSILON) {
    console.log(`low is ${low}, high is ${high}, g is ${g}`);
    if (g * g < x) {
      low = g;
    } else {
      high = g;
    }
    g = (low + high) / 2;
    numOfStep += 1;
  }
  return [g, numOfStep];
};

const squareRootTest = (x) => {
  const result = squareRoot2(x);
  console.log(`Square roof of ${x} is ${result[0]}`);
  console.log(`The number of steps is ${result[1]}`);
};

squareRootTest(1000);
