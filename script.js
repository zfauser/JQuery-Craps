/*
  Name: Zach Fauser
  Date: April 25th, 2024
  Purpose: To create the game of Craps using HTML, CSS, and JavaScript
*/

// Global Variables
let die1 = 0;
let die2 = 0;
let playButtonClicked = false;
let firstRoll = true;
let balance = 100;
let bet = 0;
let validStartingValue = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let total = 0;
let win = false;
let winningNumber = 0;
let wins = 0;
let losses = 0;
let balanceResets = 0;
let maxTurns = 0;
let turns = 0;
let quickBetClicked = false;

function saveVariables() 
/*
  Purpose: To save the variables to local storage, which allows them to be saved between sessions
*/
{
  localStorage.setItem("balance", balance);
  localStorage.setItem("wins", wins);
  localStorage.setItem("losses", losses);
  localStorage.setItem("balanceResets", balanceResets);
}

function loadVariables()
/* 
  Purpose: To load the variables from local storage
*/
{
  // if the variables are in local storage, load them, otherwise set them to the default values
  if (localStorage.getItem("balance")) {
    balance = parseInt(localStorage.getItem("balance"));
    wins = parseInt(localStorage.getItem("wins"));
    losses = parseInt(localStorage.getItem("losses"));
    balanceResets = parseInt(localStorage.getItem("balanceResets"));
    if (balance === 1) {
      $("#balance").text("Balance: " + balance + " Smartie");
    } else {
      $("#balance").text("Balance: " + balance + " Smarties");
    }
    $("#win-losses").text("Wins: " + wins + ", Losses: " + losses + ", Balance Resets: " + balanceResets);
  } else {
    saveVariables();
  }
}

function onPlayButtonHover()
/*
  Purpose: To pause the animations when the play button (or quick play button) is hovered over, this is done in order to keep the animations synchronized
*/
{
  $("#welcome").css("animation-play-state", "paused");
  $("#play-button").css("animation-play-state", "paused");
  $("#quick-play-button").css("animation-play-state", "paused");
}

function onPlayButtonLeave()
/*
  Purpose: resume the animations when the play button (or quick play button) is no longer hovered over
*/
{
  $("#welcome").css("animation-play-state", "running");
  $("#play-button").css("animation-play-state", "running");
  $("#quick-play-button").css("animation-play-state", "running");
}

function showHowTo()
/*
  Purpose: to show the user how to play the game when they click the "Show: How To Play" button
*/
{
  if ($("#how-to-info-button").text() === "Show: How To Play") {
    $("#how-to-info-button").text("Hide: How To Play");
  } else {
    $("#how-to-info-button").text("Show: How To Play");
  }
  $("#how-to-info").slideToggle("fast");
}

function showQuickPlayInfo()
/*
  Purpose: to show the user what quick play is when they click the "What is Quick Play?" button
*/
{
  if ($("#what-is-quick-play-button").text() === "What is Quick Play?") {
    $("#what-is-quick-play-button").text("Hide Quick Play Info");
  }
  else {
    $("#what-is-quick-play-button").text("What is Quick Play?");
  }
  $("#quick-play-info").slideToggle("fast");
}

function rollDice()
/*
  Purpose: to roll the dice and display the results
*/
{
  let tempDie1 = Math.floor(Math.random() * 6 + 1);
  let tempDie2 = Math.floor(Math.random() * 6 + 1);
  $("#die1-image").attr("src", "dice-images/" + tempDie1 + ".png");
  $("#die2-image").attr("src", "dice-images/" + tempDie2 + ".png");
  $("#sum").text("Total: " + (tempDie1 + tempDie2));
}

function playAgain()
/*
  Purpose: to reset the game after the user has won, lost, or after they have played quick play
*/
{
  $("#play-button").text("Play Again");
  $("#play-button").attr("disabled", false);
  $("#play-button").removeClass("play-button-inactive");
  $("#play-button").addClass("play-button-active");
  $("#play-button").show();
  $("#quick-play-button").text("Quick Play");
  $("#quick-play-button").attr("disabled", 'disabled');
  $("#quick-play-button").removeClass("play-button-active");
  $("#quick-play-button").addClass("play-button-inactive");
  $("#quick-play-button").hide();
  $("#quick-play-text").hide();
  $("#what-is-quick-play-button").text("What is Quick Play?");
  $("#what-is-quick-play-button").hide();
  $("#play-button").attr("disabled", false);
  $("#play-button").removeClass("play-button-inactive");
  $("#play-button").addClass("play-button-active");
  firstRoll = true;
  playButtonClicked = false;
  turns = 0;
  quickBetClicked = false;
  $("#bet-title").hide();
  $("#winning-numbers").hide();
  $("#losing-numbers").hide();
  $("#win-losses").text("Wins: " + wins + ", Losses: " + losses + ", Balance Resets: " + balanceResets);

  // if the user has a balance of 1, changer whether or not "Smartie" is plural
  if (balance === 1) {
    $("#balance").text("Balance: " + balance + " Smartie");
  } else {
    $("#balance").text("Balance: " + balance + " Smarties");
  }
  $("#bet").val("");
  $("#bet-title").text("");
  $("#winning-numbers").text("If you roll a 7 or 11 you win!");
  $("#losing-numbers").text("If you roll a 2, 3, or 12 you lose!");
  $("#die1-image").attr("src", "dice-images/1.png");
  $("#die2-image").attr("src", "dice-images/1.png");
  $("#sum").text("");
  $("#number-of-turns").val("");

  // if the user has no money, show the out of money modal
  if (balance === 0) {

    // adapted this line of code from the libraries documentation: https://www.jquerymodal.com/#:~:text=%24(%22%23sticky%22).modal(%7B%0A%20%20escapeClose%3A%20false%2C%0A%20%20clickClose%3A%20false%2C%0A%20%20showClose%3A%20false%0A%7D)%3B
    $("#out-of-money-modal").modal({
      escapeClose: false,
      clickClose: false,
      showClose: false
    });
  }
}

function onWin()
/*
  Purpose: to handle the user winning the game
*/
{
  balance += bet * 2;
  wins += 1;
  saveVariables();
  $("#play-button").attr("disabled", true);
  $("#play-button").removeClass("play-button-active");
  $("#play-button").addClass("play-button-inactive");
  $("#play-button").text("Game Over");
  $("#win-modal-title").text("You Won " + bet * 2 + " Smarties!");
  $("#balance").text("Balance: " + balance + " Smarties");
  $("#win-modal").modal();

  // Adapted this answer in order to get the audio to work: https://stackoverflow.com/a/15888798
  $("#player-wins-audio").get(0).play();
}

function onLose()
/*
  Purpose: to handle the user losing the game
*/
{
  losses += 1;
  saveVariables();
  $("#play-button").attr("disabled", true);
  $("#play-button").removeClass("play-button-active");
  $("#play-button").addClass("play-button-inactive");
  $("#play-button").text("Game Over");
  if (bet === 1) {
    $("#lose-modal-title").text("You Lost 1 Smartie!");
  } else {
    $("#lose-modal-title").text("You Lost " + bet + " Smarties!");
  }
  $("#lose-modal").modal();

  // Adapted this answer in order to get the audio to work: https://stackoverflow.com/a/15888798
  $("#player-loses-audio").get(0).play();
}

function resetBalance()
/*
  Purpose: if the user has no money, they have the option to reset their balance to 100 Smarties, this handles that
*/
{
  balance = 100;
  balanceResets += 1;
  saveVariables();
  $("#balance").text("Balance: " + balance + " Smarties");
  $("#win-losses").text("Wins: " + wins + ", Losses: " + losses + ", Balance Resets: " + balanceResets);

  // Used line 40 in this code on the modal libraries GitHub page in order to close modal: https://github.com/kylefox/jquery-modal/blob/master/jquery.modal.js
  $.modal.close();
  console.log("Balance Reset");
}

function showResults()
/*
  Purpose: to show the results of the dice roll, and determine if the user has won or lost
*/
{
  $("#die1-image").attr("src", "dice-images/" + die1 + ".png");
  $("#die2-image").attr("src", "dice-images/" + die2 + ".png");
  $("#sum").text("Total: " + total);
  $("#play-button").text("Roll Again");
  $("#play-button").attr("disabled", false);
  $("#play-button").removeClass("play-button-inactive");
  $("#play-button").addClass("play-button-active");
  // If this is the first roll, if a 7 or 11 is rolled, the user wins, if a 2, 3, or 12 is rolled, the user loses, otherwise, the winning number is set to the total
  if (firstRoll) 
    {
    if (total === 7 || total === 11) {
      $("#win-modal-text").text(
        "You rolled a " + total + ", which is a winning number!"
      );
      onWin();
    } else if (total === 2 || total === 3 || total === 12) {
      $("#lose-modal-text").text(
        "You rolled a " + total + ", which is a losing number!"
      );
      onLose();
    } else {
      winningNumber = total;
      $("#winning-numbers").text(
        "If you roll a " + winningNumber + " you win!"
      );
      $("#losing-numbers").text("If you roll a 7 you lose!");
    }
    firstRoll = false;
  } 
  // Otherwise, if this is not the first roll, if the total is equal to the number the user rolled first, the user wins, if the total is 7, the user loses
  else {
    if (total === winningNumber) {
      $("#win-modal-text").text("You rolled a " + total + ", which is a winning number!");
      onWin();
    } else if (total === 7) {
      $("#lose-modal-text").text("You rolled a 7, which is a losing number!");
      onLose();
    }
  }
}

function onBetKeydown(e)
/*
  Purpose: When the user types in the bet input, this function checks to see if the key they pressed is a valid key, if it is not, it does not allow the key to be entered
*/
{
  if (
    e.key === "." ||
    e.key.toLowerCase() === "e" ||
    e.key === "-" ||
    e.key == "+"
  ) {
    return false;
  } else {
    let tempBet = $("#bet").val() + e.key;
    if (
      tempBet > balance ||
      tempBet < 0 ||
      tempBet == 0 ||
      !validStartingValue.includes(parseInt(tempBet[0]))
    ) {
      return false;
    } else {
      $("#play-button").removeClass("play-button-inactive");
      $("#play-button").addClass("play-button-active");
      $("#play-button").attr("disabled", false);
      $("#quick-play-button").removeClass("play-button-inactive");
      $("#quick-play-button").addClass("play-button-active");
      $("#quick-play-button").attr("disabled", false);
    }
  }
}

function onBetKeyup(e)
/*
  Purpose When the user types in the bet input, this function checks if the input is empty, and it updates the balance
*/
{
  if (!$("#bet").val()) {
    $("#play-button").removeClass("play-button-active");
    $("#play-button").addClass("play-button-inactive");
    $("#play-button").attr("disabled", "disabled");
  }
  bet = parseInt($("#bet").val()) || 0;
  newBalance = balance - bet;
  if (newBalance === 1) {
    $("#balance").text("Balance: " + newBalance + " Smartie");
  } else {
    $("#balance").text("Balance: " + newBalance + " Smarties");
  }
}

function onBetInput()
/*
  Purpose: When the user change the bet input using the up and down arrows, this function updates the balance and checks if the bet is valid
*/
{
  bet = parseInt($("#bet").val()) || 0;
  newBalance = balance - bet;
  if (newBalance === 1) {
    $("#balance").text("Balance: " + newBalance + " Smartie");
  } else { 
    $("#balance").text("Balance: " + newBalance + " Smarties");
  }
  if (bet > 0 && bet <= balance) {
    $("#play-button").removeClass("play-button-inactive");
    $("#play-button").addClass("play-button-active");
    $("#play-button").attr("disabled", false);
    $("#quick-play-button").removeClass("play-button-inactive");
    $("#quick-play-button").addClass("play-button-active");
    $("#quick-play-button").attr("disabled", false);
  } else {
    $("#play-button").addClass("play-button-inactive");
    $("#play-button").removeClass("play-button-active");
    $("#play-button").attr("disabled", true);
    $("#quick-play-button").addClass("play-button-inactive");
    $("#quick-play-button").removeClass("play-button-active");
    $("#quick-play-button").attr("disabled", true);
  }
}

function onQuickBetKeydown(e)
/*
  When the user types in the number of turns input, this function checks to see if the key they pressed is a valid key, if it is not, it does not allow the key to be entered
*/
{
  if (
    e.key === "." ||
    e.key.toLowerCase() === "e" ||
    e.key === "-" ||
    e.key == "+"
  ) {
    return false;
  } else {
    let tempTurns = $("#number-of-turns").val() + e.key;
    if (
      tempTurns > maxTurns ||
      tempTurns < 0 ||
      tempTurns == 0 ||
      !validStartingValue.includes(parseInt(tempTurns[0]))
    ) {
      return false;
    } else {
      $("#quick-play-button").removeClass("play-button-inactive");
      $("#quick-play-button").addClass("play-button-active");
      $("#quick-play-button").attr("disabled", false);
    }
  }
}   

function onQuickBetKeyup(e)
/*
  Purpose: When the user types in the number of turns input, this function checks if the input is empty, and it updates the balance
*/
{
  if (!$("#number-of-turns").val()) {
    $("#quick-play-button").removeClass("play-button-active");
    $("#quick-play-button").addClass("play-button-inactive");
    $("#quick-play-button").attr("disabled", "disabled");
  }
  turns = parseInt($("#number-of-turns").val()) || 0;
  newBalance = balance - (bet * turns);
  if (newBalance === 1) {
    $("#balance").text("Balance: " + newBalance + " Smartie");
  } else {
    $("#balance").text("Balance: " + newBalance + " Smarties");
  }
}

function onQuickBetInput()
/*
  Purpose: When the user change the number of turns input using the up and down arrows, this function updates the balance and checks if the bet is valid
*/
{
  turns = parseInt($("#number-of-turns").val()) || 0;
  newBalance = balance - (bet * turns);
  if (newBalance === 1) {
    $("#balance").text("Balance: " + newBalance + " Smartie");
  } else {
    $("#balance").text("Balance: " + newBalance + " Smarties");
  }
  if (turns > 0 && turns <= maxTurns) {
    $("#quick-play-button").removeClass("play-button-inactive");
    $("#quick-play-button").addClass("play-button-active");
    $("#quick-play-button").attr("disabled", false);
  } else {
    $("#quick-play-button").addClass("play-button-inactive");
    $("#quick-play-button").removeClass("play-button-active");
    $("#quick-play-button").attr("disabled", true);
  }
}

function onPlayButtonClick()
/*
  Purpose: to handle the user clicking the play button, this function handles some of the logic for the game
*/
{

  // if this is the first time the user has clicked the play button, hide the welcome text and show the betting options
  if (!playButtonClicked) {
    $("#welcome").hide();
    $("#quick-play-button").show();
    $("#quick-play-info").hide();
    $("#quick-play-text").show();
    $("#what-is-quick-play-button").show();
    $("#enterBetTitle").show();
    $("#bet").show();
    $("#win-losses").show();
    $("#balance").show();
    $("#winning-numbers").show();
    $("#losing-numbers").show();
    $("#play-button").text("Bet & Roll");
    $("#bet").attr("max", balance);
    $("#bet").attr("min", 1);
    $("#play-button").removeClass("play-button-active");
    $("#play-button").addClass("play-button-inactive");
    $("#play-button").attr("disabled", "disabled");
    if (balance === 0) {

      // adapted this line of code from the libraries documentation: https://www.jquerymodal.com/#:~:text=%24(%22%23sticky%22).modal(%7B%0A%20%20escapeClose%3A%20false%2C%0A%20%20clickClose%3A%20false%2C%0A%20%20showClose%3A%20false%0A%7D)%3B
      $("#out-of-money-modal").modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
    }
    playButtonClicked = true;
  } 

  // Otherwise, if the user has clicked the play button before, roll the dice and show the results
  else {
    $("#quick-play-button").hide();
    $("#quick-play-text").hide();
    $("#quick-play-info").hide();
    $("#what-is-quick-play-button").text("What is Quick Play?");
    $("#what-is-quick-play-button").hide();
    if (firstRoll) {
      balance -= bet;
      saveVariables();
    }
    if (balance === 1) {
      $("#balance").text("Balance: " + balance + " Smartie");
    } else {
      $("#balance").text("Balance: " + balance + " Smarties");
    }
    if (bet === 1) {
      $("#bet-title").text("Bet: " + bet + " Smartie");
    } else {
      $("#bet-title").text("Bet: " + bet + " Smarties");
    }
    $("#bet-title").show();
    $("#enterBetTitle").hide();
    $("#bet").hide();
    $("#play-button").text("Rolling...");
    $("#play-button").attr("disabled", "disabled");
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    total = die1 + die2;
    $("#play-button").removeClass("play-button-active");
    $("#play-button").addClass("play-button-inactive");

    // Show the dice rolling animation
    for (let i = 0; i <= 6; i++) {
      if (i < 6) {
        setTimeout(rollDice, 100 * i);
      } else {
        setTimeout(showResults, 100 * i);
      }
    }
  }
} 

function onQuickPlayButtonClick() 
/*
  Purpose: to handle the user clicking the quick play button
*/
{
  // if the user has not clicked the quick play button before, show the number of turns input and hide the bet input
  if (!quickBetClicked) {
    $("#bet").hide();
    $("#enterBetTitle").hide();
    $("#winning-numbers").hide();
    $("#losing-numbers").hide();
    $("#play-button").hide();
    $("#quick-play-text").hide();
    $("#enterTurnsTitle").show();
    $("#number-of-turns").show();
    $("#bet-per-roll").text("Bet Per Roll: " + bet + " Smarties");
    $("#bet-per-roll").show();
    if (balance === 1) {
      $("#balance").text("Balance: " + balance + " Smartie");
    } else {
      $("#balance").text("Balance: " + balance + " Smarties");
    }
    // Determine the maximum number of turns the user can play with their bet
    maxTurns = Math.floor(balance / bet);
    $("#number-of-turns").attr("max", maxTurns);
    $("#number-of-turns").attr("min", 1);
    $("#quick-play-button").removeClass("play-button-active");
    $("#quick-play-button").addClass("play-button-inactive");
    $("#quick-play-button").attr("disabled", "disabled");
    quickBetClicked = true;
  } 
  // otherwise, if the user has clicked the quick play button before, run the quick play function
  else {
    if (firstRoll) {
      balance -= bet * turns;
      saveVariables();
    }
    if (balance === 1) {
      $("#balance").text("Balance: " + balance + " Smartie");
    } else {
      $("#balance").text("Balance: " + balance + " Smarties");
    }
    $("#bet-per-roll").hide();
    $("#enterTurnsTitle").hide();
    $("#number-of-turns").hide();
    $("#quick-play-text").hide();
    $("#quick-play-button").text("Rolling...");
    $("#quick-play-button").removeClass("play-button-active");
    $("#quick-play-button").addClass("play-button-inactive");
    $("#quick-play-button").attr("disabled", "disabled");
    quickPlay();
}
}

function quickPlay()
/*
  Purpose: Handle the logic for the quick play feature
*/
{
  // Variables for the quick play statistics
  let quickPlayWins = 0;
  let quickPlayLosses = 0;
  let startingBet = bet * turns;
  let moneyWon = 0;
  let moneyLost = 0;

  // for the number of turns the user has selected, roll the dice and determine if the user has won or lost
  for (let i = 0; i < turns; i++) {
    let gameEnded = false;
    while (!gameEnded) {
      die1 = Math.floor(Math.random() * 6) + 1;
      die2 = Math.floor(Math.random() * 6) + 1;
      total = die1 + die2;
      $("#die1-image").attr("src", "dice-images/" + die1 + ".png");
      $("#die2-image").attr("src", "dice-images/" + die2 + ".png");
      $("#sum").text("Total: " + total);
      // If this is the first roll, if a 7 or 11 is rolled, the user wins, if a 2, 3, or 12 is rolled, the user loses, otherwise, the winning number is set to the total
      if (firstRoll) {
        if (total === 7 || total === 11) {
          balance += bet * 2;
          moneyWon += bet;
          wins += 1;
          $("#win-losses").text("Wins: " + wins + ", Losses: " + losses + ", Balance Resets: " + balanceResets);
          quickPlayWins += 1;
          gameEnded = true;
        } else if (total === 2 || total === 3 || total === 12) {
          losses += 1;
          moneyLost += bet;
          $("#win-losses").text("Wins: " + wins + ", Losses: " + losses + ", Balance Resets: " + balanceResets);
          quickPlayLosses += 1;
          gameEnded = true;
        } else {
          winningNumber = total;
          firstRoll = false;
        }
      }
      // Otherwise, if this is not the first roll, if the total is equal to the number the user rolled first, the user wins, if the total is 7, the user loses
      else {
        if (total === winningNumber) {
          balance += bet * 2;
          moneyWon += bet;
          wins += 1;
          $("#win-losses").text("Wins: " + wins + ", Losses: " + losses + ", Balance Resets: " + balanceResets);
          quickPlayWins += 1;
          gameEnded = true;
        } else if (total === 7) {
          losses += 1;
          moneyLost += bet;
          $("#win-losses").text("Wins: " + wins + ", Losses: " + losses + ", Balance Resets: " + balanceResets);
          quickPlayLosses += 1;
          gameEnded = true;
        }
      }
    }
  }
  saveVariables();
  $("#balance").text("Balance: " + balance + " Smarties");
  $("#quick-play-button").attr("disabled", false);
  $("#quick-play-button").removeClass("play-button-inactive");
  $("#quick-play-button").addClass("play-button-active");

  // Determine all of the statistics
  $("#quick-play-win-losses").text("Wins: " + quickPlayWins + ", Losses: " + quickPlayLosses);
  $("#quick-play-initial-bet").text("Total Amount Bet: " + startingBet + " Smarties");
  $("#quick-play-new-total").text("Total Amount After " + turns + " Rolls: " + (startingBet + moneyWon - moneyLost) + " Smarties");
 let balanceUpDown = moneyWon - moneyLost;
  if (balanceUpDown > 0) {
    $("#quick-play-up-down").text("Overall Profit: " + balanceUpDown + " Smarties");
  } else if (balanceUpDown < 0) {
    $("#quick-play-up-down").text("Overall Loss: " + balanceUpDown + " Smarties");
  } else {
    $("#quick-play-up-down").text("No Change in Balance");
  }

  // Show the statistics modal
  $("#quick-play-stats-modal").modal();
}

$(document).ready(function () {
  loadVariables();
  $("#how-to-info").hide();
  $("#quick-play-button").hide();
  $("#quick-play-info").hide();
  $("#quick-play-text").hide();
  $("#what-is-quick-play-button").hide();
  $("#enterBetTitle").hide();
  $("#enterTurnsTitle").hide();
  $("#bet").hide();
  $("#number-of-turns").hide();
  $("#balance").hide();
  $("#bet-title").hide();
  $("#winning-numbers").hide();
  $("#losing-numbers").hide();
  $("#win-losses").hide();
  $("#bet-per-roll").hide();
  $("#how-to-info-button").click(showHowTo);
  $("#what-is-quick-play-button").click(showQuickPlayInfo);
  $("#play-button").click(onPlayButtonClick);
  $("#play-button").hover(onPlayButtonHover, onPlayButtonLeave);
  $("#quick-play-button").click(onQuickPlayButtonClick);
  $("#quick-play-button").hover(onPlayButtonHover, onPlayButtonLeave);
  $("#bet").keydown(onBetKeydown);
  $("#bet").keyup(onBetKeyup);
  $("#bet").on("input", onBetInput);
  $("#number-of-turns").keydown(onQuickBetKeydown);
  $("#number-of-turns").keyup(onQuickBetKeyup);
  $("#number-of-turns").on("input", onQuickBetInput);
  $("#reset-button").click(resetBalance);

  // adapted this line of code from the libraries GitHub Repo: https://github.com/kylefox/jquery-modal#:~:text=%24(%27%23purchase%2Dform%27).on(%24.modal.BEFORE_CLOSE%2C%20function(event%2C%20modal)%20%7B%0A%20%20clear_shopping_cart()%3B%0A%7D)%3B
  $(".result").on($.modal.AFTER_CLOSE, function (event, modal) {
    playAgain();
  });
});
