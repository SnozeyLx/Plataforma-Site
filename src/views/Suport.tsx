import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import Vetor from "../assets/img/Vector.png";
import NavInfo from "../assets/components/NavInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import call from "../assets/img/callCenter.png";
import "animate.css";
const Suport = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const API_BASE = "http://api.rondaonlinebr.com";
  const API_URL = `${API_BASE}/support/email`;
  const WHATSAPP_NUMBER = "5521994534692";
  const handleOpenWhatsapp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const showMsg = (msg, type = "success", ms = 3000) => {
    setAlertMessage(msg);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), ms);
  };
  const handleEmailSend = async () => {
    if (!emailSubject || !emailMessage) {
      showMsg("Preencha todos os campos antes de enviar.", "error", 3000);
      return;
    }
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");
    if (!token) {
      showMsg("Você precisa estar logado para enviar. Token não encontrado.", "error", 4000);
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: emailSubject,
          message: emailMessage,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg =
          data?.message ||
          (data?.errors ? Object.values(data.errors).flat().join(" ") : null) ||
          "Erro ao enviar e-mail.";
        throw new Error(msg);
      }
      showMsg(data?.message || "Mensagem enviada com sucesso!", "success", 3000);
      setEmailSubject("");
      setEmailMessage("");
    } catch (error) {
      showMsg(error.message || "Erro ao enviar.", "error", 4000);
    }
  };
  return (
    <div>
      <NavInfo />
      <div className="row g-0">
        <div className="col-12 container ">
          <div
            style={{
              backgroundColor: "#1A242D",
              borderRadius: "8px",
              height: "40px",
            }}
            className="mt-3 d-flex justify-content-between align-items-center px-3 py-2"
          >
            <p
              className="text-white fs-5 m-0 d-flex align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(ROUTES.HOME)}
            >
              <img
                style={{ fontSize: "20px" }}
                src={Vetor}
                alt="Voltar"
                className="me-2 poppins-semibold"
              />
              Suporte
            </p>
          </div>
        </div>
        <div className="container-fluid ">
          <div className="col-12 col-lg-12">
            <div
              style={{
                backgroundColor: "#1A242D",
                borderRadius: "8px",
                marginTop: "22px",
              }}
              className="p-0 mt-3  text-white"
            >
              {activeTab === "whatsapp" && (
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 text-center">
                      <img
                        style={{ marginTop: "50px" }}
                        width={"390px"}
                        className="img-fluid justify-content-center align-items-center"
                        src={call}
                        alt=""
                      />
                      <h3
                        className="poppins-bold"
                        style={{ marginTop: "50px", fontSize: "20px" }}
                      >
                        Precisando de ajuda?
                      </h3>
                      <p>
                        Estamos aqui para te atender! Escolha a melhor forma de
                        entrar em contato com
                      </p>
                      <p>nosso time de suporte e tire suas dúvidas rapidamente.</p>
                    </div>
                    <div className="col text-center">
                      <button
                        style={{
                          backgroundColor: "#FFFFFF1A",
                          color: "#ffff",
                          maxWidth: "631px",
                        }}
                        onClick={() => setActiveTab("email")}
                        className="btn btn-lg w-100 mb-3"
                      >
                        Atendimento por e-mail
                      </button>
                      <button
                        style={{
                          backgroundColor: "#60D669",
                          maxWidth: "631px",
                        }}
                        onClick={handleOpenWhatsapp}
                        className="btn btn-lg w-100 mb-3"
                      >
                        Atendimento Whatsapp
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "email" && (
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 text-center">
                      <h3 className="d-none d-lg-block">Atendimento por E-mail</h3>
                      {showAlert && (
                        <div
                          className={`alert ${alertType === "success" ? "alert-success" : "alert-danger"
                            } animate__animated animate__${alertType === "success" ? "bounceIn" : "shakeX"
                            }`}
                          role="alert"
                        >
                          {alertMessage}
                        </div>
                      )}
                      <input
                        ref={inputRef}
                        style={{
                          backgroundColor: "#0F1923",
                          borderRadius: "4px",
                        }}
                        className="form-control text-white mb-3"
                        type="text"
                        placeholder="Assunto"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                      <textarea
                        rows={20}
                        style={{
                          backgroundColor: "#0F1923",
                          borderRadius: "4px",
                        }}
                        className="form-control text-white mb-3"
                        placeholder="Mensagem"
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                      ></textarea>
                      <p>
                        Quanto mais detalhes você nos enviar, mais rápido conseguiremos
                        te ajudar. Se puder, inclua horários e o
                      </p>
                      <p className="mb-3">
                        que você estava fazendo quando o problema aconteceu.
                      </p>
                    </div>
                    <div className="container-fluid w-100 text-center">
                      <button
                        style={{
                          backgroundColor: "#FFFFFF1A",
                          color: "#ffff",
                          maxWidth: "631px",
                        }}
                        onClick={handleEmailSend}
                        className="btn btn-lg w-100 mb-3"
                      >
                        Enviar e-mail
                      </button>
                      <button
                        style={{
                          backgroundColor: "#60D669",
                          maxWidth: "631px",
                        }}
                        onClick={() => setActiveTab("whatsapp")}
                        className="btn btn-lg w-100 mb-3"
                      >
                        Atendimento Whatsapp
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Suport;
