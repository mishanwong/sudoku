import numpy as np
from collections import Counter
import copy
import sys


class SudokuSolver:
    def __init__(self, puzzle):
        self.puzzle = puzzle
        self.solutions = []

    def solve(self):
        # If a solution is found, append to the solutions array
        if self.is_solved(self.puzzle):
            self.solutions.append(copy.deepcopy(self.puzzle))

        for row in range(9):
            for col in range(9):
                if self.puzzle[row, col] == 0:
                    for n in range(1, 10):
                        # Check if it is possible to put this number in this position
                        if self.is_possible(self.puzzle, row, col, n):
                            self.puzzle[row, col] = n
                            self.solve()
                            self.puzzle[row, col] = 0

                    return

    def is_solved(self, puzzle):
        """Check if the puzzle is completely solved"""
        # Check if there is any zeros
        if np.any(puzzle == 0):
            return False

        # Check if it's consisten
        if self.check_consistent(puzzle) == False:
            return False

        return True

    def check_consistent(self, puzzle):
        """
        Function that returns True if none of the numbers violate the rule of sudoku and False if otherwise
        """
        # Check each row horizontally
        for row in puzzle:
            if not self._check_consistent_helper(row):
                return False

        # Check each column vertically
        for i in range(len(puzzle[0])):
            col = puzzle[:, i]
            if not self._check_consistent_helper(col):
                return False

        # Check within each section of 3x3 grid
        for i in range(3):
            for j in range(3):
                grid_values = []
                for a in range(i * 3, i * 3 + 3):
                    for b in range(j * 3, j * 3 + 3):
                        grid_values.append(puzzle[a][b])
                if not self._check_consistent_helper(grid_values):
                    return False

        # Return true in the end
        return True

    def _check_consistent_helper(self, array):
        counter = Counter(array)
        del counter[0]
        values = list(counter.values())
        for value in values:
            if value != 1:
                return False

        return True

    def is_possible(self, puzzle, row, col, n):
        """Function that checks if it is possible to put the number n into position (row, col) in the puzzle"""
        # If cell is already filled, return not possible
        if puzzle[row][col] != 0:
            return False

        # Check if the number is already within the row
        if n in puzzle[row]:
            return False

        # Check if number is already in the column
        if n in puzzle[:, col]:
            return False

        # Check if number is already in the grid
        # Find which grid does this (row, col) belongs to
        grid_row = row // 3
        grid_col = col // 3

        # Get all the values in the grid
        grid_values = []
        for a in range(grid_row * 3, grid_row * 3 + 3):
            for b in range(grid_col * 3, grid_col * 3 + 3):
                grid_values.append(puzzle[a][b])

        if n in grid_values:
            return False

        return True


def main():
    # Check usage
    if len(sys.argv) != 2:
        sys.exit("Usage: python sudoku.py input.txt")

    input_file = sys.argv[1]

    # Parse command-line arguments
    puzzle = []
    with open(input_file) as f:
        row = []
        content = f.read().splitlines()
        for r in content:
            row = list(map(int, r.split(",")))
            puzzle.append(row)

    # Check that the puzzle is valid
    # Check that it has 9 rows and 9 columns
    if len(puzzle) != 9:
        sys.exit("Puzzle has incorrect number of rows")

    for row in puzzle:
        if len(row) != 9:
            sys.exit("Puzzle has incorrect number of columns")

    # Check that puzzle only contains numbers for 0 - 9
    puzzle = np.array(puzzle)
    check = ~np.isin(puzzle, range(0, 10))
    if check.any():
        sys.exit("Puzzle has invalid input")

    solver = SudokuSolver(np.array(puzzle))
    solver.solve()

    num_solutions = len(solver.solutions)
    if not solver.solutions:
        print("No solution!")
    elif num_solutions == 1:
        print(f"There is {num_solutions} solution!")
        print(solver.solutions[0])
    else:
        print(f"There are {num_solutions} solutions!")
        for solution in solver.solutions:
            print(solution)


if __name__ == "__main__":
    main()
