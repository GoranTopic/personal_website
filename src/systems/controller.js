import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { player } from '../world/world';

function addController(camera, renderer){
		const controls = new OrbitControls( camera, renderer.domElement );
		controls.enablePan = true;
		controls.enableZoom = true;
		controls.target.set( 0, 150, 0 );
		controls.enableDamping = true;
		controls.tick = () =>{
				if(player){
						let { x, y, z } = player.position;
						controls.target.set(x, y+150, z );
				}
				controls.update();
		}
		return controls;
}

export { addController }
