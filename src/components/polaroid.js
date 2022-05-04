import { AnimationMixer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();

async function loadPolaroid(){
		// model
		const data = await loader.loadAsync(
				'../../resources/polaroid_photo/scene.gltf'
		);

		let polaroid = data.scene
		let s = 20;
		polaroid.scale.set(s,s,s)

		/*
		data.traverse( function ( child ) {
				if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
				}
		} );
		*/

		data.tick = delta => {}

		return polaroid;
}

export { loadPolaroid }
