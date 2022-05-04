import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Color, TorusGeometry, OctahedronGeometry, Mesh, Group, MeshLambertMaterial  } from 'three';

function loadMarker() {
		const loader = new GLTFLoader();

		const OctaRadius = 7;  // ui: radius
		const octahrdron = new OctahedronGeometry(OctaRadius);

		const torusRadius = 4;  // ui: radius
		const tubeRadius = .4;  // ui: tubeRadius
		const radialSegments = 3;  // ui: radialSegments
		const tubularSegments = 18;  // ui: tubularSegments

		const torus = new TorusGeometry(
				torusRadius, tubeRadius,
				radialSegments, tubularSegments);

		//const marker = markerData.scene;

		// make mateial
		const material = new MeshLambertMaterial({ 
				color: 'red',
				transparent: true,
				opacity: 0.4,
				flatShading: false,
		});

		// creat octa mesh

		// circulat bottom part
		const circleMesh = new Mesh(torus, material);

		// scale up
		let scaleUpTo = 10; // scale up
		let scale = 0;
		let heightScale = 20;
		// rotate
		let rotation = Math.PI / 2;
		circleMesh.rotateX(rotation);
		circleMesh.scale.set(1, 1, 1);
		// location
		let x = 0, y = 0.2, z = 0; 
		circleMesh.position.set(x, y, z);

		const octaMesh = new Mesh(octahrdron, material);
		octaMesh.rotateZ(Math.PI/2)

		octaMesh.scale.set(0.2, 0.1, 0.1);
		octaMesh.position.set(x, y + 5, z);

		// make marker group mesh
		const marker = new Group();
		marker.add(octaMesh)
		marker.add(circleMesh)

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
		
		let scaleUpSpeed = 0.2;
		marker.tick = () => {
				// animate scaling up and down
				if(marker.isPlaced){
						if(marker.visible === false) marker.visible = true;
						if(marker.scale.x < scaleUpTo){
								scale += scaleUpSpeed;
								console.log('scale', scale);
								marker.scale.set(scale, heightScale, scale);
						}
				}else{
						if(scale <= 0) marker.visible = false; 
						else if(scale >= 0){ // scale down
								scale -= scaleUpSpeed;
								marker.scale.set(scale, heightScale, scale);
						}
						
				}
		};

		return marker;
}

export { loadMarker };
