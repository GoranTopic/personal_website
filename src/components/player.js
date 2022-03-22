import { Color, Mesh, AnimationMixer, TextureLoader, MathUtils, Vector3,
		Quaternion, MeshStandardMaterial, MeshPhongMaterial, BackSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { State, createFiniteStateMachine } from '../systems/StateMachine';
import { KeyboardInputController } from '../systems/inputs';
import { movement } from '../systems/movement/movement';

const loader = new FBXLoader();
const textLoader = new TextureLoader();

let data;

async function loadPlayer(camera){
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
				camera: camera,
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
						(inputs.forward === false &&
								inputs.backward === false && 
								inputs.left === false &&
								inputs.right === false)
				)
		});
		idleState.setAnimation( actions['idle'] );
		idleState.setEnterCallback( (curState, prevState) => {  
				const idleAction = curState._animation;
				if (prevState) {
						const prevAction = prevState._animation;
						idleAction.time = 0.0;
						idleAction.enabled = true;
						idleAction.setEffectiveTimeScale(1.0);
						idleAction.setEffectiveWeight(1.0);
						idleAction.crossFadeFrom(prevAction, 0.5, true);
						idleAction.play();
				} else {
						idleAction.play();
				}
				walkWait = 0;
		});

		let walkWait = 0;
		let wait2Run = 30;
		let runningSpeed=380;
		/* define walk state */
		const walkState = new State({ 
				name: 'walk', 
				model: data, 
				condition: inputs => ( 
						(inputs.forward || inputs.left || inputs.right || inputs.backward )
						&& ( (walkWait < wait2Run ) )
				),
		});
		walkState.setAnimation( actions['walk'] );
		walkState.setMovement( mover.moveFoward() );
		walkState.setUpdateCallback( () => {
				walkWait += 1;
		});
		walkState.setEnterCallback( (curState, prevState)  => {
				const curAction = curState._animation;
				if (prevState) {
						const prevAction = prevState._animation;
						curAction.enabled = true;
						if (prevState.Name == 'run') {
								const ratio = curAction.getClip().duration / prevAction.getClip().duration;
								curAction.time = prevAction.time * ratio;
						} else {
								curAction.time = 0.0;
								curAction.setEffectiveTimeScale(1.0);
								curAction.setEffectiveWeight(1.0);
						}
						curAction.crossFadeFrom(prevAction, 0.5, true);
						curAction.play();
				} else {
						curAction.play();
				}
		});

		/* define run state */
		const runState = new State({ 
				name: 'run', 
				model: data, 
				condition: inputs => (
						(inputs.forward || inputs.left || inputs.right || inputs.backward )
						&& ( (walkWait > wait2Run ) )
				),
		});
		runState.setAnimation( actions['run'] );
		runState.setMovement( mover.moveFoward(runningSpeed) );
		runState.setEnterCallback( (curState, prevState) => {
				const curAction = curState._animation;
				if (prevState) {
						const prevAction = prevState._animation;
						curAction.enabled = true;
						if (prevState._name == 'walk') {
								const ratio = curAction.getClip().duration / prevAction.getClip().duration;
								curAction.time = prevAction.time * ratio;
						} else {
								curAction.time = 0.0;
								curAction.setEffectiveTimeScale(1.0);
								curAction.setEffectiveWeight(1.0);
						}
						curAction.crossFadeFrom(prevAction, 0.5, true);
						curAction.play();
				} else {
						curAction.play();
				}
		});
		runState.setExitCallback( () => {
				walkWait = 0;
		});


		/* state connections */
		const stateConnnections = [
				['idle', 'walk'],
				['idle', 'run' ],
				['walk', 'idle'],
				['walk', 'run' ],
				['run', 'walk' ],
				['run', 'idle' ],
		];

		const globalUpdate = () => {
				//console.log(data.rotation)
		}

		// states to process
		const states = [ idleState, walkState, runState ]; 

		/* global  update callback function */
		const updateCallback = (delta, inputs, model) => {}

		// create state machine
		const stateMachine = createFiniteStateMachine( 
				states, stateConnnections, data, 'idle', globalUpdate
		);

		//stateMachine.print_paths();
		//console.log("current state:", stateMachine.getCurrentState()._name);

		/* update function
		 * this witll call the state machine updater
		 * and pass the inputs to it  */
		data.tick = delta =>  {
				stateMachine.update(
						delta, // pass the delta
						controller.getInputs(), // pass the input
				);
				// update animation 
				mixer.update(delta);
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


export { loadPlayer }
