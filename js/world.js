/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Sarah Pappas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var GREY = 0xaaaaaa;
var PLANE_SIZE = 1000;

function World() {

	// SETUP
	// We need 3 things to dispaly anything: A scene, a camera, and a renderer.
	this.scene = new THREE.Scene();
	// The camera in this scene is on the player.
	this.player = new Player();
	// We call the HUD constructor to render the HUD.
	this.hud = new Hud(this.player);

	// SETUP RENDERER
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

	// ADD FOREST
	this.numberOfTrees = 20000;
	// this._setupForest();
    
	// ADD FOG
	// this.scene.fog = new THREE.Fog(GREY, .0001, 150);

    // ADD SUBTLE AMBIENT LIGHTING
    var ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 50, 0);
    pointLight.castShadow = true;
    this.scene.add(pointLight);

	// Resize camera aspect ratio when the user resizes the window.
	window.addEventListener('resize', this._onWindowResize.bind(this), false);
}


World.prototype = {
	start: function () {
		this._render();
	},
	// To render the page, you need a render loop.
	// Anything you move or change has to run through the render function loop.
	_render: function () {
		this.hud.render(this.player);
		this.player.render(this.pillarPositions, this.treasure.position);
		this.renderer.render(this.scene, this.player.camera);

		// Use requestAnimationFrame for loop instead of setInterval because it 
		// pauses when the user navigates away from the page.
		requestAnimationFrame(this._render.bind(this));
	},
	_onWindowResize: function () {
	    this.player.camera.aspect = window.innerWidth / window.innerHeight;
	    this.player.camera.updateProjectionMatrix();
	    this.renderer.setSize(window.innerWidth, window.innerHeight);
	},
	_setupGround: function () {
		var groundTexture = THREE.ImageUtils.loadTexture("images/Grass.jpg");
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set(100, 100);
		groundTexture.anisotropy= 4;
		var geometryGroundPlane = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 1, 1);
		var materialGroundPlane = new THREE.MeshBasicMaterial({ 
			map: groundTexture, 
			side: THREE.DoubleSide 
		});
		var ground = new THREE.Mesh(geometryGroundPlane, materialGroundPlane);
		ground.rotateX(90 * (Math.PI / 180));
		return ground;
	},
	_randomCoordinant: function () {
		return Math.random() * PLANE_SIZE - PLANE_SIZE / 2;
	},
	_setMaterial: function (newObject, texture) {
		var material = new THREE.MeshLambertMaterial({color:0xFFFFFF, map:texture});
		newObject.children[0].material = material;
		newObject.children[0].transparent = true;
	},
	_setPostition: function(object, x, y, z) {
		object.position.x = x;
		object.position.y = y;
		object.position.z = z;
	},
	_defaultLoadingTreasure: function () {
		var treasureGeometry = new THREE.BoxGeometry( 2, 2, 2 );
		var treasureMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('images/crate.jpg') });
		var treasureCube = new THREE.Mesh(treasureGeometry, treasureMaterial);
		
		this._setPostition(treasureCube, this._randomCoordinant(), 1, this._randomCoordinant());
		
		return treasureCube;
	},
	_setupTreasure: function () {
		var manager = new THREE.LoadingManager();
	    var loader = new THREE.OBJLoader(manager);
	    loader.load( 'images/treasure_chest.obj', function ( object ) {
	        var texture = THREE.ImageUtils.loadTexture("images/treasure_chest.jpg");
	        texture.wrapS = THREE.RepeatWrapping;
	        texture.wrapT = THREE.RepeatWrapping;
	        
	        this._setMaterial(object, texture);
	        this._setPostition(object, this._randomCoordinant(), 0, this._randomCoordinant());
	        
	        // We need to remove the default treasure from the scene.
	        this.scene.remove(this.treasure);
	        this.treasure = object;
	        this.scene.add(object)
	    }.bind(this));
	},
	_setupPillars: function () {
		var manager = new THREE.LoadingManager();
	    var loader = new THREE.OBJLoader(manager);

		loader.load( 'images/pedestal-cheetah.obj', function ( object ) {
        	for (var i = 0; i < this.numberOfPillars; i++) {
        		var newObject = object.clone();
		        var texture = THREE.ImageUtils.loadTexture("images/pedestal3.jpg");
		        this._setMaterial(newObject, texture);

		        newObject.scale.set(20, 20, 20);

				if (i == 0) {
					// We set the first pillar straight North at the edge of
					// the map.
					this._setPostition(newObject, 0, 0, 50 - PLANE_SIZE / 2);
				} else {
					// Position the rest of the pillars randomly.
					this._setPostition(newObject, this._randomCoordinant(), 0, this._randomCoordinant());
				}

				this.pillarPositions.push(newObject.position);
		        this.scene.add(newObject)
	    	}
		}.bind(this));
	},
	_setupForest: function () {
		var forestGeometry = new THREE.Geometry();

	    var texture = THREE.ImageUtils.loadTexture("images/aspen-2.png");
	    var treeMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF, map: texture, side: THREE.DoubleSide});
	    treeMaterial.alphaTest = 0.95;

		var manager = new THREE.LoadingManager();
	    var loader = new THREE.OBJLoader(manager);

	    loader.load("images/aspen-combined-3.obj", function (treeObject) {
		    for (var i = 0; i < this.numberOfTrees; i++) {
		    	var newTreeObject = treeObject.clone();

		        var newTreeMesh = newTreeObject.children[0];
		        var scale = Math.random() * 10 + 5;
	        	newTreeMesh.scale.set(scale, scale, scale);
	        	this._setPostition(newTreeMesh, this._randomCoordinant(), -0.5, this._randomCoordinant());
		        newTreeMesh.rotation.y = Math.random() * 2 * Math.PI;
		        newTreeMesh.updateMatrix();

		        var geometry = new THREE.Geometry().fromBufferGeometry(newTreeMesh.geometry);
				forestGeometry.merge(geometry, newTreeMesh.matrix);
			}

		   	var forestMesh = new THREE.Mesh(forestGeometry, treeMaterial);
		    this.scene.add(forestMesh);
	    }.bind(this));
	},
	getPositionOfNextPillar: function () {
		return this.pillarPositions[Math.floor(Math.random() * this.pillarPositions.length)];
	},
	getPositionOfTreasure: function (){
		return this.treasure.position;
	}
};


