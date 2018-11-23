// **++--// ---> Objeto-Modulo que realiza la operatividad y funcionalidad del Juego Match Game <--- //--++** //
var GameMatch = {
    candyMoves: 0,
    pointsMatch: 0,
    titleBlink: 0,
    seconds: 0,
    minutes: 2,
    timer: 0,
    // ---> Funcion Nativa que inicia la itermitencia del titulo del Juego <--- //
    blinkingTitle: function() {
      titleBlink = setInterval(function() { $('h1.main-titulo:first').toggleClass('main-titulo-blink', 150) }, 300);
    },
    // ---> Funcion Nativa que ejecuta los procesos de recorrido de los caramelos (candies) del tablero <--- //
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
    // ---> Funcion Nativa que ejecuta el borrado de los caramelos del tablero <--- //
    emptyCandies: function(element) {
      $(element).children().remove();
    },
    // ---> Funcion Nativa que ejecuta el marcado de caramelos coincidentes el linea en el tablero <--- //
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
    // ---> Funcion Nativa que ejecuta el llenado y resposicion de caramelos removidos el linea por columna del tablero <--- //
    fillingCandies: function(element) {
      if ($(element).children().length < 7) {
        var colArray = Array(7 - $(element).children().length);
        $.each(colArray, function(idx, val) {
          var randomCandy = Math.floor(Math.random() * 4) + 1;
          val = $('<img src="image/' + randomCandy.toString() + '.png" />');
          val.addClass('candy dragandrop');
          val.prependTo(element).hide();
          setTimeout(function() { val.show('bounce', { times: 2 }, 200) }, 200);
        });
      }
    },
    // ---> Funcion Nativa que asigna, configura y ejecuta acciones de arrastre y soltado de los caramelos en el tablero <--- //
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
    // -> Funcion Nativa que asigna, configura y ejecuta acciones de arrastre, soltado y verificacion de caramelos en el tablero <- //
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
    // ---> Funcion Nativa/Auxiliar que ejecuta acciones de verificacion de caramelos al momento de arrastre en el tablero <--- //
    dragAnDropEvent: function() {
      $(this).css({ opacity: 1 });
      GameMatch.trampCandies(GameMatch.checkNeighboors, 2000, true);
    },
    // ---> Funcion Nativa que ejecuta el retraso en el llenado y asigancion de arrastre y soltado de caramelos en el tablero <--- //
    swapCandies: function(element) {
      setTimeout(function() {
        GameMatch.fillingCandies(element);
        GameMatch.setDroppableCandy(element);
        GameMatch.setCandiesDrag(element);
      }, 500);
    },
    // ---> Funcion Nativa que ejecuta el retraso y verificación de 3 o mas caramelos en linea en el tablero <--- //
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
    // --> Funcion Nativa que ejecuta el retraso del ciclo de boorado/verificacion de 3 o mas caramelos en linea en el tablero <-- //
    popMatchCandies: function(popTime) {
      var popMatch = setTimeout(function() {
        var candiesmatch = $('.panel-tablero:first').find($('.match-candy'));
        if (candiesmatch.length != 0) {
          var timepopCandies = candiesmatch.length < 6 ? candiesmatch.length * 300 : candiesmatch.length * 250;
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
    // ---> Funcion Nativa que ejecuta el inicio de un juego con temporizador inicial del Juego <--- //
    startGame: function() {
      GameMatch.blinkingTitle();
      candyMoves = 0, pointsMatch = 0;
      GameMatch.trampCandies(GameMatch.swapCandies);
      GameMatch.trampCandies(GameMatch.checkNeighboors, 4000);
    },
    // ---> Funcion Nativa que ejecuta el reinicio del juego con temporizador inicial del Juego <--- //
    restartGame: function() {
      GameMatch.trampCandies(GameMatch.emptyCandies);
      $('div.panel-tablero:first, div.time:first').css({ width: '', height: '', border: '', opacity: 1 }).show();
      $('div.panel-score').css({ width: '' });
      $('span#score-text').text('0');
      $('span#movimientos-text').text('0');
      clearInterval(titleBlink);
      if ($('div.panel-score').find('h1') != 0) {
        $('div.panel-score h1').remove();
        $('h2.data-titulo, span.data-info').css({ color: '', fontSize: '' });
        if ($('div.main-container h1:first').hasClass('main-titulo-blink')) {
          $('div.main-container h1:first').removeClass('main-titulo-blink');
        }
      }
    },
    // ---> Funcion Nativa que ejecuta el fin de un juego con temporizador final del Juego <--- //
    gameOver: function() {
      clearInterval(titleBlink);
      GameMatch.trampCandies(GameMatch.emptyCandies);
      $('div.panel-tablero:first, div.time:first').animate({ width: '0px', height: '0px', border: '0px', opacity: 0 }, {
        duration: 2500,
        complete: function() {
          $(this).hide();
        }
      });
      $('div.panel-score:first').animate({ width: '100%' }, {
        duration: 2500,
        complete: function() {
          $(this).prepend('<h1 class = "titulo-over">¡¡Juego Finalizado!!</h1>');
          $('div.main-container h1:first').addClass('main-titulo-blink');
          $('h2.data-titulo, span.data-info').css({ color: '#DCFF0E', fontSize: '2em' });
        }
      });
    },
    // ---> Funcion Nativa que ejecuta el inicio del temporizador del Juego <--- //
    startTimer: function() {
      seconds = 0;
      minutes = 2;
      timer = setInterval(GameMatch.timerGame, 1000);
    },
    // ---> Funcion Nativa que ejecuta la pausa y final del temporizador del Juego <--- //
    stopTimer: function() {
      clearInterval(timer);
    },
    // ---> Funcion Nativa que ejecuta el reinicio del temporizador del Juego <--- //
    resetTimer: function() {
      clearInterval(timer);
      seconds = 0;
      minutes = 2;
      $('#timersec').text("00");
      $('#timermin').text("02");
    },
    // ---> Funcion Nativa que ejecuta el conteo de tiempo del temporizador del Juego <--- //
    timerGame: function() {
      if (seconds == 0) {
        seconds = 60;
        minutes--;
        if (minutes < 10) { minutes = "0" + minutes }
        $('#timermin').text(minutes);
      }
      if (seconds <= 60) {
        seconds--;
        if (seconds < 10) { seconds = "0" + seconds }
        $('#timersec').text(seconds);
      }
      if ((seconds == 0) && (minutes == 0)) {
        GameMatch.stopTimer();
        GameMatch.gameOver();
      }
    },
    // **** // ---> Funcion Nativa del evento Click del boton Iniciar/Reiniciar del Juego <--- // **** //
    clkInitBtn: function(evt) {
      evt.preventDefault();
      var btnTitle = $(this).text();
      if (btnTitle != 'Iniciar') {
        $(this).text('Iniciar');
        GameMatch.restartGame();
        GameMatch.stopTimer();
        GameMatch.resetTimer();
      } else {
        $(this).text('Reiniciar');
        GameMatch.startGame();
        GameMatch.startTimer();
      }
    }
  }
  // ---> Funcion Ready del Juego que ejecuta y asigna la funcion del boton Iniciar/Reiniciar del Juego <--- //
$(function() {
  $('.btn-reinicio:first').click(GameMatch.clkInitBtn);
});