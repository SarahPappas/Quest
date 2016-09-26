function Game() {
	this._getRiddles();
}

Game.prototype = {
	_getRiddles: function() {
		$.getJSON("riddles.json", function(data) {
			// FIX need to fire an event to return this data to somwhere else
			return data;
		}).fail(function (error) {
			console.log("fail");
			console.log(error);
		});
	}
};

var game = new Game();
var world = new World(Player);
world.render();


	

