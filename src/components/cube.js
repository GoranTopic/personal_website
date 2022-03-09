import { 
		Mesh,
		BoxBufferGeometry, 
		MeshBasicMaterial, 
		MeshStandardMaterial,
		TextureLoader,
} from 'three';

import { MathUtils } from 'three';

const radiansPerSecond = MathUtils.degToRad(30);

const spec =  {
		color: 'purple',
}

function createCube() {
		let x = 50;
		let y = 100;
		let z = 100;
		// create a geometry
		const geometry = new BoxBufferGeometry(2, 2, 2);
		// create a default (white) Basic material
		const material = createMaterial();
		// create a Mesh containing the geometry and material
		const cube = new Mesh(geometry, material);
		cube.position.set(x, y, z);
		// add rotation
		cube.rotation.set(-0.5, -0.1, 0.8);

		// make it bigger 
		cube.scale.set(20, 20, 20)

		// animate
		cube.tick = delta => {
				cube.rotation.z += radiansPerSecond * delta;
				cube.rotation.x += radiansPerSecond * delta;
				cube.rotation.y += radiansPerSecond * delta;
		}

		return cube;
}

function createMaterial() {
  // create a "standard" material
		const textureLoader = new TextureLoader();
		const texture = textureLoader.load(
				'../../resources/textures/cavern-deposits-unity/cavern-deposits_albedo.png',
		)

		const material = new MeshStandardMaterial({
			map: texture,
		});

		return material;
}


export { createCube };
