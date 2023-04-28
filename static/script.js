let numSelected = null
let cellSelected = null
let removingNumber = false
let solutionDisplayed = false

let puzzle = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const testPuzzle = [
    [6, 0, 0, 9, 0, 0, 0, 0, 8],
    [0, 0, 0, 0, 0, 0, 4, 3, 0],
    [1, 0, 0, 0, 4, 0, 0, 9, 0],
    [5, 0, 0, 8, 0, 0, 0, 0, 7],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 2, 0, 0, 9],
    [0, 7, 0, 5, 0, 0, 0, 0, 1],
    [0, 3, 0, 4, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 8, 0, 7, 0, 3]
]

window.onload = function () {
    setGame()
}

function setGame() {
    // Create 9x9 board
    const gridBorder = [2, 5]
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div')
            cell.id = row.toString() + col.toString()
            cell.classList.add("tile")
            if (gridBorder.includes(row)) {
                cell.classList.add("thick-bottom-border")
            }
            if (gridBorder.includes(col)) {
                cell.classList.add("thick-right-border")
            }
            const gameBoard = document.getElementById("game-board")
            gameBoard.appendChild(cell)
            cell.addEventListener('click', () => {
                const i = cell.id[0]
                const j = cell.id[1]
                if (!removingNumber) {
                    if (numSelected !== null) {
                        cellSelected = cell.id

                        // Add to puzzle 2-D array
                        puzzle[i][j] = numSelected

                        // Display number in UI
                        cell.innerText = numSelected
                    }
                } else {
                    // Remove number if cell is already filled
                    puzzle[row][col] = 0
                    cell.innerHTML = ""
                }
            })
        }
    }

    // Create number pad
    for (let i = 1; i < 10; i++) {
        const numberPad = document.getElementById("number-pad")
        const number = document.createElement("div")
        number.id = i
        number.innerText = i
        number.classList.add("number")
        numberPad.appendChild(number)
        number.addEventListener('click', () => {
            removingNumber = false

            if (numSelected === null) {
                numSelected = i
                number.classList.add("selected-number")
            } else {
                const previousSelectedNumber = document.getElementById(numSelected.toString())
                previousSelectedNumber.classList.remove("selected-number")
                numSelected = i
                number.classList.add("selected-number")
            }
        })

    }

    const solveButton = document.getElementById("solve-button")
    const spinner = document.getElementById("spinner")
    solveButton.addEventListener('click', () => {
        fetch('/check_input', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(puzzle)
        }).then(response => {
            return response.json()
        }).then(data => {
            if (data.isConsistent === "False") {
                alert("Sudoku puzzle is invalid")
            } else if (data.isEmpty === "True") {
                alert("Please enter a Sudoku puzzle")
            } else {
                // Input is valid
                document.body.style.cursor = "wait"
                spinner.style.display = "block"
                fetch('/solve', {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify(puzzle)
                }).then(response => {
                    return response.json()
                }).then(data => {
                    displaySolution(data)
                    spinner.style.display = "none"
                    document.body.style.cursor = "default"
                }).catch(error => {
                    console.error(error)
                })
            }
        })
    })

    const resetButton = document.getElementById("reset-button")
    resetButton.addEventListener('click', () => {
        for (let i = 0; i < puzzle.length; i++) {
            puzzle[i].fill(0)
        }

        // Remove all numbers in UI
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const id = i.toString() + j.toString()
                const tile = document.getElementById(id)
                tile.innerText = ""
            }
        }

        // Reset numSelected
        numSelected = null
        for (let i = 1; i < 10; i++) {
            const number = document.getElementById(i)
            number.classList.remove("selected-number")
        }

        // If there is a solution, clear the solution
        if (solutionDisplayed) {
            const solutionTitle = document.getElementById("solution-title")
            solutionTitle.innerText = ""


            const solutionBoard = document.getElementById("solution-board")
            solutionBoard.classList.remove("thick-board-border")
            while (solutionBoard.firstChild) {
                solutionBoard.removeChild(solutionBoard.firstChild)
            }
            solutionDisplayed = false
        }

    })

    const removeNumberButton = document.getElementById("remove-number")
    removeNumberButton.addEventListener('click', () => {
        // Set numSelected to null
        numSelected = null
        removingNumber = true

        // Remove the class "selected-number" from number's classlist
        for (let i = 1; i < 10; i++) {
            const number = document.getElementById(i)
            number.classList.remove("selected-number")
        }
    })

    const samplePuzzleButton = document.getElementById("sample-puzzle")
    samplePuzzleButton.addEventListener('click', () => {
        // Fill in the numbers
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                puzzle[i][j] = testPuzzle[i][j]
                const cell = document.getElementById(i.toString() + j.toString())
                if (puzzle[i][j] !== 0) {
                    cell.innerText = puzzle[i][j]
                }
            }
        }
    })
    function displaySolution(solution) {
        if (!solutionDisplayed) {
            solutionDisplayed = true
            const title = document.getElementById("solution-title")
            title.innerText = "Solution"

            const solutionBoard = document.getElementById("solution-board")
            solutionBoard.classList.add("thick-board-border")

            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    const solutionCell = document.createElement('div')
                    solutionCell.id = `sol${row}${col}`
                    solutionCell.classList.add("tile")
                    solutionCell.innerText = solution[row][col]

                    const solutionBoard = document.getElementById("solution-board")
                    solutionBoard.appendChild(solutionCell)
                    if (gridBorder.includes(row)) {
                        solutionCell.classList.add("thick-bottom-border")
                    }
                    if (gridBorder.includes(col)) {
                        solutionCell.classList.add("thick-right-border")
                    }
                }
            }
        }

    }
}

