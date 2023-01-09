import MonteCarloGameState from "./MonteCarloGameState"
import Player from "./MonteCarloPlayer"

export default class MonteCarloField {
    constructor() {
        this.next = undefined
        this.boardPrototype = []
        /*
        for(let row = 0; row <= 2; row++) {
            for (let row = 0; row <= 2; row++) {
                for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {

                    }
                }
            }
        }*/

        for(let row = 0; row <= 2; row++) {
            this.boardPrototype[row] = []
            for (let row = 0; row <= 2; row++) {
                this.boardPrototype[row][col] = []
                for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                    this.boardPrototype[row][col][fieldRow] = []
                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                        this.boardPrototype[row][col][fieldRow][fieldCol] = Player.DEFAULT
                    }
                }
            }
        }
    }
    /** Generate and return the initial game state. */
    start() {
    // TODO
        return new MonteCarloGameState([], this.boardPrototype, Player.CROSS)
    }  /** Return the current player’s legal moves from given state. */
    legalPlays(state) {
    // TODO
        let legalPlays = []
        for(let row = 0; row <= 2; row++) {
            for (let row = 0; row <= 2; row++) {
                for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                        // TODO return legal place from state
                    }
                }
            }
        }
        return plays
    }  /** Advance the given state and return it. */
    nextState(state, move) {
    // TODO
        return newState
    }  /** Return the winner of the game. */
    winner(state) {
        // TODO
        return winner
    }


    numToChords(num) {
        num--
        let col = (num % 3)
        let row = Math.floor(num / 3)
        return {row:row, col:col,}
    }

    chordsToNum(row, col) {
        return ((row+1)*3) - (3-(col+1))
    }
}