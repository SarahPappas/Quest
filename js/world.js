function World() {
		// SETUP
	// need 3 things to dispaly anything. A scene a camera and a render
	this.scene = new THREE.Scene();
	// diffrent types of cameras, parameters filed of view, aspect ration, near and far clipping plane
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);

	//ADD GROUND PLANE
	var groundTexture = THREE.ImageUtils.loadTexture("images/MossyBank.jpg");
	console.log(groundTexture);
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set(200, 200);
	// var groundBump = THREE.ImageUtils.loadTexture("");
	var geometryGroundPlane = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var materialGroundPlane = new THREE.MeshBasicMaterial({ 
		map: groundTexture, 
		side: THREE.DoubleSide 
	});
	this.ground = new THREE.Mesh( geometryGroundPlane, materialGroundPlane);
	// ground.rotation.set(90 * (3.14/180), 0, 'XY');
	this.ground.rotateX(90 * (Math.PI / 180));
	// adds plane
	this.scene.add(this.ground);


	// set camera position
	// moves out camera postion becaus otherwise it would be placed at 0, 0, 0 with the cube
	this.camera.position.z = 0;
	this.camera.position.y = 2;

	//resize
	window.addEventListener('resize', this.onWindowResize.bind(this), false);
}


World.prototype = {
	// to render the page, you need a render loop
	// anything you move or change has to run through the render function loop
	render: function() {
		this.renderer.render(this.scene, this.camera);
		// use requestAnimationFrame for loop instead of setInterval because it pauses when user navigates away
		requestAnimationFrame(this.render.bind(this));

		// // Update the orbit controls
		// if(controls != null) {
		// controls.update();
	},
	onWindowResize: function() {
	    this.camera.aspect = window.innerWidth / window.innerHeight;
	    this.camera.updateProjectionMatrix();
	    this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
};


