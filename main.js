import ClientHandler from "./modules/ClientHandler.js";
import * as WebSocket from "ws";
import crypto from "crypto";
import ClientMessageType from "./modules/ClientMessageType.js";
import MessageBuilder from "./modules/MessageBuilder.js";
import MessageType from "./modules/MessageType.js";
import GameStatus from "./modules/GameStatus.js";
import Logger from "./modules/Logger.js";
import config from "./modules/config.js";

let websocketServer = new WebSocket.WebSocketServer({port: 8080})

console.log("Server started successfully")

websocketServer.on("connection", function (websocket, request) {
    let key = request.headers["sec-websocket-key"]
    let id = createIdFromKey(key)

    ClientHandler.clientConnect(id, websocket)
    
    websocket.on("message", function (message) {
        let data = JSON.parse(message)
        if(data.type === ClientMessageType.PING) {
            websocket.send(JSON.stringify(new MessageBuilder(MessageType.PING).build()))
        }
        if(data.type === ClientMessageType.MOVE) {
            let chords = data.content
            if(config.verbose) {
                Logger.log("Game [" + ClientHandler.playerGameID.get(id) + "] Received move from " + id + " with choords " + JSON.stringify(chords))
            }
            if(ClientHandler.isIngame(id)) {
                let game = ClientHandler.games.get(ClientHandler.playerGameID.get(id))
                game.set(chords.row, chords.col, chords.fieldRow, chords.fieldCol, id)
            }
        }
        if(data.type === ClientMessageType.JOIN) {
            ClientHandler.sendStatus(id, GameStatus.WAITING)
            ClientHandler.addToQueue(id)
        }
    })

    websocket.on("close", function() {
        ClientHandler.clientDisconnect(id)
    })
})

function createIdFromKey(key) {
    return crypto.createHash("sha1").update(key).digest("base64")
}