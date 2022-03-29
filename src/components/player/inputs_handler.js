import { plane, marker } from '../../world/world';
import { thereIsClick, hasReachedMarker, hasNotReachedMarker, hasKeyPress, hasArrowKeyPress, isTimeToRun, isNotTimeToRun } from './conditions';
import { raycastClicktoPlane } from '../../systems/utils'

function setup_inputHandler(model){
		/* general function which determines how the model reacts to inputs */
		
		model.handleInputs = (delta, inputs) => {
				// if there was a key press
				if( hasKeyPress(inputs) ){ 
						if(model.vars.isFollowingMarker)
								// if there is a key input while
								//			 model is following the marker.
								// Stop following.
								model.vars.isFollowingMarker = false;
								marker.hide()
				}
				// if thre is a click
				if( thereIsClick(inputs) ){
						let clickPos = inputs.getMouseClick();
						let planePos = raycastClicktoPlane(clickPos);
						if(planePos){  // is there was a intersection
								// place a marker
								marker.placeAt(planePos);
								// look at that point
								model.lookAt(planePos);
								// set model to follow marker
								model.vars.isFollowingMarker = true;
						}
				}
		}
		return model 
}

export { setup_inputHandler }
