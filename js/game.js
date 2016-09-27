function Game(world) {
	var riddleContainerEl= $(".riddleContainer");
	var riddlesAnsweredCorrectly = 0;
	
	world.player.addEventListener("pillarDetected", function() {
		riddleContainerEl.css("display", "initial");
		this._displayRiddle();

	}.bind(this))
}

Game.prototype = {
	_displayRiddle: function() {
		var questionEl = $(".riddleContainer .question");
		questionEl.text(riddles[Math.floor(Math.random() * riddles.length)].Question);		
	}
};