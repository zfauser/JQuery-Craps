let die1 = 0;
let die2 = 0;
let playButtonClicked = false;
let balance = 100;
let bet = 0;

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

function showResults() {
  $("#die1-image").attr("src", "dice-images/" + die1 + ".png");
  $("#die2-image").attr("src", "dice-images/" + die2 + ".png");
  $("#sum").text("Total: " + (die1 + die2));
  $("#play-button").text("Roll Again");
  $("#play-button").attr("disabled", false);
  $("#play-button").removeClass("play-button-inactive");
  $("#play-button").addClass("play-button-active");
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
    $("#play-button").removeClass("play-button-active");
    $("#play-button").addClass("play-button-inactive");
    $("#bet").change(function () {
      bet = $("#bet").val();
      console.log($("#bet").val())
      if (bet > balance) {
        $("#bet").val(balance);
      } else if (bet < 0) {
        $("#bet").val(0);
      }

      if (bet == 0) {
        $("#play-button").removeClass("play-button-active");
        $("#play-button").addClass("play-button-inactive");
      } else if (bet > 0 && bet <= balance){
        $("#play-button").removeClass("play-button-inactive");
        $("#play-button").addClass("play-button-active");
      }
    }
    );
    playButtonClicked = true;
  } else {
    balance -= bet;
    $("#balance").text("Balance: " + balance + " Smarties");
    $("#bet-title").text("Bet: " + bet + " Smarties");
    $("#bet-title").show();
    $("#enterBetTitle").hide();
    $("#bet").hide();
    $("#play-button").text("Rolling...");
    $("#play-button").attr("disabled", "disabled");
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
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
});
