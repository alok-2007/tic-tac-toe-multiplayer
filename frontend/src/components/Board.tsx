import { useState, useEffect, useRef } from "react";
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
    const [p1Or2, setP1Or2] = useState<null | "p1" | "p2">(null);
    const p10r2Ref = useRef<"p1" | "p2" | null>(null);
    const [gameResult, setGameResult] = useState<"p1"|"p2"|"draw"|null>(null)

    useEffect(() => {
        if(!ws) return;

        ws.onmessage = (event: MessageEvent) => {
            const payload = JSON.parse(event.data);
            const type = payload.type;

            if (type === INITIAL_CALL) {
                const { gameCount,totalMove, p1OrP2 } = payload;
                setGameCount(gameCount);
                setMoveCount(totalMove);
                console.log("from initial call p1OrP2",p1OrP2)
                setP1Or2(p1OrP2)
                p10r2Ref.current = p1OrP2;
                setGameStatus("Game On");
                return
            } else if (type === MOVE_ACK) {
                const { gameState, totalMove } =  payload;
                setMoveCount(totalMove);
                setBoard(() => {
                    const next:Cell[][] = [
                        [null, null, null],
                        [null, null, null],
                        [null, null, null]
                    ];

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
                    console.log("winner",winner)
                    console.log("p1Or2",p1Or2)
                    if (winner === p10r2Ref.current) {
                        setGameStatus("You Won");
                        setGameResult(winner);
                    } else {
                        setGameStatus("You Lose");
                        setGameResult(winner);
                    }
                } else if (resultType === "draw") {
                    setGameStatus("Draw");
                    setGameResult("draw");
                } else {
                    setGameStatus("Error")
                }
                setBoard(() => {
                    const next:Cell[][] = [
                        [null, null, null],
                        [null, null, null],
                        [null, null, null]
                    ];

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

    console.log("p1Or2",p1Or2)

    useEffect(() => {
        if (gameCount === null || moveCount === null) return;

        const temSum = gameCount + moveCount;

        if (p1Or2 === "p1" && temSum % 2 !== 0) {
            setPointer(true);
        } else if (p1Or2 === "p2" && temSum % 2 === 0) {
            setPointer(true)
        } else {
            setPointer(false);
        }

    }, [gameCount, moveCount, p1Or2])

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

    console.log("movecount",moveCount)
    console.log("gameCount",gameCount)

    return (
        <>
            <div className="game-status">
                <div>{gameStatus}</div>
            </div>
            <div className="players">
                <div className="player1">
                    <div className="pointer1">{gameResult === "p1" ? (
                        <span>🏆</span>
                    ): gameResult === "p2" ? (
                        <span>🤕</span>
                    ): gameResult === "draw" ? (
                        <span>🤝</span>
                    ): pointer && (
                        <span>➡️</span>
                    )}</div>
                    <div className="name1">{`You (${p1Or2 === "p1" ? "O" : "X"})`}</div>
                </div>
                <div className="divider"></div>
                <div className="player2">
                    <div className="pointer1">{gameResult === "p2" ? (
                        <span>🏆</span>
                    ): gameResult === "p1"  ? (
                        <span>🤕</span>
                    ): gameResult === "draw" ? (
                        <span>🤝</span>
                    ): !pointer && (
                        <span>➡️</span>
                    )}</div>
                    <div className="name1">{`Opponent (${p1Or2 === "p2" ? "O" : "X"})`}</div>
                </div>
            </div>
            <div className="main-board">
                {board.map((row,rowIndex) => 
                    <div className={`row-${rowIndex}`} key={rowIndex}>
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
        </>
    );
}
