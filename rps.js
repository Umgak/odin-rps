"use strict;"
function playGame()
{
  const Choice = [
    /* lets me add extra options easily - in case this becomes rock-paper-scissors-lizard-spock tomorrow
       I know that you don't expect me to know array or object yet. I do. Sorrgy :3 */
    { name: "rock", beats: ["scissors"]},
    { name: "paper", beats: ["rock"]},
    { name: "scissors", beats: ["paper"]},
    // secret option
    { name: "trans rights", beats: ["rock", "paper", "scissors"]}
  ];

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
      if (playerInput !== null) // player canceled - otherwise toLowerCase fails.
      {
        // hate multi-nesting like this. can I switch this to a guard clause somehow? look into it later
        playerInput = playerInput.toLowerCase();
        playerChoice = Choice.find(obj => obj.name === playerInput) // attempt to lookup 
        if (playerChoice === undefined && !runOnce) // failed to look up
        {
          query = `Unable to understand player choice: ${playerInput}. Please try again.\n\n${query}`;
          runOnce = true; // don't modify the text multiple times
        }
      }

    } while (playerChoice === undefined)
    return playerChoice;
  }

  function playRound(playerChoice, computerChoice) {
    if (playerChoice.beats.includes(computerChoice.name))
    {
      return RoundState.PLAYER_VICTOR;
    }
    else if (computerChoice.beats.includes(playerChoice.name))
    {
      return RoundState.COMPUTER_VICTOR;
    }
    return RoundState.NO_VICTOR;
  }

}