import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from './setupModel';

async function loadBirds() {
		const loader = new GLTFLoader();

		// asyncronosly load the model
		//const parrotData = await loader.loadAsync('../../../resources/models/Parrot.glb');

		const [parrotData, flamingoData, storkData] = await Promise.all([
				loader.loadAsync('../../../resources/models/Parrot.glb'),
				loader.loadAsync('../../../resources/models/Flamingo.glb'),
				loader.loadAsync('../../../resources/models/Stork.glb'),
		]);
		console.log('Squaaawk!', parrotData);

		let x = -150, y = 100, z = 200; 

		// set up model
		const parrot = setupModel(parrotData);
		parrot.position.set(x, y, z + 100);

		const flamingo = setupModel(flamingoData);
		flamingo.position.set(x + 70.5, y, z -100);

		const stork = setupModel(storkData);
		stork.position.set(x -100, y -20.5, z -100);

		return { parrot, flamingo, stork };
}

export { loadBirds };
