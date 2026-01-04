import { useState, useEffect } from "react";
import Square from "./Square";
import { INITIAL_CALL, MOVE_ACK, MOVE_ACK_AND_RESULT, WAIT_FOR_OPPONENT, PLAYER_DISCONNECTED } from "../messages";

type Cell = 1 | 0 | null;
type Board = Cell[][];

type BoardPropsType = {
    ws: WebSocket | null;
    setIsGameOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Board({ ws, setIsGameOn}: BoardPropsType) {
    const [board, setBoard] = useState<Board>([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]);
    const [gameCount, setGameCount] = useState<number | null>(null);
    const [moveCount, setMoveCount] = useState<number | null>(null);
    const [gameStatus, setGameStatus] = useState<"Game On" | "You Won" | "You Lose" | "Draw" | "Waiting for Opponent" | "Error" | "Loading"| "Opponent Disconnected">("Loading");
    const [pointer, setPointer] = useState<boolean | null>(null);
    const [p1Or2, setP1Or2] = useState<null | "p1" | "p2">(null)

    useEffect(() => {
        if(!ws) return;

        ws.onmessage = (event: MessageEvent) => {
            const payload = JSON.parse(event.data);
            const type = payload.type;

            if (type === INITIAL_CALL) {
                const { gameCount,totalMove, p1OrP2 } = payload;
                setGameCount(gameCount);
                setMoveCount(totalMove);
                setP1Or2(p1OrP2)
                setGameStatus("Game On");
                return
            } else if (type === MOVE_ACK) {
                const { gameState, totalMove } =  payload;
                setMoveCount(totalMove);
                setBoard(() => {
                    const next:Cell[][] = new Array();

                    for(let i = 0 ; i < 9; i++) {
                        next[Math.floor(i/3)][i%3] = gameState[i];
                    }

                    return next;
                });
                return;
            } else if (type === MOVE_ACK_AND_RESULT) {
                const { gameState, totalMove, resultType, winner } = payload;
                setMoveCount(totalMove);
                setIsGameOn(false);
                if (resultType === 'win') {
                    if (winner === ws) {
                        setGameStatus("You Won");
                    } else {
                        setGameStatus("You Lose");
                    }
                } else if (resultType === "draw") {
                    setGameStatus("Draw");
                } else {
                    setGameStatus("Error")
                }
                setBoard(() => {
                    const next:Cell[][] = new Array();

                    for(let i = 0 ; i < 9; i++) {
                        next[Math.floor(i/3)][i%3] = gameState[i];
                    }

                    return next;
                });
            } else if (type === WAIT_FOR_OPPONENT) {
                setGameStatus("Waiting for Opponent");
            } else if (type === PLAYER_DISCONNECTED) {
                setGameStatus("Opponent Disconnected");
            }
        }
        return () => {
            ws.onmessage = null
        };
    },[ws])

    useEffect(() => {
        if (!gameCount || !moveCount) return;

        const temSum = gameCount + moveCount;

        if (p1Or2 === "p1" && temSum % 2 !== 0) {
            setPointer(true);
        } else if (p1Or2 === "p2" && temSum % 2 === 0) {
            setPointer(true)
        } else {
            setPointer(false);
        }

    }, [gameCount, moveCount])

    useEffect(() => {
        switch (gameStatus) {
            case "Game On":
                setIsGameOn(true);
                break;
            default:
                setIsGameOn(false);
                break;
        }
    }, [gameStatus])

    

    return (
        <div>
            <div className="flex flex-col justify-center items-center h-[100px]">
                <div>{gameStatus}</div>
                <div className="flex flex-row gap-100 w-full bg-yellow-600">
                    <div>You</div>
                    <div>Opponent</div>
                </div>
            </div>
            <div className="bg-yellow-200 flex flex-col">
            {board.map((row,rowIndex) => 
                <div className="flex flex-row gap-1" key={rowIndex}>
                    {row.map((col, colIndex) => {
                        const index = rowIndex * 3 + colIndex;
                        return (
                            <Square 
                                key={index}
                                index={index}
                                value={col}
                                ws={ws}
                                gameStatus={gameStatus}
                                pointer={pointer}
                            />
                        );
                    })}
                </div>
            )}
            </div>
        </div>
    );
}
