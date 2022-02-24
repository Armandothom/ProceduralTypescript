import { Tile } from "./Tile";

class Tilemap {
	private tiles : Map<string, Tile> = new Map();
	public width : number;
	public height : number;
	constructor(width : number, height : number) {
		this.width = width;
		this.height = height;
	}

	setTile(tile : Tile, x : number, y : number) {
		if(x > this.width) {
			throw new Error("Width out of bounds");
		}
		if(y > this.height) {
			throw new Error("Height out of bounds");
		}
		this.tiles.set([x, y].join(','), tile);
	}

	getTile(x : number, y : number) : Tile {
		let tile = this.tiles.get([x, y].join(','));
		if(tile) {
			return tile;
		} else {
			throw new Error(`Tile does not exist on coordinate ${x},${y}`);
		}
	}
}

export {Tilemap};