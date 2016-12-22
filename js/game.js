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
 
function Game(world) {

	// Passing the world into the game function.
	this.world = world;
	// Grabbing elements from the DOM.
	this.riddleContainerEl = $(".riddle-container");
	this.questionEl = $(".riddle-container .question");
	// Setting game correct answers need to be pointed to the treasure.
	this.correctAnswersNeeded = 3;
	// Setting game correct answer count.
	this.riddlesAnsweredCorrectly = 0;
	// The riddle index starts at null.
	this.riddleIndex = null;
	// The user input starts empty.
	this.userInput = "";

	this._exitDisplayRiddle = this._exitDisplayRiddle.bind(this);

	var startButtonEl = $("#js-start-button");

	// After the user clicks start, we no longer display start dialog.
	startButtonEl.click(function () {
		$(".instruction-container").css("display", "none");
	})
	
	this.world.player.addEventListener("pillarDetected", function () {
		this._displayDialog("pillar");
	}.bind(this));

	this.world.player.addEventListener("treasureDetected", function () {
		this._displayDialog("treasure");
	}.bind(this))

	var submitButton = $("#js-answer-button");
	
	submitButton.click(function (event) {
		var userInputEl = $("input[name='answer']");
		// Save user input.
		this.userInput = userInputEl.val();
		// clear user input.
		userInputEl.val("");
		// Dicide if user was correct and display the next direction to head 
		// using the #question div.
		this._interactWithUser();
		// Hide the question / answer dialog.
		$(".answer").css("display", "none");
	}.bind(this))

}

Game.prototype = {
	_displayText: function (text) {
		this.questionEl.text(text);
	},
	_getRiddleIndex: function () {
		return this.riddleIndex = Math.floor(Math.random() * riddles.length);
	},
	_isRiddleCorrect: function (riddle, userAnswer) {
		return userAnswer.toLowerCase().indexOf(riddle.Answer.toLowerCase()) != -1;
	},
	_showTreasure: function () {
		this._displayText("I'm so pleased you are correct! Please see your HUD for the location of the box.");
		this.world.hud.addTargetArea(this.world.getPositionOfTreasure());
	},
	_showNoPillarsLeft: function () {
		this._displayText("I'm so pleased you are correct! Unfortunately, there are no more pillars to guide you.");
	},
	_showNextPillar: function () {
		this._displayText("I'm so pleased you are correct! Please see your HUD for the location of the next pillar.");
		this.world.hud.addTargetArea(this.world.getPositionOfNextPillar());
	},
	_showNoHelp: function () {
		this._displayText("Sorry to say, but you will get no help from me");
		this.world.hud.hintSphere = null;
	},
	_interactWithUser: function () {
		if(this.world.hud.hintSphere){
			this.world.hud.removeObjectFromScene();
		}
		
		// Remove riddle that is already shown.
		var riddle = riddles.splice(this.riddleIndex, 1)[0];

		// Decide what help to show player depending on their riddle answer.
		if (this._isRiddleCorrect(riddle, this.userInput)) {
			this.riddlesAnsweredCorrectly++;

			if (this.riddlesAnsweredCorrectly >= this.correctAnswersNeeded) {
				this._showTreasure();
			} else if (riddles.length == 0) { 
				this._showNoPillarsLeft();
			} else {			
				this._showNextPillar();
			}
		} else {
			this._showNoHelp();
		}

		// After you've answered the riddle and we have shown a message, we 
		// dismiss the message when the user hits any arrow key to start moving
		// again.
		document.addEventListener("keydown", this._exitDisplayRiddle);
	},
	_exitDisplayRiddle: function (e) {
		if (e.keyCode == UP_ARROW_KEY_CODE || e.keyCode == DOWN_ARROW_KEY_CODE || e.keyCode == RIGHT_ARROW_KEY_CODE || e.keyCode == LEFT_ARROW_KEY_CODE) {
			this.riddleContainerEl.css("display", "none");
			document.removeEventListener("keydown", this._exitDisplayRiddle);
		}
	},
	_congratulateWinner: function () {
		this.questionEl.text("Congratulations!! You're a winner");
	},
	_displayDialog: function (item) {
		this.riddleContainerEl.css("display", "initial");

		if (item == "pillar") {
			this._displayText(riddles[this._getRiddleIndex()].Question);
			$(".answer").css("display", "initial");
		}

		if (item == "treasure") {
			this._congratulateWinner();
		}
	},

};
