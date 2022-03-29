import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { inputs } from '../../systems/inputs';
import { setup_stateMachine } from './stateMachine';
import { setup_model } from './setup';
import { setup_inputHandler } from './inputs_handler';


const loader = new FBXLoader();

let player;

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
		let data = await loader.loadAsync(
				'../../../resources/player_models/Individual Characters/FBX/Adventurer.fbx',
		);
		// make animation mixer
		
		// setup player 
		player = setup_model(data);

		// setup stateMachine
		player = setup_stateMachine(player);

		// handle mouse input
		player = setup_inputHandler(player);

		/* update function
		 * this witll call the state machine updater
		 * and pass the inputs to it  */
		player.tick = delta => {
				// handle inputs
				player.handleInputs(delta, inputs);
				// pass detla to update
				player.stateMachine.update(delta, inputs);
				// update animation 
				player.mixer.update(delta);
		}

		return player;
}


export { loadPlayer }
