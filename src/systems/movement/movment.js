import { Vector3, Quaternion } from 'three';

class movement{
		/* this class controls the movment vectors of a oject 
		 *  it uses the accelatation and velocity as well as PI somehow,
		 *  to make realistic movment*/
		constructor({ model, velocity=null, acceleration=null, decceleration=null }){
				this.model = model;
				this.velocity = velocity || new Vector3(0, 0, 0);
				this.max_velocity = new Vector3(0, 0, 0);
				this.acceleration = acceleration || new Vector3(1, 0.25, 50.0);
				this.decceleration = decceleration || new Vector3(-0.0005, -0.0001, -5.0);
				this.frameDecceleration = new Vector3(
						this.velocity.x * this.decceleration.x,
						this.velocity.y * this.decceleration.y,
						this.velocity.z * this.decceleration.z );
				this.profiles = {};
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

		update = delta => { 
				// create from decceleration
				this.frameDecceleration.multiplyScalar(delta);
				/*
				this.frameDecceleration.z = Math.sign(
						this.frameDecceleration.z) * Math.min(
								Math.abs(this.frameDecceleration.z), 
								Math.abs(this.velocity.z)
						);
						*/
				// deccelerate
				console.log('frameDecceleration:',this.frameDecceleration);
				if(this.velocity.z > 0)
						this.velocity.add(this.decceleration);
				//console.log("global update ran");
				console.log('velocity:',this.velocity);
				//console.log('acceleration:',this.acceleration);
		}

		moveFoward = (delta=0, profile=null) => {
				// add to velocity
				this.velocity.z += this.acceleration.z * delta;
				// make forward vector
				const forward = new Vector3(0, 0, 1);
				// move to toward the direction the model is facing
				forward.applyQuaternion(this.model.quaternion);
				// normalize??
				forward.normalize();
				//multiple with the scaler? waht??
				forward.multiplyScalar(this.velocity.z * delta);
				// move the model	
				this.model.position.add(forward);
		}


}

export { movement }

