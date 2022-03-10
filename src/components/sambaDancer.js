
import { AnimationMixer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const loader = new FBXLoader();

async function loadSambaDancer(){
		// model
		const sambaDancer = await loader.loadAsync('./resources/models/Samba Dancing.fbx');

		const mixer = new AnimationMixer( sambaDancer );

		const action = mixer.clipAction( sambaDancer.animations[ 0 ] );
		action.play();

		sambaDancer.traverse( function ( child ) {
				if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
				}
		} );

		sambaDancer.tick = delta => mixer.update(delta);

		return sambaDancer;
}

export { loadSambaDancer }
