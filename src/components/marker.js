import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Color, TorusGeometry, Mesh, MeshLambertMaterial  } from 'three';

async function loadMarker() {
		const loader = new GLTFLoader();

		// asyncronosly load the model
		const markerData = await loader.loadAsync(
				'../../resources/marker/uxrzone_circle_floor/scene.gltf'
		);


		const radius = 7;  // ui: radius
		const tubeRadius = .7;  // ui: tubeRadius
		const radialSegments = 3;  // ui: radialSegments
		const tubularSegments = 18;  // ui: tubularSegments

		const torus = new TorusGeometry(
				radius, tubeRadius,
				radialSegments, tubularSegments);

		//const marker = markerData.scene;

		// make mateial
		const material = new MeshLambertMaterial({ 
				color: 'red',
				transparent: true,
				opacity: 0.4,
				flatShading: false,
		});

		// mesh
		const marker = new Mesh(torus, material);

		// scale up
		let scaleUpTo = 10; // scale up
		let scale = 0;
		let heightScale = 20;
		// rotate
		let rotation = Math.PI / 2;
		marker.rotateX(rotation);
		marker.scale.set(scale, scale, heightScale);
		// location
		let x = 0, y = 2, z = 0; 
		marker.position.set(x, y, z);
		// set if it place
		marker.isPlaced = false;

		marker.placeAt = pos => {
				if(marker.isPlaced){ 
						// if it is already place someWhere else
						scale = 0;
						marker.scale.set(scale, scale, 1)
				}
				marker.position.set(pos.x, y, pos.z);
				marker.isPlaced = true;
		}

		marker.hide = () => marker.isPlaced = false;

		//console.log('marky-mark!', marker);
		
		let scaleUpSpeed = 0.6;
		marker.tick = () => {
				// animate scaling up and down
				if(marker.isPlaced){
						if(marker.visible === false) marker.visible = true;
						if(marker.scale.x < scaleUpTo){
								scale += scaleUpSpeed;
								marker.scale.set(scale, scale, heightScale);
						}
				}else{
						if(scale <= 0) marker.visible = false; 
						else if(scale >= 0){ // scale down
								scale -= scaleUpSpeed;
								marker.scale.set(scale, scale, heightScale);
						}
						
				}
		};

		return marker;
}

export { loadMarker };
