import { WebSocket } from "ws";
import { MOVE_ACK, MOVE_ACK_AND_RESULT, PLAYER_DISCONNECTED, INITIAL_CALL  } from "./messages.js";

export default class Game {
    public player1: null | WebSocket;
    public player2: null | WebSocket;
    private gameState : (number | null)[];
    private moveCounter: number;
    private gameCounter: number;
    public isGameOn: boolean;

    constructor(ws1:WebSocket, ws2:WebSocket){
        this.player1 = ws1;
        this.player2 = ws2;
        this.gameState = new Array(9).fill(null);
        this.moveCounter = 0
        this.gameCounter = 1
        this.isGameOn = true;
        this.initialCall()
    }

    initialCall() {
        this.player1?.send(JSON.stringify({
            type: INITIAL_CALL,
            gameCount: this.gameCounter,
            totalMove: this.moveCounter,
            p1OrP2: "p1"
        }));
        this.player2?.send(JSON.stringify({
            type: INITIAL_CALL,
            gameCount: this.gameCounter,
            totalMove: this.moveCounter,
            p1OrP2: "p2"
        }));
        
    }

    newGame() {
        if (!this.isGameOn) {
            return
        }
        this.gameState = new Array(9).fill(null);
        this.gameCounter += 1
        this.moveCounter = 0
        this.initialCall()
    }

    isGameOver():(WebSocket | null) {
        const tem = this.gameState
        if ((tem[0] === 1 && tem[1] === 1 && tem[2] === 1) ||
            (tem[0] === 1 && tem[4] === 1 && tem[8] === 1) || 
            (tem[0] === 1 && tem[3] === 1 && tem[6] === 1) ||
            (tem[3] === 1 && tem[4] === 1 && tem[5] === 1) ||
            (tem[6] === 1 && tem[7] === 1 && tem[8] === 1) ||
            (tem[1] === 1 && tem[4] === 1 && tem[7] === 1) ||
            (tem[2] === 1 && tem[5] === 1 && tem[8] === 1) ||
            (tem[2] === 1 && tem[4] === 1 && tem[6] === 1)
        ) {
            return this.player1
        } else if ((tem[0] === 0 && tem[1] === 0 && tem[2] === 0) ||
            (tem[0] === 0 && tem[4] === 0 && tem[8] === 0) || 
            (tem[0] === 0 && tem[3] === 0 && tem[6] === 0) ||
            (tem[3] === 0 && tem[4] === 0 && tem[5] === 0) ||
            (tem[6] === 0 && tem[7] === 0 && tem[8] === 0) ||
            (tem[1] === 0 && tem[4] === 0 && tem[7] === 0) ||
            (tem[2] === 0 && tem[5] === 0 && tem[8] === 0) ||
            (tem[2] === 0 && tem[4] === 0 && tem[6] === 0)
        ) {
            return this.player2
        } else {
            return null
        } 
    }

    makeMove(ws:WebSocket,move:number) {
        if (this.isGameOn) return;

        if (move < 0 || 8 < move) {
            console.log("return from game makeMove buz move out of bound",move)
            return
        } else if (this.gameState[move] !== null) {
            console.log("return from game makeMove buz move already been made there",move)
            return
        } else if (this.isGameOver() === this.player1 || this.isGameOver() === this.player2) {
            console.log(`return from game makeMove buz game is over, winner is ${this.isGameOver() === this.player1 ? 'player1 "X"':'player2 "O"'}.`)
            return
        } else {
            if (this.gameCounter % 2 !== 0) {
                if ((this.moveCounter % 2 !== 0 && ws === this.player1) || (this.moveCounter % 2 === 0 && ws === this.player2)) {
                    console.log("return from game makemove buz move mismatch",ws,this.moveCounter)
                    return
                }
            } else {
                if ((this.moveCounter % 2 !== 0 && ws === this.player2) || (this.moveCounter % 2 === 0 && ws === this.player1)) {
                    console.log("return from game makemove buz move mismatch",ws,this.moveCounter)
                    return
                }
            }
        }

        try {
            if (this.player1 === ws) {
                this.gameState[move] = 1
            } else if (this.player2 === ws) {
                this.gameState[move] = 0
            };
        } catch (err) {
            console.log("try and catch from game makeMove", err)
            return
        };
        
        this.moveCounter += 1

        const isGameOver = this.isGameOver()
        if (isGameOver || this.moveCounter === 9) {
            const payload = JSON.stringify({
                type: MOVE_ACK_AND_RESULT,
                totalMove: this.moveCounter,
                gameState: this.gameState,
                resultType: isGameOver ? "win": "draw",
                winner: isGameOver
            });

            this.player1?.send(payload);
            this.player2?.send(payload);
        } else {
            const payload = JSON.stringify({
                type: MOVE_ACK,
                totalMove: this.moveCounter,
                gameState: this.gameState,
                move: move
            });

            this.player1?.send(payload);
            this.player2?.send(payload);
        }
    }

    handleDisconnect(ws:WebSocket) {
        if (this.player1 === ws) {
            const payload = JSON.stringify({
                type: PLAYER_DISCONNECTED,
            })
            this.player2?.send(payload);
            return
        } else if (this.player2 === ws) {
            const payload = JSON.stringify({
                type: PLAYER_DISCONNECTED,
            })
            this.player1?.send(payload);
            return
        }
    }
}