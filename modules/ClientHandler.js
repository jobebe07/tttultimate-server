import Game from "../Game.js";
import MessageBuilder from "./MessageBuilder.js";
import MessageType from "./MessageType.js";

export default class ClientHandler {
    // connectionID -> websocket
    static connections = new Map()
    // connectionIDs
    static pendingPlayerIDs = []
    // instances of 'Game'
    static games = []
    // connectionID -> index from current game in 'games'
    static playerGameID = new Map()

    static clientConnect(id, client) {
        this.connections.set(id, client)
        this.pendingPlayerIDs.push(id)

        this.createGames()
    }

    static clientDisconnect(id) {
        this.connections.delete(id)

        let gameID = this.playerGameID.get(id)

        this.disbandGame(gameID)
    }

    static createGames() {
        while(this.pendingPlayerIDs.length >= 2) {
            let idX = this.pendingPlayerIDs.pop()
            let idO = this.pendingPlayerIDs.pop()
            this.games.push(new Game(idX, idO))
            this.playerGameID.set(idX, this.games.length-1)
            this.playerGameID.set(idO, this.games.length-1)
        }
    }

    static sendStatus(clientID, status) {
        if(this.connections.has(clientID)) {
            let msg = new MessageBuilder(MessageType.STATUS_CHANGE, status).build()
            this.connections.get(clientID).send(msg)
        }
    }

    static disbandGame(gameID) {
        let conIDX = this.games[gameID].conIDX
        let conIDO = this.games[gameID].conIDO

        this.sendStatus(conIDX, GameStatus.WAITING)
        this.sendStatus(conIDO, GameStatus.WAITING)

        if(this.connections.has(conIDX)) {
            this.pendingPlayerIDs.push(conIDX)
        }
        if(this.connections.has(conIDO)) {
            this.pendingPlayerIDs.push(conIDO)
        }

        delete this.games[gameID]
    }
}