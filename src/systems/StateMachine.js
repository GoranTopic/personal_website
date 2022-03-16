class FiniteStateMachine {
		constructor(){
				// set state to empty obj
				this._state = {}; 
				// initilized current state to null
				this._currentState = null;
		}

		AddState(name, type) {
				// adds a state name and saves it type;
				this._state[name] = type;
		}

		setState(name){ // for an already defined state
				// change to that state?
				// set the current state as the previous one
				const prevState = this._currentState;
				// if there was a previous state, 
				if(prevState){ 
						// and the state to add is the same as the previous oene.
						if(prevState.Name === name){
								return; // do nothing
						}
						// if it is a difrent state
						prevState.Exit(); // exit
				}
				// add new state 
				const state = new this._state[name](this);
				// set this state as current 
				this._currentState = state;
				// Enter prevState?
				state.Enter(prevState);
		}

		update(timeElapsed, input){
				if(this._currentState){
						this._currentState.update(timeElapsed, input);
				}
		}

}

class State {
		constructor(parent){
				this._parent = parent;
		}

		Enter(){}
		Exit(){}
		Update(){}
}

class DanceState extends State{
		constructor(parent){
				super(parent);
				this._FinishedCallback = () => {
						this._Finished();
				}
		}

		get Name(){
				return 'dance';
		}
		Enter(prevState){
				const curAction = this._parent._proxy._animations['dance'].action;
				const mixer = curAction.getMixer();
				mixer.addEvenListener('finished', this._FinishedCallback);

				if (prevState) {
						const prevAction = this._parent._proxy._animations[prevState.Name].action;
						curAction.reset();  
						curAction.setLoop(THREE.LoopOnce, 1);
						curAction.clampWhenFinished = true;
						curAction.crossFadeFrom(prevAction, 0.2, true);
						curAction.play();
				} else {
						curAction.play();
				}
		}

		_Finished() {
				this._Cleanup();
				this._parent.SetState('idle');
		}
		_Cleanup() {
				const action = this._parent._proxy._animations['dance'].action;
				action.getMixer().removeEventListener('finished', this._CleanupCallback);
		}
		Exit() {
				this._Cleanup();
		}
		Update(_) {
		}
}


class WalkState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'walk';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['walk'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

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
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input._keys.forward || input._keys.backward) {
      if (input._keys.shift) {
        this._parent.SetState('run');
      }
      return;
    }

    this._parent.SetState('idle');
  }
};


class RunState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'run';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['run'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'walk') {
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
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input._keys.forward || input._keys.backward) {
      if (!input._keys.shift) {
        this._parent.SetState('walk');
      }
      return;
    }

    this._parent.SetState('idle');
  }
};


class IdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'idle';
  }

  Enter(prevState) {
    const idleAction = this._parent._proxy._animations['idle'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  Exit() {
  }

  Update(_, input) {
    if (input._keys.forward || input._keys.backward) {
      this._parent.SetState('walk');
    } else if (input._keys.space) {
      this._parent.SetState('dance');
    }
  }
};
