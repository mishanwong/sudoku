import numpy as np
from collections import Counter
import copy


class SudokuSolver:
    def __init__(self, puzzle):
        self.puzzle = puzzle
        self.solutions = []
        self.count = 0

    def solve(self):
        self.count += 1
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

    def solve_optimized(self):
        self.count += 1
        """Alternative solve algorithm that tries to fill in the cell with least degree of freedom"""

        if self.is_solved(self.puzzle):
            self.solutions.append(copy.deepcopy(self.puzzle))

        cell = self.degress_of_freedom(self.puzzle)
        if cell:
            row, col = cell
            for n in range(1, 10):
                # Check if it is possible to put this number in this position
                if self.is_possible(self.puzzle, row, col, n):
                    self.puzzle[row, col] = n
                    self.solve_optimized()
                    self.puzzle[row, col] = 0

            return

    def is_solved(self, puzzle):
        """Check if the puzzle is completely solved"""
        # Check if there is any zeros
        if np.any(puzzle == 0):
            return False

        # Check if it's consistent
        if self.check_consistent(puzzle) == False:
            return False

        return True

    def check_consistent(self, puzzle):
        """
        Function that returns True if none of the numbers violate the rule of sudoku and False if otherwise
        """
        puzzle = np.array(puzzle)
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

    def check_empty_input(self, puzzle):
        """Returns a boolean to check if a puzzle is completely empty"""
        return np.all(puzzle == 0)

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

    def degress_of_freedom(self, puzzle):
        """Returns a list of all empty cells ordered by their degrees of freedom in ascending order"""
        result = {}
        for i, row in enumerate(puzzle):
            for j, num in enumerate(row):
                if num == 0:
                    numbers_filled = set()
                    current_row = puzzle[i]
                    current_col = puzzle[:, j]
                    current_grid = []
                    grid_row = i // 3
                    grid_col = j // 3
                    for a in range(grid_row * 3, grid_row * 3 + 3):
                        for b in range(grid_col * 3, grid_col * 3 + 3):
                            current_grid.append(puzzle[a][b])
                    numbers_filled.update(current_row)
                    numbers_filled.update(current_col)
                    numbers_filled.update(current_grid)
                    numbers_filled.remove(0)
                    deg_freedom = 9 - len(numbers_filled)
                    result[(i, j)] = deg_freedom

        sorted_result = dict(sorted(result.items(), key=lambda item: item[1]))
        return list(sorted_result.keys())[0] if sorted_result else None
