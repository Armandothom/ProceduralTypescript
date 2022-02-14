class Vector2 {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	dot(vectorToDot: Vector2) : number {
		return this.x * vectorToDot.x + this.y * vectorToDot.y;
	}
}

export {Vector2};