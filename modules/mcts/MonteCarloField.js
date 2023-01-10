import MonteCarloGameState from "./MonteCarloGameState.js"
import MonteCarloPlay from "./MonteCarloPlay.js"
import Player from "./MonteCarloPlayer.js"
import Items from "../Items.js";

export default class MonteCarloField {
    constructor() {
        this.next = undefined
        this.boardPrototype = []
        this.lockedPrototype = []
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
            for (let col = 0; col <= 2; col++) {
                this.boardPrototype[row][col] = []
                for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                    this.boardPrototype[row][col][fieldRow] = []
                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                        this.boardPrototype[row][col][fieldRow][fieldCol] = Player.DEFAULT
                    }
                }
            }
        }

        for(let row = 0; row <= 2; row++) {
            this.lockedPrototype[row] = []
            for (let col = 0; col <= 2; col++) {
                this.lockedPrototype[row][col] = {locked: false, lockItem: Player.DEFAULT}
            }
        }
    }
    /** Generate and return the initial game state. */
    start() {
        return new MonteCarloGameState([], this.boardPrototype, this.lockedPrototype, undefined, Player.CROSS)
    }  /** Return the current player’s legal moves from given state. */
    legalPlays(state) {
    // TODO
        let legalPlays = []
        for(let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                        // TODO return legal place from state
                        if(state.board[row][col][fieldRow][fieldCol] === Player.DEFAULT
                                // check whether field is locked
                                && !state.locked[row][col].locked
                                // check whether the play is in the forced field
                                && (state.next === this.chordsToNum(row, col) || state.next === undefined)) {
                            legalPlays.push(new MonteCarloPlay(row, col, fieldRow, fieldCol))
                        }
                    }
                }
            }
        }
        return legalPlays
    }  /** Advance the given state and return it. */
    nextState(state, move) {
    // TODO
        console.log(this.getFieldVisual(state))

        let newHistory = state.playHistory.slice()
        newHistory.push(move)

        let newBoard = state.board.slice()
        let newLocked = state.locked.slice()

        if(state.board[move.row][move.col][move.fieldRow][move.fieldCol] === Player.DEFAULT
                && !state.locked[move.row][move.col].locked
                && (state.next === this.chordsToNum(move.row, move.col) || state.next === undefined)) {
            newBoard[move.row][move.col][move.fieldRow][move.fieldCol] = state.player

            let checkField = this.checkField(newBoard[move.row][move.col], Player.DEFAULT)
            if(checkField) {
                newLocked[move.row][move.col].locked = true
                newLocked[move.row][move.col].lockItem = state.player
            }
        } else {
            console.log(move, !state.locked[move.row][move.col].locked)
            throw new Error("Illegal play")
        }

        let newNext
        if(!state.locked[move.fieldRow][move.fieldCol].locked) {
            newNext = this.chordsToNum(move.fieldRow, move.fieldCol)
        } else {
            newNext = undefined
        }
        let newPlayer = (state.player === Player.CROSS ? Player.CIRCLE : Player.CROSS)
        console.log(newPlayer)

        return new MonteCarloGameState(newHistory, newBoard, newLocked, newNext, newPlayer)
    }  /** Return the winner of the game. */
    winner(state) {
        // TODO
        let array = []
        for(let row = 0; row <= 2; row++) {
            array[row] = []
            for(let col = 0; col <= 2; col++) {
                array[row][col] = state.locked[row][col].lockItem
            }
        }
        let winner = this.checkField(array, Player.DEFAULT)

        if(this.isFullGlobal(state)) {
            winner = Player.DEFAULT
        }

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

    isFull(state, row, col) {
        let notFull = false
        for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
            for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                if(state.board[row][col][fieldRow][fieldCol] === Player.DEFAULT) {
                    notFull = true
                }
            }
        }

        return !notFull
    }

    isFullGlobal(state) {
        let notFull = false

        for(let row = 0; row <= 2; row++) {
            for(let col = 0; col <= 2; col++) {
                if(!state.locked[row][col].locked && !this.isFull(state, row, col)) {
                    notFull = true
                }
            }
        }

        return !notFull
    }

    checkField(array, ex) {
        try {
            if(array[0][0] === array[0][1] && array[0][0] === array[0][2] && array[0][0] !== ex) {
                return array[0][0]
            }
            if(array[1][0] === array[1][1] && array[1][0] === array[1][2] && array[1][0] !== ex) {
                return array[1][0]
            }
            if(array[2][0] === array[2][1] && array[2][0] === array[2][2] && array[2][0] !== ex) {
                return array[2][0]
            }

            if(array[0][0] === array[1][0] && array[0][0] === array[2][0] && array[0][0] !== ex) {
                return array[0][0]
            }
            if(array[0][1] === array[1][1] && array[0][1] === array[2][1] && array[0][1] !== ex) {
                return array[0][1]
            }
            if(array[0][2] === array[1][2] && array[0][2] === array[2][2] && array[0][2] !== ex) {
                return array[0][2]
            }

            if(array[0][0] === array[1][1] && array[0][0] === array[2][2] && array[0][0] !== ex) {
                return array[0][0]
            }
            if(array[0][2] === array[1][1] && array[0][2] === array[2][0] && array[0][2] !== ex) {
                return array[0][2]
            }
        } catch (ex) {

        }
        return false
    }

    getFieldVisual(state) {
        let board = state.board
        let msg = ""
        for(let row = 0; row <= 2; row++) {
            for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
                for(let col = 0; col <= 2; col++) {
                    for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                        msg+=board[row][col][fieldRow][fieldCol] + " "
                    }
                    msg+=" "
                }
                msg+="\n"
            }
            msg+="\n"
        }
        msg+="-----------------------"
        return msg
    }
}