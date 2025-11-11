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

  new Choice("rock", "🪨", "Rock", "smashes", ["scissors"]);
  new Choice("paper", "📄", "Paper", "covers", ["rock"]);
  new Choice("scissors", "✂️", "Scissors", "chop up", ["paper"]);
  // secret option
  new Choice("transrights", "🏳️‍⚧️", "Trans Rights", "", ["rock", "paper", "scissors"], false);

  let playerScore = 0, computerScore = 0;

  function disableTransRightsEE()
  /* only let you use the trans rights easter egg once per game */
  {
    for (let i = 0; i < (Choices.length - 1); ++i) {
      Choices[i].beats.push("transrights");
    }
    Choices[Choices.length - 1].beats.length = 0;
    return;
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

  function appendScores(message)
  {
    message += `\nPlayer score: ${playerScore}\nComputer score: ${computerScore}`
    return message;
  }

  function playRound(event)
  {
    const playerChoice = Choices.find(obj => obj.id === event.target.id);
    const computerChoice = getComputerChoice();
    const scoreDelta = determineVictor(playerChoice, computerChoice);
    playerScore += scoreDelta[0];    // avoids using big if-else blocks for playRound (they're in determineVictor instead)
    computerScore += scoreDelta[1]; // this is actually faster than using a loop, w/e

    let message = `You threw: ${playerChoice.friendlyName}\nI threw: ${computerChoice.friendlyName}\n`;
    if (scoreDelta === RoundState.NO_VICTOR)
    {
      message += "It's a tie!\n";
    }
    else if (playerChoice.name === "transrights") // gotta handle the two states of trans rights in here
    {
      if (scoreDelta === RoundState.PLAYER_VICTOR)
      {
        message += "Hey, that's not one of the options! But it is true...\nI'll give you this round, but I won't be so gentle in the future.\n";
      }
      else
      {
        message += "I told you I wouldn't be so gentle in the future.\nI'm taking this round!\n";
      }
    }
    else
    {
      message += ((scoreDelta === RoundState.PLAYER_VICTOR) ? 
        `Your ${playerChoice.friendlyName} ${playerChoice.flavorText} my ${computerChoice.friendlyName}!\nYou win this round!\n` : 
        `My ${computerChoice.friendlyName} ${computerChoice.flavorText} your ${playerChoice.friendlyName}!\nI win this round!\n`)
    }
    message = appendScores(message)
    console.log(message);
  }
}

playGame();