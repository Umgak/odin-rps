"use strict;"
function playGame()
{
  const MAX_ROUNDS = 5;
  let playerScore = 0, computerScore = 0;
  const Choice = [
    /* lets me add extra options easily - in case this becomes rock-paper-scissors-lizard-spock tomorrow
       I know that you don't expect me to know array or object yet. I do. Sorrgy :3 */
    { name: "rock", friendlyName: "Rock", flavorText: "smashes", beats: ["scissors"]},
    { name: "paper", friendlyName: "Paper", flavorText: "covers", beats: ["rock"]},
    { name: "scissors", friendlyName: "Scissors", flavorText: "chops up", beats: ["paper"]},
    // secret option
    { name: "trans rights", friendlyName: "Trans Rights", beats: ["rock", "paper", "scissors"]}
  ];

  function disableTransRightsEE()
  /* only let you use the trans rights easter egg once per game */
  {
    for (let i = 0; i < (Choice.length - 1); ++i) {
      Choice[i].beats.push("trans rights");
    }
    Choice[Choice.length - 1].beats.length = 0;
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
    return Choice[(Math.floor(Math.random() * (Choice.length - 1)))]; // -1 so that computer cannot pick trans rights
  }

  function getPlayerChoice()
  {
    let playerInput = undefined;
    let playerChoice = undefined;
    let query = "Enter rock, paper, or scissors."
    let runOnce = false;
    do {
      playerInput = prompt(query);
      if (playerInput === null) continue; // guard clause against player clicking cancel
      playerInput = playerInput.toLowerCase();
      playerChoice = Choice.find(obj => obj.name === playerInput) // attempt to lookup 
      if (playerChoice === undefined && !runOnce) // failed to look up
      {
        query = `Unable to understand player choice: ${playerInput}. Please try again.\n\n${query}`;
        runOnce = true; // don't modify the text multiple times
      }
    } while (playerChoice === undefined)
    return playerChoice;
  }

  function determineVictor(playerChoice, computerChoice)
    /* the *only* purpose of this function is to compute a victor. That's it. */
    {
    if (playerChoice.beats.includes(computerChoice.name))
    {
      if (playerChoice.name === "trans rights") {
        disableTransRightsEE()
      }
      return RoundState.PLAYER_VICTOR;
    }
    else if (computerChoice.beats.includes(playerChoice.name))
    {
      return RoundState.COMPUTER_VICTOR;
    }
    return RoundState.NO_VICTOR;
  }

  function playRound()
  /* according to the instructions, I'm supposed to get the player choices outside of this function.
     no. */
  {
    let playerChoice = getPlayerChoice();
    let computerChoice = getComputerChoice();
    let scoreDelta = determineVictor(playerChoice, computerChoice);
    playerScore += scoreDelta[0];    // avoids using big if-else blocks for playRound (they're in determineVictor instead)
    computerScore += scoreDelta[1]; // this is actually faster than using a loop, w/e

    let message = `You threw: ${playerChoice.friendlyName}\nI threw: ${computerChoice.friendlyName}\n`;
    if (scoreDelta == RoundState.NO_VICTOR)
    {
      message += "It's a tie!\n";
    }
    else if (playerChoice.name === "trans rights") // gotta handle the two states of trans rights in here
    {
      if (scoreDelta == RoundState.PLAYER_VICTOR)
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
      message += ((scoreDelta == RoundState.PLAYER_VICTOR) ? `Your ${playerChoice.friendlyName} ${playerChoice.flavorText} my ${computerChoice.friendlyName}!\nYou win this round!\n` : `My ${computerChoice.friendlyName} ${computerChoice.flavorText} your ${playerChoice.friendlyName}!\nI win this round!\n`)
    }
    message += `\nPlayer score: ${playerScore}\nComputer score: ${computerScore}`
    console.log(message);
    alert(message);
  }
}