from flask import Flask, jsonify, render_template, request
from sudoku import *
import numpy as np

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/solve", methods=["POST"])
def solve():
    # Get user input
    puzzle = request.get_json("puzzle")
    puzzle = np.array(puzzle)

    solver = SudokuSolver(puzzle)
    solver.solve_optimized()
    result = solver.solutions[0].tolist()

    return jsonify(result)


@app.route("/check_input", methods=["POST"])
def check_input():
    puzzle = request.get_json("puzzle")
    puzzle = np.array(puzzle)

    solver = SudokuSolver(puzzle)
    is_empty = solver.check_empty_input(puzzle)
    is_consistent = solver.check_consistent(puzzle)

    return jsonify({"isEmpty": str(is_empty), "isConsistent": str(is_consistent)})
