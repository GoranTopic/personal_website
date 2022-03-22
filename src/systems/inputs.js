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
				document.addEventListener(
						'keydown',
						e => this.onKeyChange(e, true),
						false
				);
				document.addEventListener('keyup',
						e => this.onKeyChange(e, false),
						false
				);
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
						case 72: // h
								this.inputs.left = isDown? true: false;
								break;
						case 74: // j
								this.inputs.backward = isDown? true: false;
								break;
						case 75: // k
								this.inputs.forward = isDown? true: false;
								break;
						case 76: // l
								this.inputs.right = isDown? true: false;
								break;
				}
		}

		getInputs = () => this.inputs;
}

export { KeyboardInputController }
