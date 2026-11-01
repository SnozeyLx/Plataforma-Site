import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Vetor from "../img/Vector.png";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../../routes";
import "react-circular-progressbar/dist/styles.css";
const UserLive = ({ onOpenChat }) => {
  const navigate = useNavigate();
  // const videoRef = useRef(null);
  // const ws = useRef(null);
  // const peerConnectionRef = useRef(null);
  // const [viewerCount, setViewerCount] = useState(0);
  // const [currentTime, setCurrentTime] = useState("");
  // const [connectionStatus, setConnectionStatus] = useState("connecting");
  // const [error, setError] = useState(null);
  // const [isWinner, setIsWinner] = useState(null);
  // const [value, setValue] = useState(null);
  // const pendingCandidates = useRef([]);
  // const remoteDescriptionSet = useRef(false);
  const [bets, setBets] = useState([]);
  const [token] = useState(localStorage.getItem("authToken") || "");
  const [UserId] = useState(localStorage.getItem("UserId") || "");
  const [roomId] = useState(localStorage.getItem("roomId") || "");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // const TEN_MINUTES = 10 * 60 * 1000;
  const lastActivityAtRef = useRef(Date.now());
  const lastUserBetCountRef = useRef(0);
  /* useEffect(() => {
    
    const fetchBets = async () => {
      try {
        const response = await axios.get(
          `${API_URLS.BASE}/bets/list/${roomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        setBets(data.user_bets || []);
      } catch (error) {
        setBets([]);
        console.log(setBets);
      }
    };
    fetchBets();
    const intervalId = setInterval(fetchBets, 2000);
    return () => clearInterval(intervalId);
  }, [token, roomId]); */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!UserId) return;

    const userBets = (bets || []).filter(
      (b) => String(b.user_id) === String(UserId)
    );
    const currentCount = userBets.length;
    if (currentCount > lastUserBetCountRef.current) {
      lastUserBetCountRef.current = currentCount;
      lastActivityAtRef.current = Date.now();
    }
  }, [bets, UserId]);

  // useEffect(() => {
  //   if (!UserId) return;

  //   const checkInactivity = () => {
  //     const now = Date.now();
  //     const diff = now - lastActivityAtRef.current;

  //     if (diff >= TEN_MINUTES) {
  //       navigate("/home");
  //     }
  //   };
  //   const intervalId = setInterval(checkInactivity, TEN_MINUTES);
  //   return () => clearInterval(intervalId);
  // }, [UserId, navigate]);


  const src = `https://ronda-2ha8xj.greenstudios.com.br/
              ?casinoSessionId=${token}
              &casinoPlayerId=${UserId}
              &gameMode=REAL
              &country=BR
              &currency=BRL
              &lobbyUrl=http%3A%2F%2Flobby.betapp.net%2Fslots
              &depositUrl=http%3A%2F%2Fpay.betapp.net%2Fcompra-credito
              &locale=pt-BR`.replace(/\s+/g, "");

const iframeStyle = isMobile
    ? {
        marginTop: "0px",
        height: "90vh",
        width: "100%",
        backgroundColor: "#000",
        borderRadius: "0px",
      }
    : {
        marginTop: "8px",
        height: "99%", // desktop com respiro
        width: "100%",
       // maxWidth: "100%",          // opcional: limita largura no desktop
        backgroundColor: "#000",
        borderRadius: "12px",        // desktop com borda arredondada
      };
  return (

        <iframe
          className="d-flex flex-grow-1 shadow-lg"
          style={iframeStyle}
          id={isMobile ? "iframeRondaMobile" : "iframeRondaDesktop"}
          src={src}
          referrerPolicy="no-referrer-when-downgrade"
          title="Ronda"
        />
        );

};
export default UserLive;