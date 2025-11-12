"use strict;"
/* Author's note:
  If you're following along the Odin Project, and you stumbled into this code
  DO NOT USE IT AS A BENCHMARK.
  You are not supposed to know what the hell a "class" is, or how to use a constructor()
  I already DID know, because I've used C++ before.

  Learn at your own pace.
*/
function playGame()
{
  const Choices = [] // Array that lets me use loops to iterate over choices in the logic for determining who wins.
  class Choice {
    // Choice class constructor ends up handling everything from game logic to icon creation.
    // Is this good separation of concerns? No. But also yes! Because it handles everything that is related to choosing.
    constructor(id, icon, friendlyName, flavorText, beats, createIcon = true) {
      this.id = id;
      this.icon = icon;
      this.friendlyName = friendlyName;
      this.flavorText = flavorText;
      this.beats = beats;
      if (createIcon) {
        const clickableContainer = document.querySelector("#clickable-container");
        let div_outer = document.createElement("div");
        let div_inner = document.createElement("div");
        div_outer.className = "clickable";
        div_inner.id = this.id;
        div_inner.className = "card";
        div_inner.textContent = this.icon;

        div_outer.appendChild(div_inner);
        clickableContainer.appendChild(div_outer);
      }
      let clickableTarget = document.querySelector(`#${this.id}`);
      clickableTarget.addEventListener('click', playRound);
      Choices.push(this);
    }
  }

  class Score {
    #playerScore = 0;
    #computerScore = 0;
    #playerScoreDisplay = document.querySelector("#playerscore");
    #computerScoreDisplay = document.querySelector("#computerscore");

    resetScore()
    {
      this.#playerScore = 0;
      this.#computerScore = 0;
      this.#updateScoreDisplay();
    }

    addScore(RoundState)
    {
      this.#playerScore += RoundState[0];
      this.#computerScore += RoundState[1];
      this.#updateScoreDisplay();
    }

    #updateScoreDisplay()
    {
      this.#playerScoreDisplay.innerHTML = `Player Score: ${this.#playerScore}`;
      this.#computerScoreDisplay.innerHTML = `Computer Score: ${this.#computerScore}`
      return;
    }
  };

  let Scores = new Score;

  /* you have no idea how tempting it is to make this another class/part of the Score class*/
  const roundStatusDisplayLeft = document.querySelector(".roundstatusleft");
  const roundStatusDisplayRight = document.querySelector(".roundstatusright");
  const roundStatusDisplayBottom = document.querySelector(".roundstatusbottom");

  function init()
  // called on first startup
  {
    // setup new game
    new Choice("rock", "🪨", "Rock", "smashes", ["scissors"]);
    new Choice("paper", "📄", "Paper", "covers", ["rock"]);
    new Choice("scissors", "✂️", "Scissors", "chop up", ["paper"]);
    // secret option
    new Choice("transrights", "🏳️‍⚧️", "Trans Rights", "If you're reading this, I messed up!", [], false);
    enableTransRightsEE(true);

    // Reset scores (so the score display appears)
    Scores.resetScore();
  }

  function cleanup()
  {
    // reset scoring
    Scores.resetScore();

    // cleanup text
    roundStatusDisplayLeft.innerHTML = "";
    roundStatusDisplayRight.innerHTML = "";
    roundStatusDisplayBottom.innerHTML = "";

    // gotta put the easter egg back!
    enableTransRightsEE();
  }

  function disableTransRightsEE()
  /* only let you use the trans rights easter egg once per game */
  {
    for (let i = 0; i < (Choices.length - 1); ++i) {
      Choices[i].beats.push("transrights");
    }
    Choices[Choices.length - 1].beats.length = 0;
    return;
  }

  function enableTransRightsEE(isInitialSetup = false)
  /* re-enable the trans rights EE, since it doesn't fall out of scope now */
  {
    for (obj of Choices)
    {
      if (obj.beats.includes("transrights") || isInitialSetup)
      {
        Choices[Choices.length - 1].beats.push(obj.id);
      }
      if (obj.beats.includes("transrights")) // was disabled
      {
        obj.beats.length -= 1;
      }
    }

  }

  const RoundState = Object.freeze({
    /* pseudo-enum for roundstate */
    /* syntax: NAME: [player_score, computer_score] */
    NO_VICTOR: [0, 0],
    PLAYER_VICTOR: [1, 0],
    COMPUTER_VICTOR: [0, 1]
  });

  function getComputerChoice()
  {
    return Choices[(Math.floor(Math.random() * (Choices.length - 1)))]; // -1 so that computer cannot pick trans rights
  }

  function determineVictor(playerChoice, computerChoice)
    /* the *only* purpose of this function is to compute a victor. That's it. */
    {
    if (playerChoice.beats.includes(computerChoice.id))
    {
      if (playerChoice.id === "transrights") {
        disableTransRightsEE()
      }
      return RoundState.PLAYER_VICTOR;
    }
    else if (computerChoice.beats.includes(playerChoice.id))
    {
      return RoundState.COMPUTER_VICTOR;
    }
    return RoundState.NO_VICTOR;
  }

  function playRound(event)
  {
    const playerChoice = Choices.find(obj => obj.id === event.target.id);
    const computerChoice = getComputerChoice();
    const scoreDelta = determineVictor(playerChoice, computerChoice);
    Scores.addScore(scoreDelta);
    roundStatusDisplayLeft.innerHTML = `You threw: ${playerChoice.friendlyName}`
    roundStatusDisplayRight.innerHTML = `I threw: ${computerChoice.friendlyName}`;
    if (scoreDelta === RoundState.NO_VICTOR)
    {
      roundStatusDisplayBottom.innerHTML = "It's a tie!";
    }
    else if (playerChoice.id === "transrights") // gotta handle the two states of trans rights in here
    {
      if (scoreDelta === RoundState.PLAYER_VICTOR)
      {
        roundStatusDisplayBottom.innerHTML = "Hey, that's not one of the options! But it is true...<br>I'll give you this round, but I won't be so gentle in the future.<br>";
      }
      else
      {
        roundStatusDisplayBottom.innerHTML = "I told you I wouldn't be so gentle in the future.<br>I'm taking this round!<br>";
      }
    }
    else
    {
      roundStatusDisplayBottom.innerHTML = ((scoreDelta === RoundState.PLAYER_VICTOR) ? 
        `Your ${playerChoice.friendlyName} ${playerChoice.flavorText} my ${computerChoice.friendlyName}!<br>You win this round!<br>` : 
        `My ${computerChoice.friendlyName} ${computerChoice.flavorText} your ${playerChoice.friendlyName}!<br>I win this round!<br>`)
    }
  }
  
  init();

  // TEST DATA
  let reset = document.querySelector("#computerscore");
  reset.addEventListener("click", cleanup);
}

playGame();