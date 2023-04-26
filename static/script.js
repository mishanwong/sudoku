let numSelected = null
let cellSelected = null
let removingNumber = false
const puzzle = [
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
                    console.log(puzzle)
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
    solveButton.addEventListener('click', () => {
        console.log(puzzle)
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

}

