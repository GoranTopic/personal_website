import { Vector2, Vector3, Raycaster } from 'three' ;

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

class MouseInputControlller{
		constructor(){
				this._mouseClicked = false;
				this.inputs = {
						mousePosition: new Vector2(),
						mouseClick: new Vector2(),
				};
				//event listeneres
				document.addEventListener( 'pointermove', this.handleMouseMove  );
				document.addEventListener( 'pointerdown', this.handlePlaneClick );
		}

		
		/* handle mouse click on plane*/
		handlePlaneClick = event => {
				/* get click on screen */
				this.inputs.mouseClick.set( 
						( event.clientX / window.innerWidth ) * 2 - 1,
						- ( event.clientY / window.innerHeight ) * 2 + 1
				);
				// mark as clicked
				this._mouseClicked = true;
		}

		/* handle mouse movement */
		handleMouseMove = (event, isDown) => 
				this.inputs.mousePosition.set( 
						( event.clientX / window.innerWidth ) * 2 - 1,
						- ( event.clientY / window.innerHeight ) * 2 + 1
				);

		checkClick = () => this._mouseClicked;

		getInputs = () => { 
				//set the most recent mouse click to false
	 			this._mouseClicked = false;
				// makr the most recenet click as off 
				// every time it is checked
				return this.inputs;
		}
}


export { KeyboardInputController, MouseInputControlller }
