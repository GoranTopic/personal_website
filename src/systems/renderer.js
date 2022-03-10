import { WebGLRenderer, sRGBEncoding } from 'three';

function createRenderer() {

		const renderer = new WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;

		return renderer;
}

export { createRenderer };
