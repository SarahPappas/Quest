// SETUP keycodes
var UP_ARROW_KEY_CODE = 38;
var DOWN_ARROW_KEY_CODE = 40;
var RIGHT_ARROW_KEY_CODE = 39;
var LEFT_ARROW_KEY_CODE = 37;

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
		// console.log(this.isRightArrowActive, this.isLeftArrowActive);
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
		this.directionVector = this.camera.getWorldDirection().clone().normalize();
	},
	_keydown: function(e) {
		if (e.keyCode == UP_ARROW_KEY_CODE) {
			this.isUpArrowActive = true;
		}
		if (e.keyCode == DOWN_ARROW_KEY_CODE) {
			this.isDownArrowActive = true;
		}
		if (e.keyCode == RIGHT_ARROW_KEY_CODE) {
			this.isRightArrowActive = true;
		}
		if (e.keyCode == LEFT_ARROW_KEY_CODE) {
			this.isLeftArrowActive = true;
		}
	},
	_keyup: function(e) {
		if (e.keyCode == UP_ARROW_KEY_CODE) {
			this.isUpArrowActive = false;
		}
		if (e.keyCode == DOWN_ARROW_KEY_CODE) {
			this.isDownArrowActive = false;
		}
		if (e.keyCode == RIGHT_ARROW_KEY_CODE) {
			this.isRightArrowActive = false;
		}
		if (e.keyCode == LEFT_ARROW_KEY_CODE) {
			this.isLeftArrowActive = false;
		}
	}
};