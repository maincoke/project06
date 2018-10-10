var candyMoves, pointsMatch, gameTime;

function blinkingTitle() {
  setInterval(() => { $('h1.main-titulo').toggleClass('main-titulo-blink', 200) }, 200);
}

function trampCandies(process) {
  $.each($('div[class^="col"]'), function(idx) {
    process($('.col-' + (idx + 1).toString())[0]);
  });
}

function emptyCandies(element) {
  $(element).children().remove();
}

function markCandies(candy) {
  if (!candy.hasClass('match-candy')) {
    candy.addClass('match-candy');
    setInterval(() => { candy.toggle('fade') }, 150);
    pointsMatch += 10;
  }
}

function fillingCandies(element) {
  if ($(element).children().length < 7) {
    var colArray = Array(7 - $(element).children().length);
    $.each(colArray, function(idx, val) {
      var randomCandy = Math.floor(Math.random() * 4) + 1;
      val = $('<img class="elemento" src="image/' + randomCandy.toString() + '.png" />');
      val.prependTo(element).hide();
      setTimeout(() => { val.show('bounce', { times: 2 }, 150) }, 150);
    });
  }
}

function checkNeighboors(element) {
  var candies = $(element).children('.elemento');
  $.each(candies, function(idx, val) {
    if ($(this).attr('src') == $(this).prev('.elemento').attr('src') &&
      $(this).attr('src') == $(this).next('.elemento').attr('src')) {
      markCandies($(this));
      markCandies($(this).prev('.elemento'));
      markCandies($(this).next('.elemento'));
    }
    if ($(this).parent().prev().length != 0 && $(this).parent().next().length != 0) {
      if ($($(this).parent().prev().children('.elemento')[idx]).attr('src') == $(this).attr('src') &&
        $($(this).parent().next().children('.elemento')[idx]).attr('src') == $(this).attr('src')) {
        markCandies($(this));
        markCandies($($(this).parent().prev().children('.elemento')[idx]));
        markCandies($($(this).parent().next().children('.elemento')[idx]));
      }
    }
  });
  console.log(pointsMatch);
  $('span#score-text').text(pointsMatch.toString());
}

function popMatchCandies() {
  var candiesmatch = $($('.panel-tablero')[0]).find($('.match-candy'));
  if (candiesmatch.length != 0) {
    setTimeout(() => { candiesmatch.remove() }, 2500);
    return true;
  }
  return false;
}

$(function() {
  blinkingTitle();
  $($('.btn-reinicio')[0]).click(function(evt) {
    var btnTitle = $(this).text();
    if (btnTitle != 'Iniciar') {
      $(this).text('Iniciar');
      trampCandies(emptyCandies);
      $('span#score-text').text('0');
    } else {
      candyMoves = 0, pointsMatch = 0;
      $(this).text('Reiniciar');
      trampCandies(fillingCandies);
      setTimeout(() => { trampCandies(checkNeighboors) }, 2000);
      var initMatch, keepMatching;
      initMatch = setInterval(() => {
        keepMatching = popMatchCandies();
        if (!keepMatching) {
          clearInterval(initMatch);
        } else {
          setTimeout(() => { trampCandies(fillingCandies) }, 3000);
          setTimeout(() => { trampCandies(checkNeighboors) }, 4500);
        }
      }, 5000);
    }
  });
});