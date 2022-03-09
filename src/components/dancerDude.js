import { AnimationMixer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const loader =  new FBXLoader();

async function loadDancerDude(){
		// first let's load the dancer dude =)
		const dancerDude = await loader.loadAsync('../../resources/models/Samba Dancing.fbx');
		// now that we have the data, lets make a mixer
		const mixer = new AnimationMixer(dancerDude);
		// lets create a action controller, and pass it the animation clip	
		const action = mixer.clipAction( dancerDude.animations[0] );
		// let play that animation 
		action.play();
		// for every mesh in the dance dude, enable shadows
		dancerDude.traverse( child => { 
				if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
				}
		});
		// let's create a function so that we can call the update
		// functions in out game loop
		dancerDude.tick = delta => mixer.update(delta);
		// return dude bro
		return dancerDude;
}

export { loadDancerDude } 
