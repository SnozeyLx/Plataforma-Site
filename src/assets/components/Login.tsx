import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES, API_URLS } from "../../routes";
import axios from "axios";
const logo = "/assets/img/logo.jpg";
const spinner = "/assets/img/hugeicons_loading-03.png";
import ModalForgout from "../components/ModalForgout";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import "animate.css";
const Login = ({ onClose, onOpenRegister }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const router = useRouter();

  const handleOpenRegister = () => {
    onClose?.();
    onOpenRegister?.();
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_URLS.BASE}/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem("authToken", token);

      onClose?.();
      router.push(ROUTES.HOME);
    } catch (err) {
      if (!err.response) {
        setError("Sem conexão com o servidor. Tente novamente.");
        return;
      }
      const { status, data } = err.response;
      if (status === 401 || status === 403) {
        setError("Usuário ou senha incorretos");
        return;
      }
      const errors = data?.errors;
      if (errors && typeof errors === "object") {
        const firstMsg =
          (errors.cpf && errors.cpf[0]) ||
          (errors.email && errors.email[0]) ||
          Object.values(errors)?.flat()?.[0];
        setError(firstMsg || "Dados inválidos.");
        return;
      }
      setError(data?.message || "Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  if (showForgot) {
    return <ModalForgout onClose={() => setShowForgot(false)} />;
  }
  return (
    <div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div>
        <div className="container d-flex justify-content-center mb-5">
          <img className="text-center" width="169px" src={logo} alt="Logo" />
        </div>
        <div className="text-center">
          <h4
            onClick={handleOpenRegister}
            style={{ fontSize: "16px", display: "inline-block", cursor: "pointer" }}
            className="mb-4 poppins-semibold border-bottom"
          >
            Cadastre-se na Ronda Online
          </h4>
        </div>
        {error && <p className="text-danger text-center">{error}</p>}
        <div className="mb-3">
          <input
            style={{ backgroundColor: "#0F1923", fontSize: "12px", height: "42px" }}
            type="email"
            className="form-control border-0 poppins-semibold text-white"
            placeholder="Endereço de e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <div className="input-group">
            <input
              style={{ backgroundColor: "#0F1923", fontSize: "12px", height: "42px" }}
              type={showPassword ? "text" : "password"}
              className="form-control border-0 poppins-semibold text-white"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              style={{ backgroundColor: "#0F1923" }}
              className="btn"
              type="button"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeSlashFill /> : <EyeFill />}
            </button>
          </div>
        </div>
        <div className="mb-3">
          <button
            style={{ fontSize: "12px" }}
            onClick={() => setShowForgot(true)}
            className="btn btn-link text-light poppins-semibold text-decoration-none small"
            type="button"
          >
            Esqueci a minha senha
          </button>
        </div>
        <button
          onClick={handleLogin}
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center animate__animated animate__pulse"
          style={{ gap: "10px", height: "45px", background: "#F70004" }}
          disabled={loading}
          type="button"
        >
          {loading && (
            <img
              src={spinner}
              alt="Carregando..."
              style={{ width: "20px", height: "20px", animation: "spin 1s linear infinite" }}
            />
          )}
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
};
export default Login;
