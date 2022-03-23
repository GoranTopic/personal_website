import { Vector2 } from 'three';
import { createCamera } from '../components/camera';
//import { createCube } from '../components/cube';
import { createScene } from '../components/scene';
import { createLights } from '../components/lights';
import { loadAstro } from '../components/astro';
import { loadPlayer } from '../components/player';
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

				const thisRan = (value, value1) => {
						console.log('pointer moved', value, value1);
				}

				const clickDown = ( value, value1 ) => {
						const pointer = new Vector2();
						pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
						console.log('pointer down', pointer);
				}


				document.addEventListener( 'pointermove', thisRan );
				document.addEventListener( 'pointerdown', clickDown );


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

				const player = await loadPlayer(camera);
				//console.log("model:", model);
				let { x, y, z } = player.position;
				controller['targetModel'] = player
				scene.add(player);
				loop.add(player);

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
