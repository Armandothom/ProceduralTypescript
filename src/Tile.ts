class Tile {
	height: number = 32;
	width : number = 32;
	color : string;
	constructor(color : string) {
		this.color = color;
	}
}

export {Tile};