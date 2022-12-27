import MessageBuilder from "./modules/MessageBuilder.js";
import MessageType from "./modules/MessageType.js";
import Items from "./modules/Items.js";
import ClientHandler from "./modules/ClientHandler.js";

export default class Game {
    constructor(conIDX, conIDO) {
        this.conIDX = conIDX
        this.conIDO = conIDO
        this.gameState = GameStatus.INGAME
        ClientHandler.sendStatus(conIDX, GameStatus.INGAME)
        ClientHandler.sendStatus(conIDO, GameStatus.INGAME)

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
    }

    getConnectionByID(id) {
        if(Connections.map.has(id)) {
            return ClientHandler.connections.get(id)
        } else {
            this.gameState = GameStatus.DISCONNECT
        }
    }

    disband() {
        ClientHandler.disbandGame(ClientHandler.playerGameID.get(this.conIDX))
    }
}