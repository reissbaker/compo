!function(exports) {
  'use strict';

  function Matrix(rows, cols) {
    var r, c, row;

    this.numRows = rows;
    this.numCols = cols;
    this.rows = new Array(rows);

    for(r = 0; r < rows; r++) {
      row = new Array(cols);
      this.rows[r] = row;
      for(c = 0; c < cols; c++) {
        row[c] = 0;
      }
    }
  }

  Matrix.prototype.set = function(r, c, val) {
    this.rows[r][c] = val;
    return val;
  }

  Matrix.prototype.get = function(r, c) {
    return this.rows[r][c];
  }

  Matrix.prototype.row = function(r, c) {
    return this.rows[r];
  }

  exports.Matrix = Matrix;

}(demo);
