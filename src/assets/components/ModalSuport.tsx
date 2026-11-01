import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import seta from "../img/Icon_seta.png";
const ModalSuport = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px" }}>
        <div className="modal-content bg-dark text-white p-4">
          <div className="d-flex justify-content-end">
            <button className="btn bg-dark" style={{ color: "white" }} type="button" onClick={onClose}>X</button>
          </div>
          <h4 className="mb-3">Suporte online</h4>
          <p>Para iniciar o chat online, digite seu e-mail no campo abaixo:</p>
          <div className="position-relative w-100" style={{ maxWidth: "360px" }}>
            <input
              type="text"
              className="form-control bg-secondary text-light border-0 pe-5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Digite sua mensagem..."
              style={{ paddingRight: "45px" }}
            />
            <button
              type="button"
              onClick={(e) => setMessage(e.target.value)}
              className="btn p-0 position-absolute"
              style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
            >
              <img src={seta} alt="Enviar" style={{ height: "20px" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalSuport;
