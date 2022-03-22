import { Vector3, Quaternion } from 'three';

class movement{
		/* this class controls the movment vectors of a oject 
		 *  it uses the accelatation and velocity as well as PI somehow,
		 *  to make realistic movment*/
		constructor({ model, velocity=null, acceleration=null, decceleration=null }){
				this.model = model;
				this.velocity = velocity || new Vector3(0, 0, 0);
				this.rotation = 0;
				this.max_velocity = new Vector3(0, 0, 0);
				this.acceleration = acceleration || new Vector3(1, 0.25, 50.0);
				this.decceleration = decceleration || new Vector3(-0.0005, -0.0001, -5.0);
				this.frameDecceleration = new Vector3(
						this.velocity.x * this.decceleration.x,
						this.velocity.y * this.decceleration.y,
						this.velocity.z * this.decceleration.z );
				this.profiles = {};

				this._Q = new Quaternion();
				this._A = new Vector3();
				this._R = model.quaternion.clone();
		}

		setAcceleration = acc => 
				/* set the reservation */
				this.acceleration = acc;

		setAccProfile = (name, acc=null, maxVel=null, decc=null) => {
				/* set a profile with the max velocity and the acceletation */
				this.profiles[name] = {
						acceleration: acc	   || this.acceleration,
						max_velocity: maxVel || this.max_velocity ,
						decceleration: decc  || this.decceleration,
						frameDecceleration: new Vector3(
								velocity.x * decceleration.x,
								velocity.y * decceleration.y,
								velocity.z * decceleration.z 
						)
				}
		}

		rotate = (delta, inputs) => {
				this.rotation = 0;
				let count = 0;
				if(inputs.forward){
						this.rotation += 1;
						count += 1;
						this.model.rotation.y = Math.PI;
				}
				if(inputs.backward){
						// look backward
						if(inputs.forward || inputs.left) 
								this.rotation += 2;
						count += 1;
				}
				if(inputs.left){
						this.rotation += 1.5;
						count += 1;
				}
				if(inputs.right){
						this.rotation += 0.5;
						count += 1;
				}
				if(count > 0)
						this.model.rotation.y = (this.rotation / count) * Math.PI;
		}

		moveFoward = speed  => (delta, inputs) => {
				this.rotate(delta, inputs);
				this.speed = speed || 170
				this.velocity.setZ(this.speed);
				this.velocity.setX(this.speed);
				const forward = new Vector3(0, 0, 1);
				forward.applyQuaternion(this.model.quaternion);
				forward.normalize();
				forward.multiplyScalar(this.velocity.z * delta);
				this.model.position.add(forward);
		}


}

export { movement }

