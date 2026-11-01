import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES, SOCKET_URLS } from '../../routes';
const Vetor = "/assets/img/Vector.png";
const Relogio = "/assets/img/relogio.png";
const Player = "/assets/img/player.png";
import UnityDealer from './UnityDealer';

const DealerLive = ({ unityRef, setIsUnityReady }: any = {}) => {
  const router = useRouter();
  const videoRef = useRef(null);
  const ws = useRef(null);
  const peerConnectionRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [error, setError] = useState<any>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [stream, setStream] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState("");
  const offerRequested = useRef(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setConnectionStatus("disconnected");
    setError(null);
  }, []);

  const sendWsMessage = (message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  };

  const startStream = async () => {
    try {
      setConnectionStatus("connecting");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Erro ao iniciar vídeo local:", err);
      setError(err.message);
    }
  };

  const createAndSendOffer = async () => {
    if (!stream) return;
    try {
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" }
        ]
      });

      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendWsMessage({ type: "candidate", candidate: event.candidate });
        }
      };

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      sendWsMessage({ type: "offer", offer: peerConnectionRef.current.localDescription });
    } catch (err) {
      console.error("Erro ao criar/sincronizar offer:", err);
      setError(err.message);
    }
  };
  useEffect(() => {
    ws.current = new WebSocket(`${SOCKET_URLS.BASE}/DealerLive`);

    ws.current.onopen = () => {
      setConnectionStatus("connected");
      sendWsMessage({ type: "register", role: "dealer" });
    };
    ws.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "viewer_count") {
          setViewerCount(data.count);
        }

        if (data.type === "request_offer") {
          await createAndSendOffer();
        }

        if (data.type === "answer" && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }

        if (data.type === "candidate" && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
          }
        }
      } catch (err) {
        console.error("Erro ao processar mensagem:", err);
      }
    };

    ws.current.onerror = (err) => {
      console.error("Erro no WebSocket:", err);
      setError("Erro na conexão WebSocket");
      setConnectionStatus("error");
    };

    ws.current.onclose = () => {
      setConnectionStatus("disconnected");
    };
    return () => {
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (ws.current) ws.current.close();
    };
  }, [stream]);

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
        }} onClick={() => router.push(ROUTES.HOME)}>
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
          </p>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", maxHeight: "270px", backgroundColor: "#000" }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "270px", backgroundColor: "#000" }} />
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
          zIndex: 5
        }}>
          {unityRef && setIsUnityReady && (
            <UnityDealer unityRef={unityRef} setIsUnityReady={setIsUnityReady} />
          )}
        </div>
      </div>
      <div style={{ position: "absolute", top: "60px", left: "10px", color: "white", backgroundColor: "rgba(0,0,0,0.7)", padding: "6px", borderRadius: "4px", fontSize: "12px", width: "140px", zIndex: 10 }}>
        <div className="container-fluid" style={{ paddingTop: "8px", width: "128px", height: "40px", background: "#3C0000" }}>
          <h5 className="poppins-regular" style={{ float: "left", fontSize: "14px" }}>Apostas</h5>
        </div>
        <button
          onClick={startStream}
          style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          disabled={connectionStatus === "connecting"}
        >
          {connectionStatus === "error" ? "Tentar Novamente" :
            connectionStatus === "connecting" ? "Conectando..." : "Iniciar Transmissão"}
        </button>
        {error && <div style={{ color: "#ff6b6b", marginTop: "10px" }}>{error}</div>}
      </div>
    </div>
  );
};
export default DealerLive;
