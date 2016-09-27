function Game() {
	this._getRiddles();
}

Game.prototype = {

};

var game = new Game();
var world = new World(Player);
world.render();


	

