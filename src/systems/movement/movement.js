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

		rotate = (delta, inputs) => {
				this._rotation = 0;
				let count = 0;
				if(inputs.forward){
						this._rotation = +1;
						count += 1;
				}
				if(inputs.backward){
						// look backward
						if(inputs.forward || inputs.left) 
								this._rotation += 2;
						count += 1;
				}
				if(inputs.left){
						this._rotation += 1.5;
						count += 1;
				}
				if(inputs.right){
						this._rotation += 0.5;
						count += 1;
				}
				if(count > 0){ // if it is pressing an input 
						//console.log('inputs:',inputs);
						//console.log('rotation:',this._rotation);
						let target = (this._rotation / count) * Math.PI;
						this.model.rotation.y = target;
						//this.turnSmoothly( target );
				}
		}

		moveFoward = (speed=null)  => (delta, inputs=null) => {
				console.log('moving is moving');
				console.log('inputs', inputs);
				inputs &&
						this.rotate(delta, inputs);
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

