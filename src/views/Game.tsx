import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getSocket } from "../SocketNew";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import NavInfo from "../assets/components/NavInfo";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES, API_URLS } from "../routes";
import UserLive from "../assets/components/UserLive";
import ChatOnline from "../assets/components/ChatOnline";

const Game = () => {
  const [user, setUser] = useState<any>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [apostas, setApostas] = useState<any[]>([]);
  const [percentages, setPercentages] = useState({
    card_left: "0%",
    card_right: "0%",
  });
  const [isUnityReady, setIsUnityReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const unityRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPaymentGetOpen, setIsPaymentGetOpen] = useState(false);
  const [isPaymentSetOpen, setIsPaymentSetOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showNavInfo, setShowNavInfo] = useState(false);
  const userName = localStorage.getItem("userName") || " "; // Nome do usuário

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

  useEffect(() => {

    let cancelled = false;

    const init = async () => {
       window.location.href = ROUTES.INDEX;
      const socket = getSocket();
      // 1) Refresh SEMPRE ao entrar no Game
      try {
        const newToken = await refreshToken();
        if (newToken && !cancelled) {
          updateToken(newToken); // seta state + localStorage
        }
      } catch (e) {
        // se falhar o refresh, derruba sessão
        console.error("Erro ao refresh token:", e);
        localStorage.removeItem("authToken");
        window.location.href = ROUTES.INDEX;
        return;
      }

      if (cancelled) return;

      // 2) Só depois entra na sala
      socket.emit("joinRoom", { userId: userName, username: "MeuNome = " });

      socket.on("DC", () => {
        console.log("Desconectado: Usuario ja esta na sala");
        router.push(`${ROUTES.HOME}?alreadyOnRoom=true`);
      });
    };

    init();

    return () => {
      cancelled = true;
      const socket = getSocket();
      socket.emit("leaveRoom");
      socket.off("DC");
    };
  }, []); 

  const updateToken = (t) => {
    localStorage.setItem("authToken", t);
    setToken(t);
  };

  /* useEffect(() => {
  const socket = getSocket();

  socket.emit("joinRoom", { userId: userName, username: "MeuNome" });

  socket.on("DC", () => {

    console.log("Desconectado:");
    router.push(ROUTES.HOME);
    
  });

  return () => {
    // ✅ libera vaga ao sair do Game
    socket.emit("leaveRoom");
    
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
          window.location.href = ROUTES.INDEX;
        }
      }, 9 * 60 * 1000); // 10 min

      return () => clearInterval(interval);
  }, [token]); */

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const show = () => setShowNavInfo(true);
    window.addEventListener("touchmove", show, { passive: true });
    window.addEventListener("wheel", show, { passive: true });
    window.addEventListener("scroll", show, { passive: true });
    return () => {
      window.removeEventListener("touchmove", show);
      window.removeEventListener("wheel", show);
      window.removeEventListener("scroll", show);
    };
  }, [isMobile]);
  /* const fetchBets = async (roomId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URLS.BASE}/bets/list/${roomId}`, {
        headers: { Authorization: `Bearer  ${token}` },
      });
      if (response.data?.user_bets) setApostas(response.data.user_bets);
      if (response.data?.percentages) setPercentages(response.data.percentages);
    } catch (error) {
      console.error("Erro ao buscar apostas:", error);
    } finally {
      setLoading(false);
    }
  }; */
  /* useEffect(() => {
    if (selectedRoom) {
      setApostas([]);
      setPercentages({ card_left: "0%", card_right: "0%" });
      fetchBets(selectedRoom);
    }
  }, [selectedRoom]); */
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(
          `${API_URLS.BASE}/rooms?page=${currentPage}`,
          { headers }
        );
        if (
          response.data?.rooms?.data &&
          Array.isArray(response.data.rooms.data)
        ) {
          const filteredRooms = response.data.rooms.data.filter(
            (room) => !room.finished_at
          );
          setRooms(filteredRooms);
          setTotalPages(response.data.rooms.last_page || 1);
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
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;
        const response = await axios.get(`${API_URLS.BASE}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.profile) setUser(response.data.profile);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, [token]);
  useEffect(() => {
    const roomId = searchParams.get("roomId");
    if (roomId) {
      setSelectedRoom(roomId);
      sendToUnity(roomId);
    }
  }, [searchParams]);
  const sendToUnity = (roomId: any, role?: any) => {
    if (
      !isUnityReady ||
      !unityRef.current ||
      !unityRef.current.SendMessage ||
      !roomId
    )
      return;
    const message = JSON.stringify({ room: roomId, token: token, role: role });
    try {
      unityRef.current.SendMessage("ApiAuth", "ChangeRoom", message);
    } catch (error) {
      console.error("Erro ao enviar mensagem para Unity:", error);
    }
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };
  useEffect(() => {
    const onFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);
  const handleOpenChat = () => setIsChatOpen(true);
  const handleCloseChat = () => setIsChatOpen(false);
  return (
    <div
      className="container-fluid px-0"
      style={{
        backgroundColor: "#080A10",
      }}
    >
     {!isFullscreen && !isMobile && (
        <NavInfo
          setIsPaymentSetOpen={setIsPaymentSetOpen}
          setIsPaymentGetOpen={setIsPaymentGetOpen}
          isPaymentGetOpen={isPaymentGetOpen}
          isPaymentSetOpen={isPaymentSetOpen}
        />
      )}
      <div className="row g-0">
        <div
          className={
            isFullscreen
              ? "col-12 d-flex justify-content-center align-items-top"
              : "col-12 col-lg-9 d-flex justify-content-center align-items-top"
          }
        >
          <div
            ref={fullscreenRef}
            className="container-fluid flex-grow-1 text-center"
            style={{ marginTop: "8px", width: "100%", padding: "0 10px" }}
          >
            <UserLive onOpenChat={handleOpenChat} />
            {user?.role === "dealer" && (
              <div
                tabIndex={-1}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    document.exitFullscreen?.();
                  }
                }}
              >
              </div>
            )}
            {user?.role === "user" && (
              <div
                tabIndex={-1}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    document.exitFullscreen?.();
                  }
                }}
              >
              </div>
            )}
          </div>
        </div>
        {!isFullscreen && (
          <div className="col-12 col-lg-3 mt-3 mr-2 d-none d-lg-block animate__animated animate__fadeInRight">
            <ChatOnline
              style={{
                maxWidth: "333px",
                height: "100%",
                borderRadius: "8px",
                marginTop: "50px",
              }}
              token={token}
            />
          </div>
        )}
      </div>
      {!isFullscreen && isChatOpen && (
        <>
          <div
            onClick={handleCloseChat}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1040,
            }}
          />
          <div
            className="animate__animated animate__slideInUp"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: "70vh",
              maxHeight: "500px",
              minHeight: "300px",
              backgroundColor: "#0f172a",
              zIndex: 1050,
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onTouchStart={(e) => {
              const startY = e.touches[0].clientY;
              const handleTouchMove = (e) => {
                const currentY = e.touches[0].clientY;
                const diff = currentY - startY;
                if (diff > 100) {
                  handleCloseChat();
                  document.removeEventListener("touchmove", handleTouchMove);
                }
              };
              document.addEventListener("touchmove", handleTouchMove, {
                passive: true,
              });
              document.addEventListener(
                "touchend",
                () => {
                  document.removeEventListener("touchmove", handleTouchMove);
                },
                { once: true }
              );
            }}
          >
            <div
              style={{
                padding: "15px 20px 10px",
                backgroundColor: "#1e293b",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #334155",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div />
                <h6 style={{ margin: 0, fontWeight: "600" }}>Chat Online</h6>
              </div>
              <button
                onClick={handleCloseChat}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "0",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "#334155")
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "transparent")
                }
                aria-label="Fechar chat"
              >
                &times;
              </button>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <ChatOnline token={token} isMobile={true} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Game;