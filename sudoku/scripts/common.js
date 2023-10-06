export const GRID_SIZE = 9;
export const SQUARE_SIZE = 3;

export function convertIndexToPosition(index) {
	return {
		row: Math.floor(index / GRID_SIZE),
		column: index % GRID_SIZE
	};
}