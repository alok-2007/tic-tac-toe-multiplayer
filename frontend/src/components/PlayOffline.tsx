import NavBar from "./NavBar";
import { useState, useEffect } from "react";

export default function PlayOffline() {
    const [isGameOn, setIsGameOn] = useState(false);

    return (
        <div>
            <NavBar isGameOn={isGameOn}/>
        </div>
    )
}