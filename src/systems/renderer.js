import { WebGLRenderer } from 'three';

function createRenderer() {
		const renderer = new WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.physicallyCorrectLights = true;
		return renderer;
}

export { createRenderer };
