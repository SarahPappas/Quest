function Game(world) {
	var displayContainer = $("#container");
	var riddlesAnsweredCorrectly = 0;
	
	world.player.addEventListener("pillarDetected", function() {
		displayContainer.append("<div class='riddle'>" + riddles[Math.floor(Math.random() * riddles.length)].Question + "</div>")

	})
}

Game.prototype = {

};