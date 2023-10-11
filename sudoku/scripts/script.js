import { GRID_SIZE, convertIndexToPosition } from "./common.js";
import { Sudoku } from "./sudoku.js";
let level;
function setLevel(num) {
	level = num;
}
let cells;
let selectedCellIndex;
let selectedCell;
sudoku(level)
function sudoku(level = 10) {
	const sudoku = new Sudoku(level);
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
		const modal = document.querySelector('.win__overlay');
		const closeBtns = document.querySelectorAll('.modal__close');
		modal.classList.add('active');
		closeBtns.forEach((btn) => btn.addEventListener('click', () => {
			modal.classList.remove('active');
		}))
	}

}


//new game

const newGameBtn = document.querySelector('.header__btn_new-game');
newGameBtn.addEventListener('click', (e) => {
	// location.reload();
	e.preventDefault();
	console.log(level);
	cells = document.querySelectorAll('.table__cell');
	cells.forEach((cell) => {
		cell.innerHTML = '';
		cell.classList.remove('filled');
		cell.classList.remove('selected');
	});
	sudoku(level);
});

//level


const levelBtn = document.querySelector('.header__btn_level');
const levelModal = document.querySelector('.level__overlay');
const closeBtns = document.querySelectorAll('.modal__close');
const submit = document.querySelector('.level__submit');
const form = document.querySelector('.level__form');
levelBtn.addEventListener('click', () => {
	levelModal.classList.add('active');
	closeBtns.forEach((btn) => btn.addEventListener('click', () => {
		levelModal.classList.remove('active');
	}))
});
submit.addEventListener('click', () => {
	levelModal.classList.remove('active');
	cells = document.querySelectorAll('.table__cell');
	cells.forEach((cell) => {
		cell.innerHTML = '';
		cell.classList.remove('filled');
		cell.classList.remove('selected');
	});
	setLevel(Number(form.elements['level'].value));
	sudoku(Number(form.elements['level'].value));
});




