import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Vetor from "../img/Vector.png";
import VetorFullscreen from "../img/VectorFullscreen.png";
import Relogio from "../img/relogio.png";
import Player from "../img/player.png";
import Winner from "../img/winner.png";
import Looser from "../img/try.png";
import Message from "../img/message.png";
import { useNavigate } from 'react-router-dom';
import { ROUTES, API_URLS, SOCKET_URLS } from '../../routes';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const UserLive = ({ onOpenChat }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const ws = useRef(null);
  const peerConnectionRef = useRef(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWinner, setIsWinner] = useState(null);
  const [value, setValue] = useState(null);
  const pendingCandidates = useRef([]);
  const remoteDescriptionSet = useRef(false);
  const totalSeconds = 1 * 30;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [bets, setBets] = useState([]);
  const [showBetValues, setShowBetValues] = useState(false);
  const [showBetList, setShowBetList] = useState(window.innerWidth > 768);
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get(`${API_URLS.BASE}/bets/list/4`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        setBets(data.user_bets || []);
      } catch (error) {
        console.error("Erro ao buscar apostas:", error);
        setBets([]);
      }
    };
    fetchBets();
    const intervalId = setInterval(fetchBets, 10000);
    return () => clearInterval(intervalId);
  }, [token]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowBetList(true);
      } else {
        setShowBetList(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    window.startGame = (start) => {
      if (start === true) {

      }
    };
    return () => delete window.startGame;
  }, []);

  useEffect(() => {
    window.cronus = (time) => {
      setSecondsLeft(time);
      setIsCountdownRunning(true);
    };
  }, []);
  useEffect(() => {
    if (!isCountdownRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCountdownRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCountdownRunning]);
  const formatTime = (secs) => {
    const min = Math.floor(secs / 60).toString().padStart(2, '0');
    const sec = (secs % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
      ]
    });
    pc.onicecandidate = (event) => {
      if (event.candidate && ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };
    pc.ontrack = (event) => {
      if (event.streams && event.streams.length > 0 && videoRef.current) {
        const stream = event.streams[0];
        videoRef.current.srcObject = stream;
        videoRef.current.play()
          .then(() => setConnectionStatus("playing"))
          .catch(err => {
            console.error("Erro ao reproduzir vídeo:", err);
            setError("Erro ao reproduzir vídeo");
            setConnectionStatus("error");
          });
      }
    };
    peerConnectionRef.current = pc;
  };

  useEffect(() => {
    ws.current = new WebSocket(SOCKET_URLS.USER_LIVE);
    ws.current.onopen = () => {
      setConnectionStatus("connected");
      ws.current.send(JSON.stringify({ type: "register", role: "user" }));
      ws.current.send(JSON.stringify({ type: "request_offer" }));
    };
    ws.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "viewer_count") {
          setViewerCount(data.count);
        }
        if (data.type === "offer") {
          initializePeerConnection();
          const pc = peerConnectionRef.current;
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          remoteDescriptionSet.current = true;
          for (const candidate of pendingCandidates.current) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.error("Erro ao adicionar candidato ICE pendente:", e);
            }
          }
          pendingCandidates.current = [];
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          ws.current.send(JSON.stringify({ type: "answer", answer: pc.localDescription }));
        }
        if (data.type === "candidate") {
          const pc = peerConnectionRef.current;
          if (pc && pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          } else {
            pendingCandidates.current.push(data.candidate);
          }
        }
      } catch (err) {
        console.error("Erro ao processar mensagem:", err);
        setError("Erro na transmissão");
        setConnectionStatus("error");
      }
    };
    ws.current.onerror = (err) => {
      console.error("Erro no WebSocket:", err);
      setError("Erro na conexão");
      setConnectionStatus("error");
    };
    ws.current.onclose = () => {
      setConnectionStatus("disconnected");
    };

    return () => {
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (ws.current) ws.current.close();
      if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    };
  }, []);
  window.sendGameResult = (result, value) => {
    setIsWinner(result === true);
    setValue(value || null);
    setTimeout(() => {
      setIsWinner(null);
      setValue(null);
    }, 5000);
  };
  return (
    <div style={{ maxWidth: "1380px", margin: "0 auto", position: "relative" }}>
      <div style={{
        width: "100%",
        height: "50px",
        background: "#0F1923",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: window.innerWidth <= 768 ? "0 10px" : "0 20px"
      }}>
        <p className="text-white poppins-regular" style={{
          marginTop: "14px",
          fontSize: window.innerWidth <= 768 ? "16px" : "20px",
          cursor: "pointer"
        }} onClick={() => navigate(ROUTES.HOME)}>
          <img style={{
            marginRight: window.innerWidth <= 768 ? "5px" : "10px",
            width: window.innerWidth <= 768 ? "16px" : "auto"
          }} src={Vetor} alt="" />
          {window.innerWidth <= 768 ? "S04" : "Sala 04"}
        </p>
        <div style={{
          background: "#080A10B2",
          height: window.innerWidth <= 768 ? "35px" : "40px",
          borderRadius: "12px",
          padding: window.innerWidth <= 768 ? "3px 6px" : "5px 10px",
          display: "flex",
          alignItems: "center"
        }}>
          <p className="text-white" style={{
            fontSize: window.innerWidth <= 768 ? "14px" : "20px",
            display: "flex",
            alignItems: "center"
          }}>
            <img style={{
              marginTop: window.innerWidth <= 768 ? "10px" : "14px",
              marginRight: window.innerWidth <= 768 ? "5px" : "10px",
              width: window.innerWidth <= 768 ? "14px" : "auto"
            }} src={Relogio} alt="" />
            <div style={{
              marginTop: window.innerWidth <= 768 ? "8px" : "10px",
              marginRight: window.innerWidth <= 768 ? "5px" : "10px"
            }}>{currentTime}</div>
            <img style={{
              marginTop: window.innerWidth <= 768 ? "10px" : "14px",
              marginRight: window.innerWidth <= 768 ? "5px" : "10px",
              marginLeft: window.innerWidth <= 768 ? "5px" : "10px",
              width: window.innerWidth <= 768 ? "14px" : "auto"
            }} src={Player} alt="" />
            <div style={{
              marginTop: window.innerWidth <= 768 ? "8px" : "10px",
              marginRight: window.innerWidth <= 768 ? "5px" : "10px"
            }}>{viewerCount}</div>
            <img
              onClick={() => onOpenChat && onOpenChat()}
              className="d-lg-none"
              style={{
                marginTop: "8px",
                marginRight: "5px",
                marginLeft: "5px",
                cursor: "pointer",
                width: "16px"
              }}
              src={Message}
              alt="Abrir Chat"
            />
          </p>
        </div>
      </div>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", maxHeight: "270px", backgroundColor: "#000" }} />
      {isWinner !== null && (
        <div style={{ fontSize: "25px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "486px", padding: "20px", backgroundColor: "transparent", textAlign: "center", borderRadius: "8px", zIndex: 10 }}>
          {isWinner ? (
            <>
              <img src={Winner} alt="Você ganhou!" style={{ width: "486px", marginBottom: "-80px" }} />
              {value !== null && <p style={{ fontSize: "25px", marginTop: "-5px", paddingLeft: "30px", color: "#FFCA61" }}>R$ {parseFloat(value * 2).toFixed(2)}</p>}
            </>
          ) : (
            <p style={{ fontSize: "25px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", padding: "20px", backgroundColor: "#252219", color: "#FFCA61", textAlign: "center", borderRadius: "8px", zIndex: 10 }}>
              <img src={Looser} alt="Tente novamente" style={{ maxWidth: "200px", marginBottom: "10px" }} />
              Tente novamente
            </p>
          )}
        </div>
      )}

      {isCountdownRunning && (
        <div style={{ position: "absolute", top: "65%", left: "50%", transform: "translate(-50%, -50%)", width: 120 }}>
          <CircularProgressbarWithChildren value={(secondsLeft / totalSeconds) * 100} styles={buildStyles({ pathColor: secondsLeft <= 17 ? 'red' : 'lime', trailColor: '#444' })}>
            <div style={{ backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "23px", padding: "8px 14px", fontSize: 18, color: "#fff" }}>{formatTime(secondsLeft)}</div>
          </CircularProgressbarWithChildren>
        </div>
      )}
      {connectionStatus !== "playing" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", backgroundColor: "rgba(0,0,0,0.7)", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          {connectionStatus === "error" ? (
            <>
              <div style={{ color: "#ff6b6b", marginBottom: "10px" }}>{error || "Erro na conexão"}</div>
              <button onClick={() => window.location.reload()} style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Tentar Novamente</button>
            </>
          ) : (
            <div>{connectionStatus === "connecting" ? "Conectando ao servidor..." : connectionStatus === "connected" ? "Aguardando transmissão..." : "Carregando..."}</div>
          )}
        </div>
      )}
      {window.innerWidth <= 768 && !showBetList && (
        <button
          onClick={() => setShowBetList(true)}
          style={{
            position: "absolute",
            top: "60px",
            left: "10px",
            background: "#3C0000",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            fontSize: "12px",
            cursor: "pointer",
            zIndex: 10
          }}
        >
          Mostrar Apostas
        </button>
      )}
      {(window.innerWidth > 768 || showBetList) && (
        <div style={{
          width: window.innerWidth > 768 ? "200px" : "120px",
          position: "absolute",
          top: "60px",
          left: "10px",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "6px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 10
        }}>
          <div className="container-fluid" style={{
            paddingTop: "8px",
            width: window.innerWidth > 768 ? "200px" : "108px",
            height: "40px",
            background: "#3C0000",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h5 className="poppins-regular" style={{ fontSize: "14px", margin: 0 }}>Apostas</h5>
            {window.innerWidth <= 768 && (
              <button
                onClick={() => setShowBetList(false)}
                style={{
                  background: "transparent",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: "1"
                }}
              >
                ×
              </button>
            )}
          </div>
          <div className="container mb-3 overflow-y-auto"
            style={{ width: window.innerWidth > 768 ? "200px" : "108px", maxHeight: window.innerWidth > 768 ? "200px" : "120px", overflowY: "scroll" }}>
            {bets.map((bet, index) => (
              <p key={index} className="text-start" style={{ fontSize: "11px", margin: "2px 0", cursor: "pointer" }}
                onClick={() => setShowBetValues(!showBetValues)}>
                {bet.user_name ? bet.user_name : `User id ${bet.user_id}`}
                {showBetValues ? ` R$${parseFloat(bet.bet_value).toFixed(2)}` : '***'}
              </p>
            ))}
          </div>
        </div>
      )}
      <div>
        <img onClick={() => {
          setIsFullscreen(prev => !prev);
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }} style={{ marginLeft: "97%", top: "-40px", position: "relative", cursor: "pointer" }} src={VetorFullscreen} alt="" />
      </div>
    </div>
  );
};
export default UserLive;
