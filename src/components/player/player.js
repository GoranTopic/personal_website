import { Color, Mesh, AnimationMixer, TextureLoader, MathUtils, Vector3,
		Quaternion, MeshStandardMaterial, MeshPhongMaterial, BackSide, Raycaster } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { State, createFiniteStateMachine } from '../systems/StateMachine';
//import { inputs } from '../systems/inputs';
import { inputs } from '../systems/inputs';
import { movement } from '../systems/movement/movement';
import { camera, plane, marker } from '../world/world';

const loader = new FBXLoader();
const textLoader = new TextureLoader();

let data;
async function loadPlayer(){
		/* model
		 * The mode has some key component,
		 * - the state machine that handles the state of the object.
		 * - the animation mixed which is stored to each state 
		 * - the input controler which check if there are keybord input 
		 *		and passes it to the state machince to change the state
		 * - the mover wich moves the objec on each state.
		 * */
		
		// is the user clicks on the plane, this var has the position 
		let clickedPosition = null;

		let data = await loader.loadAsync('../../resources/Alien_Helmet.fbx');
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

		/* mover component  */ 
		const mover = new movement({
				model: data,
		});
		//add mover
		data['mover'] = mover;

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
												flatShading: false, });
										return m;
								});
								child.material = material;
								child.material.needsUpdate = true;
						}
				});


		/* define idle state */
		let radioOfError = 10;
		const idleState = new State({ 
				name: 'idle', 
				model: data, 
				condition: () => { 
						if(clickedPosition)
								// radion of error it had
								return ((Math.abs(data.position.x - clickedPosition.x) < radioOfError) &&
										(Math.abs(data.position.z - clickedPosition.z) < radioOfError))
						else{		
								if(inputs.checkKey()){
										let keys =  inputs.getKeyInputs();
										return (keys.forward === false &&
												keys.backward === false && 
												keys.left === false &&
												keys.right === false);
								}else return true
						}
				}
		});
		idleState.setAnimation( actions['idle'] );
		idleState.setEnterCallback( (curState, prevState) => {  
				clickedPosition = null;
				// rmove marker 
				marker.hide();
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

		/* walking state */
		let walkWait = 0;
		let wait2Run = 50;
		let runningSpeed=380;
		/* define walk state */
		const walkState = new State({ 
				name: 'walk', 
				model: data, 
				condition: () => {
						if(clickedPosition)
								return  ( (walkWait < wait2Run ) &&
										!((data.position.x === clickedPosition.x) && 
												(data.position.z === clickedPosition.z))
								);
						else{
								if(inputs.checkKey()){
										let keys =  inputs.getKeyInputs();
										return (
												(keys.forward || keys.left || keys.right || keys.backward )
												&& ( walkWait < wait2Run  )
										)
								}else false
						}
				},
		});
		walkState.setAnimation( actions['walk'] );
		walkState.setMovement( mover.moveFoward() );
		walkState.setUpdateCallback( () => {
				walkWait += 1;
		});
		walkState.setEnterCallback( (curState, prevState) => {
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
				condition: () => {
						if(clickedPosition)
								return  ( (walkWait > wait2Run ) &&
										!((data.position.x === clickedPosition.x) && 
												(data.position.z === clickedPosition.z))
								);
						else{ 
								if(inputs.checkKey()){
										let keys =  inputs.getKeyInputs();
										return (
												(keys.forward || keys.left || keys.right || keys.backward )
												&& ( (walkWait > wait2Run ) )
										)
								}else return false
						}
				},
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
				/*[ from -> to ] state*/
				['idle', 'walk'],
				['walk', 'idle'],
				['walk', 'run' ],
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
				let keyInput = inputs.getKeyInputs();
				//console.log(keyInput);
				//console.log(Object.values(keyInput).some( v => v === true))
				if( inputs.checkKey() )
						if(clickedPosition){
								clickedPosition = null;
								data.lookAt(0,0,0);
						}
						stateMachine.update(
								delta, // pass the delta
								keyInput, // pass the input
						);
				if( inputs.checkClick() ){
						let clickPos = inputs.getMouseClick();
						// let ray trace to get the model to look the the plane
						// use a ray to get the intersection with the plane obj
						let raycaster = new Raycaster();
						raycaster.setFromCamera( clickPos, camera );
						const intersects = raycaster.intersectObject( plane, false );
						//if there was a intersect
						let intersect = intersects.length > 0 ?
								intersects[0].point.add(intersects[0].face.normal)
								: null
						// set global clickedPosition
						clickedPosition = intersect;
						// set marker 
						marker.placeAt(intersect);
						// look at that point
						data.lookAt(intersect);
						// call state machine
						//console.log(clickedPosition)
				}
				// pass detla to update
				stateMachine.update(delta );
				// update animation 
				mixer.update(delta);
		}

		/* scale n' tweaks */
		let scale = 0.8; // scale down 
		data.scale.set(scale, scale, scale);
		// set initial position 
		data.position.set(500, 0, 0)

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
