import { WebSocketServer, WebSocket } from "ws";
import GameManager from "./GameManager.js";
import { INIT_GAME, JOIN_ROOM, MAKE_MOVE, MAKE_ROOM, NEW_GAME, } from "./messages.js";

const wss = new WebSocketServer({port: 8000})
const gamemanager = new GameManager();

wss.on("connection", (ws:WebSocket) => {

    ws.on("message", (data) => {
        const payload = JSON.parse(data.toString())
        switch (payload.type) {
            case INIT_GAME:
                gamemanager.initGame(ws);
                break;
            case MAKE_ROOM:
                gamemanager.makeRoom(ws);
                break;
            case JOIN_ROOM:
                gamemanager.joinRoom(ws, payload.roomId);
                break;
            case MAKE_MOVE:
                gamemanager.makeMove(ws, payload.move);
                break;
            case NEW_GAME:
                gamemanager.reMatch(ws)
            
        }
    })

    ws.on("close", () => {
        gamemanager.removeHandler(ws)
    });
})