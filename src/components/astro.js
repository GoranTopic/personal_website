import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


const loader = new FBXLoader();

async function loadAstro(){
		// model
		const data = await loader.loadAsync('../../resources/models/floating-astro-sva-no-plinth/source/Floating-via-C4D.fbx');
		const sambaDancer = await loader.loadAsync('../../resources/models/Samba Dancing.fbx');

		console.log("astro!", data);
		const mixer = new AnimationMixer( data );

		const action = mixer.clipAction( sambaDancer.animations[ 0 ] );
		action.play();

		if(data.traverse)
				data.traverse( child => {
						if( child.isMesh ){
								child.castShadow = true;
								child.receiveShadow = true;
						}
				});

		data.tick = delta => mixer.update(delta);

		let scale = 50;
		data.scale.set(scale, scale, scale);
		data.position.set(100, 0, 0)

		return data;
}

export { loadAstro }
