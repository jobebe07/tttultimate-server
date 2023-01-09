export default class MonteCarloPlay {
    constructor(row, col, fieldRow, fieldCol) {
        this.row = row
        this.col = col
        this.fieldRow = fieldRow
        this.fieldCol = fieldCol
    }

    hash() {
        return this.row.toString() + "," + this.col.toString() + "," + this.fieldRow.toString() + "," + this.fieldCol.toString()
    }
}