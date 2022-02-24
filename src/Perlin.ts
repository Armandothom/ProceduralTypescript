import { Vector2 } from "./Vector2";


export class Perlin {
  permutationNumbersMax: number = 256;
  permutationNumbers: Array<number> = new Array(this.permutationNumbersMax);
  seedValue: number;
  constructor(seed: string) {
    this.seedValue = this.seedHashFunction(seed);
    this.populatePermutation();
  }

  generatePerlinValue(x: number, y: number) {
    let xInputPointFloored = Math.floor(x) % (this.permutationNumbersMax - 1);
    let yInputPointFloored = Math.floor(y) % (this.permutationNumbersMax - 1);
    let xInputPointDiff = x - Math.floor(x);
    let yInputPointDiff = y - Math.floor(y);

    let offsetTopRightToInput = new Vector2(xInputPointDiff - 1.0, yInputPointDiff - 1.0);
    let offsetTopLeftToInput = new Vector2(xInputPointDiff, yInputPointDiff - 1.0);
    let offsetBottomRightToInput = new Vector2(xInputPointDiff - 1.0, yInputPointDiff);
    let offsetBottomLeftToInput = new Vector2(xInputPointDiff, yInputPointDiff);

    let topRightGridValue = this.permutationNumbers[this.permutationNumbers[xInputPointFloored + 1] + yInputPointFloored + 1]; //P[P[X+1]+Y+1]
    let topLeftGridValue = this.permutationNumbers[this.permutationNumbers[xInputPointFloored] + yInputPointFloored + 1]; //P[P[X]+Y+1]
    let bottomRightGridValue = this.permutationNumbers[this.permutationNumbers[xInputPointFloored + 1] + yInputPointFloored]; //P[P[X+1]+Y]
    let bottomLeftGridValue = this.permutationNumbers[this.permutationNumbers[xInputPointFloored] + yInputPointFloored]; //P[P[X]+Y]

    let interpolatedValue: number = this.lerp(xInputPointDiff,
      this.lerp(yInputPointDiff, this.grad(bottomLeftGridValue, offsetBottomLeftToInput), this.grad(topLeftGridValue, offsetTopLeftToInput)),
      this.lerp(yInputPointDiff, this.grad(bottomRightGridValue, offsetBottomRightToInput), this.grad(topRightGridValue, offsetTopRightToInput)));
    return interpolatedValue;
  }

  lerp(interpolationValue: number, startValue: number, endValue: number): number {
    return startValue + interpolationValue * (endValue - startValue);
  }

  /*Populates the permutation table and shuffles it afterwards*/
  populatePermutation() {
    for (let i = 0; i < this.permutationNumbersMax; i++) {
      this.permutationNumbers[i] = i;
    }
    for (let e = this.permutationNumbersMax - 1; e > 0; e--) {
      let index = Math.round(this.randomFromSeed() * (e - 1))
      let temp = this.permutationNumbers[e];
      this.permutationNumbers[e] = this.permutationNumbers[index];
      this.permutationNumbers[index] = temp;
    }
  }

  //Here I'm using Mulberry32 Algorithm to transform the ASCII value of the seed into a number between 0 and 1.
  //https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
  randomFromSeed(): number {
    this.seedValue |= 0; this.seedValue = this.seedValue + 0x6D2B79F5 | 0;
    var t = Math.imul(this.seedValue ^ this.seedValue >>> 15, 1 | this.seedValue);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  //I'm parsing the seed string into a hash function, so it will return me a 32-bit hash.
  //https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions
  seedHashFunction(seed: string): number {
    for (var i = 0, h = 1779033703 ^ seed.length; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    }
    h = Math.imul(h ^ h >>> 16, 2246822507),
      h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }

  grad(valuePermutation: number, vectorDistance: Vector2): number {
    switch (valuePermutation % 4) {
      case 0:
        return vectorDistance.dot(new Vector2(1, 1));
      case 1:
        return vectorDistance.dot(new Vector2(1, -1));
      case 2:
        return vectorDistance.dot(new Vector2(-1, 1));
      case 3:
        return vectorDistance.dot(new Vector2(-1, -1));
      default:
        return 0; // never gonna happen
    }
  }


  //Fade function defined by Ken Perlin (6t^5-15t^4+10t^3). Smooths the decimal value towards one of the both ends of rounding it.
  fade(t: number): number {
    return ((6 * t - 15) * t + 10) * t * t * t;
  }
}


/*
  Steps
  1 -> Get the input point within the square grid, from user input.
  2 -> Calculate the distance vector from each of the grid points to the input point
  3 -> Get the constant vectors using hash function and then calculate the dot product with the distance vector
  4 -> Lerp the results on x and y axis
*/