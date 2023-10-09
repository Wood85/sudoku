import { GRID_SIZE, convertIndexToPosition } from "./common.js";
import { Sudoku } from "./sudoku.js";

const sudoku = new Sudoku();
let cells;
let selectedCellIndex;
let selectedCell;
init();

function init() {
	initCells();
}

function initCells() {
	cells = document.querySelectorAll('.table__cell');
	fillCells();
	initCellsEvent();
	initKeyDown()
}

function fillCells() {
	for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
		const { row, column } = convertIndexToPosition(i);
		if (sudoku.matrix[row][column] !== null) {
			cells[i].classList.add('filled');
			cells[i].innerHTML = sudoku.matrix[row][column];
		}
	}
}

function initCellsEvent() {
	cells.forEach((cell, index) => {
		cell.addEventListener('click', () => onCellClick(cell, index));
	});
}

function onCellClick(clickedCell, index) {

	cells.forEach(cell => cell.classList.remove('selected'));
	if (clickedCell.classList.contains('filled')) {
		selectedCellIndex = null;
		selectedCell = null;
	} else {
		selectedCellIndex = index;
		selectedCell = clickedCell;
		clickedCell.classList.add('selected');
	}

	if (clickedCell.innerHTML === '') return;

	cells.forEach(cell => {
		if (cell.innerHTML === clickedCell.innerHTML) cell.classList.add('selected');
	});
}

function onRemoveClick() {
	if (!selectedCell) return;
	if (selectedCell.classList.contains('filled')) return;

	cells.forEach(cell => cell.classList.remove('selected'));
	selectedCell.classList.add('selected');
	const { row, column } = convertIndexToPosition(selectedCellIndex);
	selectedCell.innerHTML = '';
	sudoku.matrix[row][column] = null;
}

function onNumberClick(number) {
	if (!selectedCell) return;
	if (selectedCell.classList.contains('filled')) return;

	cells.forEach(cell => cell.classList.remove('selected'));
	selectedCell.classList.add('selected');
	setValueInSelectedCell(number);

	if (!sudoku.hasEmptyCells()) {
		setTimeout(() => win(), 500);
	}
}

function setValueInSelectedCell(value) {
	const { row, column } = convertIndexToPosition(selectedCellIndex);
	sudoku.matrix[row][column] = value;
	selectedCell.innerHTML = value;
}

function initKeyDown() {
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Backspace') {
			onRemoveClick();
		} else if (event.key >= '1' && event.key <= '9') {
			onNumberClick(parseInt(event.key));
		}
	});
}

function win() {
	const modal = document.querySelector('.overlay');
	const close = document.querySelector('.modal__close');
	modal.classList.add('active');
	close.addEventListener('click', () => {
		modal.classList.remove('active');
	})
}


//new game

const newGameBtn = document.querySelector('.header__btn_new-game');
newGameBtn.addEventListener('click', () => {
	location.reload();
});

//level

const level = document.querySelector('.header__btn_level');
level.addEventListener('click', () => {

});

