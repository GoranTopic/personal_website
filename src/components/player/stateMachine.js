import { inputs } from '../../systems/inputs';
import { marker } from '../../world/world';
import { State, createFiniteStateMachine } from '../../systems/StateMachine';
import { hasReachedMarker, hasNotReachedMarker, hasKeyPress, hasArrowKeyPress, isTimeToRun, isNotTimeToRun } from './conditions'

function setup_stateMachine(model){

		let { runningSpeed } = model.vars;
		// get animations
		let actions  = model.animationActions;
		let mover = model.mover;


		/* Conditions of entry for states */
		// for idle state
		const conditions_to_be_idle = () => { 
						if(model.vars.isFollowingMarker){
								if(hasReachedMarker(model, marker))
										return true;
								else 
										return false;
						}else{		
								if(hasKeyPress(inputs)){
										if(hasArrowKeyPress(inputs))
												return false;
								}else return true
						}
				}

		// for walking
		const conditions_to_be_walking = () => {
						if(model.vars.isFollowingMarker){
								if(	hasNotReachedMarker(model, marker) &&
										isNotTimeToRun(model) )
										return true;
								else 
										return false
						}else{
								if(hasKeyPress(inputs)){
										if( hasArrowKeyPress(inputs) && 
												isNotTimeToRun(model) )
												return true;
										else
												return false;
								}else
										return false;
						}
				}

		// for running 
		const conditions_to_be_running = () => {
						if(model.vars.isFollowingMarker){
								if(	hasNotReachedMarker(model, marker) &&
										isTimeToRun(model) )
										return true;
								else
										return false;
						}else{
								if(hasKeyPress(inputs)){
										if( hasArrowKeyPress(inputs) && 
												isTimeToRun(model) )
												return true;
										else
												return false;
								}else
										return false;
						}
				}


		/* define idle state */
		const idleState = new State({ 
				name: 'idle', 
				model: model, 
				condition:  conditions_to_be_idle,
		});
		idleState.setAnimation( actions['idle'] );
		idleState.setEnterCallback( (curState, prevState) => {  
				// get fwllowing as false
				model.vars.isFollowingMarker = false;
				// remove marker 
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
				model.vars.walkTimer = 0;
		});

		/* define walk state */
		const walkState = new State({ 
				name: 'walk', 
				model: model, 
				condition: conditions_to_be_walking,
		});
		walkState.setAnimation( actions['walk'] );
		walkState.setMovement( mover.moveFoward() );
		walkState.setUpdateCallback( () => {
				// update walk timer
				model.vars.walkTimer += 1; 
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
				model: model, 
				condition: 	conditions_to_be_running,
		});
		runState.setAnimation( actions['run'] );
		runState.setMovement( mover.moveFoward(model.vars.runningSpeed) );
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
				model.vars.walkTimer = 0;
		});

		/* state connections */
		const stateConnnections = [
				/*[ from -> to ] state*/
				['idle', 'walk'],
				['walk', 'idle'],
				['walk', 'run' ],
				['run', 'idle' ],
		];

		const globalUpdate = (delta, inputs, model) => {
				// here we can write something we wan to 
				// every time any state get updated
				//console.log('current state:', model.stateMachine.getCurrentState())
		}

		// states to process
		const states = [ idleState, walkState, runState ]; 

		// create state machine
		const stateMachine = createFiniteStateMachine( 
				states, stateConnnections, model, 'idle', globalUpdate
		);

		// save state machine
		model.stateMachine = stateMachine;

		return model;
}


export { setup_stateMachine }
