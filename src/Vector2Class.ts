class Vector2 {
    x : number;
    y : number;

	constructor(x : number, y : number){
		this.x = x;
		this.y = y;
	}

	dotVector(vectorToDot : Vector2){
		return this.x * vectorToDot.x + this.y * vectorToDot.y;
	}
}
