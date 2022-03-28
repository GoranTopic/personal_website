import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Color } from 'three';

async function loadMarker() {
		const loader = new GLTFLoader();

		// asyncronosly load the model
		const markerData = await loader.loadAsync('../../resources/marker/uxrzone_circle_floor/scene.gltf');


		const marker = markerData.scene;

		let x = 0, y = 0, z = 0; 

		let scale = 100; // scale down 
		marker.scale.set(scale, 0, scale);

		marker.traverse( child => {
				if( child.type === 'Points' ){
						if( child.name == 'Object_2' ){
								//console.log('child', child);
								child.material.color = new Color('azure');
						}
						if( child.name == 'Object_3' ){
								//console.log('child', child); // what is this?
								// what does it do? who knows?
								// try asking god...
								child.material.color = new Color('pink');
						}
				}
		});


		// set up model
		//const marker = setupModel(markerData);
		marker.position.set(x, y, z);

		marker.placeAt = pos => {
				marker.position.set(pos.x, y, pos.z);
				marker.visible = true;
		}

		marker.hide = () => marker.visible = false;

		console.log('marky-mark!', marker);
		
		marker['tick'] = () => {};

		marker.visible = false;

		return marker;
}

export { loadMarker };
