import { CameraHelper } from 'three';

import { createCamera } from '../components/camera';
import { createCube } from '../components/cube';
import { createScene } from '../components/scene';
import { createLights } from '../components/lights';
import { createGround } from '../components/ground';
import { createGrid } from '../components/grid';
import { createMeshGroup } from '../components/meshGroup';
import { loadDancerDude } from '../components/dancerDude'; 
import { loadBirds } from '../components/birds/birds';

import { createRenderer } from '../systems/renderer';
import { Loop } from '../systems/Loop';
// import controller
import { addController } from '../systems/controller'
import { addStats } from '../systems/stats'
//import { Resizer } from '../systems/Resizer';


let camera, renderer, scene, loop, controller;

class World {

		constructor(container){
				// create camera
				camera = createCamera();
				// create scene
				scene = createScene();
				// create renderer
				renderer = createRenderer();
				// create loop 
				loop = new Loop(camera, scene, renderer);
				// render to the DOM
				container.append(renderer.domElement);
				// create cube
				let cube = createCube();
				//create ligths 
				let { dirLight, hemiLight, ambientLight  } = createLights();
				// create ground
				let ground =  createGround();
				// create grid
				let grid = createGrid();

				const meshGroup = createMeshGroup()

				// add cube to scene 
				scene.add( 
						dirLight,
						hemiLight, 
						ambientLight,
						ground, 
						grid,
						cube,
						meshGroup,
						//new CameraHelper( dirLight.shadow.camera ),
				);

				// add controller			
				controller = addController(camera, renderer);

				// add to animation loop
				loop.add(
						cube, // add cube 
						controller, // add controller
						meshGroup, // add meshGroup
				)

				// add stats
				addStats(container);

				// let's resize the 
				//let resizer = new Resizer(container, camera, renderer);
				//resizer.onResize = () => this.render() 
		}

		async init() { // load async objects
				// load bird models
				const { parrot, flamingo, stork } = await loadBirds();
				// move the target to the center of the front bird
				controller.target.copy(parrot.position);
				// asynchronous setup here
				// load dance guy
				const dancerDude = await loadDancerDude();
				// let's add object fo the scene
				scene.add( parrot, flamingo, stork, dancerDude);
				// add birds and dancer dude to out animation loop
				loop.add( parrot, flamingo, stork, dancerDude);
				
		}
		
		// start the loop
		start = () => loop.start()
		
		// stop the loop
		stop = () => loop.stop()

		// render the world
		render(){
				renderer.render(scene, camera);
		}
}

export { World };
