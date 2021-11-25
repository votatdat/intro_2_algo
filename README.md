## An overview of algorithm

A computer is good at doing two things, and two things only:

- It performs calculations
- It remembers the results of those calculations

So, we-developers will let the computer help us with calculations, and we just
think about some good solutions so that the computer can calculate something in
the fastest way.

Many (or maybe nearly all) programming languages have built-in `square root`
function. For example, in JavaScript:

```js
Math.sqrt(5)
// Result: 2.23606797749979
```

If I give you a positive number, and ask you to calculate the square root of it
without using computer nor calculator. How will you do it? For example, how you
calculate the square root of 47? And a related question, how ancient people
calculated the square root of a positive number (of course, they did not have
calculator nor computer)?

Let's have a try with finding the square root of 47. You know that the square
root of 49 is 7, and square root of 36 is 6. So, the result is somewhere
between 6 and 7, and 47 is near 49 so the result is nearly 7, it's 6.8 or 6.9
or just 6.85, but what will you do next? How to get a more precise result?

Babylonian mathematicians and Heron of Alexandria were the first ones who wrote
down a way to compute the square root of a number. The method to find the
square root of `x` is as below:

1. Start with a guess, `g`.
2. Calculate `g*g`. If `g*g` is close enough to `x`, stop and say that `g` is
   the answer/result.
3. Otherwise, create a new guess by **averaging g and x/g**, `(g + x/g)/2`.
   This step is extremely important.
4. Using this new guess, which we again call `g` (reassign the new value
   to `g`), repeat the process until `g*g` is close enough to `x`.

For example, find the square root of 47:

1. Start with a guess, I guess 6.
2. 6*6 is 36, not close enough to 47. So, 6 is not the answer.
3. New guess value is (6 + 47/6)/2 = 6.92 (please do it by hand to feel this).
4. 6.92*6.92 is 47.89, close enough to 47. So, 6.92 is the result. Done.

You can read more about methods to find square
root [here](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots)

And we call this kind of method `algorithm`. We have a square root algorithm,
it's not good but still an algorithm for you to calculate the square root of a
number. We can see some problems with this algorithm are:

- `g` can not be 0 due to `x/g` will be infinite.
- Initial `g` value is important. If we guess `g` = 7 at the first time, new
  guess value is (7 + 47/7) / 2 = 6.86, and 6.86 * 6.86 = 47.06, closer than
  initial `g` = 6. It's a better result but what if initial `g` is 0, 1 or even
  100, 101, ... 1000000. Moreover, computer can not guess like us, when we
  guess 6 or 7, actually we have already used square root in our mind.
- `close enough` has not been controlled.
- ...

## Approximate Solutions

As mentioned earlier, in programming, we MUST notice about `close enough`. Are
47.89 and 47 close enough to each other? Some agree and some don't. But please
always remember that in computer, everything is stored as 0 and 1,
(called binary numbers) in memory. `0.1` and `0.2` also have error (error here
doesn't mean mistake, it's the difference between an observed or calculated
value and a true value). For example, in JavaScript or Python:

```
> 0.1 + 0.2
0.30000000000000004
```

Now, we will write a simple function to calculate the square root of a number,
temporarily ignoring checking the input type, pretend that the input is always
a positive number, haha:

```js
const EPSILON = 0.1;
const STEP = 0.01;

const squareRoot = (x) => {
  let g = 0;
  while (Math.abs(g * g - x) > EPSILON) {
    g += STEP;
  }
  return g;
};

const squareRootTest = (x) => {
  console.log(`Square roof of ${x} is ${squareRoot(x)}`);
};

squareRootTest(47);
// Square roof of 47 is 6.849999999999898
// The result is 6.85, because the STEP is 0.01
// This strange result is due to binary problem mentioned above.
```

If you don't know `while-loop`, you can
read [here](https://www.w3schools.com/js/js_loop_while.asp).

In this snippet, you will see that:

- `g` start from 0:
    - As mentioned above, computer can not guess the initial value.
    - Square root of a positive number is also positive, so it's a good start
      with 0.
- `close enough` is controlled, it must be smaller the `EPSILON`, and we check
  this by `Math.abs(g * g - x) > EPSILON`. If the difference is bigger
  than `EPSILON`, the loop will stop.
  <br>(You can read more about absolute
  function [here](https://www.w3schools.com/jsref/jsref_abs.asp)).
- We don't use `(x+x/g)/2` as algorithm above, but we add 0.01 after every
  step.

And we refactor a little to see how many steps this function runs to get the
result:

```js
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
// Square roof of 47 is 6.849999999999898
// The number of steps is 685
// 6.85/0.01 = 685, easy to calculate right?
```

So, we can conclude at least 2 things:

- Smaller STEP, bigger number of steps. If the STEP = 0.001, we need 6850
  steps.
- Bigger input, bigger number of steps. If x = 1000, we 3163 steps.

And if you test the above code with `x = 1000`, you will see that we have a bug
here, 31.62 * 31.62 = 999.8244, and 31.63 * 31.63 = 1000.4569, so Math.abs(g *
g - x) is always bigger than EPSILON = 0.1, the loop will never end. We have to
decrease STEP or increase EPSILON to solve this issue.

- If we decrease STEP to 0.001, g is 31.622 and the number of step is 31622.
- If we increase EPSILON to 0.2, g is 31.62 and the number of step is 3162.

And there are still a lot of bugs in this snippet, but we don't focus them too
much here, we just want to focus on ideas.

We see that `Approximate Solutions` can solve problem, but it takes a lot of
memory and time. Do you feel that?

## Bisection

The next solution that you may think about to solve this problem
is `Bisection` (dividing into two equal parts). The ideas are as below:

- We don't use STEP anymore. This is a very important improvement.
- We have input value x, have a first guess with the value between from 0 to
  x: `g = x/2`.
- If (g * g) > x, the new g is the middle value from 0 to x/2 (the lower half),
  it's `g = x/4`.
- Otherwise, new g is the middle value from x/2 to x (the upper half),
  it's`g = 3x/4`.
- And continue with this until the difference is smaller than EPSILON.

```js
const EPSILON = 0.1;

const squareRoot2 = (x) => {
  let g = 0;
  let numOfStep = 0;
  let low = 0;
  let high = Math.max(x, 1);

  while (Math.abs(g * g - x) > EPSILON) {
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

const squareRootTest2 = (x) => {
  const result = squareRoot2(x);
  console.log(`Square roof of ${x} is ${result[0]}`);
  console.log(`The number of steps is ${result[1]}`);
};

squareRootTest2(1000);
// Square roof of 1000 is 31.62384033203125
// The number of steps is 17
```

Wow, the return value is 31.624 and the function needs only 17 steps to finish.
Let's calculate again to check: 31.624 * 31.624 = 1000.08, it's a
good `close enough`.

Let check with some other values:

```js
squareRootTest2(1E9); // 1E9 = 10^9, 1 billion
// Square roof of 1000000000 is 31622.776601736292
// The number of steps is 49
```

```js
squareRootTest2(0.001);
// Square roof of 0.001 is 0
// The number of steps is 0
```

Ha, we have a bug here simply because the value of EPSILON is too big, the
function fails at the first time. This algorithm is better, so we are confident
to decrease `close enough` values from 0.1 to 0.000001 (or 1E-6) and have a
check.

```js
const EPSILON = 1E-6;
// ...
// ...
squareRootTest(0.00001);
// Square roof of 0.00001 is 0.003173828125
// The number of step is 12
```

Well, only 12 steps to get the result. If you still don't understand the code,
we will add a `console.log` function to follow value of `low`, `high`, and `g`:

```js
const EPSILON = 0.1;

const squareRoot2 = (x) => {
  let g = 0;
  let numOfStep = 0;
  let low = 0;
  let high = Math.max(x, 1);

  while (Math.abs(g * g - x) > EPSILON) {
    console.log(`low is ${low}, high is ${high}, g is ${g}`); // add this line only
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

const squareRootTest2 = (x) => {
  const result = squareRoot2(x);
  console.log(`Square roof of ${x} is ${result[0]}`);
  console.log(`The number of steps is ${result[1]}`);
};

squareRootTest2(1000);
```

The output is:

``` 
low is 0, high is 1000, g is 0
low is 0, high is 1000, g is 500
low is 0, high is 500, g is 250
low is 0, high is 250, g is 125
low is 0, high is 125, g is 62.5
low is 0, high is 62.5, g is 31.25
low is 31.25, high is 62.5, g is 46.875
low is 31.25, high is 46.875, g is 39.0625
low is 31.25, high is 39.0625, g is 35.15625
low is 31.25, high is 35.15625, g is 33.203125
low is 31.25, high is 33.203125, g is 32.2265625
low is 31.25, high is 32.2265625, g is 31.73828125
low is 31.25, high is 31.73828125, g is 31.494140625
low is 31.494140625, high is 31.73828125, g is 31.6162109375
low is 31.6162109375, high is 31.73828125, g is 31.67724609375
low is 31.6162109375, high is 31.67724609375, g is 31.646728515625
low is 31.6162109375, high is 31.646728515625, g is 31.6314697265625
Square roof of 1000 is 31.62384033203125
The number of steps is 17
```

This is really a good solution. But, any better solutions?

## Newton-Raphson

With this algorithm, you need to know about Derivative, you learned it in high
school, but perhaps you forgot it. If you have not a familiar with Derivative,
you can read again [here](https://en.wikipedia.org/wiki/Derivative).

The first key idea: finding the square root of `x` means solving the
polynomial `g^2 - x = 0`. We write again in Maths style: `f(g) = g^2 - x`, with
`x` is a positive number, and we find `g` when `f(g) = 0`.

The second key idea: Mathematicians Newton and Raphson proved that:
`guess – f(guess)/f’(guess)`  where `f’` is the `first derivative of f`, is a
better approximation.

`f(g) = g^2 - x` so `f'(g) = 2g`. (Please accept it if you don't remember
Derivative). We will have:

- guess is `g`.
- f(guess) is `(g * g - x`)
- f'(guess) is `2*g`.

Now, we will imply these ideas to code:

```js
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
// Square roof of 1000000000 is 31622.776601683792
// The number of steps is 19
```

Wow, comparing with 47 steps in `Bisection` algorithm, `Newton-Raphson`
algorithm is even better, just 19 steps.

After having walk-through with 3 algorithms, we can see that with a good
algorithm, the code is not more complex, even a little simpler and easier to
understand, but the program runs much faster.

Do you feel why we need algorithm now?
<br/>Can you research more effective algorithms for this problem?


Your turn: Solve all top interview questions (easy level)

https://leetcode.com/explore/interview/card/top-interview-questions-easy/