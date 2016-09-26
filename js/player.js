function Player() {
	// SETUP cameras
	// diffrent types of cameras, parameters filed of view, aspect ration, near and far clipping plane
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	// set camera position
	// moves out camera postion becaus otherwise it would be placed at 0, 0, 0 with the cube
	this.camera.position.z = 0;
	this.camera.position.y = 2;

	// SETUP movements
	// set the distance you will move in a frame
	// This will move the camera 1 out of the 1,000 ground plane we created
	this.speed = .1; 
	// The noramalizes, then copies the vector of the direction the camera is looking
	this.directionVector = this.camera.getWorldDirection().clone().normalize();
	// The degree of rotation for each arrow press
	this.rotation = 1;

	// SETUP key controls, default false
	this.isUpArrowActive = false;
	this.isDownArrowActive = false;
	this.isLeftArrowActive = false;
	this.isRightArrowActive = false;

	document.addEventListener("keydown", this._keydown.bind(this));
	document.addEventListener("keyup", this._keyup.bind(this));

}

Player.prototype = {
	/**
	 * @param {string} arrowKey - up, down, left, or right.
	 */
	render: function() {
		// console.log(this.isRightArrowActive);
		if (this.isUpArrowActive && !this.isDownArrowActive) {
			this._walk(this.speed);
		}
		if (this.isDownArrowActive && !this.isUpArrowActive) {
			this._walk(-this.speed);
		}
		if (this.isRightArrowActive && !this.isLeftArrowActive) {
			this._rotate(-this.rotation);
		}
		if (this.isLeftArrowActive && !this.isRightArrowActive) {
			this._rotate(this.rotation);
		}
	},
	/**
	 * @param {number} distance - The distance for each move. Should be positive this.speed or negative this.speed.
	 */
	_walk: function(distance) {
		this.camera.position.x = this.camera.position.x + this.directionVector.x * distance;
		this.camera.position.z = this.camera.position.z + this.directionVector.z * distance;
	},
	/**
	 * @param {number} rotation in degrees - The rotation for each move. Should be positive this.rotation for spinnig right or negative this.rotation for spinning left.
	 */
	_rotate: function(degrees) {
		this.camera.rotation.y += (degrees * (Math.PI / 180));
	},
	_keydown: function(e) {
		if (e.keyIdentifier == "Up") {
			this.isUpArrowActive = true;
		}
		if (e.keyIdentifier == "Down") {
			this.isDownArrowActive = true;
		}
		if (e.keyIdentifier == "Right") {
			this.isRightArrowActive = true;
		}
		if (e.keyIdentifier == "Left") {
			this.isLeftArrowActive = true;
		}
	},
	_keyup: function(e) {
		if (e.keyIdentifier == "Up") {
			this.isUpArrowActive = false;
		}
		if (e.keyIdentifier == "Down") {
			this.isDownArrowActive = false;
		}
		if (e.keyIdentifier == "Right") {
			this.isRightArrowActive = false;
		}
		if (e.keyIdentifier == "Left") {
			this.isLeftArrowActive = false;
		}
	}
};