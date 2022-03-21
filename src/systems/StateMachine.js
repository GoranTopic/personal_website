class State{
		constructor(s){
				this._targetStates = [];
				this._name = s.name;
				this._model = s.model;
				this._conditionOfEntry = s.condition;
				this._exit = s.exit || null;
				this._enter = s.enter || null;
				this._update = s.update || null;
				this._animation = s.animation || null;
				this._movement = s.movement || null;
		} 

		/* set exit callaback */
		setExitCallback = cb => this._exit = cb;
		/* set enter callaback */
		setEnterCallback = cb => this._enter = cb;
		/* set unpdate callaback */
		setUpdateCallback = cb => this._update = cb;
		/* set animation to play callaback */
		setAnimation = ani => this._animation = ani;
		/* set movement to play callaback */
		setMovement = mov => this._movement = mov;

		/* wrapper function for update of the state */
		update = (delta, inputs) => {
				// check if it has animation action
				this._animation?.play()
				//console.log(this._animation?.play())
				// check if it has the motion function
				this._movement && this._movement(this._model, delta);
				// at the end run the update callaback
				this._update && this._update(delta, inputs, this._model);
		}

		/* save the input required to change
				 to a given adjecent states */
		addToState = state => this._targetStates.push(state);

		/* check if the condition to enter is true */
		checkConditionOfEntry = (inputs, delta) => 
				this._conditionOfEntry(inputs, delta)

		/* this is the function in every state which 
				 decied what state to change on a give inpu
				 since this is call by update() in the game loop it has to be fast */
		checkStateConditions = (delta, inputs) => {
				for(let state of this._targetStates ) // if condition matches
						if(state.checkConditionOfEntry(inputs, delta))
								return state;
				return null;
		}
}


class FinateStateMachine {
		/* this object keeps track fo the states,
		 *  their edges and current and previous State
		 *  it also runs the callabacks for enteing and exiting
		 *  it also has itsown update function */
		constructor(){
				this._states = [];
				this._currentState = null;
				this._previousState = null;
				this._update = null;
		}

		/* print he connection between all the states */
		print_paths = () => {
				for (const state of this._states){
						state._targetStates.forEach(target => 
								(state._name === target._name) || 
								console.log(target._name, " -> ", target._name)
						);
				}
		}

		/* get current state */
		getCurrentState = () => 
				this._currentState
		
		/* this sets update callback */
		setUpdateCallback = update => 
				this._update = update;
		
		
		/* looks for states in states array */
		getStateByName = name => 
				this._states.filter( s => s._name === name)[0]
		

		/* add the obj or a state to the states array */
		addState = state => 
				this._states.push(state)
				
		/* set the current state
		 * takes a state instance or 
		 * the name of the state */
		setCurrentState = state => {
				if(typeof state ===  "string")
						state = this.getStateByName(state);
				this._currentState = state;
		}

		/* this functino takes a list of connections 
		 * and makes connection to the states based on it */
		addConnection = connection => {
				let from, to;
				if(connection instanceof Array) // if it is just an array
						[ from, to ] = connection;
				else 
						({ from, to } = connection)
				// if it is a string 
				if(typeof from ===  "string") 
						from = this.getStateByName(from);
				if(typeof to ===  "string")
						to = this.getStateByName(to);
				// connect states
				if( from && to ) // make use the are no undefined
						from._targetStates.push(to)
		} 

		/* this functions changes the current state to the one passed*/
		changeState = state => { // new state is the string of the state name
				// passed state is null
				if(state === null) return; 
				// if it id passed a string
				console.log('current state:', this._currentState._name);
				console.log('chaging to:', state._name);
				if(typeof state ===  "string")
						state = this.getStateByName(state);
				// if it is in same state
				if(this._currentState._name === state._name) return; 
				// swap states 
				this._previousState = this._currentState
				this._currentState = state;
				// run exit function from the previous state
				this._previousState._exit &&
						this._previousState._exit();
				this._previousState?._animation?.stop &&
						this._previousState?._animation?.stop();
				// run enter functions from next state
				this._currentState?._enter &&
						this._currentState?._enter();
				if(this._currentState?._animation?.play){
						this._currentState?._animation.play();
				}
		}
		
		update = (delta, inputs) =>  {
				// run globale update
				//this._update && this._update(delta, inputs);
				//console.log('this update', this._update);
				// run the update function in each state
				this._currentState.update(delta, inputs);
				// check the condition of the inputs to determine wheter to move state
				this.changeState(
						this._currentState.checkStateConditions(delta, inputs)
				);
		}
}

/* this function take care of the hassle of creating a state machine */
function createFiniteStateMachine( states, connections, 
		model, initialState, globalUpdate=null ){
		// create state machine
		const machine = new FinateStateMachine();
		// add states to machine
		// add all state, or nodes
		states.forEach( state => machine.addState(state) )
		// add connections
		connections.forEach( connection => 
				machine.addConnection(connection))
		// initialize
		machine.setCurrentState(initialState);
		// global update
		machine.setUpdateCallback(globalUpdate);
		// run the update callback
		machine.getCurrentState().update()
		// return finite state machine
		return machine;	
}

export { createFiniteStateMachine, FinateStateMachine, State }
