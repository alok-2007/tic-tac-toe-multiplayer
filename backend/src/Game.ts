import { WebSocket } from "ws";

export default class Game {
    public player1: null | WebSocket;
    public player2: null | WebSocket;
    private gameState : (number | null)[];
    private moveCounter: number;
    private p1s: 1 | 0;
    private p2s: 1 | 0;

    constructor(ws1:WebSocket, ws2:WebSocket, p1s:1 | 0, p2s:1 | 0){
        this.player1 = ws1;
        this.player2 = ws2;
        this.p1s = p1s
        this.p2s = p2s
        this.gameState = new Array(9).fill(null);
        this.initialCall()
        this.moveCounter = 0
    }

    initialCall() {
        this.player1?.send(JSON.stringify({
            message: `you are ${this.p1s}.`,
            gameState: this.gameState
        }));
        this.player2?.send(JSON.stringify({
            message: `you are ${this.p2s}.`,
            gameState: this.gameState
        }));
        
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
            return this.p1s === 1 ? this.player1 : this.player2
        } else if ((tem[0] === 0 && tem[1] === 0 && tem[2] === 0) ||
            (tem[0] === 0 && tem[4] === 0 && tem[8] === 0) || 
            (tem[0] === 0 && tem[3] === 0 && tem[6] === 0) ||
            (tem[3] === 0 && tem[4] === 0 && tem[5] === 0) ||
            (tem[6] === 0 && tem[7] === 0 && tem[8] === 0) ||
            (tem[1] === 0 && tem[4] === 0 && tem[7] === 0) ||
            (tem[2] === 0 && tem[5] === 0 && tem[8] === 0) ||
            (tem[2] === 0 && tem[4] === 0 && tem[6] === 0)
        ) {
            return this.p1s === 0 ? this.player1 : this.player2
        } else {
            return null
        } 
    }

    makeMove(ws:WebSocket,move:number) {
        if (move < 0 || 8 < move) {
            console.log("return from game makeMove buz move out of bound",move)
            return
        } else if (this.gameState[move] !== null) {
            console.log("return from game makeMove buz move already been made there",move)
            return
        } else if (this.isGameOver() === this.player1 || this.isGameOver() === this.player2) {
            console.log(`return from game makeMove buz game is over, winner is ${this.isGameOver() === this.player1 ? 'player1 "X"':'player2 "O"'}.`)
            return
        } else if (this.moveCounter % 2 !== 0 && ws === this.player1) {
            console.log("return from game makemove buz move mismatch",ws,this.moveCounter)
            return
        }

        try {
            if (this.player1 === ws) {
                this.gameState[move] = this.p1s
            } else if (this.player2 === ws) {
                this.gameState[move] = this.p2s
            };
        } catch (err) {
            console.log("try and catch from game makeMove", err)
            return
        };
        
        this.moveCounter += 1

        const isGameOver = this.isGameOver()
        if (isGameOver || this.moveCounter === 9) {
            const payload = JSON.stringify({
                type: "moveAckAndResult",
                totalMove: this.moveCounter,
                gameState: this.gameState,
                resultType: isGameOver ? "win": "draw",
                winner: isGameOver
            });

            this.player1?.send(payload);
            this.player2?.send(payload);
        } else {
            const payload = JSON.stringify({
                type: "moveAck",
                totalMove: this.moveCounter,
                gameState: this.gameState
            });

            this.player1?.send(payload);
            this.player2?.send(payload);
        }
    }

    handleDisconnect(ws:WebSocket) {
        
    }
}