import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Create scence container
const scene = new THREE.Scene();

// Create Render, it is the obj which render graphics into the scene
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

// Set the renderer aspect ration
renderer.setPixelRatio( window.devicePixelRatio );

// Set the sixe of the renderer
renderer.setSize( window.innerWidth, window.innerHeight );

// create camara
const camera = new THREE.PerspectiveCamera(75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000);
// set camera position 
camera.position.setZ(30);

// pass the scene and camera to the renderer ob
renderer.render( scene, camera );

// create geomerty and material wrapper
const geomery  = new THREE.TorusGeometry( 10, 3, 16, 100 )
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347, wireframe: true } );

// create torus object with the material and the geomery, this is called mesh
const torus = new THREE.Mesh( geomery, material );
scene.add(torus)

// create light point instance of 
const pointLight = new THREE.PointLight(0xfffffff)
// set position of the light bulb
pointLight.position.set(0,0,0)
// add to scenen
scene.add(pointLight)

// create lightbulb helper instance
const lightHelper = new THREE.PointLightHelper(pointLight)
// add a grd helper to the scene
const gridHelper = new THREE.GridHelper(200, 50)
// add helpers to scene
//scene.add(lightHelper, gridHelper)

// Obit co class 
const controls  = new OrbitControls(camera, renderer.domElement);

//add start function 
const addStar = () => {
		const geo  = new THREE.SphereGeometry( 0.10, 10, 10);
		const material = new THREE.MeshStandardMaterial( { color: 0xfffffff } );
		const star = new THREE.Mesh( geo, material );

		const [x, y, z] =  Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
		star.position.set(x, y, z)
		scene.add(star)
}
// Add stars to the world
Array(1000).fill().forEach(addStar)

// add a background texture 
const spaceTexture = new THREE.TextureLoader().load('background.jpg');
scene.background = spaceTexture;

// add moon object 
const moonTexture = new THREE.TextureLoader().load('moon.jpg')
const normalMap = new THREE.TextureLoader().load('normal.jpg')

const moon = new THREE.Mesh(
		new THREE.SphereGeometry(3, 32, 32),
		new THREE.MeshStandardMaterial({
				map: moonTexture,
				normalMap: normalMap,
		})
);

moon.position.set(7, 12, 9)

scene.add(moon)

function animate() {
		requestAnimationFrame(animate);
		renderer.render( scene, camera );
		
		// update the controls
		controls.update();

		// rotate figure
		//torus.rotation.x += 0.01;
		torus.rotation.y += 0.005;
		torus.rotation.z += 0.01;
}

animate()
