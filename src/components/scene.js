import { Color, Scene, Fog } from 'three';

function createScene() {
		const scene = new Scene();
		// with color blue
		//scene.background = new Color( 'white' );
		// add fog
		scene.fog = new Fog( 0xa0a0a0, 200, 1000 );
		return scene;
}

export { createScene };
