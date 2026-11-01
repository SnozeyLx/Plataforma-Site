import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
//import { io } from "socket.io-client";
import { getSocket } from "../SocketNew";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES, API_URLS } from '../routes';
import 'animate.css';
import '../Homepage.css';

import NavInfo from "../assets/components/NavInfo";
const ClipPath = "clippath" as any;

const side1 = "/assets/img/side1.png";
const side2 = "/assets/img/side2.png";
const side3 = "/assets/img/side3.png";
const side4 = "/assets/img/side4.png";

const mobile1 = "/assets/img/sidemobile1.png";
const mobile2 = "/assets/img/sidemobile2.png";
const mobile3 = "/assets/img/sidemobile3.png";
const mobile4 = "/assets/img/sidemobile4.png";
const Online = "/assets/img/image1.png";
const Live = "/assets/img/image2.png";
const OnGame = "/assets/img/onGame.png";
const OffGame = "/assets/img/offGame.png";
const IconRoulette = "/assets/img/iconRoulette.png";
const avatar1 = "/assets/img/avatar/avatar1.png";
const avatar2 = "/assets/img/avatar/avatar2.png";
const avatar3 = "/assets/img/avatar/avatar3.png";
const avatar4 = "/assets/img/avatar/avatar4.png";
const avatar5 = "/assets/img/avatar/avatar5.png";
const avatar6 = "/assets/img/avatar/avatar6.png";
const avatar7 = "/assets/img/avatar/avatar7.png";
const avatar8 = "/assets/img/avatar/avatar8.png";
const avatar9 = "/assets/img/avatar/avatar9.png";
const avatar10 = "/assets/img/avatar/avatar10.png";
const avatar11 = "/assets/img/avatar/avatar11.png";
const avatar12 = "/assets/img/avatar/avatar12.png";
const avatar13 = "/assets/img/avatar/avatar13.png";
const avatar14 = "/assets/img/avatar/avatar14.png";
const avatar15 = "/assets/img/avatar/avatar15.png";
const avatar16 = "/assets/img/avatar/avatar16.png";
const avatar17 = "/assets/img/avatar/avatar17.png";
const avatar18 = "/assets/img/avatar/avatar18.png";
const avatar19 = "/assets/img/avatar/avatar19.png";
const avatar20 = "/assets/img/avatar/avatar20.png";
const avatar21 = "/assets/img/avatar/avatar21.png";
const avatar22 = "/assets/img/avatar/avatar22.png";
const avatar23 = "/assets/img/avatar/avatar23.png";
const avatar24 = "/assets/img/avatar/avatar24.png";
import WelcomeBonusModal from "../assets/components/WelcomeBonusModal";
const Homepage = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUnityReady, setIsUnityReady] = useState(false);
  const [roomUsers, setRoomUsers] = useState<any[]>([]);
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const router = useRouter();
  const searchParams = useSearchParams();
  const unityRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [roomFull, setRoomFull] = useState(false);
  const socketRef = useRef(null);

  const avatarMap = {
    avatar1, avatar2, avatar3, avatar4, avatar5, avatar6,
    avatar7, avatar8, avatar9, avatar10, avatar11, avatar12,
    avatar13, avatar14, avatar15, avatar16, avatar17, avatar18,
    avatar19, avatar20, avatar21, avatar22, avatar23, avatar24,
  };
  const historyMock = [
    { date: "12/02 15:22", value: "20.00" },
    { date: "12/02 15:32", value: "20.00" },
    { date: "12/02 15:12", value: "20.00" },
  ];

  const updateToken = (t) => {
  localStorage.setItem("authToken", t);
  setToken(t);
  };
  
  const refreshToken = async () => {
  const oldToken = localStorage.getItem("authToken");
  if (!oldToken) return null;

  const res = await axios.get(`${API_URLS.BASE}/refresh`, {
    headers: { Authorization: `Bearer ${oldToken}` },
  });

  const newToken = res.data?.token;
  if (newToken) {
    localStorage.setItem("authToken", newToken);
    return newToken;
  }
  return null;
};
  
  /* useEffect(() => {
  const socket = io("http://3.140.18.243:4000", {
    transports: ["websocket"], // evita fallback polling
    
  });

  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("Conectado:", socket.id);

     console.log("Conectado!");

    socket.emit("checkRoom", { });

    
   /*  socket.emit("joinRoom", {
      userId: "realUser",
      username: "MeuNome"
    }); */

    /* socket.emit("joinRoom", {
      roomId: "1",
      userId: "UserId",
      username: "user?.name"
    }); 
  });

  socket.on("roomFull", (data) => {
    if (!data.full) {
      console.log("foi");

      if (data.count >= 4) {
        setRoomFull(false);
        console.log("Sala vazia");
      }
    }else{console.log("sala cheia");  setRoomFull(true);}
    console.log("roomFull, " + data);
  });


  socket.on("roomStatus", (data) => {
    if (!data.full) {
      console.log("foi2");
      if (data.count >= 3) {
        setRoomFull(true);
        console.log("Sala cheia");
      }else{
        setRoomFull(false);
        console.log("Sala vazia");
      }
    }
    console.log(data.count);
  });

  return () => {
    socket.disconnect();
  };
}, []); */

  /* useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const newToken = await refreshToken();
        if (newToken) setToken(newToken);
      } catch (e) {
        localStorage.removeItem("authToken");
        window.navigate.href = ROUTES.INDEX;
      }
    }, 9 * 60 * 1000); // 10 min

    return () => clearInterval(interval);
  }, [token]); */
  
  useEffect(() => {
  if (searchParams.get("alreadyOnRoom")) {
    setShowModal3(true);
    router.replace(window.location.pathname); // opcional
  }
  }, [searchParams, router]);

useEffect(() => {
  const socket = getSocket();        // ✅ usa o singleton
  socketRef.current = socket;        // mantém seu socketRef

  // se conectar agora ou já estiver conectado, faz check
  const doCheck = () => socket.emit("checkRoom", {});

  if (socket.connected) doCheck();
  else socket.once("connect", doCheck);

  // ✅ mantém seu handler do jeito que você já escreveu
  /* socket.on("roomFull", (data) => {
    if (!data.full) {
      if (data.count >= 100) {
        setRoomFull(false);
      }
    } else {
      setRoomFull(true);
    }
    //console.log("roomFull", data);
  }); */

  // ✅ mantém seu handler do jeito que você já escreveu
  socket.on("roomStatus", (data) => {
    // SUA REGRA (mas arrumei o bug: quando full=true você não tratava)
     if (data.full) {
      setRoomFull(true);
      console.log("Sala cheia");
    } else { 
      // aqui você decide o limite (no servidor é MAX_USERS=4)
      if (data.count >= 100) {
        setRoomFull(true);
        console.log("Sala cheia");
      } else {
        setRoomFull(false);
        console.log("Sala vazia");
      }
    }
      //console.log("count:", data.count);
    });

    return () => {
      // ✅ não desconecta (pra manter conexão entre telas)
      //socket.off("roomFull");
      socket.off("roomStatus");
      socket.off("connect", doCheck);
    };
  }, []);

  
  
  
  const handleEnterRoom = () => {
    
    const socket = socketRef.current;

    if (!socket) return;

    const doCheck = () => socket.emit("checkRoom", {});
    doCheck();
 
    if (roomFull) {
      setShowModal2(true);
      return;
    } 
     if (roomUsers.length >= 100) {
      setShowModal(true); // Sala cheia
      return;
    } 
    //localStorage.setItem("roomId", "1" );
    router.push(ROUTES.GAME);
  };
  
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  useEffect(() => {
    const tryOpenWelcomeModal = () => {
      const uid = localStorage.getItem("UserId");
      if (!uid) return;
      const now = new Date();
      const firstSeenKey = `user:firstSeen:${uid}`;
      const lastShownKey = `welcomeModal:lastShown:${uid}`;
      let firstSeen = localStorage.getItem(firstSeenKey);
      if (!firstSeen) {
        firstSeen = now.toISOString();
        localStorage.setItem(firstSeenKey, firstSeen);
      }
      const firstSeenDate = new Date(firstSeen);
      const daysSince = Math.floor((now.getTime() - firstSeenDate.getTime()) / (1000 * 60 * 60 * 24));
      const isNewUser = daysSince <= 7;
      if (!isNewUser) return;
      const lastShown = localStorage.getItem(lastShownKey);
      const sameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
      if (!lastShown || !sameDay(new Date(lastShown), now)) {
        setShowModal(false);
        localStorage.setItem(lastShownKey, now.toISOString());
      }
    };
    const timer = setTimeout(tryOpenWelcomeModal, 400);
    return () => clearTimeout(timer);
  }, [token]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_URLS.BASE}/rooms?page=${currentPage}`, { headers });
        if (response.data?.rooms?.data && Array.isArray(response.data.rooms.data)) {
          setRooms(response.data.rooms.data);
          setTotalPages(response.data.rooms.last_page || 1);
        } else {
          console.warn("Formato inesperado da resposta:", response.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          if (newToken) {
            setToken(newToken);
            return fetchRooms(); // tenta novamente
          }
        } catch (e) {}

        localStorage.removeItem("authToken");
        window.location.href = ROUTES.INDEX;
      }
        console.error("Erro ao buscar salas:", error);
      }
    };
    fetchRooms();
  }, [token, currentPage]);
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_URLS.BASE}/ranking/daily`, { headers });

        if (response.data?.ranking && Array.isArray(response.data.ranking)) {
          setRanking(response.data.ranking.slice(0, 10)); // Top 10 rankings
        } else {
          console.warn("Formato inesperado da resposta de ranking:", response.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          window.location.href = ROUTES.INDEX;
        }
        console.error("Erro ao buscar ranking:", error);
      }
    };
    fetchRanking();
  }, [token]);
  window.getReactData = () => {
    return JSON.stringify({
      token: localStorage.getItem("authToken"),
      room_id: 4,
    });
  };
  const sendToUnity = (roomId: any) => {
    if (!isUnityReady || !unityRef.current?.SendMessage) {
      console.error("Unity ainda não está pronto ou não foi carregado corretamente!");
      return;
    }
    if (!roomId) {
      console.error("ID da sala é inválido.");
      return;
    }
    const message = JSON.stringify({ room: roomId, token });
    try {
      unityRef.current.SendMessage("ApiAuth", "ChangeRoom", message);
    } catch (error) {
      console.error("Erro ao enviar mensagem para Unity:", error);
    }
  };
  const getPositionIcon = (position) => {
    if (position === 0) {
      return (
        <svg width={17} height={15} viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M2.84773 14.0947H13.3477M7.76923 0.794231C7.8016 0.735436 7.84916 0.686406 7.90694 0.652259C7.96472 0.618111 8.03061 0.600098 8.09773 0.600098C8.16485 0.600098 8.23074 0.618111 8.28852 0.652259C8.3463 0.686406 8.39386 0.735436 8.42623 0.794231L10.6402 4.99723C10.693 5.09455 10.7667 5.17898 10.856 5.24445C10.9453 5.30991 11.048 5.3548 11.1567 5.37588C11.2654 5.39695 11.3774 5.39371 11.4847 5.36636C11.592 5.33902 11.6919 5.28826 11.7772 5.21773L14.985 2.46973C15.0466 2.41965 15.1224 2.39039 15.2017 2.38618C15.281 2.38197 15.3595 2.40302 15.4261 2.44629C15.4926 2.48957 15.5437 2.55284 15.572 2.627C15.6003 2.70116 15.6043 2.78238 15.5835 2.85898L13.458 10.5435C13.4146 10.7007 13.3211 10.8395 13.1917 10.9389C13.0623 11.0382 12.9041 11.0927 12.741 11.094H3.45523C3.29198 11.0928 3.13356 11.0385 3.00402 10.9391C2.87449 10.8398 2.7809 10.7009 2.73748 10.5435L0.61273 2.85973C0.591918 2.78313 0.595946 2.70191 0.624236 2.62775C0.652526 2.55359 0.703617 2.49032 0.770156 2.44704C0.836695 2.40377 0.915249 2.38272 0.99451 2.38693C1.07377 2.39114 1.14965 2.4204 1.21123 2.47048L4.41823 5.21848C4.50358 5.28901 4.60349 5.33977 4.71078 5.36711C4.81807 5.39446 4.93008 5.39771 5.03878 5.37663C5.14748 5.35555 5.25016 5.31066 5.33945 5.24519C5.42874 5.17973 5.50243 5.0953 5.55523 4.99798L7.76923 0.794231Z" stroke="#F0B100" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      );
    } else if (position === 1) {
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexGrow: 0, flexShrink: 0, width: 18, height: 18, position: "relative" }} preserveAspectRatio="none">
          <g clip-path="url(#clip0_1460_35111)">
            <path d="M4.92247 11.4653L1.04733 5.00645C0.880229 4.72778 0.801643 4.40789 0.821326 4.0865C0.841009 3.76511 0.958095 3.45637 1.15805 3.19863L2.52925 1.44011C2.68792 1.23599 2.89365 1.07032 3.13017 0.956221C3.3667 0.842119 3.6275 0.782715 3.89194 0.782715H14.1121C14.3765 0.782715 14.6374 0.842119 14.8739 0.956221C15.1104 1.07032 15.3161 1.23599 15.4748 1.44011L16.8375 3.19863C17.0388 3.45555 17.1574 3.76386 17.1786 4.08526C17.1998 4.40666 17.1226 4.72699 16.9567 5.00645L13.0816 11.4653M8.15034 9.00012L3.14246 0.947073M9.8537 9.00012L14.8616 0.947073M5.5953 4.89141H12.4087M9.00202 13.9305V12.2871H8.57618M13.2604 13.1088C13.2604 15.378 11.3539 17.2175 9.00202 17.2175C6.65017 17.2175 4.74362 15.378 4.74362 13.1088C4.74362 10.8396 6.65017 9.00011 9.00202 9.00011C11.3539 9.00011 13.2604 10.8396 13.2604 13.1088Z" stroke="#99A1AF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <ClipPath id="clip0_1460_35111">
              <rect width={18} height={18} fill="white" />
            </ClipPath>
          </defs>
        </svg>
      );
    } else if (position === 2) {
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexGrow: 0, flexShrink: 0, width: 18, height: 18, position: "relative" }} preserveAspectRatio="none">
          <g clip-path="url(#clip0_1463_35599)">
            <path d="M4.92247 11.4653L1.04733 5.00645C0.880229 4.72778 0.801643 4.40789 0.821326 4.0865C0.841009 3.76511 0.958095 3.45637 1.15805 3.19863L2.52925 1.44011C2.68792 1.23599 2.89365 1.07032 3.13017 0.956221C3.3667 0.842119 3.6275 0.782715 3.89194 0.782715H14.1121C14.3765 0.782715 14.6374 0.842119 14.8739 0.956221C15.1104 1.07032 15.3161 1.23599 15.4748 1.44011L16.8375 3.19863C17.0388 3.45555 17.1574 3.76386 17.1786 4.08526C17.1998 4.40666 17.1226 4.72699 16.9567 5.00645L13.0816 11.4653M8.15034 9.00012L3.14246 0.947073M9.8537 9.00012L14.8616 0.947073M5.5953 4.89141H12.4087M9.00202 13.9305V12.2871H8.57618M13.2604 13.1088C13.2604 15.378 11.3539 17.2175 9.00202 17.2175C6.65017 17.2175 4.74362 15.378 4.74362 13.1088C4.74362 10.8396 6.65017 9.00011 9.00202 9.00011C11.3539 9.00011 13.2604 10.8396 13.2604 13.1088Z" stroke="#BB4D00" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <ClipPath id="clip0_1463_35599">
              <rect width={18} height={18} fill="white" />
            </ClipPath>
          </defs>
        </svg>
      );
    } else if (position === 3) {
      return (
        <svg width={17} height={17} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M3.59961 5.8501H2.47461C1.97733 5.8501 1.50041 5.65255 1.14878 5.30092C0.797153 4.94929 0.599609 4.47238 0.599609 3.9751C0.599609 3.47782 0.797153 3.0009 1.14878 2.64927C1.50041 2.29764 1.97733 2.1001 2.47461 2.1001H3.59961M3.59961 5.8501L3.59961 0.600098H12.5996V5.8501M3.59961 5.8501C3.59961 7.04357 4.07372 8.18816 4.91763 9.03208C5.76154 9.87599 6.90614 10.3501 8.09961 10.3501C9.29308 10.3501 10.4377 9.87599 11.2816 9.03208C12.1255 8.18816 12.5996 7.04357 12.5996 5.8501M12.5996 5.8501H13.7246C14.2219 5.8501 14.6988 5.65255 15.0504 5.30092C15.4021 4.94929 15.5996 4.47238 15.5996 3.9751C15.5996 3.47782 15.4021 3.0009 15.0504 2.64927C14.6988 2.29764 14.2219 2.1001 13.7246 2.1001H12.5996M2.09961 15.6001H14.0996M6.59961 10.0951V11.8501C6.59961 12.2626 6.24711 12.5851 5.87211 12.7576C4.98711 13.1626 4.34961 14.2801 4.34961 15.6001M9.59961 10.0951V11.8501C9.59961 12.2626 9.95211 12.5851 10.3271 12.7576C11.2121 13.1626 11.8496 14.2801 11.8496 15.6001" stroke="#2B7FFF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      );
    }
    return null;
  };
  const formatName = (fullName) => {
    if (!fullName) return "***--- ---***";
    const parts = fullName.trim().split(" ");
    const first = (parts[0] || "").padEnd(3, "-").slice(0, 3);
    const last = (parts.length > 1 ? parts[parts.length - 1] : "")
      .padEnd(3, "-")
      .slice(0, 3);
    return `***${first} ${last}***`;
  };
  const formatMoney = (v) => {
    const n = Number(v || 0);
    return `R$ ${n.toLocaleString("pt-BR")}`;
  };
  const bannerImages = [
    { desktop: side1, mobile: mobile1 },
    { desktop: side2, mobile: mobile2 },
    { desktop: side3, mobile: mobile3 },
    { desktop: side4, mobile: mobile4 },
  ];

  const bannerData = [
  {
    desktop: side1,
    mobile: mobile1,
    subtitle: "Vem jogar RONDA com o agoniado!",
    title: "AO VIVO!",
    description: "Entre e jogue agora"
  },
  {
    desktop: side2,
    mobile: mobile2 ,
    subtitle: "APOSTE NO",
    title: "RONDA, GALHO 1 OU GALHO 2",
    description: "ATÉ 3 OPÇÕES DE APOSTA POR RODADA"
  },
  {
    desktop: side3,
    mobile: mobile3 ,
    subtitle: "SUBA SUA",
    title: "BANCA AO VIVO",
    description: "A EMOÇÃO COMEÇA AGORA"
  },
  {
    desktop: side4,
    mobile: mobile4 ,
    subtitle: "Ranking com Prêmios incríveis",
    title: "JOGUE E GANHE",
    description: "PREMIOS EM DIHEIRO"
  }
];
  return (
    <div className="container-fluid p-0 poppins-regular">
      <NavInfo />
      <div className="row g-0">
        <div className="col-md-12 col-lg-12 col-sm-12">
          <div className="container-fluid text-center mt-4">
            <div className="row">
              <div className="col-12 p-0 position-relative">
                <div
                  id="carouselBanner"
                  className="carousel slide animate__animated animate__fadeIn position-relative"
                  data-bs-touch="false"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators custom-indicators">
                    {bannerData.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselBanner"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-label={`Slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="container-fluid carousel-inner">
                    {bannerData.map((img, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                      >
                          {/* IMAGENS */}
                      <img
                        style={{ height: "300px" }}
                        src={img.desktop}
                        className="w-100 d-none d-md-block"
                        alt=""
                      />
                      <img
                        style={{ height: "222px" }}
                        src={img.mobile}
                        className="w-100 d-md-none"
                        alt=""
                      />
                       <div style={{ marginTop: "-5px", marginLeft: "20px" }} className="d-none d-md-block  position-absolute top-50 start-0 translate-middle-y p-1 mb-1">
                    <div className="container-lg">
                      <div className="poppins-regular text-white text-start">
                        <h3 className="mb-2">{img.subtitle}</h3>
                        <h1 style={{ color: "#FF6D70" }}>{img.title}</h1>
                        <h3>{img.description}</h3>
                        <button
                          style={{ width: "170px", height: "48px", background: "#F70004" }}
                          //onClick={handleEnterRoom }
                            /* () => {
                            localStorage.setItem("roomId", 1);
                            router.push(ROUTES.GAME);
                          } */
                          
                          className="btn btn-danger animate__animated animate__bounceIn"
                        >
                          Jogue Agora !
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ marginLeft: "20px" }}
                    className="d-block d-md-none position-absolute top-50 start-0 translate-middle-y"
                  >
                    <div className="container text-white text-start">
                      <h5 className="mb-2">{img.subtitle}</h5>
                      <h3 style={{ color: "#FF6D70" }}>{img.title}</h3>
                      <h5>{img.description}</h5>

                      <button
                        style={{ width: "170px", height: "48px", background: "#F70004" }}
                        //onClick={() => {handleEnterRoom(img.roomId)}}
                        className="btn btn-danger"
                      >
                        Jogue Agora !
                      </button>
                    </div>
                  </div>

                      
                      </div>
                    ))}

                  </div>
                  <div style={{ marginLeft: "20px" }} className="d-block d-md-none  position-absolute top-50 start-0 translate-middle-y p-0 mb-0">
                    <div className="container">
                      
                    </div>
                  </div>
                  <div style={{ marginTop: "-5px", marginLeft: "20px" }} className="d-none d-md-block  position-absolute top-50 start-0 translate-middle-y p-1 mb-1">
                    <div className="container-lg">
                      <div className="poppins-regular text-white text-start">
                        {/* <h3 className="mb-2">Pronto para a próxima jogada?</h3>
                        <h1 className="mb-2 poppins-bold" style={{ fontSize: 38, color: "#FF6D70" }}>
                          RONDA EM TEMPO REAL
                        </h1>
                        <h3 className="mb-3" style={{ fontSize: 44 }}>
                          Entre e jogue agora
                        </h3> */}
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                marginTop: "10px",
                backgroundColor: "#1A242D",
                borderRadius: "14px",
                padding: "10px 16px",
                height: "56px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
              }}
            >
              <span
                className="poppins-semibold text-white"
                style={{ fontSize: "18px", letterSpacing: "0.5px" }}
              >
                Salas
              </span>
              <div className="d-flex gap-2">
                <button
                  onClick={() => {
                    const container = document.getElementById("scrollContainer");
                    container.scrollLeft -= 150;
                  }}
                  className="btn btn-dark animate__animated animate__fadeInLeft"
                  style={{
                    borderRadius: "50%",
                    width: "42px",
                    height: "42px",
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={() => {
                    const container = document.getElementById("scrollContainer");
                    container.scrollLeft += 150;
                  }}
                  className="btn btn-dark animate__animated animate__fadeInRight"
                  style={{
                    borderRadius: "50%",
                    width: "42px",
                    height: "42px",
                  }}
                >
                  ❯
                </button>
              </div>
            </div>
            <br />
            <div className="position-relative px-0 mb-3">
              <div
                id="scrollContainer"
                className="d-flex overflow-auto pb-3 mb-3"
                style={{
                  scrollBehavior: "smooth",
                  gap: "15px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {rooms.length > 0 ? (
                  rooms.map((room, index) => {
                    let isActive = index === 0;
                    return (
                      <div
                        key={room.id}
                        className="text-white text-center flex-shrink-0 animate__animated animate__slideInLeft"
                        style={{
                          width: "clamp(100px, 25vw, 140px)",
                          cursor: isActive ? "pointer" : "not-allowed",
                          borderRadius: "12px",
                          overflow: "hidden",
                          animationDelay: `${index * 0.1}s`,
                          position: "relative",
                          opacity: isActive ? 1 : 0.7,
                        }}
                       // onClick={() => {                          if (!isActive) return;                          handleEnterRoom();                        }}
                      >
                        <img
                          src={isActive ? Online : Live}
                          alt={`Sala ${room.id}`}
                          className="animate__animated animate__zoomIn"
                          style={{
                            width: "130px",
                            height: "154px",
                            objectFit: "cover",
                            filter: isActive ? "none" : "blur(2px) brightness(0.6)",
                            transition: "all 0.3s ease",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15))",
                            padding: "10px 6px",
                            backdropFilter: "blur(2px)",
                          }}
                        >
                          <div
                            className="poppins-regular d-flex align-items-center justify-content-center gap-1"
                            style={{ fontSize: "14px" }}
                          >
                            SALA {room.id.toString().padStart(2, "0")}
                            <img src={isActive ? OnGame : OffGame} alt="" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white ms-3">Carregando salas...</p>
                )}
              </div>
            </div>
            <div
              className="d-flex align-items-center justify-content-between mb-3"
              style={{
                marginTop: "10px",
                backgroundColor: "#1A242D",
                borderRadius: "14px",
                padding: "10px 16px",
                height: "56px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
              }}
            >
              <span
                className="poppins-semibold text-white"
                style={{ fontSize: "18px", letterSpacing: "0.5px" }}
              >
                Ranking
              </span>
              <div className="d-flex gap-2">
                <span
                  className="poppins-semibold text-white"
                  style={{ paddingTop: "7px", fontSize: "18px", letterSpacing: "0.5px" }}
                  onClick={() => router.push(ROUTES.RANKING)}
                >
                  Ver tudo
                </span>
                <button
                  onClick={() => {
                    const container = document.getElementById("scrollContainer2");
                    container.scrollLeft -= 150;
                  }}
                  className="btn btn-dark animate__animated animate__fadeInLeft"
                  style={{
                    borderRadius: "50%",
                    width: "42px",
                    height: "42px",
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={() => {
                    const container = document.getElementById("scrollContainer2");
                    container.scrollLeft += 150;
                  }}
                  className="btn btn-dark animate__animated animate__fadeInRight"
                  style={{
                    borderRadius: "50%",
                    width: "42px",
                    height: "42px",
                  }}
                >
                  ❯
                </button>
              </div>
            </div>
            {/* <div
              onClick={() => setShowModal(true)}
              style={{
                position: "fixed",
                bottom: "70px",
                right: "70px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                zIndex: 9999,
                backgroundColor: "transparent"
              }}
             >
              <img
                src={IconRoulette}
                alt="Abrir bônus"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />
            </div> */}
            <div className="position-relative px-4 mb-3">
              <div
                id="scrollContainer2"
                className="d-flex overflow-auto pb-3 mb-3"
                style={{
                  scrollBehavior: "smooth",
                  gap: "clamp(10px, 3vw, 15px)",
                  marginTop: "-40px",
                  marginLeft: "-22px",
                  marginRight: "-22px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {ranking.length > 0 ? (
                  ranking.map((user, idx) => {
                    const isCurrent = !!user.is_current_user;
                    const valueColor = isCurrent ? "#F0B100" : "#fff";
                    const nameMasked = user.name?.slice(0, 13);//formatName(user.name);
                    const cardBorder =
                      isCurrent
                        ? "2px solid #c53030"
                        : idx === 0
                          ? "1px solid #F0B100"
                          : idx === 1
                            ? "1px solid #ABABAB"
                            : idx === 2
                              ? "1px solid #FF7A00"
                              : "none";
                    const cardBg =
                      idx === 0
                        ? "linear-gradient(89.83deg, rgba(240,177,0,0.4) 0.33%, rgba(0,0,0,0) 137.24%)"
                        : idx === 1
                          ? "linear-gradient(89.83deg, rgba(171,171,171,0.4) 0.33%, rgba(0,0,0,0) 137.24%)"
                          : idx === 2
                            ? "linear-gradient(89.83deg, rgba(255,122,0,0.4) 0.33%, rgba(0,0,0,0) 137.24%)"
                            : "linear-gradient(90deg, #1e222b 0%, #171b25 70%)";
                    return (

                      <div
                        key={user.id}
                        className="mt-5 text-white text-center flex-shrink-0 animate__animated animate__slideInLeft"
                        style={{
                          width: "clamp(204px, 45vw, 204px)",
                          height: "121px",
                          cursor: "pointer",
                          borderRadius: 10,
                          overflow: "hidden",
                          padding: "clamp(12px, 3vw, 16px)",
                          background: cardBg,
                          border: cardBorder,
                          animationDelay: `${idx * 0.1}s`,
                        }}
                        onClick={() => router.push(ROUTES.RANKING)}
                      >
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{ flex: 1, textAlign: "left" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                              <img
                                src={
                                  avatarMap[`avatar${user.avatar}`]
                                }
                                alt="Avatar"
                                style={{ width: "clamp(32px, 8vw, 42px)", height: "clamp(32px, 8vw, 42px)", borderRadius: "50%" }}
                              />
                              <div className="poppins-semibold" style={{ fontSize: "clamp(12px, 3.5vw, 14px)", display: "flex", flexDirection: "column", gap: 2 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  <span>{nameMasked}</span>
                                </div>
                                <span style={{ marginLeft: idx < 4 ? 4 : 0, fontSize: "clamp(11px, 3vw, 13px)", color: "rgba(255,255,255,0.6)" }}>
                                  {idx < 4 && getPositionIcon(idx)} {user.bets_count || 0} apostas
                                </span>
                              </div>
                            </div>
                            <div
                              style={{
                                marginTop: 6,
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: 4,
                                textAlign: "center",
                                fontSize: "clamp(12px, 3.4vw, 15px)",
                              }}
                            >
                              <div>
                                <small style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(8px, 2.1vw, 8px)" }}>PTS</small>
                                <div style={{ color: valueColor, fontWeight: 1200, lineHeight: 1, fontSize: "clamp(12px, 3.4vw, 14px)" }}>
                                  {user.point_daily || 0}
                                </div>
                              </div>
                              <div>
                                <small style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(8px, 2.1vw, 8px)" }}>Taxa</small>
                                <div style={{ color: "#fff", fontWeight: 1200, lineHeight: 1, fontSize: "clamp(12px, 3.4vw, 14px)" }}>
                                  {typeof user.percentage === "number"
                                    ? `${user.percentage}%`
                                    : user.percentage || "0%"}
                                </div>
                              </div>
                              <div>
                                <small style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(8px, 2.1vw, 8px)" }}>Maior Vitória</small>
                                <div style={{ color: valueColor, fontWeight: 1200, lineHeight: 1, fontSize: "clamp(12px, 3.4vw, 14px)" }}>
                                  {formatMoney(user.biggest_bet || 0)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white ms-3">Carregando ranking...</p>
                )}
              </div>
            </div>
          </div>
          {showModal && (
            
            <WelcomeBonusModal
              show={showModal}
              onClose={() => setShowModal(false)}
            />
          )}

          {showModal2 && (
            <div className="ronda-modal-overlay" onClick={() => setShowModal2(false)}>
              <div
                className="ronda-modal-card"
                onClick={(e) => e.stopPropagation()} // não fecha ao clicar dentro
                role="dialog"
                aria-modal="true"
              >
                <button
                  className="ronda-modal-close"
                  onClick={() => setShowModal2(false)}
                  aria-label="Fechar"
                >
                  ×
                </button>

                <div className="ronda-modal-title-wrapper">
                  <h2 className="ronda-modal-title">SALA CHEIA</h2>
                </div>
                <div className="ronda-modal-divider" />

                <p className="ronda-modal-text">
                  ESTA SALA JÁ ATINGIU <b>300</b> JOGADORES.
                </p>

                <button
                  className="ronda-modal-btn"
                  onClick={() => setShowModal2(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}    

          {showModal3 && (
            <div className="ronda-modal-overlay" onClick={() => setShowModal3(false)}>
              <div
                className="ronda-modal-card"
                onClick={(e) => e.stopPropagation()} // não fecha ao clicar dentro
                role="dialog"
                aria-modal="true"
              >
                <button
                  className="ronda-modal-close"
                  onClick={() => setShowModal3(false)}
                  aria-label="Fechar"
                >
                  ×
                </button>

                <div className="ronda-modal-title-wrapper">
                  <h2 className="ronda-modal-title">Erro!</h2>
                </div>
                <div className="ronda-modal-divider" />

                <p className="ronda-modal-text">
                  Voce já esta logado em outro dispositivo!
                </p>

                <button
                  className="ronda-modal-btn"
                  onClick={() => setShowModal3(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}    

        {/*   {showModal3 && (
            <div className="modal show d-block" tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Sala cheia</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal3(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>Voce já esta logado!.</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal3(false)}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
export default Homepage;


