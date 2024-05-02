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

function onPlayButtonHover() {
  $("#welcome").css("animation-play-state", "paused");
  $("#play-button").css("animation-play-state", "paused");
}

function onPlayButtonLeave() {
  $("#welcome").css("animation-play-state", "running");
  $("#play-button").css("animation-play-state", "running");
}

function showGamblingInfo() {
  if ($("#gambling-info-button").text() === "Show Important Gambling Info") {
    $("#gambling-info-button").text("Hide Important Gambling Info");
  } else {
    $("#gambling-info-button").text("Show Important Gambling Info");
  }
  $("#gambling-info").slideToggle("fast");
}

function rollDice() {
  let tempDie1 = Math.floor(Math.random() * 6 + 1);
  let tempDie2 = Math.floor(Math.random() * 6 + 1);
  $("#die1-image").attr("src", "dice-images/" + tempDie1 + ".png");
  $("#die2-image").attr("src", "dice-images/" + tempDie2 + ".png");
  $("#sum").text("Total: " + (tempDie1 + tempDie2));
}

function playAgain() {
  $("#play-button").text("Play Again");
  $("#play-button").attr("disabled", false);
  $("#play-button").removeClass("play-button-inactive");
  $("#play-button").addClass("play-button-active");
  firstRoll = true;
  playButtonClicked = false;
  $("#bet-title").hide();
  $("#winning-numbers").hide();
  $("#losing-numbers").hide();
  $("#balance").text("Balance: " + balance + " Smarties");
  $("#bet").val("");
  $("#bet-title").text("");
  $("#winning-numbers").text("If you roll a 7 or 11 you win!");
  $("#losing-numbers").text("If you roll a 2, 3, or 12 you lose!");
  $("#die1-image").attr("src", "dice-images/1.png");
  $("#die2-image").attr("src", "dice-images/1.png");
  $("#sum").text("");
}

function onWin() {
  balance += bet * 2;
  $("#play-button").attr("disabled", true);
  $("#play-button").removeClass("play-button-active");
  $("#play-button").addClass("play-button-inactive");
  $("#play-button").text("Game Over");
  $("#balance").text("Balance: " + balance + " Smarties");
  $("#win-modal").modal();
  $("#player-wins-audio").get(0).play();
}

function onLose() {
  $("#play-button").attr("disabled", true);
  $("#play-button").removeClass("play-button-active");
  $("#play-button").addClass("play-button-inactive");
  $("#play-button").text("Game Over");
  $("#lose-modal").modal();
  $("#player-loses-audio").get(0).play();
}

function showResults() {
  $("#die1-image").attr("src", "dice-images/" + die1 + ".png");
  $("#die2-image").attr("src", "dice-images/" + die2 + ".png");
  $("#sum").text("Total: " + total);
  $("#play-button").text("Roll Again");
  $("#play-button").attr("disabled", false);
  $("#play-button").removeClass("play-button-inactive");
  $("#play-button").addClass("play-button-active");
  if (firstRoll) {
    if (total === 7 || total === 11) {
      win = true;
      onWin();
    } else if (total === 2 || total === 3 || total === 12) {
      win = false;
      onLose();
    } else {
      winningNumber = total;
      $("#winning-numbers").text(
        "If you roll a " + winningNumber + " you win!"
      );
      $("#losing-numbers").text("If you roll a 7 you lose!");
    }
    firstRoll = false;
  } else {
    if (total === winningNumber) {
      win = true;
      onWin();
    } else if (total === 7) {
      win = false;
      onLose();
    }
  }
}

function onBetKeydown(e) {
  // console.log(e.key)
  if (e.key === ".") {
    return false;
  } else if (e.key.toLowerCase() === "e" || e.key === "-" || e.key == "+") {
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
    }
  }
}

function onBetKeyup(e) {
  if (!$("#bet").val()) {
    $("#play-button").removeClass("play-button-active");
    $("#play-button").addClass("play-button-inactive");
    $("#play-button").attr("disabled", "disabled");
  }
  bet = parseInt($("#bet").val());
  newBalance = balance - bet;
  $("#balance").text("Balance: " + newBalance + " Smarties");
}

function onBetChange() {
  parseInt($("#bet").val());
  newBalance = balance - bet;
  $("#balance").text("Balance: " + newBalance + " Smarties");
  if (bet < balance && bet > 0) {
    $("#play-button").addClass("play-button-active");
    $("#play-button").removeClass("play-button-inactive");
    $("#play-button").attr("disabled", false);
  }
}

function onPlayButtonClick() {
  if (!playButtonClicked) {
    $("#welcome").hide();
    $("#enterBetTitle").show();
    $("#bet").show();
    $("#balance").show();
    $("#winning-numbers").show();
    $("#losing-numbers").show();
    $("#play-button").text("Bet & Roll");
    $("#bet").attr("max", balance);
    $("#play-button").removeClass("play-button-active");
    $("#play-button").addClass("play-button-inactive");
    $("#play-button").attr("disabled", "disabled");
    playButtonClicked = true;
  } else {
    if (firstRoll) {
      balance -= bet;
    }
    $("#balance").text("Balance: " + balance + " Smarties");
    $("#bet-title").text("Bet: " + bet + " Smarties");
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
    for (let i = 0; i <= 6; i++) {
      if (i < 6) {
        setTimeout(rollDice, 100 * i);
      } else {
        setTimeout(showResults, 100 * i);
      }
    }
  }
}

$(document).ready(function () {
  $("#gambling-info").hide();
  $("#enterBetTitle").hide();
  $("#bet").hide();
  $("#balance").hide();
  $("#bet-title").hide();
  $("#winning-numbers").hide();
  $("#losing-numbers").hide();
  $("#gambling-info-button").click(showGamblingInfo);
  $("#play-button").click(onPlayButtonClick);
  $("#play-button").hover(onPlayButtonHover, onPlayButtonLeave);
  $("#bet").keydown(onBetKeydown);
  $("#bet").keyup(onBetKeyup);
  $("#bet").change(onBetChange);

  // adapted this line of code from the libraries GitHub Repo: https://github.com/kylefox/jquery-modal#:~:text=%24(%27%23purchase%2Dform%27).on(%24.modal.BEFORE_CLOSE%2C%20function(event%2C%20modal)%20%7B%0A%20%20clear_shopping_cart()%3B%0A%7D)%3B
  $(".modal").on($.modal.AFTER_CLOSE, function (event, modal) {
    playAgain();
  });
});
