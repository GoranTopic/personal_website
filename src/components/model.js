import { Color, Mesh, AnimationMixer, TextureLoader, MathUtils, Vector3,
		MeshStandardMaterial, MeshPhongMaterial, BackSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const loader = new FBXLoader();
const textLoader = new TextureLoader();


class KeyboardInputController{
		constructor(){
				this.inputs = {
						forward: false,
						backward: false,
						left: false,
						right: false,
						space: false,
						shift: false,
				}
				document.addEventListener('keydown', e => this.onKeyChange(e, true), false);
				document.addEventListener('keyup', e => this.onKeyChange(e, false), false);
		}

		onKeyChange = (event, isDown) => {
				switch (event.keyCode){
						case 87: // w 
								this.inputs.forward = isDown? true : false;
								break;
						case 65: // a
								this.inputs.left =  isDown? true : false;
								break;
						case 68: // d 
								this.inputs.right = isDown? true : false;
								break;
						case 83: // s 
								this.inputs.backward = isDown? true: false;
								break;
						case 32: // space 
								this.inputs.space = isDown? true: false;
								break;
						case 16: // swift 
								this.inputs.shift = isDown? true: false;
								break;
				}
		}
		getInputs = () => this.inputs;
}


async function loadModel(){
		// model
		const data = await loader.loadAsync('../../resources/Alien_Helmet.fbx');

		//console.log("astro!", data);
		const mixer = new AnimationMixer( data );

		// make input controller
		const controller = new KeyboardInputController();

		// choose animation 
		const actions = {};
		// get the actions to the actions
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

		// make shadow
		if(data.traverse)
				data.traverse( child => {
						if( child.isMesh ){
								child.castShadow = true;
								child.receiveShadow = true;
						}
				});


		data.traverse(
				child => { // color model 
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

		// scale n' tweaks
		let scale = 0.8;
		data.scale.set(scale, scale, scale);
		data.position.set(0, 0, 0)

		// how much to turn when you run
		const radiansPerSecondRun = MathUtils.degToRad(30);
		// how much to turn when walking
		const radiansPerSecondWalk = MathUtils.degToRad(45);
		// how much to turn when idle
		const radiansPerSecondIdle = MathUtils.degToRad(60);

		// idle state configurations 
		const idleState = {};
		idleState.name = 'idle';
		idleState.model = data;
		idleState.action = actions['idle'];
		idleState.condition =
				inputs => ( 
						inputs.forward === false 
						|| inputs.forward === false
				);
		idleState.enter = () => {};
		idleState.update = (delta, inputs, model) => {
				if(inputs.left && inputs.right) return;
				if(inputs.left)
						model.rotation.y += radiansPerSecondIdle * delta;
				else if(inputs.right)
						model.rotation.y -= radiansPerSecondIdle * delta;
		};
		idleState.exit = () => {};
		idleState.to = [ { 
				state: 'walk',
				callback: ()=> {}, 
		},{
				state: 'run',
				callback: ()=> {}, 
		}];
		idleState.from = [{
				state: 'walk',
				callback: () => {},
		},{
				state: 'run',
				callback: () => {},
		}];

		// I don't kow what I am doing 
		const decceleration = new Vector3(-0.0005, -0.0001, -5.0);
		const acceleration = new Vector3(1, 0.25, 50.0);
		const velocity = new Vector3(0, 0, 0);
		const frameDecceleration = new Vector3(
				velocity.x * decceleration.x,
				velocity.y * decceleration.y,
				velocity.z * decceleration.z
		);

		// walk state config
		const walkState = {};
		walkState.name = 'walk';
		walkState.model = data;
		walkState.action = actions['walk'];
		walkState.condition = 
				inputs => ( 
						(inputs.forward === true ||
								inputs.forward === true)
						&& (inputs.shift === false) // shift must be off 
				);
		walkState.enter = () => {};
		walkState.update = (delta, inputs, model) => {
				
				// someone help me plz
				frameDecceleration.multiplyScalar(delta);
				frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
						Math.abs(frameDecceleration.z), Math.abs(velocity.z));
				
				// add to the velocity vector, why??
				velocity.add(frameDecceleration);
				//local copy of acceleration? 
				const acc = acceleration.clone();
				// what is even life
				// add to velocity
				velocity.z += acc.z * delta;
				// foward vector
				const forward = new Vector3(0, 0, 1);
				forward.applyQuaternion(model.quaternion);
				forward.normalize();
				// sideways ?? wat!?
				const sideways = new Vector3(1, 0, 0);
				sideways.applyQuaternion(model.quaternion);
				sideways.normalize();
				// this guy does not comment anything
				sideways.multiplyScalar(velocity.x * delta);
				forward.multiplyScalar(velocity.z * delta);
				// ok I know this add it to the model, at least i know that..
				model.position.add(forward);
				model.position.add(sideways);
				
				console.log("rotation:", model.rotation);
				if(inputs.left && inputs.right) return;
				if(inputs.left)
						model.rotation.y += radiansPerSecondWalk * delta;
				else if(inputs.right)
						model.rotation.y -= radiansPerSecondWalk * delta;
				
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

		// run state config
		const runState = {}; 
		runState.name = 'run';
		runState.model = data;
		runState.action = actions['run'];
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

		const states = [ idleState, walkState, runState ]
		// create  state machine
		const stateMachine = createFiniteStateMachine(states, 'idle');
		//console.log("stateMachine", stateMachine);
		stateMachine.currentState._action.play();
		stateMachine.print_paths();

		data.tick = delta => { // update function
				// get keyboard inputs
				let inputs = controller.getInputs();
				// update state
				stateMachine.update(delta, inputs);
				// update animation
				mixer.update(delta);
		}
		return data;
}

class State{
		constructor(s){
				this._name = s.name;
				this._action = s.action;
				this._enter = s.enter;
				this._model = s.model;
				this._exit = s.exit;
				this._paths = [];
				this._update = s.update;
				this._conditionOfEntry = s.condition;
		} 

		_updateCallback = (delta, inputs) => 
				this._update(delta, inputs, this._model);

		addAdjecentState(state){ 
				/* save the input required to change
				 to a given adjecent states */
				this._paths.push({
						name: state._name,
						condition: state._conditionOfEntry,
						state: state,
				});
		}

		checkPathCondition(delta, inputs){
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
		constructor(){
				this.states = {};
				this.vertices = {};
				this.currentState = null;
				this.previousState = null;
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
				// create a vertice to map
				if(!this.vertices[fromState._name]) 
						// if vertex is new
						this.vertices[fromState._name] = {} // add new
				else if(this.vertices[fromState._name][toState._name]) 
						//if vertex already exists
						return; 
				else{
						// mark new vertex
						this.vertices[fromState._name][toState._name] = true
						fromState.addAdjecentState(toState);
				}
		}

		changeState(newState){ // new state is the string of the state name
				if(newState === null)
						return; // passed state is null
				if(this.currentState._name === newState._name){
						//console.log("got same state:", newState)
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
				const previousState = this.currentState;
				this.currentState = newState;
				// run exit function from the previous state
				previousState._exit();
				// stop previous animation 
				previousState._action.stop()
				// run enter state function
				this.currentState._enter();
				this.currentState._action.play()
		}

		getAdjecentCurrentStates = () => 
				this.vertices[this.currentState.name];

		update = (delta, inputs) =>  {
				// get all posible states
				//console.log(this.currentState.checkPathCondition(delta, inputs));
				this.currentState._updateCallback(delta, inputs);
				this.changeState(
						this.currentState.checkPathCondition(delta, inputs)
				);
		}
}

function createFiniteStateMachine(states){
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
				machine.initialState('idle');
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
