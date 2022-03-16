class BasicCharacterInput{
		constructor(){
				this.keys = {
						foward: false,
						backwards: false,
						left: false,
						right: false,
						space: false,
						swift: false,
				}
				document.addEventListener('keydown', e => this.onKey(e, isDown=true), false);
				document.addEventListener('keyup', e => this.onKeyUp(e, isDown=false), false);
		}

		onKey(event, isDown){
				switch (event.keyCode){
						case 87: // w 
								this._keys.foward = isDown? true : false;
								break;
						case 65: // a
								this._keys.left =  isDown? true : false;
								break;
						case 68: // d 
								this._keys.right = isDown? true : false;
								break;
						case 83: // s 
								this._keys.backward = isDown? true: false;
								break;
						case 32: // space 
								this._keys.space = isDown? true: false;
								break;
						case 16: // swift 
								this._keys.swift = isDown? true: false;
								break;
				}
		}
}
