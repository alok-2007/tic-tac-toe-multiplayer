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

    }, [])

    if (!ws) {
        return (
            <div>loading...</div>
        )
    }

    return (
        <div>
            <NavBar isGameOn={isGameOn} />
            <div>
                <div>
                    <Board ws={ws} />
                </div>
            </div>
        </div>
    )
}