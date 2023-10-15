import { GRID_SIZE, convertIndexToPosition } from "./common.js";
import { Sudoku } from "./sudoku.js";

let matrix;
let grid;
let timer;
let pauseTimer = false;
let intervalId;

if (!localStorage.getItem('sudokuLevel')) {
	localStorage.setItem('sudokuLevel', JSON.stringify(10));
};

let level = JSON.parse(localStorage.getItem('sudokuLevel'));

if (!localStorage.getItem('sudokuResults')) {
	localStorage.setItem('sudokuResults', JSON.stringify([]));
};

function sortArr(arr) {
	return arr.sort((a, b) => a - b);
}

function resultsArrLength(arr) {
	const res = arr.slice(0, 10)
	return res;
}



startTime()

function setLevel(num) {
	level = num;
}
let cells;
let selectedCellIndex;
let selectedCell;
sudoku(level);
function sudoku(level) {
	const sudoku = new Sudoku(level);
	init();
	matrix = sudoku.matrix;
	grid = sudoku.grid;
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

		const result = [];
		cells.forEach((cell) => {
			result.push(Number(cell.innerHTML));
		});

		if (!sudoku.hasEmptyCells() && (JSON.stringify(grid.flat()) === JSON.stringify(result))) {
			setTimeout(() => win(), 500);
		}
		if (!sudoku.hasEmptyCells() && (JSON.stringify(grid.flat()) !== JSON.stringify(result))) {
			setTimeout(() => loss(), 500);
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
		const result = document.querySelector('.modal__result');
		setTime(result);
		modal.classList.add('active');
		closeBtns.forEach((btn) => btn.addEventListener('click', (e) => {
			e.preventDefault();
			modal.classList.remove('active');
		}));
		pauseTimer = true;
		let sudokuResults = JSON.parse(localStorage.getItem('sudokuResults'));
		sudokuResults.push(timer);
		sortArr(sudokuResults);
		localStorage.setItem('sudokuResults', JSON.stringify(resultsArrLength(sudokuResults)));
	}

	function loss() {
		const modal = document.querySelector('.loss__overlay');
		const closeBtns = document.querySelectorAll('.modal__close');
		modal.classList.add('active');
		closeBtns.forEach((btn) => btn.addEventListener('click', (e) => {
			e.preventDefault();
			modal.classList.remove('active');
		}));
		pauseTimer = true;
		let sudokuResults = JSON.parse(localStorage.getItem('sudokuResults'));
		sudokuResults.push(100000);
		sortArr(sudokuResults);
		localStorage.setItem('sudokuResults', JSON.stringify(resultsArrLength(sudokuResults)));
	}

}


//new game

const newGameBtn = document.querySelector('.header__btn_new-game');
newGameBtn.addEventListener('click', (e) => {
	e.preventDefault();
	location.reload();
});

//level

const levelBtn = document.querySelector('.header__btn_level');
const levelModal = document.querySelector('.level__overlay');
const closeBtns = document.querySelectorAll('.modal__close');
const submit = document.querySelector('.level__submit');
const form = document.querySelector('.level__form');
levelBtn.addEventListener('click', (e) => {
	e.preventDefault();
	levelModal.classList.add('active');
	closeBtns.forEach((btn) => btn.addEventListener('click', () => {
		levelModal.classList.remove('active');
	}))
});
submit.addEventListener('click', (e) => {
	e.preventDefault();
	levelModal.classList.remove('active');
	resetViewCells();
	localStorage.setItem('sudokuLevel', JSON.stringify(Number(form.elements['level'].value)));
	setLevel(Number(form.elements['level'].value));
	sudoku(Number(form.elements['level'].value));
	startTime();
});

//resetViewCells

function resetViewCells() {
	cells = document.querySelectorAll('.table__cell');
	cells.forEach((cell) => {
		cell.innerHTML = '';
		cell.classList.remove('filled');
		cell.classList.remove('selected');
	});
}

//solve

const solveBtn = document.querySelector('.header__btn_solve');
solveBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const cells = document.querySelectorAll('.table__cell');

	cells.forEach((item, index) => item.innerHTML = grid.flat()[index]);
	setTimeout(() => {
		cells.forEach((item, index) => item.innerHTML = matrix.flat()[index]);
	}, 3000)
	timer += 30;
});

// timer
function startTime() {
	timer = 0;
	const timerDiv = document.querySelector('.timer');
	clearInterval(intervalId);
	pauseTimer = false;
	timerDiv.innerHTML = `00:00`;
	intervalId = setInterval(function () {
		if (!pauseTimer) {
			timer++;
			setTime(timerDiv);
		}
	}, 1000)

}

function setTime(selector) {
	let min = Math.floor(timer / 60);
	let sec = timer % 60;
	selector.innerHTML =
		(("" + min).length < 2 ? "0" + min : min) +
		":" +
		(("" + sec).length < 2 ? "0" + sec : sec);
}





