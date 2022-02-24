import { Perlin } from "./Perlin";
import { Tile } from "./Tile";
import { Tilemap } from "./Tilemap";

export class MapClass {
  width: number = 64;
  height: number = 64;
  frequency: number = 0.005;
  amplitude: number = 1;
  heatmap: Tilemap = new Tilemap(this.height, this.width);
  context: CanvasRenderingContext2D;
  constructor() {
    this.context = this.initCanvas();
  }

  /*Generates the map*/
  public generateMap() {
    let perlinNoise: Perlin = new Perlin("mountain");
    let octaves = 8;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let frequency = this.frequency;
        let amplitude = this.amplitude;
        let perlinResult = 0
        for (let o = 0; o < octaves; o++) {
          let perlin = perlinNoise.generatePerlinValue(x * frequency, y * frequency) * amplitude;
          frequency *= 1.8;
          amplitude *= 0.5;
          perlinResult += perlin;
        }
        perlinResult = perlinResult
        this.setHeatMap(x, y, perlinResult);
      }
    }
    this.paintMap(this.heatmap);
  }

    /*Used to set the properties of the tile of the heatmap tilemap*/
  setHeatMap(xCoord: number, yCoord: number, perlinValue: number) {
    if (perlinValue <= 0.6) {
      this.heatmap.setTile(new Tile("#ff0000", "HEATMAP_LOW", perlinValue), xCoord, yCoord);
    } else if (perlinValue > 0.6 && perlinValue <= 0.8) {
      this.heatmap.setTile(new Tile("#780000", "HEATMAP_MID", perlinValue), xCoord, yCoord);
    } else {
      this.heatmap.setTile(new Tile("#2b0000", "HEATMAP_HIGH", perlinValue), xCoord, yCoord);
    }
  }

  /*Used to paint the map*/
  paintMap(tilemap: Tilemap): void {
    for (let x = 0; x < tilemap.width; x++) {
      for (let y = 0; y < tilemap.height; y++) {
        let tile = tilemap.getTile(x, y);
        this.context.beginPath();
        this.context.fillStyle = tile.color;
        this.context.rect(x * tile.size, y * tile.size, tile.size, tile.size);
        this.context.fill();
      }
    }
  }

  /*Initializing the canvas*/
  private initCanvas(): CanvasRenderingContext2D {
    let HTMLCanvas = <HTMLCanvasElement>document.getElementById('canvas');
    HTMLCanvas.addEventListener('mousedown', ((e) => {
      this.getCoord(HTMLCanvas, e);
    }))
    let tileBase = new Tile("", "TileBase");
    HTMLCanvas.width = this.width * tileBase.size;
    HTMLCanvas.height = this.height * tileBase.size;
    let context = <CanvasRenderingContext2D>HTMLCanvas!.getContext("2d");
    context.lineWidth = 10;
    return context;
  }

  /*Just so you know which tile you are clicking*/
  getCoord(canvas : any, event : any) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log(this.heatmap.getTile(Math.floor(x / 16), Math.floor(y / 16)));
  }
}