let die1 = 0;
let die2 = 0;

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

function onPlayButtonClick() {
  $('#welcome').hide();
  $('#play-button').text('Rolling...');
  $('#play-button').attr('disabled', 'disabled');
  die1 = Math.floor(Math.random() * 6) + 1;
  die2 = Math.floor(Math.random() * 6) + 1;
  for (let i = 0; i <= 6; i++) {
    if (i < 6) {
        setTimeout(rollDice, 100 * i);
    } else {
        setTimeout(function() {
            $("#die1-image").attr("src", "dice-images/" + die1 + ".png");
            $("#die2-image").attr("src", "dice-images/" + die2 + ".png");
            $("#sum").text("Total: " + (die1 + die2));
            $('#play-button').text('Roll Again');
            $('#play-button').removeAttr('disabled');
        }, 100 * i);
    }
  }
}

$(document).ready(function () {
  $("#gambling-info").hide();
  $("#gambling-info-button").click(showGamblingInfo);
  $("#play-button").click(onPlayButtonClick);
  $("#play-button").hover(onPlayButtonHover, onPlayButtonLeave);
});
