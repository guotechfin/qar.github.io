function recoverBoards() {
  for (var i=0; i<localStorage.length; i++) {
    var boardId = localStorage.key(i);
    var b = localStorage.getItem(boardId);
    createBoard(0,0, JSON.parse(b))
  }
}

recoverBoards();

// Trigger on body click event
document.body.onclick = function (e) {
  createBoard(e.x, e.y);
};


function createBoard(x, y, b) {
  // Create a new div element
  var board = document.createElement('div');

  // Name it as 'board' and put in the current cursor coordinate
  board.className = 'board';

  if (b) {
    board.id = b.id;
    board.style.top = b.y + 'px';
    board.style.left = b.x + 'px';
    board.innerHTML = b.content;
  } else {
    board.id = new Date().getTime();
    board.style.top = y + 'px';
    board.style.left = x + 'px';
  }

  // make it alive
  document.body.appendChild(board);

  // make editable
  board.contentEditable = 'true';

  // set focus
  if (!b) {
    board.focus();
  }
  
  // click on board
  board.onclick = function (e) {
    // prevent other evnet listener
    e.preventDefault();

    // do not pop up again
    e.stopPropagation();
    
    // set focus to edit
    board.focus();
  };

  // after losing focus
  board.onblur = function (e) {
    var content = board.innerHTML;
    if (content.length === 0) {
      board.parentNode.removeChild(board);
    } else {
      var boardInfo = localStorage.getItem(board.id);
      if (boardInfo) {
        boardInfo = JSON.parse(boardInfo);
        boardInfo.x = board.offsetLeft; 
        boardInfo.y = board.offsetTop;
        boardInfo.content = board.innerHTML;
      } else {
        boardInfo = {
          'id': board.id,
          'x': board.offsetLeft,
          'y': board.offsetTop, 
          'content': board.innerHTML
        };
      }
      localStorage.setItem(board.id, JSON.stringify(boardInfo));
    }
  };

  var mouseDownLast;
  var mouseDown = false;

  board.onmousedown = function (e) {
    mouseDownLast = setTimeout(function () {
      mouseDown = !mouseDown;
      board.initialMousePosition = {
        'x': e.clientX,
        'y': e.clientY
      };
      board.currentPosition = {
        'x': board.offsetLeft,
        'y': board.offsetTop
      };
      board.style.cursor = 'move';
    }, 50);
  };

  board.onmouseup = function (e) {
    clearTimeout(mouseDownLast);
    mouseDown = !mouseDown;
    board.initialMousePosition = {};
    board.style.cursor = 'default';
  };

  board.onmousemove = function (e) {
    if (mouseDown) {
      board.style.left = board.currentPosition.x + e.clientX - board.initialMousePosition.x + 'px';
      board.style.top = board.currentPosition.y + e.clientY - board.initialMousePosition.y + 'px';
    }
  };
}

