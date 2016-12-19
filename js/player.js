// SET keycode constants
var UP_ARROW_KEY_CODE = 38;
var DOWN_ARROW_KEY_CODE = 40;
var RIGHT_ARROW_KEY_CODE = 39;
var LEFT_ARROW_KEY_CODE = 37;

function Player() {
	EventEmitter.call(this);
	// SETUP CAMERAS
	// Diffrent types of cameras, parameters field of view, aspect ration, near 
	// and far clipping plane.
	// this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 80);
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 500);
	// Set camera position.
	// Moves out camera postion because otherwise it would be placed at 0, 0, 0 
	// - in them middle of the plane.
	this.camera.position.z = 0;
	this.camera.position.y = 2;

	// SETUP MOVEMENTS
	// Set the distance you will move in a frame.
	// This will move the camera 1 out of the 1,000 ground plane we created.
	this.speed = .5; 
	// This noramalizes, then copies the vector of the direction the camera is 
	// looking.
	this.directionVector = this.camera.getWorldDirection().clone().normalize();
	// This is the degree of rotation for each arrow press.
	this.rotation = 1;

	// SETUP KEY CONTROLS
	// The default is false.
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
	render: function (arrayOfPillarPositions, treasurePosition) {
		// Arrow controls
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

		// Hit detection for pillars.
		// TODO: Make hit detection generic, player shouldn't know about pillars
		for (var i = 0; i < arrayOfPillarPositions.length; i++) {
			if (this._isPointInsideCircle(arrayOfPillarPositions[i]) == true) {
				this.emit("pillarDetected", arrayOfPillarPositions[i]);
				arrayOfPillarPositions.splice(i, 1);
			} 	
		}

		// Hit detection for treasure.
		if(this._isPointInsideCircle(treasurePosition)) {
			this.emit("treasureDetected", treasurePosition);
		}
	},
	/**
	 * @param {number} distance - The distance for each move. Should be positive this.speed or negative this.speed.
	 */
	_walk: function (distance) {
		this.camera.position.x = this.camera.position.x + this.directionVector.x * distance;
		this.camera.position.z = this.camera.position.z + this.directionVector.z * distance;
	},
	/**
	 * @param {number} rotation in degrees - The rotation for each move. Should be positive this.rotation for spinnig right or negative this.rotation for spinning left.
	 */
	_rotate: function (degrees) {
		this.camera.rotation.y += (degrees * (Math.PI / 180));
		this.directionVector = this.camera.getWorldDirection().clone().normalize();
	},
	_keydown: function (e) {
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
	_keyup: function (e) {
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
	},
	/**
	 * @param {Array} - array of (x, y, z) for a cone.
	 */
	_isPointInsideCircle: function (circle) {
		// we are using multiplications because is faster than calling Math.pow
  		var distance = Math.sqrt((this.camera.position.x - circle.x) * (this.camera.position.x - circle.x) +
                       			(this.camera.position.z - circle.z) * (this.camera.position.z - circle.z));
  		return distance <  20;
	},
};

// Add EventEmitter properties to Player.
_.assign(Player.prototype, EventEmitter.prototype);