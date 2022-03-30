import { AnimationMixer, Color } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader();

async function loadTerrain(){
		// model
		const data = await gltfLoader.loadAsync('../../resources/terrain/my_terrain.glb');
		//const data = await gltfLoader.loadAsync('../../resources/terrain/game_level_scene_low_poly/scene.gltf');
		//const terrain = data.scene;
		//const data = await gltfLoader.loadAsync('../../resources/terrain/terrain/scene.gltf');
		const terrain = data.scene;
		
		//const terrain = await fbxLoader.loadAsync('../../resources/terrain/terrain-low-poly/source/Terreno.fbx.fbx');
		//const terrain = data.scene;
		

		let scale = 22;
		terrain.scale.set(scale, scale, scale);
		terrain.position.set(0, 0, 0);

		terrain.traverse( child => {
				if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
						if(child.name.toLowerCase().match(".*mountain.*")){
								if(child.material){
										console.log('child', child);
										//child.material.color = new Color('red');
										console.log(child.material.color);
								}
						}
				}
		} );


		
		//const mixer = new AnimationMixer( sambaDancer );
		//console.log(sambaDancer);

		//const action = mixer.clipAction( sambaDancer.animations[ 0 ] );
		//action.play();

		/*
		sambaDancer.traverse( function ( child ) {
				if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
				}
		} );
		*/

		//sambaDancer.tick = delta => mixer.update(delta);

		return terrain;
}

export { loadTerrain } 
