function Game(world) {
	// QUESTION would you make these constants??
	var riddleContainerEl = $(".riddleContainer");
	var submitButton = $("#answer-button");
	this.questionEl = $(".riddleContainer .question");
	this.correctAnswersNeeded = 3;
	this.riddlesAnsweredCorrectly = 0;

	this.riddleIndex = null;
	this.userInput = "";
	
	world.player.addEventListener("pillarDetected", function() {
		riddleContainerEl.css("display", "initial");
		this._displayRiddle();
	}.bind(this))

	submitButton.click(function(event) {
		//FIX not working
		event.preventDefault();
		// save user input
		this.userInput = $("input[name='answer']").val();
		//Say if you were correct and which direction to head - use question div
		this._isRiddleCorrect();
		this._checkNumberOfCorrectAnswers();
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
	},
	_isRiddleCorrect: function() {
		var riddleAnswer = riddles[this.riddleIndex].Answer;
		if (this.userInput.toLowerCase().indexOf(riddleAnswer) == -1) {
			this.questionEl.text("Sorry to say, but you will get no help from me");
		} else {
			this.questionEl.text("I'm so pleased you are correct");
			this.riddlesAnsweredCorrectly++;
		}
		// remove riddle that is already shown
		riddles.splice(this.riddleIndex, 1);
	},
	_checkNumberOfCorrectAnswers: function() {
	 
	},
	_interactWithUser: function() {

	}
};