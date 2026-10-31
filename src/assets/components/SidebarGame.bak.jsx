import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
const SidebarGame = ({ rooms = [], botRooms = [], onRoomClick, sendToUnity, user = {} }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLiveDropdownOpen, setIsLiveDropdownOpen] = useState(false);
  const [isBotDropdownOpen, setIsBotDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");
  const [lastRoomOpen, setLastRoomOpen] = useState(false);
  const liveDropdownRef = useRef(null);
  const botDropdownRef = useRef(null);
  const token = localStorage.getItem("authToken") || "";
  useEffect(() => {
    const savedRoomId = localStorage.getItem("selectedRoomId");
    if (savedRoomId) {
      const room = rooms.find((r) => r.id === parseInt(savedRoomId, 10));
      if (room) {
        setSelectedRoom(room);
        sendToUnity(room.id);
        onRoomClick(room.id);
      }
    }
  }, [rooms, sendToUnity, onRoomClick]);
  useEffect(() => {
    if (user?.role === "dealer") {
      const fetchLastRoom = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rooms/${ localStorage.getItem("selectedRoomId")}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data?.room) {
            if (!response.data.room.finished_at) {
              setLastRoomOpen(true);
              setSelectedRoom(response.data.room);
              sendToUnity(response.data.room.id); 
              onRoomClick(response.data.room.id);
              localStorage.setItem("selectedRoomId", response.data.room.id);
            };
          }
        } catch (error) {
          console.error("Erro ao buscar a última sala:", error);
        }
      };
      fetchLastRoom();
    }
  }, [token, user?.role, sendToUnity, onRoomClick]);
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    sendToUnity(room.id);
    onRoomClick(room.id);
    setIsLiveDropdownOpen(false);
    setIsBotDropdownOpen(false);
    localStorage.setItem("selectedRoomId", room.id);
  };
  const handleCreateRoom = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/rooms`,
        { live_url: liveUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const roomId = response.data.id || response.data.room?.id;
        const liveUrlResponse = response.data.live_url || response.data.room?.live_url;
        if (roomId && liveUrlResponse) {
          const newRoom = { id: roomId, live_url: liveUrlResponse };
          handleRoomClick(newRoom);
          setShowModal(false);
          setLiveUrl("");
        } else {
          setMessage("Erro ao obter ID ou URL da sala.");
        }
      } else {
        setMessage("Erro ao criar a sala.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao criar a sala.");
      console.error("Erro ao criar sala:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFinishRoom = async () => {
    if (!selectedRoom) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/rooms/${selectedRoom.id}/finish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setLastRoomOpen(false);
        setSelectedRoom(null);
        localStorage.removeItem("selectedRoomId");
        setMessage("Sala encerrada com sucesso.");
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
  const renderRooms = (roomsList) => {
    if (roomsList.length === 0) {
      return <li className="list-group-item text-center text-white">Nenhuma sala ativa no momento.</li>;
    }
    return roomsList
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
            className="btn btn-lg"
            style={{ height: "40px", color: "#ffffff", width: "100%" }}
            onClick={() => handleRoomClick(room)}
          >
            {room.type === "bot" ? `Mesa Bot ${room.id}` : `Mesa ao Vivo ${room.id}`}
          </button>
        </li>
      ));
  };
  return (
    <div className="container-fluid d-flex flex-column">
      <div className="d-flex flex-column p-3 text-center w-100" style={{ backgroundColor: "#000000" }}>
        {user?.role === "dealer" && !lastRoomOpen && (
          <div>
            <button
              style={{ width: "100%" }}
              className="btn btn-dark"
              type="button"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              Criar Sala
            </button>
            {message && <p style={{ color: "white", marginTop: "10px" }}>{message}</p>}
          </div>
        )}
        {user?.role === "dealer" && lastRoomOpen && (
          <div>
            <button
              style={{ width: "100%", background: "red" }}
              className="btn btn-danger"
              type="button"
              onClick={handleConfirmFinishRoom}
              disabled={loading}
            >
              Encerrar Sala
            </button>
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
        {selectedRoom && selectedRoom.live_url && (
          <div className="embed-responsive embed-responsive-16by9 mt-3">
            <embed className="embed-responsive-item" src={selectedRoom.live_url} allowFullScreen />
          </div>
        )}
        {user?.role === "user" && (
          <>
            <div className="dropdown-center mt-3" ref={liveDropdownRef}>
              <button
                style={{ background: "red", width: "100%" }}
                className="btn dropdown-toggle"
                type="button"
                onClick={() => {
                  setIsLiveDropdownOpen(!isLiveDropdownOpen);
                  setIsBotDropdownOpen(false);
                }}
                aria-expanded={isLiveDropdownOpen}
              >
                Mesas ao Vivo
              </button>
              <ul
                className="dropdown-menu"
                style={{
                  width: "100%",
                  backgroundColor: "#000000",
                  maxHeight: "209px",
                  overflowY: "auto",
                  display: isLiveDropdownOpen ? "block" : "none",
                }}
              >
                {renderRooms(rooms)}
              </ul>
            </div>
            <div className="dropdown-center mt-3" ref={botDropdownRef}>
              <button
                style={{ background: "red", width: "100%" }}
                className="btn dropdown-toggle"
                type="button"
                onClick={() => {
                  setIsBotDropdownOpen(!isBotDropdownOpen);
                  setIsLiveDropdownOpen(false);
                }}
                aria-expanded={isBotDropdownOpen}
              >
                Mesas Bot
              </button>
              <ul
                className="dropdown-menu"
                style={{
                  width: "100%",
                  backgroundColor: "#000000",
                  maxHeight: "209px",
                  overflowY: "auto",
                  display: isBotDropdownOpen ? "block" : "none",
                }}
              >
                {renderRooms(botRooms)}
              </ul>
            </div>
          </>
        )}
      </div>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-dark border-0">
                <h5 className="modal-title text-white">Criar Nova Sala</h5>
                <button type="button" className="btn-close text-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body bg-dark">
                <label>URL da Live:</label>
                <input
                  type="text"
                  className="form-control bg-secondary text-white"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="Insira a URL da live..."
                />
              </div>
              <div className="modal-footer bg-dark border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateRoom} disabled={loading}>
                  Criar Sala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-dark border-0">
                <h5 className="modal-title text-white">Confirmar Encerramento</h5>
                <button type="button" className="btn-close text-white" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body bg-dark">
                <p className="text-white">Tem certeza que deseja encerrar a sala?</p>
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