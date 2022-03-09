import { Mesh, PlaneGeometry, MeshPhongMaterial } from 'three';

function createGround(){
		let plane_width  = 2000;
		let plane_height = 2000;
		// create plane 
		let plane = new PlaneGeometry( plane_width, plane_height );
		// create Phong Material config 
		let material_config = {
				color : 0x999999,	
				depthWrite: false 
		}
		// create material 
		let material = new MeshPhongMaterial( material_config );
		// create mesh 
		const mesh = new Mesh( 
				plane, 
				material 
		);
		// rotate
		mesh.rotation.x = - Math.PI / 2;
		// shadows
		mesh.receiveShadow = true;
		return mesh
}

export { createGround }
