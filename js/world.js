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
	this.treasure = this._defaultLoadingTreasure();
	this._setupTreasure();
	this.scene.add(this.treasure);

	//ADD PILLARS
	this.numberOfPillars = 5;
	this.pillarPositions = [];
	this._setupPillars();

	// forest test
    var forestGeometry = new THREE.Geometry();

    var texture = THREE.ImageUtils.loadTexture("images/aspen.png");
    var treeMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF, map: texture, side: THREE.DoubleSide});
    treeMaterial.alphaTest = 0.95;

	var manager = new THREE.LoadingManager();
	manager.onProgress = function (item, loaded, total) {
        console.log( item, loaded, total );
    };

    var loader = new THREE.OBJLoader(manager);
    loader.load("images/aspen-combined-2.obj", function (treeObject) {
	    for (var i = 0; i < 20000; i++) {
	    	var newTreeObject = treeObject.clone();

	        var newTreeMesh = newTreeObject.children[0];
	        var scale = Math.random() * 10 + 5;
        	newTreeMesh.scale.set(scale, scale, scale);
	        newTreeMesh.position.x = Math.random() * 1000 - 500;
	        newTreeMesh.position.y = -0.5;
	        newTreeMesh.position.z = Math.random() * 1000 - 500;
	        newTreeMesh.rotation.y = Math.random() * 2 * Math.PI;
	        newTreeMesh.updateMatrix();

	        var geometry = new THREE.Geometry().fromBufferGeometry(newTreeMesh.geometry);
			forestGeometry.merge(geometry, newTreeMesh.matrix);
		}

	   	var forestMesh = new THREE.Mesh(forestGeometry, treeMaterial);
	    this.scene.add(forestMesh);
    }.bind(this));

	// this.scene.fog = new THREE.Fog(GREY, .0001, 150);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 50, 0);
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
	_defaultLoadingTreasure: function() {
		var treasureGeometry = new THREE.BoxGeometry( 2, 2, 2 );
		// var treasureMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		var treasureMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('images/crate.jpg') });
		var treasureCube = new THREE.Mesh(treasureGeometry, treasureMaterial);
		treasureCube.position.x = Math.random() * 1000 - 500;
		treasureCube.position.y = 1;
		treasureCube.position.z = Math.random() * 1000 - 500;
		return treasureCube;
	},
	_setupTreasure: function() {
		var manager = new THREE.LoadingManager();
	    manager.onProgress = function ( item, loaded, total ) {
	        console.log( item, loaded, total );
	    };
	    var loader = new THREE.OBJLoader(manager);
	    loader.load( 'images/treasure_chest.obj', function ( object ) {
	        var texture = THREE.ImageUtils.loadTexture("images/treasure_chest.jpg");
	        texture.wrapS = THREE.RepeatWrapping;
	        texture.wrapT = THREE.RepeatWrapping;
	        var material = new THREE.MeshLambertMaterial({color:0xFFFFFF, map:texture});
	        object.children[0].material = material;
	        object.children[0].transparent = true;
	        object.position.set(Math.random() * 1000 - 500, 0, Math.random() * 1000 - 500);
	        this.scene.remove(this.treasure);
	        this.treasure = object;
	        this.scene.add(object)
	    }.bind(this));
	},
	_setupPillars: function() {
		var manager = new THREE.LoadingManager();
	    manager.onProgress = function ( item, loaded, total ) {
	        console.log( item, loaded, total );
	    };
	    var loader = new THREE.OBJLoader(manager);
        for (var i = 0; i < this.numberOfPillars; i++) {
		    loader.load( 'images/pedestal-cheetah.obj', function ( object ) {
		        var texture = THREE.ImageUtils.loadTexture("images/pedestal3.jpg");
		        var material = new THREE.MeshLambertMaterial({color:0xFFFFFF, map:texture});
		        object.children[0].material = material;
		        object.children[0].transparent = true;
		        object.scale.set(3, 3, 3);
		        // this.pillarPositions.pop();
				if (i == 0) {
					object.position.x = 0
					object.position.y = 0;
					object.position.z = -450;
				} else {
					object.position.x = Math.random() * 1000 - 500;
					object.position.y = 0;
					object.position.z = Math.random() * 1000 - 500;
				}
				this.pillarPositions.push(object.position);
		        console.log(object);
		        // this.scene.remove(this.pillarObjects[i]);
		        this.scene.add(object)
		    }.bind(this));
	    }
	},
	// TODO combine get position of pillar function with get position of treasure function.
	getPositionOfNextPillar: function() {
		return this.pillarPositions[Math.floor(Math.random() * this.pillarPositions.length)];
	},
	getPositionOfTreasure: function(){
		return this.treasure.position;
	}
};


