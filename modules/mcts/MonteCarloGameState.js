export default class MonteCarloGameState {
    constructor(playHistory, board, locked, next, player) {
        this.playHistory = playHistory
        this.board = board
        this.locked = locked
        this.player = player
        this.next = next
    }

    isPlayer(player) {
        return (player === this.player)
    }

    hash() {
        return JSON.stringify(this.playHistory)
    }
}