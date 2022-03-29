import { AnimationMixer, Mesh, Color, MeshStandardMaterial, } from 'three';
import { movement } from '../../systems/movement/movement';

function setup_model(model){

		console.log('setting up player', model)
		
		// set up animations
		const mixer = new AnimationMixer( model );
		// get the actions to the actions
		const actions = {};
		// animation names
		// this is a lit off all the animations this model has 
		const animation_names = [	"walk", "run", "idle_gun_shoot", "run_back",
				"idle_gun_pointing", "idle_sword", "hitrecieve", "run_shoot", "kick_left",
				"punch_right", "roll", "gun_shoot", "interact", "kick_right", "hitrecieve_2",
				"punch_left", "idle", "run_left", "sword_slash", "idle_gun", "idle_neutral",
				"run_right", "wave", "death"]
		// then some dem magic
		animation_names.forEach( name => 
				model.animations.forEach( ani => 
						ani.name.toLowerCase().match(".*"+name+"$") && (
								actions[name] = mixer.clipAction(ani)
						)
				)
		);
		console.log('actions:', actions)

		// save mixer 
		model.mixer = mixer;

		// save actions in model
		model.animationActions = actions

		// set up mover component 
		model.mover = new movement({
				model: model,
		});


		// set up some model global variables 
		model.vars = { 
				// is following a mouse marker?
				isFollowingMarker: false,
				// timer increaase when walking
				walkTimer: 0, //
				// when to start running
				time2Run: 50,
				// the running speed
				runningSpeed: 380,
		}


		/*
		// color the model 
		model.traverse(
				child => { // color me model 
						if (child instanceof Mesh) {
								const material = child.material.map( m => { 
										if(m.name === 'Main') m.color = new Color('white');
										else if(m.name === 'Stripe') m.color = new Color('red');
										else if(m.name === 'Eyes') m.color = new Color('black');
										else if(m.name === 'Nail') m.color = new Color('gray');
										else if(m.name === 'White') m.color = new Color('gray');
										else if(m.name === 'Glass') m = new MeshStandardMaterial({  
												color: new Color(0x049ef4),
												transparent: true,
												opacity: 0.4,
												flatShading: false, });
										return m;
								});
								child.material = material;
								child.material.needsUpdate = true;
						}
				});
		*/

		/* scale n' tweaks */
		let scale = 1; // scale down 
		model.scale.set(scale, scale, scale);

		// set initial position 
		let [ x, y, z ] = [ 0, 0, 0,];
		model.position.set(x, y, z)

		// make models have shadows
		if(model.traverse)
				model.traverse( child => {
						if( child.isMesh ){
								child.castShadow = true;
								child.receiveShadow = true;
						}
				});
		model.castShadow = true;

		return model;
}


export { setup_model }
