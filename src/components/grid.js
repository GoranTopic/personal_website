import { GridHelper } from 'three'

function createGrid(){
		let size = 2000;
		let divisions = 20;
		let colorCenterLine = 0x000000
		let colorGrid = 0x000000
		let grid = new GridHelper( size, divisions, colorCenterLine, colorGrid );
		grid.material.opacity = 0.2;
		grid.material.transparent = true;
		return grid;
}

export { createGrid }
