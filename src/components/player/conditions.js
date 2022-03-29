
let radioOfError = 10; 


const hasReachedMarker = (model, marker) => (
		// how far way the model must be to be consideted 'there'
				(Math.abs(model.position.x - marker.position.x) < radioOfError)
				&& (Math.abs(model.position.z - marker.position.z) < radioOfError)
		)

const hasNotReachedMarker = (model, marker) => (
		// inverse of has reached the marker
				(Math.abs(model.position.x - marker.position.x) > radioOfError)
				|| (Math.abs(model.position.z - marker.position.z) > radioOfError)
		)

const hasKeyPress = inputs => inputs.checkKey();

const hasArrowKeyPress = inputs => {
		let keys =  inputs.getKeyInputs();
		return (keys.forward === true ||
				keys.backward === true || 
				keys.left === true ||
				keys.right === true);
}

const thereIsClick = inputs =>
		inputs.checkClick();

const isTimeToRun = model =>
		model.vars.walkTimer >= model.vars.time2Run;

const isNotTimeToRun = model =>
		model.vars.walkTimer < model.vars.time2Run;

export { hasReachedMarker, hasNotReachedMarker, hasKeyPress, hasArrowKeyPress, isTimeToRun, isNotTimeToRun, thereIsClick }
