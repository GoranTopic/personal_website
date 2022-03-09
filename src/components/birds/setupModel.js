import { AnimationMixer } from 'three';

function setupModel(data){
		// extract model
		const model = data.scene.children[0];
		// extract clip data
		const clip = data.animations[0];
		// create mixer for object
		const mixer = new AnimationMixer(model);
		// create action controller
		const action = mixer.clipAction(clip);
		// play action 
		action.play(); // play
		// add tick method
		model.tick = delta => mixer.update(delta);
		// return model
		return model;
}

export { setupModel };
