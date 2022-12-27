import ClientHandler from "./modules/ClientHandler.js";
import * as WebSocket from "ws";
import crypto from "crypto";

let websocketServer = new WebSocket.WebSocketServer({port: 8080})

console.log("Server started successfully")

websocketServer.on("connection", function (websocket, request) {
    let key = request.headers["sec-websocket-key"]
    let id = createIdFromKey(key)
    ClientHandler.clientConnect(id, websocket)

    websocket.on("close", function() {
        ClientHandler.clientDisconnect(id)
    })
})

function createIdFromKey(key) {
    return crypto.createHash("sha1").update(key).digest("base64")
}