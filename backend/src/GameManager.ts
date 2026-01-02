import Game from "./Game.js"
import { WebSocket } from "ws"
import { GUEST_DISCONNECTED, HOST_DISCONNECTED, INVALID_ROOM_ID, REQ_NEW_GAME } from "./messages.js";

type Room = {
    host: WebSocket,
    guest: WebSocket | null,
}

type ReqRoom = {
    game: Game,
    reqMaker: WebSocket,
}

export function generateRamdomId(length=6):string{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXZYabcdefghijklmnopqrstuvwxzy123456890";
    let result:string = "";
    for(let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * 1000) + 1
        result += chars[randomNum % length];
    }
    return result;
} 

export default class GameManager {
    private pendingUser: null | WebSocket = null
    private games: Game[] = []
    private rooms: Map<string, Room> = new Map();
    private reqRoom: Map<string, ReqRoom> = new Map();

    initGame(ws:WebSocket) {
        if (!this.pendingUser) {
            this.pendingUser = ws
        } else {
            const newGame = new Game(this.pendingUser, ws)
            this.games.push(newGame)
            this.pendingUser = null
        }
    }

    removeHandler(ws:WebSocket) {
        if (this.pendingUser === ws) {
            this.pendingUser = null
            return
        }
        const hostFound = Array();
        const guestFound = Array();
        this.rooms.forEach((value:Room,key:string) => {
            if (value.host === ws) {
                hostFound.push([value,key])
                return
            } else if (value.guest === ws) {
                guestFound.push([value, key])
                return
            }
        });

        if (hostFound) {
            this.rooms.delete(hostFound[1])
            const guest:WebSocket = hostFound[0].guest
            guest?.send(JSON.stringify({
                type: HOST_DISCONNECTED,
                message: "host disconnected",
            }))
            this.games = this.games.filter(game => game.player1 !== guest || game.player2 !== guest)
            return

        } else if (guestFound) {
            const roomId = guestFound[1]
            const host:WebSocket = guestFound[0].host;
            const room = this.rooms.get(roomId)
            if (room) {
                this.rooms.set(roomId, {
                    host: room.host,
                    guest: null,
                })
            }
            room?.host.send(JSON.stringify({
                type: GUEST_DISCONNECTED,
                message: "guest disconnected",
            }))
            this.games = this.games.filter(game => game.player1 !== host && game.player2 !== host)
            return
        } else {
            this.games = this.games.filter(game => game.player1 !== ws && game.player2 !== ws)
            const game = this.games.filter(game => game.player1 === ws || game.player2 === ws)[0]
            game?.handleDisconnect(ws)
        }
    }

    makeMove(ws:WebSocket, move:number) {
        const game = this.games.filter(game => game.player1 === ws || game.player2 === ws)[0]
        game?.makeMove(ws, move)
    }

    makeRoom(ws:WebSocket) {
        const roomId = generateRamdomId();
        this.rooms.set(roomId, {host: ws, guest: null})
    }

    joinRoom(ws:WebSocket, roomId:string) {
        const room = this.rooms.get(roomId)

        if (!room) {
            ws.send(JSON.stringify({
                type: INVALID_ROOM_ID,
                message: "room id is invalid",
            }))
            return
        }

        this.rooms.set(roomId, {
            host: room.host,
            guest: ws,
        })

        const game = new Game(room.host, ws);
        this.games.push(game);
        return 
    }

    reMatch(ws:WebSocket) {
        const game = this.games.filter(game => game.player1 === ws || game.player2 === ws)[0]

        if (game && !game.isGameOn) {
            const playerToReq = game.player1 === ws ? game.player2 : game.player1;
            const reqRoomId = generateRamdomId();
            this.reqRoom.set(reqRoomId,{
                game: game,
                reqMaker: ws,
            })
            playerToReq?.send(JSON.stringify({
                type: REQ_NEW_GAME,
                reqester: ws,
                reqId: reqRoomId
            }))
        }
    }

}
