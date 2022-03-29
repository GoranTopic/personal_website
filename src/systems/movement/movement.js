import { Vector3, Quaternion } from 'three';
import { camera }  from '../../world/world';

class movement{
		/* this class controls the movment vectors of a oject 
		 *  it uses the accelatation and velocity as well as PI somehow,
		 *  to make realistic movment*/
		constructor({ model, speed=170, turnSpeed=0.2 }){
				this.model = model;
				this.camera = camera
				this.speed = speed;
				this.turnSpeed = turnSpeed;
				this._velocity = new Vector3(0, 0, 0);
				this._rotation = 0;
				this._acc = 0;
		}

		setAcceleration = acc => 
				/* set the reservation */
				this._acc = acc;

		turnSmoothly = angle => { // turn it smmothly
				let y = this.model.rotation.y;
				console.log('rotation:', y);
				if (angle > y){
						if(y + this.turnSpeed > angle) 
								this.model.rotation.y = angle
						else
								this.model.rotation.y += this.turnSpeed;
				}else if(angle < y){
						if(y - this.turnSpeed < angle) 
								this.model.rotation.y = angle
						else
								this.model.rotation.y -= this.turnSpeed;
				}
		}

		rotate = (delta, keyboard) => {
				this._rotation = 0;
				let count = 0;
				if(keyboard.forward){
						this._rotation = +1;
						count += 1;
				}
				if(keyboard.backward){
						// look backward
						if(keyboard.forward || keyboard.left) 
								this._rotation += 2;
						count += 1;
				}
				if(keyboard.left){
						this._rotation += 1.5;
						count += 1;
				}
				if(keyboard.right){
						this._rotation += 0.5;
						count += 1;
				}
				if(count > 0){ // if it is pressing an input 
						let target = (this._rotation / count) * Math.PI;
						this.model.rotation.set(0, target ,0);
						this.model.updateMatrix();
						// not currently working with point 
						//this.turnSmoothly( target );
				}
		}

		moveFoward = (speed=null)  => (delta, inputs=null) => {
				if(inputs && inputs.checkKey())
						this.rotate(delta, inputs.getKeyInputs());
				speed = speed || this.speed;
				this._velocity.setZ(speed);
				this._velocity.setX(speed);
				const forward = new Vector3(0, 0, 1);
				forward.applyQuaternion(this.model.quaternion);
				forward.normalize();
				forward.multiplyScalar(this._velocity.z * delta);
				this.model.position.add(forward);
				this.moveCamera(this.camera, this.model, forward);
		}

		moveCamera = (camera, model, foward) => {  
				camera.position.add(foward);
		}

}

export { movement }

