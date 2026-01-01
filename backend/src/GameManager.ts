import Game from "./Game.js"
import { WebSocket } from "ws"

type Room = {
    host: WebSocket,
    guest: WebSocket,
}

export default class GameManager {
    private pendingUser: null | WebSocket = null
    private games: Game[] = []
    private rooms: Map<string, Room> = new Map()

    initGame(ws:WebSocket) {
        if (!this.pendingUser) {
            this.pendingUser = ws
        } else {
            const newGame = new Game(this.pendingUser, ws, 1,0)
            this.games.push(newGame)
            this.pendingUser = null
        }
    }

    removeHandler(ws:WebSocket) {
        if (this.pendingUser === ws) {
            this.pendingUser = null
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

    }

    joinRoom(ws:WebSocket, roomId:string) {

    }

    reMatch(ws1:WebSocket, ws2:WebSocket) {
        
    }

}
