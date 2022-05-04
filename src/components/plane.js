import { Mesh, PlaneBufferGeometry, Object3D, RGBFormat, DataTexture, LinearFilter, Color, MeshPhongMaterial, ShaderMaterial } from 'three';
import shaderFragment from '../shaders/fragment.glsl'
import shaderVertex from '../shaders/vertex.glsl'

import { player } from '../world/world';


function createPlane() {

		// Container
		//let container = new Object3D()
		//container.matrixAutoUpdate = false

		// Geometry
		let geometry = new PlaneBufferGeometry(2000, 2000, 10, 10)

		// Colors
		let colors = {}
		colors.topLeft = '#f5883c'
		colors.topRight = '#ff9043'
		colors.bottomRight = '#fccf92'
		colors.bottomLeft = '#f5aa58'

		// Material
		let material = floorMaterial()
		// create Phong Material config 
		//let material_config = { color: 0x999999, depthWrite: false }
		// create material
		//let material = new MeshPhongMaterial(material_config);

		
		let updatePlane = () => {
				console.log('is this running?');
				const topLeft = new Color(colors.topLeft)
				const topRight = new Color(colors.topRight)
				const bottomRight = new Color(colors.bottomRight)
				const bottomLeft = new Color(colors.bottomLeft)
				const data = new Uint8Array([
						Math.round(bottomLeft.r * 255),
						Math.round(bottomLeft.g * 255),
						Math.round(bottomLeft.b * 255),
						Math.round(bottomRight.r * 255),
						Math.round(bottomRight.g * 255),
						Math.round(bottomRight.b * 255),
						Math.round(topLeft.r * 255),
						Math.round(topLeft.g * 255),
						Math.round(topLeft.b * 255),
						Math.round(topRight.r * 255),
						Math.round(topRight.g * 255),
						Math.round(topRight.b * 255)
				])
				let backgroundTexture = new DataTexture(data, 2000, 2000, RGBFormat)
				backgroundTexture.magFilter = LinearFilter
				backgroundTexture.needsUpdate = true
				material.uniforms.tBackground.value = backgroundTexture
		}

		updatePlane()
		
		// Mesh
		let mesh = new Mesh(geometry, material)
		mesh.frustumCulled = false
		mesh.matrixAutoUpdate = true
		mesh.updateMatrix()
		//container.add(mesh)

		/*
		let debug = true
		// Debug
		if(debug) {
				const folder = debug.addFolder('floor')
				// folder.open()
				folder.addColor(colors, 'topLeft').onChange(tick)
				folder.addColor(colors, 'topRight').onChange(tick)
				folder.addColor(colors, 'bottomRight').onChange(tick)
				folder.addColor(colors, 'bottomLeft').onChange(tick)
		}
		*/
		
		//mesh.rotation.set(0, 0,  Math.PI / 2)
		mesh.rotation.x = - Math.PI / 2;
		// shadows
		mesh.tick = () => {
				if(player){
						mesh.position.x = player.position.x
						mesh.position.z = player.position.z
				}
		};
		//mesh.receiveShadow = true;
		//container.tick = tick
		return mesh;


}

/*
function createPlane () {
		constructor(){
				let plane_width  = 2000;
				let plane_height = 2000;
				// create plane 
				this.plane = new PlaneBufferGeometry( plane_width, plane_height );

				// create Phong Material config 
				//let material_config = { color: 0x999999, depthWrite: false }
				// create material
				//let material = new MeshPhongMaterial(material_config);

				// Colors
				this.colors = {}
				colors.topLeft = '#f5883c'
				colors.topRight = '#ff9043'
				colors.bottomRight = '#fccf92'
				colors.bottomLeft = '#f5aa58'

				// create material 
				this.material  = new floorMaterial();

				// create mesh 
				this.mesh = new Mesh( 
						this.plane, 
						this.material 
				);
				// rotate
				this.mesh.rotation.x = - Math.PI / 2;
				// shadows
				this.mesh.receiveShadow = true;
		}	
}
*/


function floorMaterial(){

    const uniforms = {
        tBackground: { value: null }
    }

    const material = new ShaderMaterial({
        wireframe: false,
        transparent: false,
        uniforms,
        vertexShader: shaderVertex,
        fragmentShader: shaderFragment
    })

    return material
}

export { createPlane }
