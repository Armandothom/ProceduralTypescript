

export class PerlinClass {
  permutationNumbersMax: number = 256;
  permutationNumbers: Array<number> = new Array(this.permutationNumbersMax);
  seedValue: number;
  constructor(seed: string) {
    this.seedValue = this.seedHashFunction(seed);
    this.populatePermutation();
  }

  generatePerlinValue(x: number, y: number) {
    let xFloor = Math.floor(x) % (this.permutationNumbersMax - 1);
    let yFloor = Math.floor(y) % (this.permutationNumbersMax - 1);
    let xPointDifference = x - xFloor;
    let yPointDifference = y - yFloor;

    let topRight = new Vector2(xPointDifference - 1.0, yPointDifference - 1.0);
    let topLeft = new Vector2(xPointDifference, yPointDifference - 1.0);
    let bottomRight = new Vector2(xPointDifference - 1.0, yPointDifference);
    let bottomLeft = new Vector2(xPointDifference, yPointDifference);

    todo get dot based on right top left top etc
  }

  //Populating the permutation table and shuffling it afterwards.
  populatePermutation() {
    for (let i = 0; i < this.permutationNumbersMax; i++) {
      this.permutationNumbers.push(i);
    }
    for (let e = this.permutationNumbersMax - 1; e > 0; e--) {
      let index = Math.round(this.randomFromSeed() * (e - 1)),
      temp = this.permutationNumbers[e];
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
}