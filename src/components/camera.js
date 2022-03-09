import { PerspectiveCamera } from 'three';

function createCamera(){
		let x = 0;
		let y = 200;
		let z = 400;
		let fov = 35; // AKA Field of View
		let aspect = window.innerWidth / window.innerHeight;
		let near = 0.1; // the near clipping plane
		let far = 2000; // the far clipping plane
		// create camera
		let camera = new PerspectiveCamera( fov, aspect, near, far );
		// set position
		camera.position.set( x, y, z );
		return camera
}

export { createCamera };
