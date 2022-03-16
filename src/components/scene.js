import { Color, Scene, Fog } from 'three';

function createScene(){

		const scene = new Scene();
		scene.background = new Color( 0xa0a0a0 );
		//scene.fog = new Fog( 0xa0a0a0, 200, 1000 );
		return scene
}

export { createScene }
