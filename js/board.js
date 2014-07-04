// Trigger on body click event
document.body.onclick = function (e) {
  createBoard(e.x, e.y);
};

function createBoard(x, y) {
  // Create a new div element
  var newBoard = document.createElement('div');

  // Name it as 'board' and put in the current cursor coordinate
  newBoard.className = 'board';
  newBoard.style['top'] = y.toString() + 'px';
  newBoard.style['left'] = x.toString() + 'px';

  // make it alive
  document.body.appendChild(newBoard);

  // make editable
  newBoard.contentEditable = 'true';

  // set focus
  newBoard.focus();
  
  // click on board
  newBoard.onclick = function (e) {
    // prevent other evnet listener
    e.preventDefault();

    // do not pop up again
    e.stopPropagation();
    
    // set focus to edit
    newBoard.focus();
  };

  // after losing focus
  newBoard.onblur = function (e) {
    var content = newBoard.innerHTML;
    if (content.length === 0) {
      newBoard.parentNode.removeChild(newBoard);
    }
  };
}
