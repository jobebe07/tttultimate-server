export default class MonteCarloPlay {
    constructor(row, col) {
        this.row = row
        this.col = col
    }

    hash() {
        return this.row.toString() + "," + this.col.toString()
    }
}