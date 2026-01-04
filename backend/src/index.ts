import { WebSocketServer, WebSocket } from "ws";
import GameManager from "./GameManager.js";
import { STOP_GAME, INIT_GAME, JOIN_ROOM, MAKE_MOVE, MAKE_ROOM, NEW_GAME, } from "./messages.js";

const wss = new WebSocketServer({port: 8000})
const gamemanager = new GameManager();

wss.on("connection", (ws:WebSocket) => {
    console.log("New Connection");
    ws.on("message", (data) => {
        const payload = JSON.parse(data.toString())
        console.log(payload);
        console.log("after payload")
        switch (payload.type) {
            case INIT_GAME:
                console.log("before call in init_game switch")
                gamemanager.initGame(ws);
                console.log("after call in init_game switch")
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
                gamemanager.reMatch(ws);
                break;
            case STOP_GAME:
                gamemanager.stopGame(ws);
                break;
        }
        console.log("after switch complete")
    })

    ws.on("close", () => {
        gamemanager.removeHandler(ws)
        console.log("a user disconneted")
    });
})