	var MINIMAPEL = $("#inset");
	var MINIMAP_HEIGHT = 150;
	var MINIMAP_WIDTH = 150;

function Hud(player) {
	this.player = player;
	// create a new scene and camera
	this.miniMapScene = new THREE.Scene();
	this.miniMapCamera = new THREE.PerspectiveCamera(75, MINIMAP_WIDTH / MINIMAP_HEIGHT, .1, 1000);
	this.miniMapCamera.position.z = 10
	// create new renderer
	this.miniMapRenderer = new THREE.WebGLRenderer();
	this.miniMapRenderer.setSize(MINIMAP_WIDTH, MINIMAP_HEIGHT);
	// add minimap to DOM
	MINIMAPEL.append(this.miniMapRenderer.domElement);
	// add a sphere
	var sphereGeometry = new THREE.SphereGeometry(.5, 32, 32);
	var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
	this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	this.miniMapScene.add(this.sphere);
}

Hud.prototype = {
	render: function() {
		// get new sphere position
		this.sphere.position.x = (this.player.camera.position.x * .015);
		this.sphere.position.y = -1*(this.player.camera.position.z * .015);
		this.sphere.position.z = 0;
		// render minimap
		this.miniMapRenderer.render(this.miniMapScene, this.miniMapCamera);
	}

};