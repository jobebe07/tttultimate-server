import ClientHandler from "./modules/ClientHandler.js";
import * as WebSocket from "ws";
import crypto from "crypto";
import ClientMessageType from "./modules/ClientMessageType.js";
import MessageBuilder from "./modules/MessageBuilder.js";
import MessageType from "./modules/MessageType.js";

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
            ClientHandler.games[ClientHandler.playerGameID.get(id)].set(chords.row, chords.col, chords.fieldRow, chords.fieldCol)
        }
    })

    websocket.on("close", function() {
        ClientHandler.clientDisconnect(id)
    })
})

function createIdFromKey(key) {
    return crypto.createHash("sha1").update(key).digest("base64")
}