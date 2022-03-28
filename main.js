import { World }  from './src/world/world.js';

async function  main(){
		//get container
		const container = document.querySelector( '#scene-container' );
		document.body.appendChild( container );
		// create world
		const world = new World(container);
		// render world
		world.start();
		// load async models
		await world.init();
}

main().catch( err => console.log(err) )
