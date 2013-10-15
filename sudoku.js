function Sudoku(puzzle){
  this.puzzle = puzzle;
  this.prepare();
  return this.solve();
}

Sudoku.prototype.prepare = function() {

  this.index_methods = [foo, baz, bar]

  this.puzzle = this.puzzle.split("");

  this.size = this.puzzle.length;

  this.box_size = Math.sqrt(this.size);
  
  this.set_sum = get_set_sum(this.box_size);

  this.set_possible();

  this.previous_state = [];
}

var foo = function(cell_index, box_size) {
  return Math.floor(cell_index / box_size);
}

var baz = function(cell_index, box_size) {
  return cell_index % box_size;
}

var bar = function(cell_index, box_size) {
  var box_dimension = Math.sqrt(box_size);
  var box_row_index = Math.floor(foo(cell_index, box_size) / box_dimension);
  var box_column_index = Math.floor(baz(cell_index, box_size) / box_dimension);
  return box_row_index * box_dimension + box_column_index;
}

Sudoku.prototype.set_possible = function(){
  for (var i = 0; i < this.size; i++) {
    if (this.puzzle[i] == "0") {
      this.puzzle[i] = get_possibility_array(this.box_size);
    }
  }
}

Sudoku.prototype.solve = function() {
  var changed = true;
  var unsolved = true;

  while (unsolved && changed) {
    for (var i = 0; i < this.size; i++) {
      if (this.puzzle[i] instanceof Array) {
        this.puzzle[i] = this.solve_cell(i);
      }
    }
    unsolved = !this.solved();
    changed = this.changed();
    this.previous_state = copy_array(this.puzzle);
  }

  if (unsolved) {
    var unsolved_cell = this.first_unsolved_cell();
    for (var i = 0; i < this.puzzle[unsolved_cell].length && unsolved; i++) {
      var copy = copy_array(this.puzzle);    
      copy[unsolved_cell] = this.puzzle[unsolved_cell][i];
      copy = new Sudoku(array_to_string(copy));

      if (copy.solved()) {
        unsolved = false;
        this.puzzle = copy.puzzle;
      }
    }
  }

  return this; 
}

Sudoku.prototype.first_unsolved_cell = function() {
  for (var i = 0; i < this.size; i++) {
    if (this.puzzle[i] instanceof Array) {
      return i;
    }
  }
  return -1;
}

Sudoku.prototype.changed = function() {
  return !array_equals(this.previous_state, this.puzzle);
}

Sudoku.prototype.solve_cell = function(cell_index) {
  var possible = this.eliminate_final_values(cell_index);
  if (possible.length > 1) {
    possible = this.eliminate_possible_values(cell_index);
  }
  possible.length == 1 ? possible = possible[0] : null;
  return possible;
}

Sudoku.prototype.eliminate_final_values = function(cell_index) {
  var possible = this.puzzle[cell_index];

  possible = remove_possibilities(possible, this.get_final_set(cell_index, foo));
  possible = remove_possibilities(possible, this.get_final_set(cell_index, baz)); 
  possible = remove_possibilities(possible, this.get_final_set(cell_index, bar));

  return possible;  
}

Sudoku.prototype.eliminate_possible_values = function(cell_index) {
  var possible = [];

  possible.push(copy_array(this.puzzle[cell_index]));
  possible.push(copy_array(this.puzzle[cell_index]));
  possible.push(copy_array(this.puzzle[cell_index]));

  possible[0] = remove_possibilities(possible[0], this.get_possible_set(cell_index, foo));
  possible[1] = remove_possibilities(possible[1], this.get_possible_set(cell_index, baz));
  possible[2] = remove_possibilities(possible[2], this.get_possible_set(cell_index, bar));

  var final = this.puzzle[cell_index];
  for (var i = 0; i < 3; i++) {
    if (possible[i].length > 0 && possible[i].length < final.length) {
      final = possible[i];
    }
  }
  return final;
}

Sudoku.prototype.solved = function() {
  var methods = [foo, baz, bar];
  for (var j = 0; j < 3; j++) {
    for (var i = 0; i < this.size; i = i + this.box_size) {
      var set = this.get_final_set(i, methods[j]);
      if (!this.set_solved(set)) {
        return false;
      }
    }
  }
  return true;
}

Sudoku.prototype.set_solved = function(set) {
  var sum = 0;
  for (var i = 0; i < set.length; i++) {
    sum += parseInt(set[i]);
  }
  return sum == this.set_sum;
}

Sudoku.prototype.get_final_set = function(cell_index, index_method) {
  var set = [];
  var set_index = index_method(cell_index, this.box_size);

  for (var i = 0; i < this.size; i++) {
    if (index_method(i, this.box_size) == set_index && !(this.puzzle[i] instanceof Array)) {
      set.push(this.puzzle[i]);
    }
  }
  return set;
}

Sudoku.prototype.get_possible_set = function(cell_index, index_method) {
  var set = [];
  var set_index = index_method(cell_index, this.box_size);

  for (var i = 0; i < this.size; i++) {
    if (i != cell_index && index_method(i, this.box_size) == set_index && this.puzzle[i] instanceof Array) {
      set.push(this.puzzle[i]);
    }
  }
  return flatten(set); 
}

Sudoku.prototype.print = function(){
  var string = "";
  for (var i = 0; i < this.size; i++){
    if (i % this.box_size == 0){
      string += "\n\n";
    }
    string += " " + this.puzzle[i] + " ";
  }
  console.log(string);
  console.log("");
}

var array_to_string = function(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] instanceof Array) {
      array[i] = "0";
    }
  }
  return array.join("");
}

var get_set_sum = function(num) {
  var sum = 0;
  for (var i = 1; i <= num; i++){
    sum += i;
  }
  return sum;
}

var get_possibility_array = function(num) {
  var possible = "";
  for (var i = 1; i <= num; i++) {
    possible += i
  } 
  return possible.split(""); 
}

var remove_possibilities = function(possible, set) {
  for (var i = 0; i < set.length; i++) {
    remove(possible, set[i]);
  }
  return possible;
}

var copy_array = function(array) {
  var copy = [];
  for(var i = 0; i < array.length; i++) {
    copy.push(array[i]);
  }
  return copy;
}

var array_equals = function(array1, array2) {
  if (array1.length == array2.length) {
    for (var i = 0; i < array1.length; i++){
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
}

var flatten = function(array_of_arrays) {
  var sum = [];
  for (var i = 0; i < array_of_arrays.length; i++) {
    var array = array_of_arrays[i];
    for (var j = 0; j < array.length; j++) {
      if (includes(sum, array[j]) == -1) {
        sum.push(array[j]);
      }
    }
  }
  return sum;
}

var includes = function(array, element) {
  for(var i = 0; i < array.length; i++) {
    if (array[i] == element) {
      return i;
    }
  }
  return -1;
}

var remove = function(array, element) {
  var index = includes(array, element);

  if (index !== -1) {
    return array.splice(index, 1);
  }
  return -1;
}

new Sudoku("0003040000201000").print();
new Sudoku("0004000000100100").print();

new Sudoku("105802000090076405200400819019007306762083090000061050007600030430020501600308900").print();
new Sudoku("005030081902850060600004050007402830349760005008300490150087002090000600026049503").print();
new Sudoku("290500007700000400004738012902003064800050070500067200309004005000080700087005109").print();
new Sudoku("608730000200000460000064820080005701900618004031000080860200039050000100100456200").print();
new Sudoku("370000001000700005408061090000010000050090460086002030000000000694005203800149500").print();
new Sudoku("000689100800000029150000008403000050200005000090240801084700910500000060060410000").print();
new Sudoku("030500804504200010008009000790806103000005400050000007800000702000704600610300500").print();
new Sudoku("096040001100060004504810390007950043030080000405023018010630059059070830003590007").print();
new Sudoku("000075400000000008080190000300001060000000034000068170204000603900000020530200000").print();
new Sudoku("300000000050703008000028070700000043000000000003904105400300800100040000968000200").print();
new Sudoku("096040001100060004504810390007950043030080000405023018010630059059070830003590007").print();
new Sudoku("302609005500730000000000900000940000000000109000057060008500006000000003019082040").print();
new Sudoku("000000000000000000000000000000000000000000000000000000000000000000000000000000000").print();
