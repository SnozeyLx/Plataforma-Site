import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavInfo from "../assets/components/NavInfo";
import UnityApp from "../assets/components/UnityApp";
import SidebarGame from "../assets/components/SidebarGame";
import { useNavigate, useLocation } from "react-router-dom";
import GetPayments from "../assets/components/GetPayments";
import SetPayments from "../assets/components/SetPayments";
const Game = () => {
  const [user, setUser] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [apostas, setApostas] = useState([]);
  const [percentages, setPercentages] = useState({ card_left: "0%", card_right: "0%" });
  const [isUnityReady, setIsUnityReady] = useState(false);
  const [isPaymentGetOpen, getIsPaymentGetOpen] = useState(false);
  const [isPaymentSetOpen, setIsPaymentSetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken") || "";
  const unityRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const fetchBets = async (roomId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/bets/list/${roomId}`, {
        headers: { Authorization: `Bearer  ${token}` }
      });
      if (response.data?.user_bets) {
        setApostas(response.data.user_bets);
      }
      if (response.data?.percentages) {
        setPercentages(response.data.percentages);
      }
    } catch (error) {
      console.error('Erro ao buscar apostas:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedRoom) {
      setApostas([]);
      setPercentages({ card_left: "0%", card_right: "0%" });
      fetchBets(selectedRoom);
    }
  }, [selectedRoom]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/rooms?page=${currentPage}`,
          { headers }
        );
        if (response.data?.rooms?.data && Array.isArray(response.data.rooms.data)) {
          const filteredRooms = response.data.rooms.data.filter(room => !room.finished_at);
          setRooms(filteredRooms);
          setTotalPages(response.data.rooms.last_page || 1);
        } else {
          console.warn("Formato inesperado da resposta:", response.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/';
        }
        console.error("Erro ao buscar salas:", error);
      }
    };
    fetchRooms();
  }, [token, currentPage]);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          console.warn("Nenhum token encontrado. Usuário não está logado.");
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.profile) {
          setUser(response.data.profile);
        } else {
          console.warn("Formato inesperado da resposta:", response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };
    fetchUser();
  }, [token]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get('roomId');
    if (roomId) {
      setSelectedRoom(roomId);
      sendToUnity(roomId);
    }
  }, [location.search]);
  const sendToUnity = (roomId, role) => {
    if (!isUnityReady) {
      console.error("Unity ainda não está pronto!");
      return;
    }

    if (!unityRef.current || !unityRef.current.SendMessage) {
      console.error("A instância do Unity WebGL ainda não está carregada corretamente!");
      return;
    }

    if (!roomId) {
      console.error("ID da sala é inválido.");
      return;
    }

    const message = JSON.stringify({
      room: roomId,
      token: token,
      role: role,

    });
    try {
      unityRef.current.SendMessage("ApiAuth", "ChangeRoom", message);
    } catch (error) {
      console.error("Erro ao enviar mensagem para Unity:", error);
    }
  };

  window.getReactData = () => {
    return JSON.stringify({ token: token, room_id: localStorage.getItem("selectedRoomId") });
  };
  return (
    <div className="container-fluid px-0">
      <NavInfo
        setIsPaymentSetOpen={setIsPaymentSetOpen}
        getIsPaymentGetOpen={getIsPaymentGetOpen}
      />
      <div className="row g-0">
        <div className="col-12 col-lg-3 ">
          {user?.role === "user" && (
            <div className="text-center mt-3">
              <button
                className="btn btn-secondary mx-2"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-white">Página {currentPage} de {totalPages}</span>
              <button
                className="btn btn-secondary mx-2"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Próxima
              </button>
            </div>
          )}
          <SidebarGame
            rooms={rooms}
            user={user}
            onRoomClick={setSelectedRoom}
            sendToUnity={sendToUnity}
          />
        </div>
        {isPaymentGetOpen && (
          <div style={{ borderRadius: "20px" }} className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-md" role="document">
              <div className="modal-content bg-black text-white">
                <div className="modal-header border-0">
                </div>
                <div className="modal-body">
                  <GetPayments onClose={() => getIsPaymentGetOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        )}
        {isPaymentSetOpen && (
          <div style={{ borderRadius: "20px" }} className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-md" role="document">
              <div className="modal-content bg-black text-white">
                <div className="modal-header border-0">
                </div>
                <div className="modal-body">
                  <SetPayments onClose={() => setIsPaymentSetOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="col-12 col-lg-9 d-flex justify-content-center align-items-center bg-dark">
          <div className="container-fluid flex-grow-1 text-center py-3">
            <UnityApp unityRef={unityRef} setIsUnityReady={setIsUnityReady} />
            <div style={{ borderRadius: '20px' }} className="bg-black text-white p-4 rounded-lg w-full max-w-4xl mx-auto shadow-lg">
              <hr className="border-gray-600 mb-4" />
              <div className="d-flex justify-content-center mb-4">
                <div className="bg-gray-800 text-white d-flex align-items-center rounded px-4 py-1 text-sm">
                  <span className="me-2">♠️ {percentages.card_left}</span>
                  <span className="fw-bold"><h2 className="m-5">Apostas</h2></span>
                  <span className="ms-2 text-danger">♥ {percentages.card_right}</span>
                </div>
              </div>
              {loading ? (
                <div className="text-center text-white">Carregando apostas...</div>
              ) : (
                <div className="row">
                  {apostas.length > 0 ? (
                    apostas.map((aposta, index) => (
                      <div key={index} className="col-6 d-flex justify-content-between p-2 border-bottom border-gray-700">
                        <span>{aposta.user_name}</span>
                        <span className="d-flex align-items-center">
                          R$ {parseFloat(aposta.bet_value).toFixed(2)}
                          {aposta.card === "25" ? " ♠️" : aposta.card === "34" ? " ♥" : " N/A"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center text-white">Nenhuma aposta registrada.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Game;
