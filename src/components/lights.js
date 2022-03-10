import { 
		DirectionalLight,
		DirectionalLightHelper,
		PointLight,
		PointLightHelper,
		HemisphereLight,
		HemisphereLightHelper,
		AmbientLight,
} from 'three';

function createLights() {
		const lights = [];
		

		var ambientLight = new AmbientLight('white', 1);
		//lights.push(ambientLight);
		
		const hemiLight = new HemisphereLight( 0xffffff, 0x444444 );
		hemiLight.position.set( 0, 200, 0 );
		// add light
		lights.push( hemiLight );

		const dirLight = new DirectionalLight( 0xffffff );
		dirLight.position.set( 0, 200, 100 );
		dirLight.castShadow = true;
		dirLight.shadow.camera.top = 180;
		dirLight.shadow.camera.bottom = - 100;
		dirLight.shadow.camera.left = - 120;
		dirLight.shadow.camera.right = 120;
		// add light
		lights.push(dirLight)
		// add helper
		const dirHelper = new DirectionalLightHelper( dirLight, 5 );
		//lights.push(dirHelper);

		const point = new PointLight('white', 1);
		point.position.set(5,5,5);
		//lights.push(point);
		const pointHelper = new PointLightHelper(point, 5);
		//lights.push(pointHelper);

		return lights
}

export { createLights }
