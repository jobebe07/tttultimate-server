import Game from "../Game.js";
import MessageBuilder from "./MessageBuilder.js";
import MessageType from "./MessageType.js";
import config from "./config.js";
import Logger from "./Logger.js";
import GameStatus from "./GameStatus.js";

export default class ClientHandler {
    // connectionID -> websocket
    static connections = new Map()
    // connectionIDs
    static pendingPlayerIDs = new Map()
    // instances of 'Game'
    static games = new Map()
    // connectionID -> index from current game in 'games'
    static playerGameID = new Map()

    static clientConnect(id, client) {
        this.connections.set(id, client)
        this.pendingPlayerIDs.set(id, this.pendingPlayerIDs.size)

        if(config.verbose) {
            Logger.log(`Client (ID: ${id}) connected --- PENDING: ${this.pendingPlayerIDs.size}`)
        }

        this.createGames()
    }

    static clientDisconnect(id) {
        this.connections.delete(id)
        this.pendingPlayerIDs.delete(id)

        if(config.verbose) {
            Logger.log(`Client (ID: ${id}) disconnected --- PENDING: ${this.pendingPlayerIDs.size}`)
        }

        if(this.playerGameID.has(id)) {
            let gameID = this.playerGameID.get(id)

            this.disbandGame(gameID)
        }
    }

    static createGames() {
        while(this.pendingPlayerIDs.size >= 2) {
            let idX = Array.from(this.pendingPlayerIDs.keys()).pop();
            this.pendingPlayerIDs.delete(idX)
            let idO = Array.from(this.pendingPlayerIDs.keys()).pop();
            this.pendingPlayerIDs.delete(idO)

            let game = new Game(idX, idO)
            let gameID = this.games.size

            this.games.set(gameID, game)
            this.playerGameID.set(idX, gameID)
            this.playerGameID.set(idO, gameID)

            if(config.verbose) {
                Logger.log(`Game match [${gameID}] (${idX}, ${idO}) --- PENDING: ${this.pendingPlayerIDs.size}`)
            }
        }
    }

    static sendStatus(clientID, status) {
        if(this.connections.has(clientID)) {
            let msg = new MessageBuilder(MessageType.STATUS_CHANGE, status).build()
            this.connections.get(clientID).send(JSON.stringify(msg))
        }
    }

    static disbandGame(gameID) {
        let conIDX = this.games.get(gameID).conIDX
        let conIDO = this.games.get(gameID).conIDO

        this.sendStatus(conIDX, GameStatus.WAITING)
        this.sendStatus(conIDO, GameStatus.WAITING)

        this.playerGameID.delete(conIDX)
        this.playerGameID.delete(conIDO)

        if(this.connections.has(conIDX)) {
            this.pendingPlayerIDs.set(conIDX, this.pendingPlayerIDs.size)
        }
        if(this.connections.has(conIDO)) {
            this.pendingPlayerIDs.set(conIDO, this.pendingPlayerIDs.size)
        }

        this.games.delete(gameID)

        if(config.verbose) {
            Logger.log(`Game ${gameID} was disbanded --- PENDING: ${this.pendingPlayerIDs.size}`)
        }
    }

    static isIngame(id) {
        return this.playerGameID.has(id)
    }
}