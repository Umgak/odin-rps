"use strict;"
function playGame()
{
  const MAX_ROUNDS = 5;
  let humanScore = 0, computerScore = 0;
  let usedTransRights = false;
  const Choice = [
    /* lets me add extra options easily - in case this becomes rock-paper-scissors-lizard-spock tomorrow
       I know that you don't expect me to know array or object yet. I do. Sorrgy :3 */
    { name: "rock", beats: ["scissors"]},
    { name: "paper", beats: ["rock"]},
    { name: "scissors", beats: ["paper"]},
    // secret option
    { name: "trans rights", beats: ["rock", "paper", "scissors"]}
  ];

  function disableTransRightsEE()
  /* only let you use the trans rights easter egg once per game */
  {
    for (let i = 0; i < (Choice.length - 2); ++i) {
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
    humanScore += scoreDelta[0];    // avoids using big if-else blocks for playRound (they're in determineVictor instead)
    computerScore += scoreDelta[1]; // this is actually faster than using a loop, w/e
  }
}