import { useState, useEffect } from "react";
import Square from "./Square";

type Cell = 1 | 0 | null;
type Board = Cell[][];

type BoardPropsType = {
    ws: WebSocket;
};

export default function Board({ ws }: BoardPropsType) {
    const [board, setBoard] = useState<Board>([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]);

    useEffect(() => {
        if(!ws) return;
    })

    return (
        <div>
            {board.map((row,rowIndex) => 
                <div key={rowIndex}>
                    {row.map((col, colIndex) => {
                        const index = rowIndex * 3 + colIndex;
                        return (
                            <Square 
                                key={index}
                                index={index}
                                value={col}
                                ws={ws}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
