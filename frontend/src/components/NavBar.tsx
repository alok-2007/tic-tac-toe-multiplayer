import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

type NavBarPropType = {
    isGameOn: boolean;
}

export default function NavBar({isGameOn}: NavBarPropType) {
    const navigate = useNavigate();
    const location = useLocation();
    const [conf, setConf] = useState(false);
    const [action, setAction] = useState<"online" | "offline" | "room" | null>(null);
    const pathname = location.pathname.slice(1,);

    console.log(pathname);

    function handleNavClick(type:"online" | "offline" | "room") {
        if (isGameOn) {
            setAction(type);
            setConf(true);
            return
        }
        switch (type) {
            case "online":
                navigate("/play-online", { replace: true });
                break;
            case "offline":
                navigate("/play-offline", { replace: true });
                break;
            case "room":
                navigate("/play-room", { replace: true });
                break;
        }       
    }

    return (
        <>
            <div className="flex mx-auto gap-4 mb-4">
                <button className={`cursor-pointer border rounded py-1 px-3 ${pathname === "play-online" ? "bg-red-900 text-white":"bg-yellow-400 text-black"}` } onClick={() => handleNavClick("online")}>Play Online</button>
                <button className={`cursor-pointer border rounded py-1 px-3 ${pathname === "play-offline" ? "bg-red-900 text-white":"bg-yellow-400 text-black"}` } onClick={() => handleNavClick("offline")}>Play Offline</button>
                <button className={`cursor-pointer border rounded py-1 px-3 ${pathname === "play-room" ? "bg-red-900 text-white":"bg-yellow-400 text-black"}` } onClick={() => handleNavClick("room")}>Play Room</button>
            </div>
            {conf && (
                <div>
                    <div>
                        <p>Game is on!</p>
                        <p>Are you sure to quit?</p>
                        <div>
                            <button onClick={() => {
                                setConf(false);
                                setAction(null);
                            }}>No</button>
                            <button onClick={() => {
                                navigate(`/play-${action}`,{replace: true});
                            }}>Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}