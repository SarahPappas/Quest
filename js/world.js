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
	this.scene.add(this._setupGround());

	// add a cone geometry
	var coneColors = ["#09BA56", "#0AC75C", "#08A04A", "#0DF873", "#067A38"];
	// this.forestGeometry = new THREE.BufferGeometry();

	// create the forest
	for(var i = 0; i < 1000; i++) {
		var treeGeometry = new THREE.ConeBufferGeometry(Math.floor(Math.random()*4), Math.floor(Math.random()*20), 32);
		var treeMaterial = new THREE.MeshBasicMaterial({color: coneColors[Math.floor(Math.random()*5)]});
		var treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
		treeMesh.castShadow = true;
		var randomQunadrant = Math.round(Math.random());
		var postionMultiple = 1;
		if (randomQunadrant == 0) {
			positionMultiple = 1;
		} else {
			positionMultiple = -1;	
		}
		var randomQunadrant2 = Math.round(Math.random());
		var postionMultiple2 = 1;
		if (randomQunadrant2 == 0) {
			positionMultiple2 = 1;
		} else {
			positionMultiple2 = -1;	
		}
		treeMesh.position.x = Math.floor(Math.random()*500) * this._getRandomNegativeOrPositive();
		treeMesh.position.y = 0;
		treeMesh.position.z = Math.floor(Math.random()*500) * this._getRandomNegativeOrPositive();
		// this.forestGeometry.merge(treeGeometry);
		this.scene.add(treeMesh);
	}
	// this.scene.add(this.forestGeometry);


	// pillar
	for(var i = 0; i < 10; i++) {
		var pillarGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
		var pillarMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		var pillarMesh = new THREE.Mesh( pillarGeometry, pillarMaterial);
		//returns 0 or 1
		
		var randomQunadrant2 = Math.round(Math.random());
		var postionMultiple2 = 1;
		if (randomQunadrant2 == 0) {
			positionMultiple2 = 1;
		} else {
			positionMultiple2 = -1;	
		}
		pillarMesh.position.x = Math.floor(Math.random()*500) * this._getRandomNegativeOrPositive();
		pillarMesh.position.y = 0;
		pillarMesh.position.z = Math.floor(Math.random()*500) * this._getRandomNegativeOrPositive();
		this.scene.add( pillarMesh);
	}


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
	},
	_getRandomNegativeOrPositive: function() {
		var randomNumber = Math.round(Math.random());
		var randomNegativeOrPositiveMultiple = 1;
		if (randomNumber == 0) {
			randomNegativeOrPositiveMultiple = 1;
		} else {
			randomNegativeOrPositiveMultiple = -1;	
		}
		return randomNegativeOrPositiveMultiple;
	},
	_setupGround: function() {
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
		return ground;
	}

};


