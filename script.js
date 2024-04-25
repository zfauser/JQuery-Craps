let die1 = 0;
let die2 = 0;

function showGamblingInfo() {
    if ($('#gambling-info-button').text() === 'Show Important Gambling Info') {
        $('#gambling-info-button').text('Hide Important Gambling Info');
    }
    else {
        $('#gambling-info-button').text('Show Important Gambling Info');
    }
    $('#gambling-info').slideToggle('fast');
}

function rollDice() {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    $('#die1').text(die1);
    $('#die2').text(die2);
    $('#sum').text(die1 + die2);

}

$(document).ready(function() {
    $('#gambling-info').hide();
    $('#gambling-info-button').click(showGamblingInfo)
    $('#play-button').click(rollDice);
});