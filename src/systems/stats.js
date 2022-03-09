import Stats from 'three/examples/jsm/libs/stats.module'

function addStats( container ){
		// stats
		let stats = new Stats();
		// add stats
		container.appendChild( stats.dom );
}

export { addStats } 
