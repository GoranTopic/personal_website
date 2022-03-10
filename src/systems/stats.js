import Stats from 'three/examples/jsm/libs/stats.module'

function createStats(){
		// stats
		const stats = new Stats();
		// make stats update function 
		stats.tick = () => stats.update()
		// return 
		return stats;
}

export { createStats }

