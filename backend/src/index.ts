import { WebSocketServer, WebSocket } from "ws";
import GameManager from "./GameManager.js";
import { INIT_GAME, JOIN_ROOM, MAKE_MOVE, MAKE_ROOM, } from "./messages.js";

const wss = new WebSocketServer({port: 8000})
const gamemanager = new GameManager();

wss.on("connection", (ws:WebSocket) => {

    ws.on("message", (data) => {
        const payload = JSON.parse(data.toString())
        if (payload.type === INIT_GAME) {
            gamemanager.initGame(ws)
        } else if (payload.type === MAKE_ROOM) {
            gamemanager.makeRoom(ws)
        } else if (payload.type === JOIN_ROOM) {
            gamemanager.joinRoom(ws, payload.roomId)
        } else if (payload.type === MAKE_MOVE) {
            gamemanager.makeMove(ws, payload.move)
        }
    })

    ws.on("close", () => {
        gamemanager.removeHandler(ws)
    });
})