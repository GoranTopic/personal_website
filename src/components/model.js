import { Color, Mesh, AnimationMixer, TextureLoader, MathUtils, Vector3,
		Quaternion, MeshStandardMaterial, MeshPhongMaterial, BackSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { KeyboardInputController } from '../systems/imputs';
import { movement } from '../systems/movement/movment';

const loader = new FBXLoader();
const textLoader = new TextureLoader();


async function loadModel(){
		/* model
		 * The mode has some key component,
		 * - the state machine that handles the state of the object.
		 * - the animation mixed which is stored to each state 
		 * - the input controler which check if there are keybord input 
		 *		and passes it to the state machince to change the state
		 * - the mover wich moves the objec on each state.
		 * */

		const data = await loader.loadAsync('../../resources/Alien_Helmet.fbx');
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

		// make input controller
		const controller = new KeyboardInputController();

		// mover component 
		const mover = new movement({
				model: data,
		});


		// color the model
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

		// configure idle State
		const idleState = {};
		idleState.name = 'idle';
		idleState.model = data;
		idleState.animation = actions['idle'];
		idleState.condition =
				inputs => ( //  
						inputs.forward === false 
						&& inputs.backward === false
				);
		idleState.enter = () => {};
		idleState.update = (delta, inputs, model) => {};
		idleState.exit = () => {};
		// to states
		idleState.to = [ { 
				state: 'walk',
				callback: ()=> {}, 
		},{
				state: 'run',
				callback: ()=> {}, 
		}];
		// from idle states
		idleState.from = [{
				state: 'walk',
				callback: () => {},
		},{
				state: 'run',
				callback: () => {},
		}];

		// Configure Walk State
		const walkState = {};
		walkState.name = 'walk';
		walkState.model = data;
		walkState.animation = actions['walk'];
		walkState.condition = 
				inputs => ( 
						(inputs.forward === true ||
								inputs.forward === true)
						&& (inputs.shift === false) // shift must be off 
				);
		walkState.enter = () => {};
		walkState.update =
				(delta, inputs, model) => {
						// move  foward object
						console.log("update in state ran");
						mover.moveFoward(delta);
				};
		walkState.exit = () => {};
		walkState.to = [ { 
				state: 'run',
				callback: () => {}, 
		},{
				state: 'idle',
				callback: () => {}, 
		}];
		walkState.from = [{
				state: 'idle',
				callback: () => {},
		}];


		/*
		// run state config
		const runState = {}; 
		runState.name = 'run';
		runState.model = data;
		runState.animation = actions['run'];
		// implement condition with shift
		runState.condition = 
				inputs => (inputs.forward === true && inputs.shift === true);
		runState.enter = () => {};
		runState.update = (delta, inputs, model) => {
				if(inputs.left && inputs.right) return;
				if(inputs.left)
						model.rotation.y += radiansPerSecondRun * delta;
				else if(inputs.right)
						model.rotation.y -= radiansPerSecondRun * delta;
		};
		runState.exit = () => {};
		runState.to =  [{ 
				state: 'idle',
				callback: () => {},
		},{
				state: 'walk',
				callback: () => {},
		},];
		runState.from = [{ 
				state: 'walk',
				callback: ()=>{},
		},];
		*/

		// create  state machine
		const stateMachine = createFiniteStateMachine(
				[ idleState, walkState ], // state to process
				'idle', // initial state
				(delta, inputs, model) => {
						// update the mover
						mover.update(delta); 
						// update animation
						mixer.update(delta);
				}
		);

		//console.log("stateMachine", stateMachine);
		stateMachine.print_paths();


		/* update function */
		data.tick = delta =>  
				/*  this witll call the state machine updater
						and pass the inputs to it  */
				stateMachine.update(
						delta, // pass the delta
						controller.getInputs(), // pass the input
				);


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





class State{
		constructor(s){
				this._paths = [];
				this._name = s.name;
				this._exit = s.exit;
				this._enter = s.enter;
				this._model = s.model;
				this._update = s.update;
				this._animation = s.animation;
				this._conditionOfEntry = s.condition;
		} 

		update = (delta, inputs) => // wrapper function for update
				this._update(delta, inputs, this._model);

		addAdjecentState = state => { 
				/* save the input required to change
				 to a given adjecent states */
				this._paths.push({
						name: state._name,
						condition: state._conditionOfEntry,
						state: state,
				});
		}

		checkPathConditions = (delta, inputs) => {
				/* this is the function in every state which 
				 decied what state to change on a give inpu
				 since this is call by update() in the game loop it has to be fast */
				for( let path of this._paths ) // if condition matches
						if(path.condition(inputs, delta, this))
								return path.state;
				return null;
		}

}

class StateMachine {
		constructor(update){
				this.states = {};
				this.vertices = {};
				this.currentState = null;
				this.previousState = null;
				this.globalUpdate = null;
		}
		
		print_paths = () => {
				for (const [name, state] of Object.entries(this.states)) 
						state._paths.forEach(path => 
								(name === path.name) || console.log(name, " -> ", path.name)
						);
		}

		addState(state){
				this.states[state.name] = new State(state);
		}

		initialState(stateName){
				this.currentState = this.states[stateName];
		}

		addVertex(fromState, toState){
				// if stat is just a place holder
				fromState = fromState.state? 
						this.states[fromState.state] : this.states[fromState.name];
				// get th objects
				toState = toState.state?
						this.states[toState.state] : this.states[toState.name];
				// if state could not be found, exit
				if([fromState, toState].some(s => s === undefined))
						return; // exit
				// create a vertice to map, if vertex is new
				if(!this.vertices[fromState._name])  
						this.vertices[fromState._name] = {}
						//if vertex already exists
				else if(this.vertices[fromState._name][toState._name]) 
						return; 
				else{
						// mark new vertex
						this.vertices[fromState._name][toState._name] = true
						// add adjacent vetexs
						fromState.addAdjecentState(toState);
				}
		}

		changeState(newState){ // new state is the string of the state name
				if(newState === null)
						return; // passed state is null
				if(this.currentState._name === newState._name){
						// if same state
						return; // do nothing
				}
				//console.log(this.vertices[this.currentState._name][newState._name]);
				if(!this.vertices[this.currentState._name][newState._name]){ 
						// check if vetices
						console.error("could not change stat, there are no vertices bewteen them");
						return;
				}
				// swap states 
				this.previousState = this.currentState
				this.currentState = newState;
				// run exit function from the previous state
				this.previousState._exit();
				// stop previous animation 
				if(this.previousState?._animation)
						this.previousState._animation.stop()
				// run enter state function
				this.currentState._enter();
				// play animation 
				if(this.currentState._animation)
						this.currentState._animation.play()
		}
		
		getAdjecentCurrentStates = () => 
				this.vertices[this.currentState.name];

		setGlobalUpdate = update => 
				this.globalUpdate = update;
		

		update = (delta, inputs) =>  {
				// run globale update
				if(this.globalUpdate)
						this.globalUpdate(delta, inputs);
				//console.log(this.currentState.checkPathCondition(delta, inputs));
				// run the update function in each state
				this.currentState.update(delta, inputs);
				// check the condition of the inputs to determine wheter to move state
				this.changeState(
						this.currentState.checkPathConditions(delta, inputs)
				);
		}
}

function createFiniteStateMachine(states, initialState, globalUpdate){
		// create state machine
		const machine = new StateMachine();
		try{ // add states to machine
				// add all state, or nodes
				states.forEach( state => machine.addState(state) )
				// add vertexs
				states.forEach( state => { 
						state.to.forEach( toState => // add verte to 
								machine.addVertex(state, toState));
						state.from.forEach( fromState => // add vertex from
								machine.addVertex(fromState, state));
						machine.addVertex(state, state) // add link to self
				});
				// initialize
				machine.initialState(initialState);
				// global update
				machine.setGlobalUpdate(globalUpdate);
				// play animation in initial state
				machine.currentState._animation.play();
		}catch(e){ console.log(e) }
		// return finite state machine
		return machine;	
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
