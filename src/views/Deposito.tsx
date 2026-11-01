import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES, API_URLS } from '../routes';
import NavInfo from "../assets/components/NavInfo";
const Vectorpay = "/assets/img/Vectorpay.png";
const Looping = "/assets/img/looping.png";
const crop = "/assets/img/crop.png";
const Copia = "/assets/img/copia.png";
const CopiarQr = "/assets/img/copiarQr.png";
const DEPOSIT_KEY = "activeDeposit";
const MAX_SECONDS = 82800;
const Deposito = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [value, setValue] = useState(0);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [status, setStatus] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [seconds, setSeconds] = useState(MAX_SECONDS);
  const api = axios.create({
    baseURL: API_URLS.BASE,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  });
  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId).then(() => {
        setShowCopyToast(true);
        setTimeout(() => {
          setShowCopyToast(false);
        }, 3000);
      }).catch(() => {
        alert("Falha ao copiar ID.");
      });
    }
  };
  const saveToLocalStorage = (data) => {
    localStorage.setItem(DEPOSIT_KEY, JSON.stringify(data));
  };
  const clearLocalStorage = () => {
    localStorage.removeItem(DEPOSIT_KEY);
  };
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem(DEPOSIT_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!parsed?.createdAt) return null;
    const age = Math.floor((Date.now() - new Date(parsed.createdAt).getTime()) / 1000);
    if (age >= MAX_SECONDS || parsed.status === "paid" || parsed.status === "expired") {
      clearLocalStorage();
      return null;
    }

    return { ...parsed, seconds: MAX_SECONDS - age };
  };
  const fetchDepositData = async (val) => {
    try {
      clearLocalStorage();
      setLoading(true);
      const response = await api.post(`/balance/deposit`, {
        value: parseFloat(val),
      });
      const { qrCode, qrCodeImage, paymentLink, statement_id } = response.data;
      const now = new Date().toISOString();
      const depositData = {
        value: parseFloat(val),
        qrCode,
        qrCodeImage,
        paymentLink,
        orderId: statement_id,
        status: "pending",
        createdAt: now,
      };
      saveToLocalStorage(depositData);
      setValue(depositData.value);
      setQrCode(depositData.qrCode);
      setQrCodeImage(depositData.qrCodeImage);
      setPaymentLink(depositData.paymentLink);
      setCreatedAt(depositData.createdAt);
      setOrderId(depositData.orderId);
      setStatus(depositData.status);
      setSeconds(MAX_SECONDS);
    } catch (error) {
      console.error("Erro ao criar depósito:", error);
      alert("Erro ao criar depósito.");
      router.push(ROUTES.WALLET);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const raw = searchParams.get("value");
    const val = raw == null ? null : Number(raw);
    if (val == null || isNaN(val)) {
      alert("Valor inválido");
      router.push(ROUTES.WALLET);
      return;
    }
    fetchDepositData(val);
  }, [searchParams, router]);

  useEffect(() => {
    if (!orderId || status === "paid") return;

    const statusInterval = setInterval(async () => {
      try {
        const response = await api.get(`/balance/statements/${orderId}`);
        const paymentStatus = response.data?.statement?.status?.toLowerCase();

        if (paymentStatus && paymentStatus !== status) {
          if (paymentStatus === "paid") {
            setStatus("paid");
            clearInterval(statusInterval);
            clearLocalStorage();

            setTimeout(() => {
              router.push(ROUTES.GAME);
            }, 60000);
          } else if (paymentStatus === "expired") {
            setStatus("expired");
            clearLocalStorage();
          } else {
            setStatus(paymentStatus);
            saveToLocalStorage({
              value,
              qrCode,
              qrCodeImage,
              paymentLink,
              orderId,
              status: paymentStatus,
              createdAt,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status do pagamento:", error);
      }
    }, 2000);
    return () => clearInterval(statusInterval);
  }, [orderId, status, router]);
  useEffect(() => {
    if (!orderId || status === "paid") return;
    if (seconds <= 0) {
      setStatus("expired");
      clearLocalStorage();
      return;
    }
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, orderId, status]);
  const handleCopyCode = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      alert("Código copiado!");
    }
  };
  const handleGenerateNew = () => {
    clearLocalStorage();
    fetchDepositData(value);
  };
  const getStatusText = (rawStatus) => {
    switch (rawStatus?.toLowerCase()) {
      case "paid":
        return "Concluído";
      case "pending":
        return "Pendente";
      case "expired":
        return "Expirado";
      default:
        return rawStatus || "-";
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "#51FF00";
      case "pending":
        return "#F3FF6F";
      case "expired":
        return "#F70004";
      default:
        return "#9aa4ad";
    }
  };
  const isMobile = window.innerWidth <= 768;
  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  if (loading) return <p>Carregando...</p>;
  return (
    <>
      {showCopyToast && (
        <div
          className="end-0 translate-middle-x rounded"
          style={{
            position: "absolute",
            zIndex: 1055,
            background: "#fff",
            marginTop: "100px",
            width: "210px",
            height: "42px",
            color: "#080A10",
          }}
        >
          <p style={{ right: "4px", marginTop: "6px" }}>
            <img src={Copia} alt="" style={{ marginRight: "6px" }} />
            Copiado com sucesso!
          </p>
        </div>
      )}
      <NavInfo />
      <div className="row g-0">
        <div className="container-fluid">
          <div className="mt-3 d-flex justify-content-between align-items-center px-3 py-2"
            style={{
              borderRadius: "8px", height: "40px", backgroundColor: "#1A242D"
            }}
          >
            <p
              className="text-white fs-5 m-0 d-flex align-items-center poppins-semibold"
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => router.push(ROUTES.WALLET)}
            >
              {"<"} Depósito
            </p>
          </div>
        </div>
        <div className="container-fluid">
          <div className="mt-3 align-items-center px-3 py-2 text-white"
            style={{
              borderRadius: "8px", backgroundColor: "#0F1923"
            }}
          >
            <p
              style={{
                fontSize: isMobile ? "12px" : "20px",
                textAlign: isMobile ? "left" : "center"
              }}
              className="Manrope-regular"
            >
              Abra seu aplicativo de pagamento e digitalize ou copie e cole o código QR abaixo para concluir seu depósito.
            </p>
            <p
              style={{
                fontSize: isMobile ? "12px" : "20px",
                textAlign: isMobile ? "left" : "center"
              }}
              className="Manrope-regular"
            >
              Este código QR só pode ser pago uma vez. Se precisar pagar novamente, clique no botão abaixo para gerar outro.
            </p>
            {status === "paid" && (
              <p
                style={{
                  fontSize: isMobile ? "12px" : "20px",
                  textAlign: isMobile ? "left" : "center",
                  color: "#B9FF99",
                }}
                className="text-center fw-bold">
                Depois que o pagamento for bem sucedido, você precisará retornar ao lobby do jogo para aguardar os pontos!
              </p>
            )}
            <h3 className="text-center my-4">R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
            <div className="d-flex justify-content-center mb-3">
              {qrCodeImage ? (
                <img
                  src={qrCodeImage}
                  alt="QR Code PIX"
                  style={{ cursor: "pointer", width: 200, height: 200 }}
                  onClick={handleCopyCode}
                  title="Clique para copiar código"
                />
              ) : (
                <p>Código QR indisponível.</p>
              )}
            </div>
            {status === "paid" && (
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={Vectorpay}
                  alt="QR Code PIX"
                  style={{ position: "absolute", cursor: "pointer", marginTop: "-150px" }}
                  onClick={handleCopyCode}
                  title="Clique para copiar código"
                />
              </div>
            )}
            {status === "paid" && (
              <div className="text-center mt-4">
                <h5
                  style={{ color: "#B9FF99" }}
                  className="fw-bold">Recebido com sucesso</h5>
                <p>O Sistema atribuiu automaticamente o valor a você.<br />A página atual será fechada em 10 segundos.</p>
              </div>
            )}
            {status === "pending" && (
              <p className="text-center" style={{ color: "#B9FF99" }}>
                Tempo para efetivo: {formatTime(seconds)}
              </p>
            )}
            <div className="row">
              <p className="text-center" style={{ fontSize: "12px" }}>
                Você está tendo problemas para ler o código QR?
              </p>
              <p className="text-center" style={{ fontSize: "12px" }}>
                Copie o código abaixo e insira-o manualmente.
              </p>
            </div>
            <div className="d-flex justify-content-center mb-3 gap-2 flex-wrap">
              {status !== "paid" && (
                <button
                  style={{ backgroundColor: "#F70004", height: "48px" }}
                  className="btn btn-danger w-100" onClick={handleCopyCode}>
                  <img
                    style={{
                      marginTop: "2px",
                      marginLeft: "-30px",
                      position: "absolute",
                    }}
                    src={CopiarQr} alt="" />
                  Copiar código QR
                </button>
              )}
              {status === "paid" && (
                <button
                  style={{ backgroundColor: "#F70004", height: "48px" }}
                  className="btn btn-danger w-100" onClick={() => router.push(ROUTES.GAME)}>
                  Jogar agora
                </button>
              )}
              <button
                style={{ backgroundColor: "#FFFFFF1A", height: "48px" }}
                className="btn btn-secondary w-100" onClick={handleGenerateNew}>
                <img
                  style={{
                    marginTop: "2px",
                    marginLeft: "-30px",
                    position: "absolute",
                  }}
                  src={Looping} alt="" />
                Gerar novo pedido
              </button>
            </div>
            <div className="row">
              <div className="col-6">
                <p>Status do pedido:</p>
                <p>Hora de criação:</p>
                <p>Número do pedido:</p>
              </div>
              <div className="col-6 text-end">
                <p style={{ color: getStatusColor(status), }}>{getStatusText(status)}</p>
                <p>{createdAt ? new Date(createdAt).toLocaleString() : "-"}</p>
                <p>
                  {orderId || "-"}
                  <img
                    onClick={copyOrderId}
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                    src={crop}
                    alt="Copiar"
                    title="Copiar ID"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Deposito;
