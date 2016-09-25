function Player(world) {
	// diffrent types of cameras, parameters filed of view, aspect ration, near and far clipping plane
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	// set camera position
	// moves out camera postion becaus otherwise it would be placed at 0, 0, 0 with the cube
	this.camera.position.z = 0;
	this.camera.position.y = 2;

	// SETUP Controls
	// Add the orbit controls to the camera
    this.controls = new THREE.OrbitControls(this.camera, world.renderer.domElement);
    this.controls.addEventListener("mouseUp", world.render)
	
	// Set the point at which we will orbit around
    controls.target = new THREE.Vector3(0, 0, 0);     
}

Player.prototype = {

}