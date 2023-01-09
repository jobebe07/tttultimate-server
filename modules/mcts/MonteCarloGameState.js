export default class MonteCarloGameState {
    constructor(playHistory, board, player) {
        this.playHistory = playHistory
        this.board = board
        this.player = player
    }

    isPlayer(player) {
        return (player === this.player)
    }

    hash() {
        return JSON.stringify(this.playHistory)
    }
}