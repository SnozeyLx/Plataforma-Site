import React, { useEffect, useState } from "react";
const Logo = "/assets/img/logo.jpg";
const card = "/assets/img/imagem-cadastro 1.png";
const circle = "/assets/img/circle.png";
const spinner = "/assets/img/hugeicons_loading-03.png";
import { useRouter } from "next/navigation";
import { ROUTES, API_URLS } from "../../routes";
import axios from "axios";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import "animate.css";
const Register = ({ onClose, hideCloseButton = false }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [tracker, setTracker] = useState("");
  const params = new URLSearchParams(window.location.search);
  const btag = params.get("btag");
  useEffect(() => {
    setTracker(btag || "");
  }, [btag]);
  const router = useRouter();
  const checkPasswordRequirements = (password) => ({
    length: password.length >= 8 && password.length <= 30,
    upperLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  });
  const validatePassword = (password) => {
    const r = checkPasswordRequirements(password);
    if (!r.length) return "A senha deve ter entre 8 e 30 caracteres";
    if (!r.upperLower) return "A senha deve conter letras maiúsculas e minúsculas";
    if (!r.number) return "A senha deve conter pelo menos um número";
    return "";
  };
  const normalizeApiErrors = (data) => {
    const raw = data?.errors;

    if (raw && typeof raw === "object") {
      const normalized = {};
      for (const [key, value] of Object.entries(raw)) {
        if (Array.isArray(value)) normalized[key] = value.filter(Boolean);
        else if (typeof value === "string") normalized[key] = [value];
        else if (value != null) normalized[key] = [String(value)];
      }
      return normalized;
    }
    if (typeof data?.error === "string") return { _form: [data.error] };
    if (typeof data?.message === "string" && data.message && data.message !== "Bad request") {
      return { _form: [data.message] };
    }
    return {};
  };
  const getFieldError = (field) => fieldErrors?.[field]?.[0] || "";
  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev?.[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };
  const handleFieldFocus = (fieldName) => setFocusedField(fieldName);
  const handleFieldBlur = () => setFocusedField(null);
  const getFieldClass = (fieldName) => {
    const baseClass = "form-control text-light border-0";
    const hasError = !!fieldErrors?.[fieldName]?.length;
    if (focusedField === fieldName || hasError) {
      return `${baseClass} border border-danger border-2`;
    }
    return baseClass;
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearFieldError("email");
    clearFieldError("_form");
  };
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(value);
    clearFieldError("cpf");
    clearFieldError("_form");
  };
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else {
      value = value.replace(/^(\d*)$/, "($1");
    }
    setPhone(value);
    clearFieldError("phone");
    clearFieldError("_form");
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    clearFieldError("password");
    clearFieldError("_form");
    const msg = validatePassword(newPassword);
    setPasswordError(msg);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    if (!acceptedTerms) {
      setFieldErrors({ terms: ["Você deve aceitar os termos de serviço"] });
      return;
    }
    const pwdMsg = validatePassword(password);
    if (pwdMsg) {
      setPasswordError(pwdMsg);
      return;
    }
    setLoading(true);
    try {
      const cpfClean = cpf.replace(/\D/g, "");
      const response = await axios.post(`${API_URLS.BASE}/register`, {
        tracker,
        email,
        phone,
        password,
        cpf: cpfClean,
      });
      localStorage.setItem("authToken", response.data.token);
      onClose?.();
      router.push(ROUTES.HOME);
    } catch (err) {
      if (!err?.response) {
        setFieldErrors({});
        return;
      }
      const data = err?.response?.data;
      const normalized = normalizeApiErrors(data);
      setFieldErrors(normalized);
    } finally {
      setLoading(false);
    }
  };
  const passwordRequirements = checkPasswordRequirements(password);
  return (
    <div
      style={{ backgroundColor: "#1A242D" }}
      className="w-1/2 text-white flex flex-col justify-center items-center p-10"
    >
      <form onSubmit={handleRegister}>
        <div className="row">
          <div className="d-none d-lg-block col-6">
            <img src={card} alt="Ronda Online" className="img-fluid" />
            <div className="d-flex justify-content-center">
              <p style={{ marginTop: "-70px" }} className="d-none d-lg-block">
                <img className="p-1 mb-1" src={circle} alt="" />
                Jogue com responsabilidade
              </p>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 d-flex flex-column align-items-center">
            <div className="d-flex justify-content-end w-100 m-1 p-3">
              {!hideCloseButton && (
                <button
                  className="btn bg-dark"
                  style={{ color: "white" }}
                  type="button"
                  onClick={() => onClose?.()}
                >
                  X
                </button>
              )}
            </div>
            <div className="text-center mb-3">
              <img src={Logo} width="200px" alt="Ronda Online" className="img-fluid" />
              <p>Cadastre-se na Ronda Online</p>
            </div>
            {!!getFieldError("_form") && (
              <p className="text-danger text-sm mb-2" style={{ width: "100%", maxWidth: "360px" }}>
                {getFieldError("_form")}
              </p>
            )}
            {focusedField === "password" && (
              <div
                className="card mb-2 p-2"
                style={{
                  background: "#404E5A",
                  color: "#fff",
                  fontSize: "12px",
                  width: "100%",
                  maxWidth: "360px",
                }}
              >
                <ul className="list-unstyled mb-0">
                  <li style={{ color: passwordRequirements.length ? "#10B981" : "#B8BABD" }}>
                    {passwordRequirements.length ? "✓" : "✗"} Contém de 8 a 30 caracteres
                  </li>
                  <li style={{ color: passwordRequirements.upperLower ? "#10B981" : "#B8BABD" }}>
                    {passwordRequirements.upperLower ? "✓" : "✗"} Contém letras maiúsculas e minúsculas
                  </li>
                  <li style={{ color: passwordRequirements.number ? "#10B981" : "#B8BABD" }}>
                    {passwordRequirements.number ? "✓" : "✗"} Contém um número
                  </li>
                </ul>
              </div>
            )}
            <input type="hidden" name="tracker" value={tracker} />
            <div className="mb-1 w-100 d-flex justify-content-center">
              <input
                type="email"
                placeholder="Endereço de email *"
                value={email}
                onChange={handleEmailChange}
                className={getFieldClass("email")}
                onFocus={() => handleFieldFocus("email")}
                onBlur={handleFieldBlur}
                style={{ width: "100%", maxWidth: "360px", backgroundColor: "#0F1923" }}
                required
              />
            </div>
            {!!getFieldError("email") && (
              <p className="text-danger text-sm mb-2" style={{ width: "100%", maxWidth: "360px" }}>
                {getFieldError("email")}
              </p>
            )}
            <div className="mb-1 w-100 d-flex justify-content-center">
              <input
                type="text"
                placeholder="Número de Telefone *"
                value={phone}
                onChange={handlePhoneChange}
                className={getFieldClass("phone")}
                onFocus={() => handleFieldFocus("phone")}
                onBlur={handleFieldBlur}
                style={{ width: "100%", maxWidth: "360px", backgroundColor: "#0F1923" }}
                required
              />
            </div>
            {!!getFieldError("phone") && (
              <p className="text-danger text-sm mb-2" style={{ width: "100%", maxWidth: "360px" }}>
                {getFieldError("phone")}
              </p>
            )}
            <div className="mb-1 w-100 d-flex justify-content-center">
              <div className="input-group" style={{ width: "100%", maxWidth: "360px" }}>
                <input
                  style={{ backgroundColor: "#0F1923" }}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={getFieldClass("password")}
                  placeholder="Senha"
                  onFocus={() => handleFieldFocus("password")}
                  onBlur={handleFieldBlur}
                  required
                />
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashFill /> : <EyeFill />}
                </button>
              </div>
            </div>
            {!!passwordError && (
              <p className="text-danger text-sm mb-2" style={{ width: "100%", maxWidth: "360px" }}>
                {passwordError}
              </p>
            )}
            {!!getFieldError("password") && (
              <p className="text-danger text-sm mb-2" style={{ width: "100%", maxWidth: "360px" }}>
                {getFieldError("password")}
              </p>
            )}
            <div className="mb-1 w-100 d-flex justify-content-center">
              <input
                type="text"
                placeholder="CPF *"
                value={cpf}
                onChange={handleCpfChange}
                className={getFieldClass("cpf")}
                onFocus={() => handleFieldFocus("cpf")}
                onBlur={handleFieldBlur}
                style={{ width: "100%", maxWidth: "360px", backgroundColor: "#0F1923" }}
                required
              />
            </div>
            {!!getFieldError("cpf") && (
              <p className="text-danger text-sm mb-2" style={{ width: "100%", maxWidth: "360px" }}>
                {getFieldError("cpf")}
              </p>
            )}
            <div className="text-right mb-2 mr-3" style={{ width: "100%", maxWidth: "360px" }}>
              <p className="text-gray-200 text-sm hover:text-white">
                <input
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    clearFieldError("terms");
                  }}
                  type="checkbox"
                  name="terms"
                  required
                />{" "}
                Ao se inscrever você concorda com os
                <span className="text-danger">
                  <br />
                  termos de serviço
                </span>
              </p>
            </div>
            {!!getFieldError("terms") && (
              <p className="text-danger text-sm mb-3" style={{ width: "100%", maxWidth: "360px" }}>
                {getFieldError("terms")}
              </p>
            )}
            <button
              type="submit"
              className="btn btn-danger w-100 d-flex align-items-center justify-content-center animate__animated animate__pulse"
              style={{ maxWidth: "360px", height: "45px", gap: "10px", background: "#F70004" }}
              disabled={loading}
            >
              {loading && (
                <img
                  src={spinner}
                  alt="Carregando..."
                  className="animate__animated animate__spin"
                  style={{ width: "20px", height: "20px" }}
                />
              )}
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

            <div className="container d-flex justify-content-center mt-3">
              <p className="d-lg-none d-lg-block">
                <img className="p-1 mb-1" src={circle} alt="" />
                Jogue com responsabilidade
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Register;
