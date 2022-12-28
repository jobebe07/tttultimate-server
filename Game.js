import Items from "./modules/Items.js";
import ClientHandler from "./modules/ClientHandler.js";
import GameStatus from "./modules/GameStatus.js";
import MessageBuilder from "./modules/MessageBuilder.js";
import MessageType from "./modules/MessageType.js";
import Logger from "./modules/Logger.js";
import LogType from "./modules/LogType.js";

export default class Game {
    constructor(conIDX, conIDO) {
        this.conIDX = conIDX
        this.conIDO = conIDO
        this.current = Items.CROSS
        this.gameState = GameStatus.INGAME
        this.next = undefined
        ClientHandler.sendStatus(conIDX, GameStatus.INGAME, {me:Items.CROSS, current:Items.CROSS})
        ClientHandler.sendStatus(conIDO, GameStatus.INGAME, {me:Items.CIRCLE, current:Items.CROSS})

        // initialize field
        this.field = []
        for(let a = 0; a <= 2; a++) {
            this.field[a] = []
            for(let b = 0; b <= 2; b++) {
                this.field[a][b] = []
                for(let c = 0; c <= 2; c++) {
                    this.field[a][b][c] = []
                    for(let d = 0; d <= 2; d++) {
                        this.field[a][b][c][d] = Items.DEFAULT
                    }
                }
            }
        }

        this.locked = []
        for(let row = 0; row <= 2; row++) {
            this.locked[row] = []
            for(let col = 0; col <= 2; col++) {
                this.locked[row][col] = {
                    locked:false,
                    lockItem:Items.DEFAULT,
                }
            }
        }

        this.sendField(this.conIDX)
        this.sendField(this.conIDO)
    }

    getField() {
        return this.field
    }

    set(row, col, fieldRow, fieldCol, playerID) {
        if(this.getCurrentID() === playerID) {
            if(!this.locked[row][col].locked &&
                    this.field[row][col][fieldRow][fieldCol] === Items.DEFAULT &&
                    (this.chordsToNum(row, col) === this.next || this.next === undefined)) {
                this.field[row][col][fieldRow][fieldCol] = this.current

                let winner = this.checkWinner(row, col)
                if(winner) {
                    this.locked[row][col].locked = true
                    this.locked[row][col].lockItem = winner
                }

                if(!this.locked[fieldRow][fieldCol].locked && !this.isFull(fieldRow, fieldCol)) {
                    this.next = this.chordsToNum(fieldRow, fieldCol)
                } else {
                    this.next = undefined
                }

                let winnerGlobal = this.checkWinnerGlobal()
                if(winnerGlobal) {
                    this.next = undefined
                    ClientHandler.sendStatus(this.conIDX, GameStatus.END, {winner:winnerGlobal})
                    ClientHandler.sendStatus(this.conIDO, GameStatus.END, {winner:winnerGlobal})
                    this.disband()
                }

                if(this.isFullGlobal()) {
                    this.next = undefined
                    ClientHandler.sendStatus(this.conIDX, GameStatus.END)
                    ClientHandler.sendStatus(this.conIDO, GameStatus.END)
                    this.disband()
                }

                this.swap()
            }
        }

        this.sendField(this.conIDX)
        this.sendField(this.conIDO)
    }

    sendField(id) {
        let msg = new MessageBuilder(MessageType.FIELD_UPDATE, {
            field:this.field,
            locked:this.locked,
            next:this.next,
            current:this.current
        }).build()
        this.getConnectionByID(id).send(JSON.stringify(msg))
    }

    swap() {
        if(this.current === Items.CROSS) {
            this.current = Items.CIRCLE
        } else if(this.current === Items.CIRCLE) {
            this.current = Items.CROSS
        } else {
            Logger.log("An error occurred while swapping players", LogType.ERROR)
        }
    }

    getCurrentID() {
        if(this.current === Items.CROSS) return this.conIDX
        if(this.current === Items.CIRCLE) return this.conIDO
        return false
    }

    getConnectionByID(id) {
        if(ClientHandler.connections.has(id)) {
            return ClientHandler.connections.get(id)
        } else {
            this.disband()
            return false
        }
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

    checkWinner(row, col) {
        return this.checkField(this.field[row][col], Items.DEFAULT)
    }

    isFull(row, col) {
        let notFull = false
        for(let fieldRow = 0; fieldRow <= 2; fieldRow++) {
            for(let fieldCol = 0; fieldCol <= 2; fieldCol++) {
                if(this.field[row][col][fieldRow][fieldCol] === Items.DEFAULT) {
                    notFull = true
                }
            }
        }

        return !notFull
    }

    isFullGlobal() {
        let notFull = false

        for(let row = 0; row <= 2; row++) {
            for(let col = 0; col <= 2; col++) {
                if(!this.locked[row][col].locked && !this.isFull(row, col)) {
                    notFull = true
                }
            }
        }

        return !notFull
    }

    checkWinnerGlobal() {
        let array = []
        for(let row = 0; row <= 2; row++) {
            array[row] = []
            for(let col = 0; col <= 2; col++) {
                array[row][col] = this.locked[row][col].lockItem
            }
        }
        return this.checkField(array, Items.DEFAULT)
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

    disband() {
        ClientHandler.disbandGame(ClientHandler.playerGameID.get(this.conIDX))
    }
}