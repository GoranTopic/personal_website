import { Vector2 } from 'three';
import { createCamera } from '../components/camera';
//import { createCube } from '../components/cube';
import { createScene } from '../components/scene';
import { createLights } from '../components/lights';
import { loadAstro } from '../components/astro';
import { loadPlayer } from '../components/player';
import { createPlane } from '../components/plane';
import { createGrid } from '../components/grid';
import { loadMarker } from '../components/marker';
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


let camera, renderer, scene, loop, controller, plane, lights, grid, player, marker;


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
				lights = createLights();
				// create ground
				plane = createPlane();
				// create grid
				grid = createGrid();

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

				player = await loadPlayer();
				scene.add(player);
				loop.add(player);
				
				marker = await loadMarker();
				scene.add(marker);
				loop.add(marker);

		}
		
		// start the loop
		start = () => loop.start()
		
		// stop the loop
		stop = () => loop.stop()

		// render the world
		render = () =>
				renderer.render(scene, camera);

}


export { 
		World, 
		camera, 
		renderer, 
		scene, 
		loop, 
		controller, 
		plane, 
		lights, 
		grid, 
		player,
		marker,
};
