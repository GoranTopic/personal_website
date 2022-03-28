import triggers from './triggers';

/* the postpous of this class is to changin together states which make the model,
 * move or have an animation base on a the inputs form the world.
 * for example if I want a mode to move to pace in th eplae it need to go trough
 * a few states. I want to be able to script this actions and ause them in difrent models*/
// for  example:

const moveKeyInputs = [ {  // no condition
		state: 'walk', 
}, {
		state: 'run',
		condition: (state, world) => state.walkTimer >= state.walkWait,
}, ]


const moveToClick = [ {
		state: 'walk', 
}, {
		state: 'run',
		condition: (state, world) => state.walkTimer >= state.walkWait,
}, ]




class ModelBehavior {
		constructor(stateMachine){
				this._triggers = []
				this._intructions = [];
				this._stateMachine
				this.runningIntrutions = null
		}
		

		update() => {
				// first check instructions triggers
				this.instrucions.forEach( inst => {
						if(inst.trigger()){ 
								this.runningIntrutions = inst
								this._stateMachine.changeState(
						}
				});
		}	


}

class instructionExecutor {
		constructor(name, trigger, instrucions=null, this.stateMachine){
				this.stateMachine = stateMachine;
				this.name = name;
				this.trigger = trigger;
				this.instrucions = instrucions;
				if(this.instrucions) // if instructions is passed
						this.currentInstruction = instrucions[0];
				else
						this.currentInstruction = null;
		}

		addInstruction = inst => {
				if(this.currentInstruction === null)
						this.currentInstruction = inst;
				this.instrucions.push(inst);
		}

		update = () => {
				if(this.currentInstruction.check_condition()){
				}
		}
}


class instruction {
		contructor(stateName, contructorOfEntry){
				this._state = stateName;
				this._condition = contructorOfEntry; 
		}

		// chekc if condition if true 
		check_condition = () => this._condition();

		// setters
		setCondition = con => this._condition = con;
		setState = state => this._state = state;
}
