import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Board from "./Board";
import { INIT_GAME } from "../messages";


type Ws = null | WebSocket;

export default function PlayOnline(){
    const [isGameOn, setIsGameOn] = useState(false);
    const [ws, setWs] = useState<Ws>(null)

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000");
        
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: INIT_GAME,
            }))
        }

        setWs(socket);
        return () => {
            socket.close();
        }
    }, [])

    return (
        <>
            <NavBar isGameOn={isGameOn}/>
            <div className="board">
                <Board ws={ws} setIsGameOn={setIsGameOn}/>
            </div>
        </>
    )
}