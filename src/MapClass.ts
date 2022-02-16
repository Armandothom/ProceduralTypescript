import { Perlin } from "./Perlin";
import { Tile } from "./Tile";

export class MapClass {
  width : number = 600;
  height : number = 600;
  frequency : number = 0.005;
  amplitude : number = 1;
  tilemap : Array<Tile> = [];
  context : CanvasRenderingContext2D;
  constructor() {
    this.context = this.initCanvas();
  }

  public generateMap() {
    let perlinNoise : Perlin = new Perlin("hahaha");
    let octaves = 8;
    for (let x = 1; x < this.width; x++) {
        for (let y = 1; y < this.height; y++) {
            let frequency = this.frequency;
            let amplitude = this.amplitude;
            let perlinResult = 0
            for (let o = 0; o < octaves; o++) {
                let perlin = perlinNoise.generatePerlinValue(x * frequency, y * frequency) * 0.5;
                frequency *= 2;
                amplitude *= 0.5;
                perlinResult += perlin;
            }
        }
    }
  }

  private initCanvas() : CanvasRenderingContext2D {
    let HTMLCanvas = <HTMLCanvasElement> document.getElementById('canvas');
    HTMLCanvas.width = this.width;
    HTMLCanvas.height = this.height;
    let context = <CanvasRenderingContext2D> HTMLCanvas!.getContext("2d");
    context.lineWidth = 1;
    return context;
  }

}