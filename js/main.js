// SETUP
// need 3 things to dispaly anything. A scene a camera and a render
var scene = new THREE.Scene();
// diffrent types of cameras, parameters filed of view, aspect ration, near and far clipping plane
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

//ADD BOX
// object has all vertices and fill faces of the cube
var geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
var materialCube = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// takes the geometry and adds the mesh
var cube = new THREE.Mesh( geometryCube, materialCube );
// adds the cube we just made to the scene
// scene.add( cube );

//ADD GROUND PLANE
var groundTexture = THREE.ImageUtils.loadTexture("images/MossyBank.jpg");
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(200, 200);
// var groundBump = THREE.ImageUtils.loadTexture("");
var geometryGroundPlane = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
var materialGroundPlane = new THREE.MeshBasicMaterial({ 
	map: groundTexture, 
	side: THREE.DoubleSide 
});
var ground = new THREE.Mesh( geometryGroundPlane, materialGroundPlane );
// ground.rotation.set(90 * (3.14/180), 0, 'XY');
ground.rotateX(90 * (Math.PI/180));
// adds plane
scene.add( ground );

// set camera position
// moves out camera postion becaus otherwise it would be placed at 0, 0, 0 with the cube
camera.position.z = 10;
camera.position.y = 2;





// to render the page, you need a render loop
// anything you move or change has to run through the render function loop
function render() {
	// use requestAnimationFrame for loop instead of setInterval because it pauses when user navigates away
	requestAnimationFrame( render );
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	renderer.render( scene, camera );
}

// call render function
render();
