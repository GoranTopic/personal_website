import { Clock } from  'three';

// create clock instance
const clock = new Clock();

class Loop {
		constructor( camera, scene, renderer ){
				this.camera = camera;
				this.scene = scene;
				this.renderer = renderer;
				this.to_update = [];
		}

		tick() { // update the animation 
				//get last time delta
				let delta = clock.getDelta();
				//console.log(`${delta * 1000} milliseconds`);
				// 'tick' every object in updatable, and pass delta
				this.to_update.forEach( obj => obj.tick(delta) );
		}

		// add to animation loop
		add = function(){ // every parameter
				for (var i = 0; i < arguments.length; i++) 
						this.to_update.push(arguments[i]) 
		}
		
		// method to overwrite
		start(){
				this.renderer.setAnimationLoop( () => {
						// tell every animated object to tick forward one frame
						this.tick();
						// render a frame
						this.renderer.render(this.scene, this.camera);
				});
		}

		stop(){ 
				this.renderer.setAnimationLoop(null);
		}
}

export { Loop }
