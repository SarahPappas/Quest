var GREY = 0xaaaaaa;
var PLANE_WIDTH = 1000;
var PLANE_HEIGHT = 1000;

function World(player, hud) {
	// SETUP
	// need 3 things to dispaly anything. A scene a camera and a render
	this.scene = new THREE.Scene();
	// camera in screen is on the player
	this.player = new Player();
	// call the Hud constructor
	this.hud = new Hud(this.player);

	//setup renderer
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.setClearColor(GREY);
	document.body.appendChild(this.renderer.domElement);

	//ADD GROUND PLANE
	this.scene.add(this._setupGround());

	//ADD TREASURE BOX
	this.treasure = this._setupTreasure()
	this.scene.add(this.treasure);


	// add a cone geometry
	var treeColors = ["#09BA56", "#0AC75C", "#08A04A", "#0DF873", "#067A38"];
	this.forestGeometry = new THREE.Geometry();
	this.branchesMesh = null;
	this.newTreeMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('images/FirBranches_Df.png') } );
	this.newTreeMaterial.transparent = true;

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
	//new THREE.MeshBasicMaterial({color: treeColors[Math.floor(Math.random() * 5)]})
	// THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading})
	// new THREE.MeshBasicMaterial({color: treeColors[Math.floor(Math.random() * 5)]})
	var forestMesh = new THREE.Mesh(this.forestGeometry, this.newTreeMaterial);
	this.scene.add(forestMesh);



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
		this.scene.add(pillarMesh);
	}

	// create fog DECIDE WHETHER TO KEEP THIS, USE FOR TREE testing.
	// this.scene.fog = new THREE.Fog(GREY, .0001, 150);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c, 1, 1);
    this.scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 200, 0);
    pointLight.castShadow = true;
    this.scene.add(pointLight);

	//Resize Window event listener
	window.addEventListener('resize', this._onWindowResize.bind(this), false);
}


World.prototype = {
	// to render the page, you need a render loop
	// anything you move or change has to run through the render function loop
	render: function() {
		this.hud.render();
		this.player.render(this.pillarPositions, this.treasure.position);
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
		var geometryGroundPlane = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT, 1, 1);
		var materialGroundPlane = new THREE.MeshBasicMaterial({ 
			map: groundTexture, 
			side: THREE.DoubleSide 
		});
		var ground = new THREE.Mesh(geometryGroundPlane, materialGroundPlane);
		// ground.rotation.set(90 * (3.14/180), 0, 'XY');
		ground.rotateX(90 * (Math.PI / 180));
		return ground;
	},
	_setupTreasure: function() {
		var treasureGeometry = new THREE.BoxGeometry( 2, 2, 2 );
		var treasureMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		var treasureCube = new THREE.Mesh(treasureGeometry, treasureMaterial);
		treasureCube.position.x = Math.random() * 1000 - 500;
		treasureCube.position.y = 0;
		treasureCube.position.z = Math.random() * 1000 - 500;
		return treasureCube;
	},
	// TODO combine get position of pillar function with get position of treasure function.
	getPositionOfNextPillar: function() {
		return this.pillarPositions[Math.floor(Math.random() * this.pillarPositions.length)];
	},
	getPositionOfTreasure: function(){
		return this.treasure.position;
	}
};


