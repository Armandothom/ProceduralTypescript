import { Perlin } from "./Perlin";

let perlinNoise : Perlin = new Perlin("gasda");
let stringPerlin : string = "";
for (let x = 1; x < 20; x++) {
    for (let y = 1; y < 20; y++) {
        let perlinResult = perlinNoise.generatePerlinValue(x/10, y/10).toFixed(2);
        stringPerlin = stringPerlin.concat(`${perlinResult} `);
        console.log(`Resultado: ${perlinResult}` )
        console.log("========================")
    }
    stringPerlin = stringPerlin.concat(`\n`);
}
console.log("STRING PERLIN")
console.log(`${stringPerlin}`);