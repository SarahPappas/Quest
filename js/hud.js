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


function Hud(player) {
	var MiniMapEl = $("#js-HUD");
	var MiniMap_Height = 150;
	var MiniMap_Width = 150;

	this.player = player;

	// Create a new scene and camera for the HUD.
	this.miniMapScene = new THREE.Scene();
	this.miniMapCamera = new THREE.PerspectiveCamera(75, MiniMap_Width / MiniMap_Height, 0.1, 50);
	this.miniMapCamera.position.z = 10

	// Create new renderer for the HUD.
	this.miniMapRenderer = new THREE.WebGLRenderer();
	this.miniMapRenderer.setSize(MiniMap_Width, MiniMap_Height);

	// Add  the minimap to DOM.
	MiniMapEl.append(this.miniMapRenderer.domElement);

	// Add a sphere, which will represent the players location.
	var sphereGeometry = new THREE.SphereGeometry(.5, 32, 32);
	var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
	this._userSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	this.miniMapScene.add(this._userSphere);

	// We need to save sphere so we can access the name later to remove it 
	// from the minimap.
	this.hintSphere = null;

}

Hud.prototype = {
	render: function () {
		// Get new sphere position.
		this._userSphere.position.x = (this.player.camera.position.x * .015);
		this._userSphere.position.y = -1*(this.player.camera.position.z * .015);
		this._userSphere.position.z = 0;

		// Render the minimap.
		this.miniMapRenderer.render(this.miniMapScene, this.miniMapCamera);
	},
	/**
	 * @param {number} draws a circular target area at the next objective's 
	 * location.
	 */
	addTargetArea: function (location) {
		var radius = 30;
		var diameter = radius * 2;
		var pillarPosition = location;
		var ratio = .015;
		var sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
		var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xf2f28a});
		this.hintSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		this.hintSphere.position.x = ((pillarPosition.x - radius) + (Math.random() * diameter)) * ratio;
		this.hintSphere.position.y = (-1 * ((pillarPosition.z - radius) + (Math.random() * diameter))) * ratio;
		this.hintSphere.name = "TargetArea";
		this.miniMapScene.add(this.hintSphere);
	},
	removeObjectFromScene: function () {
		var selectedObject = this.miniMapScene.getObjectByName(this.hintSphere.name);
		this.miniMapScene.remove(selectedObject);
		selectedObject.material.dispose();
        selectedObject.geometry.dispose();
	},

};