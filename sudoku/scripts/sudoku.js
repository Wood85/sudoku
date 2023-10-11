import { createSudoku, findEmptyCell } from "./createSudoku.js";
import { GRID_SIZE, SQUARE_SIZE } from "./common.js";

export class Sudoku {
	constructor(level) {
		this.matrix = createSudoku(level);
	}

	getDuplicatePositions(row, column, value) {
		const duplicatesInColumn = this.getDuplicatePositionsInColumn(row, column, value)
		const duplicatesInRow = this.getDuplicatePositionsInRow(row, column, value);
		const duplicatesInSquare = this.getDuplicatePositionsInSquare(row, column, value);

		const duplicates = [...duplicatesInColumn, ...duplicatesInRow];
		duplicatesInSquare.forEach(duplicate => {
			if (duplicate.row !== row && duplicate.column !== column) duplicates.push(duplicate);
		});

		return duplicates;
	}

	getDuplicatePositionsInColumn(row, column, value) {
		const duplicates = [];
		for (let iRow = 0; iRow < GRID_SIZE; iRow++) {
			if (this.grid[iRow][column] === value && iRow !== row) {
				duplicates.push({ row: iRow, column });
			}
		}
		return duplicates;
	}

	getDuplicatePositionsInRow(row, column, value) {
		const duplicates = [];
		for (let iColumn = 0; iColumn < GRID_SIZE; iColumn++) {
			if (this.grid[row][iColumn] === value && iColumn !== column) {
				duplicates.push({ row, column: iColumn });
			}
		}
		return duplicates;
	}

	getDuplicatePositionsInSquare(row, column, value) {
		const duplicates = [];
		const firstRowInSquare = row - row % SQUARE_SIZE;
		const firstColumnInSquare = column - column % SQUARE_SIZE;

		for (let iRow = firstRowInSquare; iRow < firstRowInSquare + SQUARE_SIZE; iRow++) {
			for (let iColumn = firstColumnInSquare; iColumn < firstColumnInSquare + SQUARE_SIZE; iColumn++) {
				if (this.matrix[iRow][iColumn] === value && iRow !== row && iColumn !== column) {
					duplicates.push({ row: iRow, column: iColumn });
				}
			}
		}
		return duplicates;
	}

	hasEmptyCells() {
		return Boolean(findEmptyCell(this.matrix));
	}
}