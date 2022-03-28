import { Vector2 } from 'three';

class InputController{
		constructor(){
				this.inputs = {
						keyboard: {
								forward: false,
								backward: false,
								left: false,
								right: false,
								space: false,
								shift: false,
						},
						mouse: {
								// make sure we aree getting the latest mouse click
								isClicked: false, 
								position: new Vector2(),
								click: new Vector2(),
						}
				}
				// event listeners 
				// for keyboard
				document.addEventListener( 'keydown', e => this.onKeyChange(e, true), false);
				document.addEventListener('keyup', e => this.onKeyChange(e, false), false);
				// for mouse
				document.addEventListener( 'pointermove', this.handleMouseMove  );
				document.addEventListener( 'pointerdown', this.handleMouseClick );
		}

		// handle key press
		onKeyChange = (event, isDown) => {
				switch (event.keyCode){
						case 87: // w 
								this.inputs.keyboard.forward = isDown? true : false;
								break;
						case 65: // a
								this.inputs.keyboard.left =  isDown? true : false;
								break;
						case 68: // d 
								this.inputs.keyboard.right = isDown? true : false;
								break;
						case 83: // s 
								this.inputs.keyboard.backward = isDown? true: false;
								break;
						case 72: // h
								this.inputs.keyboard.left = isDown? true: false;
								break;
						case 74: // j
								this.inputs.keyboard.backward = isDown? true: false;
								break;
						case 75: // k
								this.inputs.keyboard.forward = isDown? true: false;
								break;
						case 76: // l
								this.inputs.keyboard.right = isDown? true: false;
								break;
						case 32: // space 
								this.inputs.keyboard.space = isDown? true: false;
								break;
						case 16: // swift 
								this.inputs.keyboard.shift = isDown? true: false;
								break;
				}
		}

		/* handle mouse movement */
		handleMouseMove = event => 
				this.inputs.mouse.position.set( 
						( event.clientX / window.innerWidth ) * 2 - 1,
						- ( event.clientY / window.innerHeight ) * 2 + 1
				);

		/* handle mouse click on plane*/
		handleMouseClick = event => {
				/* get click on screen */
				this.inputs.mouse.click.set( 
						( event.clientX / window.innerWidth ) * 2 - 1,
						- ( event.clientY / window.innerHeight ) * 2 + 1
				);
				// mark as clicked
				this.inputs.mouse.isClicked = true;
		}

		// getters 
		getKeyInputs = () => this.inputs.keyboard;
		getMousePos = () => this.inputs.mouse.position;
		getMouseClick = () => { 
				//set the most recent mouse click to false
				this.inputs.mouse.isClicked = false;
				// makr the most recenet click as off 
				// every time it is checked
				return this.inputs.mouse.click;
		}
		// safe way to check latest click
		checkClick = () => this.inputs.mouse.isClicked;
		// check if there are 
		checkKey = () => Object.values(this.inputs.keyboard).some( v => v === true );

}

const inputs = new InputController();


export { inputs } 
