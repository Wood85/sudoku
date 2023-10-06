import { GRID_SIZE, convertIndexToPosition } from "./common.js";
import { Sudoku } from "./sudoku.js";

const sudoku = new Sudoku();
let cells;
init();

function init() {
	initCells();
}

function initCells() {
	cells = document.querySelectorAll('.table__cell');
	fillCells();
}

function fillCells() {
	for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
		const { row, column } = convertIndexToPosition(i);
		if (sudoku.matrix[row][column] !== null) {
			cells[i].innerHTML = sudoku.matrix[row][column];
		}
	}
}