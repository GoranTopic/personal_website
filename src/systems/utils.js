import { Raycaster } from 'three'
import { camera, plane } from '../world/world';

let raycaster = new Raycaster();

const raycastClicktoPlane = clickPos => {
						// rays cast from camera and click position
						raycaster.setFromCamera( clickPos, camera );
						// get the intersection of the play and the ray
						const intersects = raycaster.intersectObject( plane, false );
						// if there was a intersect
						let intersect = intersects.length > 0 ?
								intersects[0].point.add(intersects[0].face.normal)
								: null
		return intersect;
}

export { raycastClicktoPlane }
