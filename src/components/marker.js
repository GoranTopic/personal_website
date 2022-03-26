import { Vector2, Vector3, Raycaster } from 'three' ;
import { 
		Mesh,
		BoxBufferGeometry, 
		MeshBasicMaterial, 
		MeshLambertMaterial,
		MeshStandardMaterial,
		TextureLoader,
} from 'three';


function createMarker(position=null) {

		const cubeGeo = new BoxBufferGeometry( 50, 50, 50 );
		const cubeMaterial = new MeshLambertMaterial( 
				{ 
						color: 0xfeb74c, 
						map: new TextureLoader()
						.load( 'textures/square-outline-textured.png' ) 
				} 
		);
		const marker = new Mesh( cubeGeo, cubeMaterial );
		if(position){
				marker.position.copy(position);
				marker.position.divideScalar( 50 )
						.floor()
						.multiplyScalar( 50 )
						.addScalar( 25 );
		}
		return marker	

}

export { createMarker };
