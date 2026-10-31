import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URLS } from "../routes";
import Logo from "../assets/img/logo.jpg";
import spinner from '../assets/img/hugeicons_loading-03.png';
import "animate.css";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";


const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => params.get("token") || "", [params]);
  const email = useMemo(() => params.get("email") || "", [params]);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const [ShowPassword, setShowPassword] = useState(false);
  const [ShowPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!token || !email) {
      setError("Link inválido: token ou e-mail ausente.");
      return;
    }

    if (!password || !passwordConfirmation) {
      setError("Preencha a nova senha e a confirmação.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      };

      const { data } = await axios.post(`${API_URLS.BASE}/reset/reset-password`, payload);

      if (data?.success) {
        setSuccess("Senha redefinida com sucesso! Redirecionando para o login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data?.message || "Não foi possível redefinir a senha.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Token inválido/expirado ou dados incorretos. Solicite um novo link.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="container" style={{ maxWidth: 420, marginTop: "200px" }}>
      <div className="row">
        <img style={{
          width: "180px",
          marginLeft: "110px"
        }}
          className="text-center img-fluid mb-3" src={Logo} alt="" />
        <h4 className="text-center text-white mb-4 poppins-bold" style={{ fontSize: "20px" }}>
          Redefinir senha
        </h4>
      </div>

      {error && <p className="text-danger text-center animate__animated animate__shakeX">{error}</p>}
      {success && <p className="text-success text-center animate__animated animate__bounceIn">{success}</p>}

      <div className="mb-3 poppins-semibold">
        <input
          style={{ backgroundColor: "#1A242D", height: "42px", fontSize: "12px" }}
          type="email"
          className="form-control text-light border-0"
          value={email}
          disabled
        />
      </div>

      <div className="mb-3 poppins-semibold">
        <div className="input-group">
          <input
            style={{ backgroundColor: "#1A242D", height: "42px", fontSize: "12px" }}
            type={ShowPassword ? "text" : "password"}
            className="form-control text-light border-0"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
            className="btn"
            type="button"
            onClick={() => setShowPassword(!ShowPassword)}
          >
            {ShowPassword ? <EyeSlashFill /> : <EyeFill />}
          </button>
        </div>
      </div>


      <div className="mb-3 poppins-semibold">
        <div className="input-group">
          <input
            style={{ backgroundColor: "#1A242D", height: "42px", fontSize: "12px" }}
            type={ShowPasswordConfirmation ? "text" : "password"}
            className="form-control text-light border-0"
            placeholder="Confirmar nova senha"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button
            style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
            className="btn"
            type="button"
            onClick={() =>
              setShowPasswordConfirmation(!ShowPasswordConfirmation)
            }
          >
            {ShowPasswordConfirmation ? <EyeSlashFill /> : <EyeFill />}
          </button>
        </div>
      </div>


      <button
        onClick={handleReset}
        className="btn btn-danger w-100 d-flex align-items-center justify-content-center animate__animated animate__pulse"
        style={{ gap: "10px", height: "45px", background: "#F70004" }}
        disabled={loading}
      >
        {loading && (
          <img
             src={spinner}
            alt="Loading..."
            style={{ width: "20px", height: "20px", animation: "spin 1s linear infinite" }}
          />
        )}
        {loading ? "Carregando..." : "Salvar nova senha"}
      </button>
    </div>
  );
};

export default ResetPassword;
