
/**
 * N-Puzzle Game Generator
 * By Qiao Anran <qiaoanran@gmail.com>
 * 2014-06-25 All rights reserved.
 */
function NPuzzle (puzzleOptions) {
  'use strict';
  var puzzle = {};

  // Get puzzle game container
  var GameEle = document.getElementById(puzzleOptions.id);
  GameEle.style['position'] = 'relative';
  GameEle.style['width'] = '600px';
  GameEle.style['height'] = '600px';
  GameEle.style['background'] = 'white';

  puzzle.height = GameEle.offsetHeight;
  puzzle.width = GameEle.offsetWidth;

  var LEVEL = puzzleOptions.level || 3;

  var BLEND = puzzleOptions.blend || 500;

  var BLOCK = {
    'height': GameEle.offsetHeight / LEVEL,
    'width': GameEle.offsetWidth / LEVEL
  };

  puzzle.steps = 0;

  var BOUNDARY = {
    'top': 0,
    'right': GameEle.offsetWidth - BLOCK.width,
    'bottom': GameEle.offsetHeight - BLOCK.height,
    'left': 0
  };

  var FINAL_STRING;
  var WHITE_BLOCK_ID;
  var THE_LAST_ELE_CLASS_NAME = BOUNDARY.right + 'px' + BOUNDARY.bottom + 'px';
  var ORIGIN_SEX;

  var BASE_INDEX = 35431;

  puzzle.resetTable = function () {
    var idList = [];
    var blockStyle = {
      'height': BLOCK.height + 'px',
      'width': BLOCK.width + 'px',
      'background-size': puzzle.height + 'px' + ' ' + puzzle.width + 'px',
      'position': 'absolute'
    };

    for (var l=0; l<LEVEL; l++) {
      for (var c=0; c<LEVEL; c++) {
        var block = document.createElement('div');
        var blockClassNames = "block";
        block.id = "b" + l.toString() + c.toString();
        idList.push(block.id);
        block.className = blockClassNames;

        // Customize CSS style
        blockStyle['background-position'] = '-' +  (c*BLOCK.height).toString() + 'px' + ' ' + '-' + (l*BLOCK.width).toString() + 'px';
        blockStyle['top'] = (l*BLOCK.width).toString() + 'px';
        blockStyle['left'] = (c*BLOCK.height).toString() + 'px';
        blockStyle['z-index'] = BASE_INDEX + l*10 + c;

        var styles = Object.keys(blockStyle);
        for (var i=0; i<styles.length; i++) {
          if (block.style.hasOwnProperty(styles[i])) {
            block.style[styles[i]] = blockStyle[styles[i]];
          }
        }

        block.className = block.className + ' ' +  (c*BLOCK.height).toString() + 'px' + (l*BLOCK.width).toString() + 'px';
        GameEle.appendChild(block);
      }
    }
    FINAL_STRING = idList.toString();
    WHITE_BLOCK_ID = idList[idList.length - 1];
    var hideBlock = document.getElementById('b' + (LEVEL-1).toString() + (LEVEL- 1).toString());
    hideBlock.style['background'] = 'white';
    hideBlock.style['z-index'] = BASE_INDEX - 1;
    ORIGIN_SEX = puzzle.isReducible();
  };


  puzzle.disOrder = function disOrder () {
    var elementIdList = FINAL_STRING.split(',');
    for (var c=0; c<BLEND; c++) {
        var eaIndex = puzzle.getRandomInt(0, elementIdList.length - 1);
        var ebIndex = puzzle.getRandomInt(0, elementIdList.length - 1);
        var eaId = elementIdList[eaIndex];
        var ebId = elementIdList[ebIndex];
        var ea = document.getElementById(eaId);
        var eb = document.getElementById(ebId);
        puzzle.switchElementPosition(ea, eb);
    }

    if (ORIGIN_SEX !== puzzle.isReducible()) {
        disOrder();
    } else {
      /** Add animation */
      for (var i=0; i<GameEle.childElementCount; i++) {
        var block = GameEle.childNodes[i];
        block.style['-webkit-transition'] = 'left 0.2s, top 0.2s';
      }
    }
  };

  puzzle.isReducible = function () {
    var whiteBlock = document.getElementById(WHITE_BLOCK_ID);
    var whiteBlockPosition = puzzle.currentSequence(whiteBlock.offsetLeft, whiteBlock.offsetTop);

    var newClassNameList = [];
    for (var k=0; k<GameEle.childElementCount - 1; k++) {
        var x = GameEle.childNodes[k+1].className.split(' ').pop().split('px');
        newClassNameList.push(x[0] / BLOCK.width* LEVEL+ x[1] / BLOCK.height);
    }
    var inversion = puzzle.calcInversion(newClassNameList);
    return (inversion + whiteBlockPosition[0] + whiteBlockPosition[1]) % 2;
  };

  puzzle.calcInversion = function (targetArray) {
    var inversionNumber = 0;
    for (var i=0; i<targetArray.length; i++) {
        for (var j=i+1; j<targetArray.length; j++) {
            if (targetArray[i] > targetArray[j]) {
                inversionNumber++;
            }
        }
    }
    return inversionNumber;
  };

  puzzle.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  puzzle.isRightEnd = function (leftOffset) {
    return leftOffset === BOUNDARY['right'];
  };

  puzzle.isLeftEnd = function (leftOffset) {
    return leftOffset === BOUNDARY['left'];
  };

  puzzle.isTopEnd = function (topOffset) {
    return topOffset === BOUNDARY['top'];
  };

  puzzle.isBottomEnd = function (topOffset) {
    return topOffset === BOUNDARY['bottom'];
  };

  puzzle.currentSequence = function (leftOffset, topOffset) {
    //var currentLineIndex = leftOffset / 50;
    var currentLineIndex = leftOffset / BLOCK.width;
    //var currentColumnIndex = topOffset / 50;
    var currentColumnIndex = topOffset / BLOCK.height;
    return [currentColumnIndex, currentLineIndex];
  };

  puzzle.getUpSiblingByCurrentPosition = function (offsets) {
    var leftOffset = offsets[0];
    var topOffset = offsets[1];
    var currentPosition = currentSequence(leftOffset, topOffset);
    if (isTopEnd(topOffset)) {
        return currentPosition;
    } else {
        return [currentPosition[0], currentPosition[1] - 1];
    }
  };

  puzzle.getRightSiblingByCurrentPosition = function (offsets) {
    var leftOffset = offsets[0];
    var topOffset = offsets[1];
    var currentPosition = currentSequence(leftOffset, topOffset);
    if (isRightEnd(leftOffset)) {
        return currentPosition;
    } else {
        return [currentPosition[0] + 1, currentPosition[1]];
    }
  };

  puzzle.getBottomSiblingByCurrentPosition = function (offsets) {
    var leftOffset = offsets[0];
    var topOffset = offsets[1];
    var currentPosition = currentSequence(leftOffset, topOffset);
    if (isBottomEnd(topOffset)) {
        return currentPosition;
    } else {
        return [currentPosition[0], currentPosition[1] + 1];
    }
  };

  puzzle.getLeftSiblingByCurrentPosition = function (offsets) {
    var leftOffset = offsets[0];
    var topOffset = offsets[1];
    var currentPosition = currentSequence(leftOffset, topOffset);
    if (isLeftEnd(leftOffset)) {
        return currentPosition;
    } else {
        return [currentPosition[0] - 1, currentPosition[1]];
    }
  };

  puzzle.getElementByPosition = function (position) {
    var elementIdList = FINAL_STRING.split(',');
    var eleId = elementIdList[(position[1]) * Columns + position[0]];
    return document.getElementById(eleId);
  };

  puzzle.switchElementPosition = function (ea, eb) {
    var eaLeft = ea.offsetLeft;
    var eaTop = ea.offsetTop;
    var eaClassName = ea.className;

    var ebLeft = eb.offsetLeft;
    var ebTop = eb.offsetTop;
    var ebClassName = eb.className;

    ea.style.left = ebLeft + 'px';
    ea.style.top = ebTop + 'px';
    ea.className = ebClassName;
    eb.style.left = eaLeft + 'px';
    eb.style.top = eaTop + 'px';
    eb.className = eaClassName;
  };

  puzzle.switchPosition = function (dir) {
    var whiteBlock = document.getElementById(WHITE_BLOCK_ID);
    var whiteBlockClassName = whiteBlock.className;

    var whiteBlockOffsets = {
        'left': parseInt(whiteBlockClassName.split(' ')[1].split('px')[0]),
        'top': parseInt(whiteBlockClassName.split(' ')[1].split('px')[1])
    };

    var whiteBlockPosition = {
        'left': whiteBlock.style.left,
        'top': whiteBlock.style.top
    };

    if (dir === 'up' && !puzzle.isBottomEnd(whiteBlockOffsets.top)) {
        var targetName = whiteBlockOffsets.left + 'px' + (whiteBlockOffsets.top + BLOCK.height) + 'px';
    } else if (dir === 'right' && !puzzle.isLeftEnd(whiteBlockOffsets.left)) {
        var targetName = (whiteBlockOffsets.left - BLOCK.width) + 'px' + whiteBlockOffsets.top + 'px';
    } else if (dir === 'down' && !puzzle.isTopEnd(whiteBlockOffsets.top)) {
        var targetName = whiteBlockOffsets.left + 'px' + (whiteBlockOffsets.top - BLOCK.height) + 'px';
    } else if (dir === 'left' && !puzzle.isRightEnd(whiteBlockOffsets.left)) {
        var targetName = (whiteBlockOffsets.left + BLOCK.width) + 'px' + whiteBlockOffsets.top + 'px';
    } else {
        return;
    }

    var target = document.getElementsByClassName(targetName)[0];

    whiteBlock.style.top = target.style.top;
    whiteBlock.style.left = target.style.left;
    whiteBlock.className = 'block ' + targetName;

    target.style.top = whiteBlockPosition.top;
    target.style.left = whiteBlockPosition.left;
    target.className = whiteBlockClassName;
  };

  puzzle.checkResult = function () {
    var newClassNameList = [];
    for (var k=1; k<GameEle.childElementCount; k++) {
        var x = GameEle.childNodes[k].className.split(' ').pop().split('px');
        newClassNameList.push(x[0] / BLOCK.width + x[1] / BLOCK.height * LEVEL);
    }
    var inversion = puzzle.calcInversion(newClassNameList);
    if (inversion === 0) {
        alert('Level ' + LEVEL + ' : ' + puzzle.steps + ' steps ! Awosome !');
        console.log('done');
    }
  };

  puzzle.bootStrap =  function () {
    // Setup table
    puzzle.resetTable();

    // Make it dis-order
    puzzle.disOrder();

    // Register event listener
    window.onkeydown = function (event) {
        var keyName = event.keyIdentifier;

        var upKeys = ['Up', 'U+0057', 'U+004B'];
        var downKeys = ['Down', 'U+0053', 'U+004A'];
        var leftKeys = ['Left', 'U+0048', 'U+0041'];
        var rightKeys = ['Right', 'U+0044', 'U+004C'];

        if (upKeys.concat(downKeys).concat(leftKeys).concat(rightKeys).indexOf(keyName) < 0) { return ;}

        if (upKeys.indexOf(keyName) >= 0) {
          event.preventDefault();
          puzzle.switchPosition('up');
        } else if (downKeys.indexOf(keyName) >= 0) {
          event.preventDefault();
          puzzle.switchPosition('down');
        } else if (leftKeys.indexOf(keyName) >= 0) {
          event.preventDefault();
          puzzle.switchPosition('left');
        } else if (rightKeys.indexOf(keyName) >= 0) {
          event.preventDefault();
          puzzle.switchPosition('right');
        }
        puzzle.steps++;
        puzzle.checkResult();
    }
  };

  puzzle.bootStrap(); // !!
}

