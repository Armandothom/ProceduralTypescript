import { MapClass } from "./MapClass";

class MainClass {
	private map : MapClass;
	constructor() {
		this.map = new MapClass();
		this.createMap();
	}

	createMap() {
		this.map.generateMap();
	}
}

export {MainClass};