var GameMatch = {
  candyMoves: 0,
  pointsMatch: 0,
  gameTime: 0,
  titleBlink: 0,
  initMatch: 0,

  blinkingTitle: function() {
    titleBlink = setInterval(function() { $('h1.main-titulo:first').toggleClass('main-titulo-blink', 200) }, 200);
  },

  trampCandies: function(process, popTime, swtimeCheck = false) {
    var chkTimeNboors = swtimeCheck ? 500 : 2000;
    if (process === GameMatch.checkNeighboors) {
      $.each($('div[class^="col"]'), function(idx) {
        process($('.col-' + (idx + 1).toString())[0], chkTimeNboors);
      });
      GameMatch.popMatchCandies(popTime);
    } else {
      $.each($('div[class^="col"]'), function(idx) {
        process($('.col-' + (idx + 1).toString())[0]);
      });
      return;
    }
  },

  emptyCandies: function(element) {
    $(element).children().remove();
  },

  markCandies: function(candy) {
    if (!candy.hasClass('match-candy')) {
      candy.addClass('match-candy');
      setInterval(function() { candy.fadeOut(150).fadeIn(150) }, 300);
      pointsMatch += 10;
    }
    if (!$('div.panel-tablero:first').hasClass('blink-border')) {
      $('div.panel-tablero:first').addClass('blink-border');
      $('.dragandrop').removeClass('candy');
    }
  },

  fillingCandies: function(element) {
    if ($(element).children().length < 7) {
      var colArray = Array(7 - $(element).children().length);
      $.each(colArray, function(idx, val) {
        var randomCandy = Math.floor(Math.random() * 4) + 1;
        val = $('<img src="image/' + randomCandy.toString() + '.png" />');
        val.addClass('candy dragandrop');
        val.prependTo(element).hide();
        setTimeout(function() { val.show('bounce', { times: 3 }, 300) }, 300);
      });
    }
  },

  setDroppableCandy: function(element) {
    var candies = $(element).children('.dragandrop');
    $.each(candies, function() {
      $(this).droppable({
        addClasses: false,
        accept: '.candy',
        deactivate: function(event, ui) {
          $(this).droppable('option', 'scope', '');
        },
        drop: function(event, ui) {
          var incomeItem = $(ui.draggable).attr('src');
          var outgoItem = $(this).attr('src');
          $(ui.draggable).attr('src', outgoItem);
          $(ui.helper).attr('src', outgoItem);
          $(this).attr('src', incomeItem);
          candyMoves++;
          $('span#movimientos-text').text(candyMoves.toString());
        }
      });
    });
  },

  setCandiesDrag: function(element) {
    var candies = $(element).children('.candy');
    $.each(candies, function() {
      $(this).draggable({
        addClasses: false,
        cursor: 'pointer',
        helper: 'clone',
        scope: 'candies',
        containment: 'div.panel-tablero:first',
        revert: 'valid',
        revertDuration: 300,
        zIndex: 10,
        start: function(event, ui) {
          $(this).css({ opacity: 0 });
          var candyIndex = ($(this).index() + 1).toString();
          var candyNboorLeft = $(this).parent().prev().children(':nth-child(' + candyIndex + ')');
          var candyNboorRight = $(this).parent().next().children(':nth-child(' + candyIndex + ')');
          var candyNboorUp = $(this).prev();
          candyNboorLeft.droppable('option', 'scope', 'candies');
          candyNboorRight.droppable('option', 'scope', 'candies');
          candyNboorUp.droppable('option', 'scope', 'candies');
          if ($(this).index() !== 6) {
            var candyNboorDown = $(this).next();
            candyNboorDown.droppable('option', 'scope', 'candies');
          }
        }
      });
      $(this).on('dragstop', GameMatch.dragAnDropEvent);
    });
  },

  dragAnDropEvent: function() {
    dragdisables = Array();
    $(this).css({ opacity: 1 });
    dragdisables = $('div.panel-tablero:first').find('.candy');
    GameMatch.trampCandies(GameMatch.checkNeighboors, 2000, true);
    return;
  },

  swapCandies: function(element) {
    setTimeout(function() {
      GameMatch.fillingCandies(element);
      GameMatch.setDroppableCandy(element);
      GameMatch.setCandiesDrag(element);
    }, 500);
  },

  checkNeighboors: function(element, timeCheck) {
    setTimeout(function() {
      var candies = $(element).children('.dragandrop');
      $.each(candies, function(idx) {
        if ($(this).attr('src') == $(this).prev('.dragandrop').attr('src') &&
          $(this).attr('src') == $(this).next('.dragandrop').attr('src')) {
          GameMatch.markCandies($(this));
          GameMatch.markCandies($(this).prev('.dragandrop'));
          GameMatch.markCandies($(this).next('.dragandrop'));
        }
        if ($(this).parent().prev().length != 0 && $(this).parent().next().length != 0) {
          if ($($(this).parent().prev().children('.dragandrop')[idx]).attr('src') == $(this).attr('src') &&
            $($(this).parent().next().children('.dragandrop')[idx]).attr('src') == $(this).attr('src')) {
            GameMatch.markCandies($(this));
            GameMatch.markCandies($($(this).parent().prev().children('.dragandrop')[idx]));
            GameMatch.markCandies($($(this).parent().next().children('.dragandrop')[idx]));
          }
        }
      });
      $('span#score-text').text(pointsMatch.toString());
    }, timeCheck);
  },

  popMatchCandies: function(popTime) {
    var popMatch = setTimeout(function() {
      var candiesmatch = $('.panel-tablero:first').find($('.match-candy'));
      if (candiesmatch.length != 0) {
        var timepopCandies = candiesmatch.length * 200;
        candiesmatch.remove();
        setTimeout(GameMatch.trampCandies(GameMatch.swapCandies), popTime + 300);
        setTimeout(GameMatch.trampCandies(GameMatch.checkNeighboors, 2500 + timepopCandies), popTime + 600);
      } else {
        if ($('div.panel-tablero:first').hasClass('blink-border')) {
          $('div.panel-tablero:first').removeClass('blink-border')
          $('.dragandrop').addClass('candy');
        }
        clearTimeout(popMatch);
      }
    }, popTime);
    return;
  },

  startGame: function() {
    //GameMatch.blinkingTitle();
    console.clear();
    candyMoves = 0, pointsMatch = 0;
    GameMatch.trampCandies(GameMatch.swapCandies);
    GameMatch.trampCandies(GameMatch.checkNeighboors, 4000);
  },

  restartGame: function() {
    GameMatch.trampCandies(GameMatch.emptyCandies);
    $('span#score-text').text('0');
    $('span#movimientos-text').text('0');
    clearInterval(titleBlink);
    clearInterval(initMatch);
  }
}

$(function() {
  $('.btn-reinicio:first').click(function(evt) {
    evt.preventDefault();
    var btnTitle = $(this).text();
    if (btnTitle != 'Iniciar') {
      $(this).text('Iniciar');
      GameMatch.restartGame();
    } else {
      $(this).text('Reiniciar');
      GameMatch.startGame();
    }
  });
});