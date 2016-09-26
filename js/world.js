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
	var ground = new THREE.Mesh(geometryGroundPlane, materialGroundPlane);
	// ground.rotation.set(90 * (3.14/180), 0, 'XY');
	ground.rotateX(90 * (Math.PI / 180));
	// adds plane geometry created as ground
	this.scene.add(ground);

	// add a cone
	var coneColors = ["#09BA56", "#0AC75C", "#08A04A", "#0DF873", "#067A38"];
	console.log(Math.floor(Math.random()*5));
	var geometry = new THREE.ConeBufferGeometry(5, 20, 32);
	var material = new THREE.MeshBasicMaterial({color: coneColors[Math.floor(Math.random()*5)]});
	var cone = new THREE.Mesh(geometry, material);
	cone.castShadow = true;
	this.scene.add(cone);
	cone.position.x = 0;
	cone.position.y = 0;
	cone.position.x = -10;



	// create fog DECIDE WHETHER TO KEEP THIS, USE FOR TREE testing.
		this.scene.fog = new THREE.Fog( 0xffffff, .0001, 40 );

	    // add subtle ambient lighting
	    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
	    this.scene.add(ambientLight);
	    // add spotlight for the shadows
	    var spotLight = new THREE.SpotLight(0xffffff);
	    spotLight.position.set(this.player.camera.position);
	    spotLight.castShadow = true;
	    this.scene.add(spotLight);
	 //^^^^ Keep?



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


