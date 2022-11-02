// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = new Array
  for (let i = 0; i < 8; i++) {
    let array = new Array
    for (let j = 0; j < 8; j++) {
      array.push(undefined)
    }
    grid.push(array)
  }

  grid[3][4] = new Piece("black")
  grid[4][3] = new Piece("black")
  grid[3][3] = new Piece("white")
  grid[4][4] = new Piece("white")

  return grid
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid(); 
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let [x, y] = pos
  if (x < 0 || y < 0 || x > 7 || y > 7) {
    return false
  }
  return true
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let [x, y] = pos
  if (!this.isValidPos(pos)) throw new Error ("Not valid pos!")
  return this.grid[x][y]
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  piece = this.getPiece(pos)
  if (piece) {
    return piece.color === color
  } 
  return piece
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return !!this.getPiece(pos)
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){

  
  let [xPos, yPos] = pos
  let [xDir, yDir] = dir
  let nextPos = [xPos + xDir, yPos + yDir]
  if (!piecesToFlip) {
    piecesToFlip = []
  }
  // debugger
  
  if (!this.isValidPos(nextPos) || !this.isOccupied(nextPos)) return [];
  if (this.isMine(nextPos, color)) return piecesToFlip
  if (!this.isMine(nextPos, color)) piecesToFlip.push(nextPos)
  
  if (!this.isMine(nextPos, color)) {
    piecesToFlip = this._positionsToFlip(nextPos, color, dir, piecesToFlip)
  } 
  return piecesToFlip

};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) return false

  for (let i=0; i < Board.DIRS.length; i++) {
    let dir = Board.DIRS[i]
    if (this._positionsToFlip(pos, color, dir).length) return true
  }
  // Board.DIRS.forEach(dir => {
  //   if (this._positionsToFlip(pos, color, dir).length) return true
  // })
  return false
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) throw new Error ("Invalid move!");
  for (let i=0; i < Board.DIRS.length; i++) {
    let dir = Board.DIRS[i]
    let positions = (this._positionsToFlip(pos, color, dir))
    for (let j = 0; j < positions.length; j++) {
      this.getPiece(positions[j]).color = color
    }
  }
  [x,y] = pos
  this.grid[x][y] = new Piece(color)
  
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let moves = new Array
  for (let i = 0; i < this.grid.length; i++) {
    let row = this.grid[i]
    for (let j = 0; j < row.length; j++) {
      let pos = [i, j]
      if (this.validMove(pos, color)) moves.push(pos)
    }
  }
  return moves
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length) return true
  return false
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (!this.hasMove("white") && !this.hasMove("black")) return true
  return false
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE