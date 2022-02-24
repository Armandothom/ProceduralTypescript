class Tile {
	size: number = 16;
	color : string;
	name : string;
	value : number | undefined
	constructor(color : string, name : string, value? : number) {
		this.color = color;
		this.name = name;
		this.value = value;
	}
}

export {Tile};