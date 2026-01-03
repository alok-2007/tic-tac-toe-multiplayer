import { MAKE_MOVE } from "../messages";
type SquarePropsType = {
    index: number;
    value : 1 | null | 0;
    ws : WebSocket;
}

export default function Square({index,value, ws}: SquarePropsType){
    
    function handleClick():void {
        if (!ws) return;
        if (value === 1 || value === 0) {
            return 
        } else {
            ws.send(JSON.stringify({
                type: MAKE_MOVE,
                move: index,
            }))
        }
    }

    return (
        <button onClick={handleClick}>{value === null ? "" : value === 1 ? "O" : "X"}</button>
    )

}