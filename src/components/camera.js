import { PerspectiveCamera } from 'three';

function createCamera(){
		let x = -150;
		let y = 1000;
		let z = 700;
		let fov = 45; // AKA Field of View
		let aspect = window.innerWidth / window.innerHeight;
		let near = 1; // the near clipping plane
		let far = 10000; // the far clipping plane
		// create camera
		let camera = new PerspectiveCamera( fov, aspect, near, far );
		// set position
		camera.position.set( x, y, z );
		return camera
}

export { createCamera }
