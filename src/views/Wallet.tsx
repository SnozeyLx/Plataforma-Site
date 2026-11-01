import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES, API_URLS } from "../routes";
const Vetor = "/assets/img/Vector.png";
const Success = "/assets/img/sucesso.png";
const Error = "/assets/img/erro.png";
const PayPix = "/assets/img/process_WhitDraw.png";
import NavInfo from "../assets/components/NavInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
const Copia = "/assets/img/copia.png";
import "animate.css";
const Wallet = () => {
  const router = useRouter();
  const inputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [pixType, setPixType] = useState("CPF");
  const [userPixData, setUserPixData] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingPix, setIsLoadingPix] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalStatus, setWithdrawalStatus] = useState<any>(null);
  const [withdrawalError, setWithdrawalError] = useState<any>(null);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showCopiedModal, setShowCopiedModal] = useState(false);
  const [recentWithdrawals, setRecentWithdrawals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pixConta, setPixConta] = useState({
    nome: "",
    chave: "",
  });
  const [activeTab, setActiveTab] = useState("deposito");
  const [selectedMethod, setSelectedMethod] = useState("PIX");
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState<any>(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const depositAmounts = [50, 100, 500, 1000, 3000, 5000, 10000, 50000];
  const api = axios.create({
    baseURL: API_URLS.BASE,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  });
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${day}/${month} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
      return dateString;
    }
  };

    const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("paid")
    ) {
      return <span className="text-success">Concluído</span>;
    } else if (statusLower.includes("processing")) {
      return <span className="text-warning">Processando</span>;
    } else if (statusLower.includes("pending")) {
      return <span className="text-warning">Pendente</span>;
    } else if (statusLower.includes("canceled") || statusLower.includes("expired")) {
      return <span className="text-danger">Expirado</span>;
    }
  };
  const fetchTransactions = async (page = 1, perPage = itemsPerPage) => {
    try {
      setIsLoadingTransactions(true);
      const response = await api.get("/balance/statements", {
        params: {
          page,
          per_page: perPage,
        },
      });
      const transactionsData = response.data.statements?.data || [];
      const total = response.data.statements?.total || 0;
      const formattedTransactions = transactionsData.map((item) => ({
        id: item.uuid,
        date: item.created_at,
        type: item.type,
        amount: parseFloat(item.value),
        status: item.status,
        reference: item.external_id,
        qr_code: item.qr_code,
      }));
      setTransactions(formattedTransactions);
      setTotalTransactions(total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };
  const handleItemsPerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setItemsPerPage(newPerPage);
    setCurrentPage(1);
    fetchTransactions(1, newPerPage);
  };
  const fetchUserPixData = async () => {
    try {
      setIsLoadingPix(true);
      const response = await api.get("/users/profile");
      if (response.data && response.data.profile) {
        setUserPixData(response.data.profile.pix || null);
        setUserBalance(response.data.profile.balance || 0);
      } else {
        console.error("Estrutura de dados inesperada:", response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados PIX:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
      }
    } finally {
      setIsLoadingPix(false);
    }
  };
  const fetchRecentWithdrawals = async () => {
    try {
      const response = await api.get("/balance/withdraw");
      setRecentWithdrawals(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar saques:", error);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      await fetchUserPixData();
      await fetchTransactions(currentPage, itemsPerPage);
    };
    loadData();
    const intervalId = setInterval(loadData, 60000);
    return () => clearInterval(intervalId);
  }, [currentPage, itemsPerPage]);
  const handleCustomInput = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null);
  };
const handleDeposito = () => {
  const value = customAmount || selectedAmount;
  if (Number(value) < 10 || isDepositing) return;
  setIsDepositing(true);
  router.push(`/deposito?value=${Number(value)}`);
};
  const handlePixInputChange = (e) => {
    const { name, value } = e.target;
    setPixConta((prev) => ({ ...prev, [name]: value }));
  };
  const handleSavePix = async () => {
    try {
      if (!pixType || !pixConta.chave) {
        alert("Por favor, preencha todos os campos");
        return;
      }
      if (pixType === "CPF" && !/^\d{11}$/.test(pixConta.chave)) {
        alert("CPF inválido. Deve conter 11 dígitos.");
        return;
      }
      if (pixType === "TELEFONE" && !/^\d{10,11}$/.test(pixConta.chave)) {
        alert("Telefone inválido. Deve conter DDD + número.");
        return;
      }
      if (pixType === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixConta.chave)) {
        alert("E-mail inválido.");
        return;
      }
      let pixTypeFormatted = pixType;
      if (pixType === "CHAVE") {
        pixTypeFormatted = "RANDOM";
      }
      if (pixType === "TELEFONE") {
        pixTypeFormatted = "PHONE";
      }
      const response = await api.put("/users/profile/update", {
        pix: pixConta.chave,
        pix_type: pixTypeFormatted,
      });

      setUserPixData(response.data.pix);
      setShowPixModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar dados PIX:", error);
      alert(error.response?.data?.error || "Erro ao salvar dados PIX. Por favor, tente novamente.");
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || isNaN(Number(withdrawalAmount))) {
      setWithdrawalError("Valor inválido");
      return;
    }
    const amount = parseFloat(withdrawalAmount);
    if (amount < 10 || amount > 50000) {
      setWithdrawalError("Valor deve estar entre R$ 20,00 e R$ 50.000,00");
      return;
    }
    if (amount > userBalance) {
      setWithdrawalError("Saldo insuficiente");
      return;
    }
    setIsProcessingWithdrawal(true);
    
    setWithdrawalError(null);
    try {
      const createResponse = await api.post("/balance/withdraw", {
        value: amount,
      });

      setWithdrawalStatus(createResponse.data);
      setUserBalance((prev) => prev - amount);
      setShowWithdrawalModal(true);
    } catch (error) {
      console.error("Erro ao processar saque:", error);
      setWithdrawalError(error.response?.data?.error || "Erro ao processar saque");
    } finally {
      setIsProcessingWithdrawal(false);
    }

  };
  const closePixModal = () => {
    setShowPixModal(false);
    setPixConta({ nome: "", chave: "" });
    setPixType("CPF");
  };
  return (
    <div>
      {showCopiedModal && (
        <div
          className="end-0 translate-middle-x rounded "
          style={{
            position: "absolute",
            zIndex: 1055,
            background: " #fff",
            marginTop: "100px",
            width: "210px",
            height: "42px",
            color: "#080A10",
          }}
        >
          <p style={{ right: "4px", marginTop: "6px" }}>
            <img src={Copia} alt="" /> PIX copiado
          </p>
        </div>
      )}
      {showPixModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "#080A10B2" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content text-white"
              style={{ backgroundColor: "#1A242D" }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">{userPixData ? "Editar conta PIX" : "Recebimento PIX"}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closePixModal}></button>
              </div>
              <div className="modal-body">
                {isLoadingPix ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-danger" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-3 border-0">
                      <input
                        style={{ backgroundColor: "#0F1923", fontSize: "12px", height: "48px" }}
                        className="form-control w-100 poppins-regular text-white"
                        type="text"
                        name="nome"
                        value={pixConta.nome}
                        onChange={handlePixInputChange}
                        placeholder="Introduza o seu nome real"
                        disabled={!!userPixData?.type}
                      />
                      {userPixData?.type && (
                        <small className="text-muted d-block mt-1">
                          Não é possível alterar o nome associado à chave PIX
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className=" row g-2 poppins-regular"
                        style={{ fontSize: "12px" }}>

                         {/* {["CPF", "TELEFONE", "EMAIL", "CHAVE"].map((type) => (
                          <div className="col-3" key={type}>
                            <button
                              className="btn w-100 text-white"
                              style={{

                                backgroundColor: pixType === type ? "#F70004" : "#FFFFFF1A",
                                color: pixType === type ? "#FFFFFF" : "#000000", height: "48px", fontSize: "12px"
                              }}
                              onClick={() => {
                                if (!userPixData?.type) {
                                  setPixType(type);
                                  setPixConta({ ...pixConta, chave: "" });
                                }
                              }}
                              disabled={!!userPixData?.type}
                            >
                              {type}
                            </button>

                          </div>
                        ))} */}
                      </div>
                    </div>
                    <div className="text-center mb-3">
                      <input
                        style={{ backgroundColor: "#0F1923", fontSize: "12px", height: "48px" }}
                        className="form-control w-100 poppins-regular text-white"
                        type="text"
                        name="chave"
                        value={pixConta.chave}
                        onChange={handlePixInputChange}
                        placeholder={
                          pixType === "CPF"
                            ? "Insira o CPF (somente números)"
                            : pixType === "TELEFONE"
                              ? "Insira o telefone com DDD"
                              : pixType === "EMAIL"
                                ? "Insira o e-mail"
                                : pixType === "CHAVE"
                                  ? "Insira a chave aleatória"
                                  : "Insira a chave PIX"
                        }
                        disabled={!!userPixData?.type}
                      />
                      {userPixData?.type && (
                        <small className="text-muted d-block mt-1">
                          Não é possível alterar o tipo/chave PIX. Entre em contato com o suporte para mudanças.
                        </small>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="text-center mb-3" style={{ fontSize: "14px" }}>
                A conta Pix do tipo {pixType} só pode ser adicionada uma vez. Verifique atentamente.
              </div>
              <div className="modal-footer border-0">
                <button
                  style={{
                    backgroundColor: "#F70004"
                  }}
                  className="btn btn-danger w-100" onClick={handleSavePix} disabled={isLoadingPix || !!userPixData?.type}>
                  {userPixData ? "Dados PIX confirmados" : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showTransactionModal && selectedTransaction && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "#080A10B2" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-white">
              <div className="modal-header border-0"
                style={{ backgroundColor: "#1A242D" }}
              >
                <h5 className="modal-title">Detalhe do {selectedTransaction.type === "deposit" ? "depósito" : "saque"}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowTransactionModal(false)}></button>
              </div>
              <div className="modal-body"
                style={{ backgroundColor: "#1A242D" }}
              >
                <div className="text-center mb-3">
                  <h3>
                    {selectedTransaction.amount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </h3>
                </div>
                {selectedTransaction.status === "paid" ? (
                  <div className="container text-center">
                    <img src={Success} alt="" />
                  </div>
                ) : selectedTransaction.status === "expired" ? (
                  <div className="container text-center">
                    <img src={Error} alt="" />
                  </div>
                ) : selectedTransaction.status === "pending" ? (
                  <div className="container text-center">
                    <img src={Error} alt="" />
                  </div>
                ) : (
                  <div className="container text-center">
                    <img src={Success} alt="" />
                  </div>
                )}
                <div className="text-center mb-4">
                  {selectedTransaction.status === "paid" ? (
                    <p className="mt-2 text-success">Recebido com sucesso</p>
                  ) : selectedTransaction.status === "expired" ? (
                    <p className="mt-2 text-danger">Pedido expirado</p>
                  ) : selectedTransaction.status === "pending" ? (
                    <p className="mt-2 text-danger">Pagamento pendente</p>
                  ) : (
                    <p className="mt-2 text-danger">Status: {selectedTransaction.status}</p>
                  )}
                </div>
                <div className="p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tipo de transação:</span>
                    <span>{selectedTransaction.type === "deposit" ? "Depósito" : "Saque"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Hora da criação:</span>
                    <span>{formatDate(selectedTransaction.date)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Número do pedido:</span>
                    {selectedTransaction.qr_code && selectedTransaction.qr_code.trim() !== "" ? (
                      <span
                        className="text-decoration-underline"
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          color: "#007bff",
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(selectedTransaction.qr_code).then(() => {
                            setShowCopiedModal(true);
                            setTimeout(() => {
                              setShowCopiedModal(false);
                            }, 2000);
                          });
                        }}
                        title="Clique para copiar QR Code completo"
                      >
                        {selectedTransaction.qr_code.length > 20
                          ? selectedTransaction.qr_code.substring(0, 20) + "..."
                          : selectedTransaction.qr_code}
                      </span>
                    ) : (
                      <span
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedTransaction.id && selectedTransaction.id.length > 20
                          ? selectedTransaction.id.substring(0, 20) + "..."
                          : selectedTransaction.id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showWithdrawalModal && withdrawalStatus && (
        <>
          <div
            onClick={() => router.push(ROUTES.HOME)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,.6)',
              zIndex: 1050
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 1051
            }}
          >
            <div
              className="animate__animated animate__fadeInDown"
              style={{
                width: 'min(92vw, 380px)',
                background: '#fff',
                color: '#030000',
                borderRadius: 12,
                padding: 14
              }}
            >
              <div
                className="d-flex align-items-center"
                style={{ gap: 8 }}
              >
                <img
                  src={PayPix}
                  alt="Bem-vindo"
                  style={{ width: 24, height: 24, flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: 12,
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Processo de saque iniciado{" "}
                  <span style={{ color: "#F70004" }}>
                  </span>
                </span>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Fechar"
                  onClick={() => router.push(ROUTES.HOME)}
                  style={{ flexShrink: 0 }}
                />
              </div>
              <p style={{ fontSize: 12, marginTop: 10 }}>
                Seu saque de R$ {(withdrawalStatus.amount)} foi processado com sucesso.
              </p>
            </div>
          </div>
        </>
      )}
      <NavInfo />
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 ">
            <div className="row">
              <div className="col-12">
                <div
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#1A242D",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    height: "40px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                  }}
                  className="mt-3 d-flex justify-content-between align-items-center"
                >
                  <p
                    className="text-white fs-5 m-0 d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(ROUTES.HOME)}
                  >
                    <img src={Vetor} alt="Voltar" className="poppins-semibold me-2" />
                    Carteira
                  </p>
                </div>
              </div>
            </div>

            <div className="row mb-3 g-3 mt-1">
              <div className="col-12 col-lg-2">
                <>
                  <div
                    className="p-3 d-block d-md-none"
                    style={{ backgroundColor: "#1A242D", borderRadius: "10px", height: "48px" }}
                  >
                    <div className="d-flex flex-row gap-2 flex-wrap" style={{ marginLeft: "9px" }}>
                      {["deposito", "saque", "transacoes"].map((tab) => (
                        <p
                          key={tab}
                          className={`text-white poppins-regular ${activeTab === tab ? "border-bottom border-danger" : ""
                            }`}
                          style={{
                            flexGrow: 2,
                            cursor: "pointer",
                            display: "inline-block",
                            marginRight: "29px",
                            width: "fit-content",
                            borderWidth: "2px",
                            fontSize: "16px",
                          }}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab === "deposito" ? "Depositar" : tab === "saque" ? "Saque" : "Transações"}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div
                    className="p-3 d-none d-md-block"
                    style={{ backgroundColor: "#1A242D", borderRadius: "10px", height: "136px" }}
                  >
                    <div className="d-flex flex-column gap-2 flex-wrap" style={{ marginLeft: "9px" }}>
                      {["deposito", "saque", "transacoes"].map((tab) => (
                        <p
                          key={tab}
                          className={`text-white poppins-regular ${activeTab === tab ? "border-bottom border-danger" : ""
                            }`}
                          style={{
                            cursor: "pointer",
                            width: "fit-content",
                            borderWidth: "2px",
                            fontSize: "16px",
                            marginBottom: 0,
                          }}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab === "deposito" ? "Depositar" : tab === "saque" ? "Saque" : "Transações"}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              </div>
              <div className="col-12 col-lg-10">
                <div
                  className=" p-3 text-white"
                  style={{
                    backgroundColor: "#1A242D",
                    borderRadius: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "20px",
                  }}
                >
                  {activeTab === "deposito" && (
                    <div className="c text-white poppins-regular">
                      <div className="mb-3">
                        <label className="form-label">Método de depósito</label>
                        <select
                          style={{ backgroundColor: "#FFFFFF1A" }}
                          className="form-select text-white"
                          value={selectedMethod}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                        >
                          <option value="PIX">PIX</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Depósito</label>
                        <div className="row g-2">
                          {depositAmounts.map((amount) => (
                            <div className="col-3 col-md-3" key={amount}>
                              <button
                                className="w-100 btn text-white poppins-medium"
                                onClick={() => {
                                  setSelectedAmount(amount);
                                  setCustomAmount(amount);
                                  inputRef.current?.focus();
                                }}
                                style={{
                                  fontSize: "0.9rem",
                                  padding: "0.5rem",
                                  backgroundColor: selectedAmount === amount ? "#F70004" : "#FFFFFF1A",
                                }}
                              >
                                {amount.toLocaleString("pt-BR")}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="input-group "
                          style={{ backgroundColor: "#0F1923", color: "#fff", borderRadius: "8px", height: "42px", fontSize: "12px" }}
                        >
                          <span className="input-group-text text-white border-0 poppins-semibold" style={{ backgroundColor: "#0F1923" }}>
                            R$
                          </span>
                          <input
                            style={{ backgroundColor: "#0F1923", color: "#fff", fontSize: "12px" }}
                            ref={inputRef}
                            type="number"
                            className="form-control border-0 poppins-regular"
                            placeholder="Mínimo 10,00"
                            value={customAmount}
                            onChange={handleCustomInput}
                            min={10}
                          />
                        </div>
                      </div>
                      <button
                        style={{ backgroundColor: "#F70004" }}
                        className="btn btn-danger w-100 monserrat-bold"


                        //depostio desbilitado para ajsutes

                        // onClick={handleDeposito}



                        disabled={Number(customAmount || selectedAmount) < 10 || isDepositing}
                      >
                        Deposite agora
                      </button>
                    </div>
                  )}
                  {activeTab === "saque" && (
                    <div style={{ backgroundColor: "#1e232a", padding: "0px", borderRadius: "10px", color: "white" }}>
                      <div style={{ marginBottom: "15px", fontSize: "16px" }}>
                        Saldo{" "}
                        <span style={{ color: "#00ff00" }}>
                          {userBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                      {userPixData ? (
                        <div
                          style={{
                            backgroundColor: "#2e333a",
                            padding: "12px 16px",
                            borderRadius: "5px",
                            marginBottom: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowPixModal(false)} //alterado
                        >
                          {userPixData}
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "#FFFFFF1A",
                            padding: "12px 16px",
                            borderRadius: "5px",
                            marginBottom: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowPixModal(false)} //alterado
                        >
                          <span className="poppins-semibold" style={{ fontSize: "12px" }}>Adicionar conta PIX para saque</span>
                          <span style={{ fontWeight: "bold" }}>›</span>
                        </div>
                      )}
                      <div style={{ backgroundColor: "#151a20", padding: "12px 16px", borderRadius: "5px", marginBottom: "20px", fontSize: "12px" }}>
                        <input
                          style={{ backgroundColor: "#151a20", fontSize: "12px" }}
                          className="form-control border-0  w-100 text-white poppins-semibold"
                          type="number"
                          placeholder="R$ Mínimo 20,00, Máximo 10.000.  Saque apenas em CPF cadastrado!"
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          min="20"
                          max="10000"
                        />
                        {withdrawalError && <div className="text-danger mt-2">{withdrawalError}</div>}
                      </div>
                      <br />
                      <button
                        className="monserrat-bold"
                        onClick={handleWithdrawal}
                        style={{
                          width: "100%",
                          backgroundColor: "#F70004",
                          color: "white",
                          padding: "12px",
                          border: "none",
                          borderRadius: "5px",
                          fontWeight: "bold",
                          fontSize: "14px",
                          cursor: userPixData && !isProcessingWithdrawal ? "pointer" : "not-allowed",
                        }}
                        disabled={!userPixData || isProcessingWithdrawal}
                      >
                        {isProcessingWithdrawal ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processando...
                          </>
                        ) : userPixData ? (
                          "Confirmar retirada"
                        ) : (
                          "Adicione uma conta PIX primeiro"
                        )}
                      </button>
                      {recentWithdrawals.length > 0 && (
                        <div className="mt-4">
                          <h5 className="mb-3">Saques Recentes</h5>
                          <div className="table-responsive">
                            <table className="table  table-hover">
                              <thead>
                                <tr>
                                  <th>Data</th>
                                  <th>Valor</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentWithdrawals.map((withdrawal) => (
                                  <tr key={withdrawal.withdrawal_id}>
                                    <td>{new Date(withdrawal.confirmed_at).toLocaleString()}</td>
                                    <td>
                                      {withdrawal.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </td>
                                    <td>
                                      <span className={`badge ${withdrawal.status === "confirmed" ? "bg-success" : "bg-warning"}`}>
                                        {withdrawal.status === "confirmed" ? "Confirmado" : "Pendente"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "transacoes" && (
                    <div className="text-white">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Transações</h5>
                        <div className="d-flex align-items-center">
                          {/* <span className="me-2">Itens por página:</span> */}
                          {/* <select
                            className="poppins-semibold form-select form-select-sm bg-dark text-white"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            style={{ width: "70px" }}
                          >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                          </select> */}
                        </div>
                      </div>
                      {isLoadingTransactions ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Carregando...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="table-responsive">
                            <table className="table table-dark mb-0" style={{ backgroundColor: "#1A242D" }}>
                              <thead>
                                <tr>
                                  <th>Data</th>
                                  <th>Tipo</th>
                                  <th>Valor</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody style={{ margin: "-12px" }}>
                                {transactions.length > 0 ? (
                                  transactions.map((transaction) => (
                                    <tr
                                      key={transaction.id}
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleTransactionClick(transaction)}
                                    >
                                      <td>{formatDate(transaction.date)}</td>
                                      <td>
                                        {transaction.type === "deposit"
                                          ? "Depósito"
                                          : transaction.type === "withdraw"
                                            ? "Saque"
                                            : transaction.type}
                                        {transaction.reference && ` #PIX`}
                                      </td>
                                      <td>
                                        R${" "}
                                        {transaction.amount.toLocaleString("pt-BR", {
                                          minimumFractionDigits: 2,
                                        })}
                                      </td>
                                      <td>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                          {getStatusBadge(transaction.status)}
                                          <span>&gt;</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="text-center py-4">
                                      Nenhuma transação encontrada
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          {transactions.length > 0 && (
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div>
                                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                                {Math.min(currentPage * itemsPerPage, totalTransactions)} de {totalTransactions} transações
                              </div>
                              <div>
                                <button
                                  className="btn btn-sm btn-outline-secondary me-2"
                                  onClick={() => fetchTransactions(currentPage - 1, itemsPerPage)}
                                  disabled={currentPage === 1}
                                >
                                  Anterior
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => fetchTransactions(currentPage + 1, itemsPerPage)}
                                  disabled={currentPage * itemsPerPage >= totalTransactions}
                                >
                                  Próxima
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Wallet;
