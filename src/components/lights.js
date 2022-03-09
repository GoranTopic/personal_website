import { 
		DirectionalLight,
		HemisphereLight,
		HemisphereLightHelper,
		AmbientLight,
} from 'three';

function createLights() {
		// ambientLight
		var ambientLight = new AmbientLight('white', 1.2);

		// Hemi Light
		var hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 1 );
		hemiLight.position.set( 0, 200, 0 );
		const hemiHelper = new HemisphereLightHelper( hemiLight, 5 );

		// Directional Light 
		var dirLight = new DirectionalLight( 0xffffff, 1);
		dirLight.position.set( 0, 100, 200 );
		dirLight.castShadow = true;
		dirLight.shadow.camera.top = 180;
		dirLight.shadow.camera.bottom = - 100;
		dirLight.shadow.camera.left = - 120;
		dirLight.shadow.camera.right = 120;

		// return lights
		return { dirLight, hemiLight, ambientLight }
}

export { createLights };
