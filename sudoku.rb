require 'debugger'

class Sudoku

  attr_reader :puzzle, :size, :dimension, :unknown_cells

  def initialize(puzzle)
    @puzzle = puzzle
    prepare
    solve
  end
  
  def prepare
    set_dimensions
    find_unknown_cells
  end

  def solve

  end

  def set_dimensions
    @size = puzzle.length
    @dimension = Math.sqrt(size).to_i
  end

  def find_unknown_cells
    @unknown_cells = {}
    size.times { |i| unknown_cells[i] = (1..dimension).to_a if puzzle[i] == "0" }
    return unknown_cells
  end

end

describe Sudoku do

  let(:game) { Sudoku.new("0034024334124321") }

  it "iterates over the string argument given and finds each unknown value" do
    
    expected = {0=> [1,2,3,4],
                1=> [1,2,3,4],
                4=> [1,2,3,4]}

    expect(game.find_unknown_cells).to eq expected
  end

  it "has a method that retrieves the final cells in a particular set" do
    
  end
end
