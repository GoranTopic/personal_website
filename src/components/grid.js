import { GridHelper } from 'three';

function createGrid(){
		const grid = new GridHelper( 2000, 20, 0x000000, 0x000000 );
		grid.material.opacity = 0.2;
		grid.material.transparent = true;
		return  grid;
}

export { createGrid }
