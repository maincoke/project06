function blinkingTitle() {
  setInterval(() => { $('h1.main-titulo').toggleClass('main-titulo-blink', 200) }, 200);
}

function trampCandies(process) {
  $.each($('div[class^="col"]'), function(idx) {
    process($('.col-' + (idx + 1).toString())[0]);
  });
}

function markCandies(candy) {
  candy.addClass('match-candy');
  setInterval(() => { candy.toggle('fade') }, 100);
}

function fillingCandies(element) {
  if ($(element).children().length < 7) {
    var colArray = Array(7 - $(element).children().length);
    $.each(colArray, function(idx, val) {
      var randomCandy = Math.floor(Math.random() * 4) + 1;
      val = $('<img class="elemento" src="image/' + randomCandy.toString() + '.png" />');
      val.prependTo(element);
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
}

function popMatchCandies() {
  var candiesmatch = $($('.panel-tablero')[0]).find($('.match-candy'));
  //console.log(candiesmatch);
  if (candiesmatch.length != 0) {
    setTimeout(() => { candiesmatch.remove() }, 3000);
    return true;
  }
  return false;
}

$(function() {
  blinkingTitle();
  trampCandies(fillingCandies);
  trampCandies(checkNeighboors);
  var keepMatching = popMatchCandies();
  console.log(keepMatching);
  setTimeout(() => { trampCandies(fillingCandies) }, 4000);
  /*setTimeout(function() {
    var childs = $('.col-1').children()[3];
    childs.remove();
  }, 2000);*/
});