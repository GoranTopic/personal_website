import { Color, Mesh, AnimationMixer, TextureLoader, MathUtils, Vector3,
		Quaternion, MeshStandardMaterial, MeshPhongMaterial, BackSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { State, createFiniteStateMachine } from '../systems/StateMachine';
import { KeyboardInputController } from '../systems/imputs';
import { movement } from '../systems/movement/movement';

const loader = new FBXLoader();
const textLoader = new TextureLoader();

let data;

async function loadModel(){
		/* model
		 * The mode has some key component,
		 * - the state machine that handles the state of the object.
		 * - the animation mixed which is stored to each state 
		 * - the input controler which check if there are keybord input 
		 *		and passes it to the state machince to change the state
		 * - the mover wich moves the objec on each state.
		 * */

		data = await loader.loadAsync('../../resources/Alien_Helmet.fbx');
		// make animation mixer
		
		const mixer = new AnimationMixer( data );
		// get the actions to the actions
		const actions = {};
		const animation_names = [ 'runningjump', 'runhold', 'walk', 'run', 'punch',
				"clapping", "jump", "swimming", "idlehold", "death", "sitting", 
				"swordslash", "idle", "standing" ]
		animation_names.forEach( name => // some them magic
				data.animations.forEach( ani => 
						ani.name.toLowerCase().match(".*_"+name+"$") && (
								actions[name] = mixer.clipAction(ani)
						)
				)
		);

		/* make input controller */
		const controller = new KeyboardInputController();

		/* mover component  */ 
		const mover = new movement({
				model: data,
		});

		/* color the model */
		data.traverse(
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
												shininess: 1.0,
												flatShading: false, });
										return m;
								});
								child.material = material;
								child.material.needsUpdate = true;
						}
				});


		/* define idle state */
		const idleState = new State({ 
				name: 'idle', 
				model: data, 
				condition: inputs => ( 
						(inputs.forward === false ||
								inputs.forward === false)
						&& (inputs.shift === false)),
		});
		idleState.setAnimation( actions['idle'] );

		/* define walk state */
		const walkState = new State({ 
				name: 'walk', 
				model: data, 
				condition: inputs => ( 
						(inputs.forward === true ||
								inputs.forward === true)
						&& (inputs.shift === false)),
		});
		walkState.setAnimation( actions['walk'] );
		walkState.setMovement( mover.moveFoward );

		/* define run state */
		const runState = new State({ 
				name: 'run', 
				model: data, 
				condition: inputs => ( 
						(inputs.forward === true ||
								inputs.forward === true)
						&& (inputs.shift === true)),
		});
		runState.setAnimation( actions['run'] );
		runState.setMovement( mover.moveFoward );

		/* state connections */
		const stateConnnections = [
				['idle', 'walk'],
				['idle', 'run' ],
				['walk', 'idle'],
				['walk', 'run' ],
				['run', 'walk' ],
				['run', 'idle' ],
		];

		// states to process
		const states = [ idleState, walkState, runState  ]; 
		// update callback function
		const updateCallback = (delta, inputs, model) => {
		}
		// create state machine
		const stateMachine = createFiniteStateMachine( 
				states, stateConnnections, data, 'idle', // updateCallback 
		);

		//console.log("stateMachine", stateMachine);
		stateMachine.print_paths();
		console.log("current state:", 
				stateMachine.getCurrentState()._name
		);

		/* update function
		 * this witll call the state machine updater
		 * and pass the inputs to it  */
		data.tick = delta =>  {
				stateMachine.update(
						delta, // pass the delta
						controller.getInputs(), // pass the input
				);
				mixer.update(delta); // update animation
		}

		/* scale n' tweaks */
		let scale = 0.8; // scale down 
		data.scale.set(scale, scale, scale);
		data.position.set(0, 0, 0)

		// make models have shadows
		if(data.traverse)
				data.traverse( child => {
						if( child.isMesh ){
								child.castShadow = true;
								child.receiveShadow = true;
						}
				});

		return data;
}





/*
const walkState = new State("walk", actions.walk);
walkState.enter = (curAction, previousState) => {
		if(previousState){
				if(previousState.Name == 'Run'){
						const ratio = curAction.getClip().duration / prevAction.getClip().duration;
						curAction.time = previousState.time * ratio;
				}else{
						curAction.time = 0.0;
						curAction.setEffectiveTimeScale(1.0);
						curAction.setEffectiveWeight(1.0);
				}
				curAction.crossFadeFrom(prevAction, 0.5, true);
				curAction.play();
		}else{
				curAction.play();
		}
}
walkState.update = (delta, input) => {
		if (input.key.forward || input.key.backward) {
				if (input.key.shift) {
						this.SetState('run');
				}
				return;
		}
		this._parent.SetState('idle');
}
*/
	
export { loadModel }
