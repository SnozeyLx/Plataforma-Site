import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, API_URLS } from "../routes";
import Vetor from "../assets/img/Vector.png";
import NavInfo from "../assets/components/NavInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "animate.css";
import Aba from "../assets/img/caneta_avatar.png";
import Avatar from "../assets/img/avatar.png";
import Avatar1 from "../assets/img/avatar/avatar1.png";
import Avatar2 from "../assets/img/avatar/avatar2.png";
import Avatar3 from "../assets/img/avatar/avatar3.png";
import Avatar4 from "../assets/img/avatar/avatar4.png";
import Avatar5 from "../assets/img/avatar/avatar5.png";
import Avatar6 from "../assets/img/avatar/avatar6.png";
import Avatar7 from "../assets/img/avatar/avatar7.png";
import Avatar8 from "../assets/img/avatar/avatar8.png";
import Avatar9 from "../assets/img/avatar/avatar9.png";
import Avatar10 from "../assets/img/avatar/avatar10.png";
import Avatar11 from "../assets/img/avatar/avatar11.png";
import Avatar12 from "../assets/img/avatar/avatar12.png";
import Avatar13 from "../assets/img/avatar/avatar13.png";
import Avatar14 from "../assets/img/avatar/avatar14.png";
import Avatar15 from "../assets/img/avatar/avatar15.png";
import Avatar16 from "../assets/img/avatar/avatar16.png";
import Avatar17 from "../assets/img/avatar/avatar17.png";
import Avatar18 from "../assets/img/avatar/avatar18.png";
import Avatar19 from "../assets/img/avatar/avatar19.png";
import Avatar20 from "../assets/img/avatar/avatar20.png";
import Avatar21 from "../assets/img/avatar/avatar21.png";
import Avatar22 from "../assets/img/avatar/avatar22.png";
import Avatar23 from "../assets/img/avatar/avatar23.png";
import Avatar24 from "../assets/img/avatar/avatar24.png";
const vipDataFallback = {
  level: 0,
  xpCurrent: 0,
  xpTotal: 3000,
  wins: 0,
  winRate: 0,
  totalProfit: 0,
  daysPlaying: 0,
  trophiesUnlocked: 0,
  trophiesTotal: 11,
  achievements: [],
};

const moneyBR = (v) =>
  Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const calcVipLevelProgress = (totalPoints) => {
  const points = Math.max(0, Number(totalPoints || 0));
  let level = 0;
  let threshold = 500;
  while (points >= threshold) {
    level += 1;
    threshold = threshold * 2;
  }
  return {
    level,
    xpCurrent: points,
    xpTotal: threshold,
  };
};
const FakeIcon = ({ label = "•" }) => (
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: "#FFFFFF1A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      color: "#fff",
    }}
  >
    {label}
  </div>
);
const StatCard = ({ iconLabel, title, value }) => (
  <div
    className="p-2"
    style={{
      backgroundColor: "#0F1923",
      borderRadius: 12,
      minHeight: 134,
      boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      minWidth: 265,
    }}
  >
    <div className="d-flex align-items-center gap-2 mb-1">
      <FakeIcon label={iconLabel} />
      <span style={{ fontSize: 10, lineHeight: "12px", color: "#B9C2CF" }}>
        {title}
      </span>
    </div>
    <div style={{ fontSize: 14, fontWeight: 700 }}>{value}</div>
  </div>
);
const AchievementCard = ({ a }) => {
  const locked = !a.unlocked;
  return (
    <div
      className="p-3"
      style={{
        borderRadius: 12,
        backgroundColor: locked
          ? "#0F1923"
          : a.id === "primeira_rodada"
            ? "#3B82F6"
            : "#22C55E",
        opacity: locked ? 0.55 : 1,
        position: "relative",
        height: "152px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      }}
    >
      {a.unlocked && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 20,
            height: 20,
            borderRadius: 999,
            backgroundColor: "#FACC15",
            color: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 900,
          }}
          title="Concluído"
        >
          ✓
        </div>
      )}

      <div className="d-flex flex-column align-items-center text-center">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 26 }}>{a.icon ?? "★"}</span>
        </div>

        <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
          {a.title}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
          {a.desc}
        </div>
      </div>
      {a.progress < 100 && (
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              backgroundColor: "#364153",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 6,
                width: `${a.progress}%`,
                backgroundColor: "#6A7282",
              }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#E9EEF7" }}>
            {a.progress}%
          </div>
        </div>
      )}
    </div>
  );
};
const Vip = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [vipDashboard, setVipDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgProfile, setImgProflie] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const token = useMemo(() => localStorage.getItem("authToken"), []);
  const avatares = useMemo(
    () => [
      Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6,
      Avatar7, Avatar8, Avatar9, Avatar10, Avatar11, Avatar12,
      Avatar13, Avatar14, Avatar15, Avatar16, Avatar17, Avatar18,
      Avatar19, Avatar20, Avatar21, Avatar22, Avatar23, Avatar24,
    ],
    []
  );
  const getImageSrc = () => {
    if (Number.isInteger(selectedAvatar) && selectedAvatar >= 1 && selectedAvatar <= avatares.length) {
      return avatares[selectedAvatar - 1];
    }
    if (imgProfile && String(imgProfile).trim() !== "" && !isNaN(imgProfile)) {
      const n = Number(imgProfile);
      if (Number.isFinite(n) && n >= 1 && n <= avatares.length) {
        return avatares[n - 1];
      }
    }

    return Avatar;
  };
  const openModalAvatar = () => {
    console.log("Abrir modal de avatar (VIP)");
  };
  const fetchUserProfile = async () => {
    if (!token) return null;
    const response = await axios.get(`${API_URLS.BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data?.profile) {
      const p = response.data.profile;
      setProfile(p);
      const { name, id, image_profile } = p;
      setImgProflie(image_profile || "");
      if (image_profile && !isNaN(image_profile)) {
        const n = Number(image_profile);
        if (Number.isFinite(n) && n >= 1 && n <= avatares.length) {
          setSelectedAvatar(n);
        }
      }
      localStorage.setItem("userName", name);
      localStorage.setItem("UserId", String(id));
      localStorage.setItem("userImageProfile", image_profile || "0");
      return p;
    }
    return null;
  };
  useEffect(() => {
    (async () => {
      try {
        await fetchUserProfile();
        await fetchVipDashboard();
      } catch (err) {
        console.error("Erro ao buscar dados VIP:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const fetchVipDashboard = async () => {
    if (!token) return null;
    const response = await axios.get(`${API_URLS.BASE}/vip`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data?.success) {
      setVipDashboard(response.data);
      return response.data;
    }
    return null;
  };
  const vipFromApi = useMemo(() => {
    const src = vipDashboard;
    if (!src?.success) return vipDataFallback;
    const totalPoints = Number(src.xp?.current ?? 0);
    const vipCalc = calcVipLevelProgress(totalPoints);
    return {
      level: vipCalc.level,
      xpCurrent: vipCalc.xpCurrent,
      xpTotal: vipCalc.xpTotal,
      wins: src.stats?.wins ?? 0,
      winRate: src.stats?.winRate ?? 0,
      totalProfit: src.stats?.totalProfit ?? 0,
      daysPlaying: src.stats?.daysPlaying ?? 0,
      trophiesUnlocked: src.trophies?.unlocked ?? 0,
      trophiesTotal: src.trophies?.total ?? 0,
      achievements: Array.isArray(src.achievements) ? src.achievements : [],
    };
  }, [vipDashboard]);
  const xpPercent = useMemo(() => {
    const total = Number(vipFromApi.xpTotal || 0);
    const cur = Number(vipFromApi.xpCurrent || 0);
    if (total <= 0) return 0;
    return Math.min(100, Math.round((cur / total) * 100));
  }, [vipFromApi.xpCurrent, vipFromApi.xpTotal]);
  const trophiesPercent = useMemo(() => {
    const total = Number(vipFromApi.trophiesTotal || 0);
    const cur = Number(vipFromApi.trophiesUnlocked || 0);
    if (total <= 0) return 0;
    return Math.min(100, Math.round((cur / total) * 100));
  }, [vipFromApi.trophiesUnlocked, vipFromApi.trophiesTotal]);
  return (
    <div>
      <NavInfo />
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 ">
            <div className="row">
              <div className="col-12">
                <div
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#1A242D",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    height: "40px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                  }}
                  className="mt-3 d-flex justify-content-between align-items-center"
                >
                  <p
                    className="text-white fs-5 m-0 d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(ROUTES.HOME)}
                  >
                    <img src={Vetor} alt="Voltar" className="poppins-semibold me-2" />
                    Clube VIP
                  </p>
                </div>
              </div>
            </div>
            <div className="row mb-3 g-3 mt-1">
              <div className="col-12 col-lg-2">
                <div
                  className="p-3 d-none d-md-block"
                  style={{
                    backgroundColor: "#1A242D",
                    borderRadius: "10px",
                    height: "136px",
                  }}
                >
                  <div className="d-flex flex-column gap-2 flex-wrap" style={{ marginLeft: "9px" }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="rounded-circle d-inline-flex justify-content-center align-items-center position-relative"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <img
                          className="img-fluid rounded-circle"
                          src={getImageSrc()}
                          alt="Avatar"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={openModalAvatar}
                        />
                        <img
                          src={Aba}
                          alt="Editar avatar"
                          className="img-fluid"
                          style={{
                            position: "absolute",
                            marginBottom: "90px",
                            marginTop: "34px",
                            right: "0",
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                          onClick={openModalAvatar}
                        />
                      </div>
                      <p
                        className="text-white poppins-regular border-bottom border-danger"
                        style={{
                          cursor: "pointer",
                          width: "fit-content",
                          borderWidth: "2px",
                          fontSize: "16px",
                          marginBottom: 0,
                        }}
                      >
                        {loading ? "Carregando..." : `Nível ${vipFromApi.level}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-10">
                <div
                  className="p-3 text-white"
                  style={{
                    backgroundColor: "#1A242D",
                    borderRadius: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "20px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Progresso de xp</div>
                    <div style={{ fontSize: 12, color: "#B9C2CF" }}>{xpPercent}%</div>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      height: 10,
                      borderRadius: 999,
                      background: "#FFFFFF1A",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: 10,
                        width: `${xpPercent}%`,
                        background: "#F70004",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div
                    className="d-flex justify-content-between mt-2"
                    style={{ fontSize: 11, color: "#B9C2CF" }}
                  >
                    <span>{vipFromApi.xpCurrent} XP</span>
                    <span>{vipFromApi.xpTotal} XP</span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(86px, 1fr))",
                      gap: 10,
                      marginTop: 12,
                      overflowX: "auto",
                      paddingBottom: 6,
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <StatCard iconLabel="🏆" title="Vitórias" value={vipFromApi.wins} />
                    <StatCard iconLabel="📅" title="Dias Jogando" value={vipFromApi.daysPlaying} />
                  </div>
                  <div className="d-flex justify-content-between align-items-end mt-4">
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>Troféus e conquistas</div>
                      <div style={{ fontSize: 12, color: "#B9C2CF" }}>
                        {vipFromApi.trophiesUnlocked} de {vipFromApi.trophiesTotal} desbloqueadas
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{trophiesPercent}%</div>
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      position: "relative",
                      height: 8,
                      borderRadius: 999,
                      background: "#FFFFFF1A",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: 8,
                        width: `${trophiesPercent}%`,
                        background: "#F70004",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div className="row g-3 mt-3">
                    {vipFromApi.achievements.map((a) => (
                      <div key={a.id} className="col-12 col-md-3">
                        <AchievementCard a={a} />
                      </div>
                    ))}
                  </div>
                  {!loading && !vipDashboard?.success && (
                    <div className="mt-3" style={{ fontSize: 12, color: "#B9C2CF" }}>
                      Não foi possível carregar os dados do VIP. Mostrando valores padrão.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Vip;