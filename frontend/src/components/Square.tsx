import { MAKE_MOVE } from "../messages";
type SquarePropsType = {
    index: number;
    value : 1 | null | 0;
    ws : WebSocket | null;
    gameStatus: "Game On" | "You Won" | "You Lose" | "Draw"  | "Waiting for Opponent" | "Error" | "Loading" | "Opponent Disconnected";
    pointer: boolean | null;
}

export default function Square({index,value, ws, gameStatus, pointer}: SquarePropsType){
    
    function handleClick():void {
        console.log("square click")
        if (!ws) {
            console.log("from square !ws")
            return
        };
        if (!pointer) {
            console.log("from square !pointer",pointer)
            return
        };
        if (gameStatus === "You Won" ||
            gameStatus === "You Lose" ||
            gameStatus === "Waiting for Opponent" ||
            gameStatus === "Draw" ||
            gameStatus === "Error" ||
            gameStatus === "Loading" ||
            gameStatus === 'Opponent Disconnected') {
                console.log("form square gameStatus mismatch ")
                return
            }
        if (value === 1 || value === 0) {
            console.log("from square value === 1 || value === 0")
            return 
        } else {
            console.log("move made",index)
            ws.send(JSON.stringify({
                type: MAKE_MOVE,
                move: index,
            }))
        }
    }

    return (
        <button className={`col-${index} square`} onClick={handleClick}>{value === null ? "" : value === 1 ? "O" : "X"}</button>
    )

}