function Game(world) {
	// QUESTION would you make these constants??
	var riddleContainerEl = $(".riddleContainer");
	var riddlesAnsweredCorrectly = 0;
	var submitButton = $("#answer-button");
	this.questionEl = $(".riddleContainer .question");

	this.riddleIndex = null;
	this.userInput = "";
	
	world.player.addEventListener("pillarDetected", function() {
		riddleContainerEl.css("display", "initial");
		this._displayRiddle();
	}.bind(this))

	submitButton.click(function() {
		// save user input
		this.userInput = $("input[name='answer']").val();
		console.log(this.userInput);
		//Say if you were correct and which direction to head - use question div
		this._isRiddleCorrect();
		//hide the form 
		$("form").css("display", "none");
		//on key down hide the riddles modal?
	}.bind(this))
}

Game.prototype = {
	_displayRiddle: function() {
		this.riddleIndex = Math.floor(Math.random() * riddles.length);
		this.questionEl.text(riddles[this.riddleIndex].Question);
		//display answer form
		$("form").css("display", "initial");
		console.log(this.riddleIndex);
	},
	_isRiddleCorrect: function() {
		var riddleAnswer = riddles[this.riddleIndex].Answer;
		console.log(this.riddleIndex);
		console.log(riddleAnswer);
		console.log(this.userInput);
		console.log(riddleAnswer.indexOf(this.userInput));
		// adjust for caps or lowercase
		if (riddleAnswer.indexOf(this.userInput) == -1) {
			this.questionEl.text("Sorry to say, but you will get no help from me");
		} else {
			this.questionEl.text("I'm so pleased you are correct");
		}
		// remove riddle that is already shown
		riddles.splice(this.riddleIndex, 1);
	}
};