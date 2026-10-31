import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../img/logo.jpg";
import Girar from "../img/Girar.png";
import Circulo from "../img/Circulo fora.png";
import Ponteiro from "../img/ponteiro.png";
import Fixo from "../img/fixo.png";
import Presente from "../img/presente.png";
import spinLoop from "../sounds/judgement-button.wav";
import tick from "../sounds/tick.wav";
import winSmall from "../sounds/win-small.wav";
import winBig from "../sounds/win-big.wav";
import avatar1 from "../img/avatar/avatar1.png";
import avatar2 from "../img/avatar/avatar2.png";
import avatar3 from "../img/avatar/avatar3.png";
import avatar4 from "../img/avatar/avatar4.png";
import avatar5 from "../img/avatar/avatar5.png";
import avatar6 from "../img/avatar/avatar6.png";
import avatar7 from "../img/avatar/avatar7.png";
import avatar8 from "../img/avatar/avatar8.png";
import avatar9 from "../img/avatar/avatar9.png";
import avatar10 from "../img/avatar/avatar10.png";
import avatar11 from "../img/avatar/avatar11.png";
import avatar12 from "../img/avatar/avatar12.png";
import avatar13 from "../img/avatar/avatar13.png";
import avatar14 from "../img/avatar/avatar14.png";
import avatar15 from "../img/avatar/avatar15.png";
import avatar16 from "../img/avatar/avatar16.png";
import avatar17 from "../img/avatar/avatar17.png";
import avatar18 from "../img/avatar/avatar18.png";
import avatar19 from "../img/avatar/avatar19.png";
import avatar20 from "../img/avatar/avatar20.png";
import avatar21 from "../img/avatar/avatar21.png";
import avatar22 from "../img/avatar/avatar22.png";
import avatar23 from "../img/avatar/avatar23.png";
import avatar24 from "../img/avatar/avatar24.png";
import { API_URLS } from "../../routes";
const avatarMap = {
  avatar1, avatar2, avatar3, avatar4, avatar5, avatar6,
  avatar7, avatar8, avatar9, avatar10, avatar11, avatar12,
  avatar13, avatar14, avatar15, avatar16, avatar17, avatar18,
  avatar19, avatar20, avatar21, avatar22, avatar23, avatar24,
};
const SpinResultModal = ({ show, value, onCollect }) => {
  return (
    <>
      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ display: show ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content text-center p-4"
            style={{ height: "559px", background: "#0f1720", borderRadius: 18, color: "#fff" }}
          >
            <div className="mb-0">
              <img src={Presente} alt="Presente" style={{ width: "377px", marginTop: "-20px" }} />
            </div>
            <p className="poppins-extrabold-italic" style={{ marginTop: "-80px ", fontSize: "54px" }}>
              Giro Perfeito
            </p>
            <p className="poppins-extrabold" style={{ marginTop: "-20px ", fontSize: "20px" }}>
              A sorte escolheu voce desta vez.
            </p>
            <div style={{ fontSize: "50px", marginTop: "-10px " }}>{value}</div>
            <p className="poppins-medium" style={{ fontSize: "18px" }}>
              CLIQUE ABAIXO PARA CONTINUAR
            </p>
            <button
              style={{ backgroundColor: "#F70004" }}
              className="btn btn-danger w-100 poppins-extrabold"
              onClick={onCollect}
            >
              Coletar Prêmio
            </button>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show" />}
    </>
  );
};
const WelcomeBonusModal = ({ show, onClose }) => {
  const wheelRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [prizeValue, setPrizeValue] = useState("");
  const [history, setHistory] = useState([]);
  const spinAudioRef = useRef(null);
  const tickAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const [segments, setSegments] = useState([]);
  const [spinConfig, setSpinConfig] = useState([]);
  const [configLoaded, setConfigLoaded] = useState(false);
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_URLS.BASE}/roulettes/spinconfig`, { headers });
        setSegments(res.data.segments || []);
        setSpinConfig(res.data.spinConfig || []);
      } finally {
        setConfigLoaded(true);
      }
    };
    loadConfig();
  }, []);
  const segAngle = segments.length ? 360 / segments.length : 0;
  const fetchHistory = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_URLS.BASE}/roulettes`, { headers });
      const raw = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      const normalized = raw.map((item) => {
        const user = item.user || {};
        return {
          image_profile: item.image_profile || user.image_profile || "",
          name: item.name || user.name || "",
          created_at: item.created_at || item.date || item.createdAt || "",
          reward: item.reward ?? item.value ?? item.prize ?? "",
          avatar_url: item.avatar_url || item.avatarUrl || user.avatar_url || user.avatarUrl || "",
        };
      });
      setHistory(normalized.slice(0, 20));
    } catch {
      setHistory([]);
    }
  };
  useEffect(() => {
    if (show) fetchHistory();
  }, [show]);
  useEffect(() => {
    spinAudioRef.current = new Audio(spinLoop);
    spinAudioRef.current.loop = true;
    spinAudioRef.current.volume = 0.6;
    tickAudioRef.current = new Audio(tick);
    tickAudioRef.current.volume = 0.4;
    winAudioRef.current = new Audio();
    return () => {
      spinAudioRef.current?.pause();
    };
  }, []);
  const findSegmentIndex = (value) =>
    segments.findIndex((seg) => value >= seg.range[0] && value <= seg.range[1]);
  const maskName = (fullName) => {
    if (!fullName) return "***--- ---***";
    const parts = String(fullName).trim().split(/\s+/);
    const first = parts[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1] : "";
    const firstMask = (first.slice(-2) || "").padEnd(2, "-");
    const lastMask = (last.slice(0, 3) || "").padEnd(3, "-");
    return `***${firstMask} ${lastMask}***`;
  };
  const formatDateShort = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${String(
      d.getHours()
    ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  const formatUSD = (val) => {
    const n = Number(val);
    return !isNaN(n) ? `$ ${n.toFixed(2)}` : String(val || "");
  };
  const getCurrentRotation = (el) => {
    if (!el) return 0;
    const st = window.getComputedStyle(el, null);
    const tr = st.getPropertyValue("transform");
    if (!tr || tr === "none") return 0;
    const values = tr.split("(")[1].split(")")[0].split(",");
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    if (angle < 0) angle += 360;
    return angle;
  };
  const norm360 = (deg) => ((deg % 360) + 360) % 360;
  const handleSpin = async () => {
    if (spinning || !segments.length || !spinConfig.length) return;
    setSpinning(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_URLS.BASE}/roulettes/store`, {}, { headers });
      const value = Number(res.data.value);

      let idx = findSegmentIndex(value);
      if (idx < 0) idx = 5;
      const { duration, spins } = spinConfig[idx];
      const centerAngle = idx * segAngle + segAngle / 2;
      const targetAtTop = norm360(360 - centerAngle);
      const current = getCurrentRotation(wheelRef.current);
      const deltaToTarget = norm360(targetAtTop - current);
      const finalRotation = (current + 360 * spins + deltaToTarget);
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.playbackRate = Math.min(2, 6 / duration);
      spinAudioRef.current.play();
      wheelRef.current.style.transition = `transform ${duration}s cubic-bezier(0.12, 0.72, 0.18, 0.99)`;
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
      const tickInterval = setInterval(() => {
        tickAudioRef.current.currentTime = 0;
        tickAudioRef.current.play();
      }, Math.max(90, duration * 120));
      const onDone = () => {
        wheelRef.current?.removeEventListener("transitionend", onDone);
        clearInterval(tickInterval);
        spinAudioRef.current.pause();
        winAudioRef.current.src = idx >= 6 ? winBig : winSmall;
        winAudioRef.current.currentTime = 0;
        winAudioRef.current.play();
        const label = segments[idx]?.label || "";
        const delayAfterStopMs = 650;
        setTimeout(() => {
          setPrizeValue(label);
          setShowResult(true);
          setSpinning(false);
          fetchHistory();
        }, delayAfterStopMs);
      };
      wheelRef.current.addEventListener("transitionend", onDone, { once: true });
    } catch {
      spinAudioRef.current?.pause();
      setSpinning(false);
    }
  };
  const handleCollectPrize = () => {
    setShowResult(false);
    onClose();
  };
  if (!show && !showResult) return null;
  return (
    <>
      <style>
        {`
          .history-scroll::-webkit-scrollbar { width: 8px; }
          .history-scroll::-webkit-scrollbar-thumb { background: #F70004; border-radius: 8px; }
        `}
      </style>
      <div
        className={`modal fade ${show && !showResult ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ display: show && !showResult ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              background: "linear-gradient(180deg, #080A10 0%, #840708 100%)",
              borderRadius: 18,
              width: 684,
              maxWidth: "100%",
              color: "#fff",
            }}
          >
            <div className="modal-header border-0">
              <img src={Logo} alt="Logo" style={{ height: 32 }} />
              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>
            <p style={{ fontSize: "20px" }} className="poppins-semibold text-center">
              Bônus de Boas-Vindas!
            </p>
            <p style={{ fontSize: "16px" }} className="poppins-regular text-center sans">
              Gire a roleta e ganhe prêmios incríveis!
            </p>
            <div className="modal-body text-center">
              <div style={{ position: "relative", width: "100%", marginLeft: "auto", marginRight: "auto", marginTop: -60 }}>
                <img
                  ref={wheelRef}
                  src={Circulo}
                  alt="Roleta"
                  style={{
                    width: "100%",
                    display: "block",
                    userSelect: "none",
                    transformOrigin: "50% 50%",
                  }}
                />
                <div
                  onClick={handleSpin}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 100,
                    height: 100,
                    cursor: spinning || !segments.length || !spinConfig.length ? "not-allowed" : "pointer",
                    zIndex: 10,
                  }}
                >
                  {/* <img
                    src={Fixo}
                    alt="Fixo"
                    className="d-block d-md-none"
                    style={{
                      position: "absolute",
                      top: "-48px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80px",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  /> */}

                  {/* <img
                    src={Ponteiro}
                    alt="Ponteiro"
                    style={{
                      position: "absolute",
                      top: "-5px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "21px",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  /> */}
                  <img
                    src={Girar}
                    alt="Girar"
                    style={{
                      width: "100%",
                      display: "block",
                      position: "relative",
                      zIndex: 3,
                      filter: spinning ? "grayscale(100%) brightness(60%)" : "none",
                    }}
                  />
                </div>
              </div>
              <div
                className="history-scroll"
                style={{
                  background: "#080A10",
                  borderRadius: 22,
                  padding: 12,
                  marginTop: -40,
                  maxHeight: 300,
                  overflowY: "auto",
                  border: "1px solid #121820",
                }}
              >
                {history.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#0F1923" : "transparent",
                      borderRadius: 14,
                      padding: 12,
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      color: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div>
                      <img
                        src={avatarMap[`avatar${item.image_profile}`] || avatar1}
                        alt="Avatar"
                        style={{ width: 32, height: 32, borderRadius: "50%" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="text-start" style={{ fontSize: 13, fontWeight: 800 }}>
                        {maskName(item.name)}
                      </div>
                      <div className="text-start" style={{ fontSize: 11, color: "#b8babd" }}>
                        {formatDateShort(item.created_at)}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 900 }}>{formatUSD(item.reward)}</div>
                  </div>
                ))}
              </div>
              {configLoaded && (!segments.length || !spinConfig.length) && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#b8babd" }}>
                  Não foi possível carregar a configuração da roleta.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <SpinResultModal show={showResult} value={prizeValue} onCollect={handleCollectPrize} />
      {show && !showResult && <div className="modal-backdrop fade show" />}
    </>
  );
};
export default WelcomeBonusModal;
