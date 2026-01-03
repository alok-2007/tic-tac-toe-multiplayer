import { useState, useEffect } from "react";
import NavBar from "./NavBar";

export default function PlayRoom(){
    const [isGameOn, setIsGameOn] = useState(false);


    return (
        <div>
            <NavBar isGameOn={isGameOn} />
            <div>playRoom</div>
        </div>
    )
}