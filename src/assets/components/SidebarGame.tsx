import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import 'animate.css';
import { ROUTES, API_URLS, SOCKET_URLS } from '../../routes';
const SidebarGame = ({ rooms = [], botRooms = [], onRoomClick, sendToUnity, user = {} as any }: any) => {
  const token = localStorage.getItem("authToken") || "";
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [lastRoomOpen, setLastRoomOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  useEffect(() => {
    const savedRoomId = localStorage.getItem("selectedRoomId");
    if (savedRoomId) {
      const room = rooms.find((r) => r.id === parseInt(savedRoomId, 10));
      if (room) {
        sendToUnity(room.id);
        onRoomClick(room.id);
      }
    }
  }, [rooms, sendToUnity, onRoomClick]);
  useEffect(() => {
    const fetchLastRoom = async () => {
      try {
        const response = await axios.get(`${API_URLS.BASE}/rooms/4`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.room) {
          if (!response.data.room.finished_at) {
            setLastRoomOpen(true);
            setSelectedRoom(response.data.room);
            sendToUnity(4);
            onRoomClick(4);
            localStorage.setItem("selectedRoomId", response.data.room.id);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar a última sala:", error);
      }
    };

    if (user?.role === "dealer") {
      fetchLastRoom();
    }
  }, [token, user?.role, sendToUnity, onRoomClick]);
  const handleRoomClick = (room) => {
    sendToUnity(4);
    onRoomClick(4);
    localStorage.setItem("selectedRoomId", room.id);
  };
  const handleFinishRoom = async () => {
    if (!selectedRoom) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await axios.get(
        `${API_URLS.BASE}/rooms/${selectedRoom.id}/finish`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        localStorage.removeItem('chatMessages');
        const ws = new WebSocket(SOCKET_URLS.CHAT);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'room_closed',
            room_id: selectedRoom.id,
            message: 'A sala foi encerrada pelo dealer'
          }));
          ws.close();
        };
        setLastRoomOpen(false);
        setSelectedRoom(null);
        localStorage.removeItem("selectedRoomId");
        setMessage("Sala encerrada com sucesso. Usuários foram expulsos e chat limpo.");
        window.location.reload();
      } else {
        setMessage("Erro ao encerrar a sala.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao encerrar a sala.");
      console.error("Erro ao encerrar sala:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmFinishRoom = () => {
    setShowConfirmModal(true);
  };
  const handleFinishRoomConfirmed = async () => {
    setShowConfirmModal(false);
    await handleFinishRoom();
  };
  window.getReactData = () => {
    return JSON.stringify({
       live_url: "https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8", // Usando a live_url do estado
      token: localStorage.getItem("authToken"),
      room_id: 4,
    });
  }
  const renderRoomsList = () => {
    return rooms
      .filter((room) => !room.finished_at)
      .map((room, index) => (
        <li
          key={room.id}
          className="table-borderless"
          style={{
            cursor: "pointer",
            backgroundColor: index % 2 === 0 ? "#000000" : "#333333",
            color: "#ffffff",
            padding: "0px",
            transition: "background-color 0.3s ease",
            height: "40px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "red")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#000000" : "#333333")
          }
        >
          <button
            className="btn btn-lg animate__animated animate__fadeInUp"
            style={{ height: "40px", color: "#ffffff", width: "100%" }}
            onClick={() => handleRoomClick(room)}
          >
            Ronda ao Vivo
          </button>
        </li>
      ));
  };
  return (
    <div className="container-fluid d-flex flex-column animate__animated animate__fadeIn">
      <div className="d-flex flex-column p-3 text-center w-100" style={{ backgroundColor: "#000000" }}>
        {/* Botões para dealers */}
        {user?.role === "dealer" && (
          <div className="mt-3">
            {!lastRoomOpen ? (
              <button className="btn btn-success w-100 mb-2 animate__animated animate__bounceIn" disabled={loading}>
                Criar Sala
              </button>
            ) : (
              <button 
                className="btn btn-danger w-100 mb-2 animate__animated animate__pulse" 
                onClick={handleConfirmFinishRoom}
                disabled={loading}
              >
                Encerrar Sala
              </button>
            )}
            {message && <p style={{ color: "white", marginTop: "10px" }}>{message}</p>}
          </div>
        )}
        {user?.role === "dealer" && selectedRoom && (
          <div className="mt-3">
            <h5 style={{ color: "white" }}>Sala do Dealer</h5>
            <ul className="list-group">
              <li
                className="table-borderless"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  padding: "0px",
                  transition: "background-color 0.3s ease",
                  height: "40px",
                }}
              >
                <button
                  className="btn btn-lg"
                  style={{ height: "40px", color: "#ffffff", width: "100%" }}
                  onClick={() => handleRoomClick(selectedRoom)}
                >
                  Mesa ao Vivo {selectedRoom.id}
                </button>
              </li>
            </ul>
          </div>
        )}
        {user?.role === "user" && (
          <div className="mt-3">
            <button className="btn btn-danger w-100 mb-2">Ronda ao vivo</button>
          </div>
        )}
      </div>
      {showConfirmModal && (
        <div className="modal fade show d-block animate__animated animate__fadeIn" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content animate__animated animate__slideInDown">
              <div className="modal-header bg-dark border-0">
                <h5 className="modal-title text-white">Confirmar Encerramento</h5>
                <button type="button" className="btn-close text-white" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body bg-dark">
                <p className="text-white">Tem certeza que deseja encerrar a sala? Todos os usuários serão expulsos e o chat será limpo.</p>
              </div>
              <div className="modal-footer bg-dark border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleFinishRoomConfirmed} disabled={loading}>
                  Encerrar Sala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SidebarGame;