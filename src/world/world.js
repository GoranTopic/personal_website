import { createCamera } from '../components/camera';
//import { createCube } from '../components/cube';
import { createScene } from '../components/scene';
import { createLights } from '../components/lights';
import { loadAstro } from '../components/astro';
import { loadModel } from '../components/model';
import { createPlane } from '../components/plane';
import { createGrid } from '../components/grid';
//import { createMeshGroup } from '../components/meshGroup';
//import { loadDancerDude } from '../components/dancerDude'; 
//import { loadBirds } from '../components/birds/birds';
import { loadSambaDancer } from '../components/sambaDancer'; 

import { createRenderer } from '../systems/renderer';
import { Loop } from '../systems/Loop';
// import controller
import { addController } from '../systems/controller'
import { createStats } from '../systems/stats'
import { Resizer } from '../systems/Resizer';


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
				container.appendChild(renderer.domElement);
				//create ligths 
				let lights = createLights();
				// create ground
				let plane = createPlane();
				// create grid
				let grid = createGrid();

				// add cube to scene 
				scene.add( 
						...lights,
						plane, 
						grid,
				);

				// add controller			
				controller = addController(camera, renderer);

				// add to animation loop
				// add controller
				loop.add( controller )

				// add stats
				const stats = createStats();
				container.appendChild( stats.dom );
				loop.add(stats);

		}

		async init() { // load async objects
				// load ancer
				//const dancer = await loadSambaDancer();
				//scene.add(dancer);
				//loop.add(dancer);
				//const astro = await loadAstro();
				//scene.add(astro);
				//loop.add(astro);

				const model = await loadModel();
				//console.log("model:", model);
				scene.add(model);
				loop.add(model);
		}
		
		// start the loop
		start = () => loop.start()
		
		// stop the loop
		stop = () => loop.stop()

		// render the world
		render = () =>
				renderer.render(scene, camera);

}

export { World };
