var GREY = 0xaaaaaa;

function World(player) {
	// SETUP
	// need 3 things to dispaly anything. A scene a camera and a render
	this.scene = new THREE.Scene();
	// camera in screen is on the player
	this.player = new Player();

	//setup renderer
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.setClearColor(GREY);
	document.body.appendChild(this.renderer.domElement);

	//ADD GROUND PLANE
	this.scene.add(this._setupGround());

	// add a cone geometry
	var treeColors = ["#09BA56", "#0AC75C", "#08A04A", "#0DF873", "#067A38"];
	this.forestGeometry = new THREE.Geometry();

	// create the forest
	for(var i = 0; i < 5000; i++) {
		var treeGeometry = new THREE.ConeGeometry(Math.random() * 10 + 5, Math.random() * 60 + 10, 8, 1, true);
		var treeMesh = new THREE.Mesh(treeGeometry);
		treeMesh.castShadow = true;
		treeMesh.position.x = Math.random() * 1000 - 500;
		treeMesh.position.y = 0;
		treeMesh.position.z = Math.random() * 1000 - 500;
		treeMesh.updateMatrix();
		this.forestGeometry.merge(treeMesh.geometry, treeMesh.matrix);
	}
	var forestMesh = new THREE.Mesh(this.forestGeometry, new THREE.MeshBasicMaterial({color: treeColors[Math.floor(Math.random() * 5)]}));
	// this.scene.add(forestMesh);

	//array of all pillar positions
	this.pillarPositions = [];
	// pillar
	for(var i = 0; i < 5; i++) {
		var pillarGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
		var pillarMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		var pillarMesh = new THREE.Mesh( pillarGeometry, pillarMaterial);
		pillarMesh.position.x = Math.random() * 1000 - 500;
		pillarMesh.position.y = 0;
		pillarMesh.position.z = Math.random() * 1000 - 500;
		this.pillarPositions.push(pillarMesh.position);
		this.scene.add( pillarMesh);
	}
	console.log(this.pillarPositions[0]);

	// create fog DECIDE WHETHER TO KEEP THIS, USE FOR TREE testing.
		// this.scene.fog = new THREE.Fog(GREY, .0001, 150);

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
		this.player.render(this.pillarPositions);
		this.renderer.render(this.scene, this.player.camera);
		// use requestAnimationFrame for loop instead of setInterval because it pauses when user navigates away
		requestAnimationFrame(this.render.bind(this));
	},
	_onWindowResize: function() {
	    this.player.camera.aspect = window.innerWidth / window.innerHeight;
	    this.player.camera.updateProjectionMatrix();
	    this.renderer.setSize(window.innerWidth, window.innerHeight);
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


