import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div>
            <div onClick={() => navigate("/play-online")}>Play Online</div>
            <div onClick={() => navigate("/play-room")}>Play Room</div>
            <div onClick={() => navigate("/play-offline")}>Play Offline</div>
        </div>
    )
}