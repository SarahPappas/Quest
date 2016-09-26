function World(player) {
	// SETUP
	// need 3 things to dispaly anything. A scene a camera and a render
	this.scene = new THREE.Scene();
	// camera in screen is on the player
	this.player = new Player();

	//setup renderer
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);

	//ADD GROUND PLANE
	var groundTexture = THREE.ImageUtils.loadTexture("images/MossyBank.jpg");
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set(200, 200);
	groundTexture.anisotropy= 4;
	// var groundBump = THREE.ImageUtils.loadTexture("");
	var geometryGroundPlane = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var materialGroundPlane = new THREE.MeshBasicMaterial({ 
		map: groundTexture, 
		side: THREE.DoubleSide 
	});
	this.ground = new THREE.Mesh( geometryGroundPlane, materialGroundPlane);
	// ground.rotation.set(90 * (3.14/180), 0, 'XY');
	this.ground.rotateX(90 * (Math.PI / 180));
	// adds plane geometry created as ground
	this.scene.add(this.ground);

	//Resize Window event listener
	window.addEventListener('resize', this._onWindowResize.bind(this), false);
}


World.prototype = {
	// to render the page, you need a render loop
	// anything you move or change has to run through the render function loop
	render: function() {
		this.player.render();
		this.renderer.render(this.scene, this.player.camera);
		// use requestAnimationFrame for loop instead of setInterval because it pauses when user navigates away
		requestAnimationFrame(this.render.bind(this));
	},
	_onWindowResize: function() {
	    this.player.camera.aspect = window.innerWidth / window.innerHeight;
	    this.player.camera.updateProjectionMatrix();
	    this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
};


