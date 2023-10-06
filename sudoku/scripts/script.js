const GRID_SIZE = 9;
const SQUARE_SIZE = 3;

function createSudoku() {
	const sudoku = createSudokuMatrix();
	completedSudoku(sudoku);
	console.log(sudoku);
}

createSudoku();

function createSudokuMatrix() {
	return new Array(GRID_SIZE).fill().map(() => new Array(GRID_SIZE).fill(null));
}

function randomNumbers() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	for (let index = numbers.length - 1; index >= 0; index--) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[numbers[index], numbers[randomIndex]] = [numbers[randomIndex], numbers[index]];
	}
	return numbers;
};

function findEmptyCell(matrix) {
	for (let i = 0; i < GRID_SIZE; i++) {
		for (let j = 0; j < GRID_SIZE; j++) {
			if (matrix[i][j] === null) return { row: i, column: j }
		}
	}
	return null;
}

function validateRow(matrix, row, column, value) {
	for (let i = 0; i < GRID_SIZE; i++) {
		if (matrix[row][i] === value && i !== column) return false;
	}
	return true;
}

function validateColumn(matrix, row, column, value) {
	for (let i = 0; i < GRID_SIZE; i++) {
		if (matrix[i][column] === value && i !== row) return false;
	}
	return true;
}

function validateSquare(matrix, row, column, value) {
	const topPointOfSquare = row - row % SQUARE_SIZE;
	const leftPointOfSquare = column - column % SQUARE_SIZE;
	for (let i = topPointOfSquare; i < topPointOfSquare + SQUARE_SIZE; i++) {
		for (let j = leftPointOfSquare; j < leftPointOfSquare + SQUARE_SIZE; j++) {
			if (matrix[i][j] === value && i !== row && j !== column) return false;
		}
	}
	return true;
}

function validate(matrix, row, column, value) {
	return validateColumn(matrix, row, column, value) && validateRow(matrix, row, column, value) && validateSquare(matrix, row, column, value);
}

function completedSudoku(matrix) {
	const emptyCell = findEmptyCell(matrix);
	if (!emptyCell) return true;

	const numbers = randomNumbers();
	for (let index = 0; index < numbers.length; index++) {
		if (!validate(matrix, emptyCell.row, emptyCell.column, numbers[index])) continue;
		matrix[emptyCell.row][emptyCell.column] = numbers[index];
		if (completedSudoku(matrix)) return true;
		matrix[emptyCell.row][emptyCell.column] = null;
	}
};


