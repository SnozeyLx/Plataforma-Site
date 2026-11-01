import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { API_URLS } from "../../routes";
const spinner = "/assets/img/hugeicons_loading-03.png";
const RecoveryPass = "/assets/img/recoverypass.png";
import "animate.css";
function openSuccessModal() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  const close = () => {
    root.unmount();
    host.remove();
  };
  function SuccessModal() {
    useEffect(() => {
      const onKeyDown = (e) => e.key === "Escape" && close();
      document.addEventListener("keydown", onKeyDown);

      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = prevOverflow;
      };
    }, []);
    return (
      <>
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            zIndex: 1050,
          }}
        />
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 16,         
            right: 16,        
            zIndex: 1051,
            padding: 0,
          }}
        >
          <div
            className="animate__animated animate__fadeInDown"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(92vw, 380px)",
              background: "#fff",
              color: "#030000",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,.35)",
              padding: 14,
            }}
          >
            <div
              className="poppins-regular"
              style={{
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <img src={RecoveryPass} alt="" />
              <span style={{
                marginRight: "170px"
              }}>Recuperar senha</span>
              <button
                type="button"
                className="btn-close btn-close-dark"
                aria-label="Fechar"
                onClick={close}
              />
            </div>
            <p className="poppins-regular" style={{ fontSize: 12, marginTop: 10 }}>
              Para redefinir sua senha, verifique seu e-mail e clique no link de
              recuperação que enviamos.
            </p>
          </div>
        </div>
      </>
    );
  }
  root.render(<SuccessModal />);
}

const ModalForgot = ({ onClose }: any) => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleForgotPassword = async () => {
    setError("");
    setLoading(true);
    if (!email) {
      setError("Informe seu e-mail.");
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${API_URLS.BASE}/reset/forgot-password`, { email });
      openSuccessModal();
      onClose?.();
    } catch (err) {
      setError(
        "Não foi possível processar sua solicitação. Verifique seu e-mail e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h4 style={{ fontSize: "20px" }} className="text-white mb-4 poppins-bold">
        Esqueci a minha senha
      </h4>
      {error && (
        <p className="text-danger text-center animate__animated animate__shakeX">
          {error}
        </p>
      )}
      <div className="mb-3 poppins-semibold">
        <input
          style={{ backgroundColor: "#1A242D", height: "42px", fontSize: "12px" }}
          type="email"
          className="form-control text-light border-0"
          placeholder="Endereço de e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button
        onClick={handleForgotPassword}
        className="btn btn-danger w-100 d-flex align-items-center justify-content-center animate__animated animate__pulse"
        style={{ gap: "10px", height: "45px", background: "#F70004" }}
        disabled={loading}
      >
        {loading && (
          <img
            src={spinner}
            alt="Loading..."
            style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }}
          />
        )}
        {loading ? "Carregando..." : "Recuperar senha"}
      </button>
    </div>
  );
};
export default ModalForgot;
