import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import { useNavigate } from 'react-router-dom';
import NavInfo from '../assets/components/NavInfo';
import Avatar from '../assets/img/avatar.jpg';
import GetPayments from "../assets/components/GetPayments";
import SetPayments from "../assets/components/SetPayments";
import WomanLeft from "../assets/img/dama_esq.png";
import WomanRight from "../assets/img/dama_dir.png";
import Pix from "../assets/img/pix.png";

const Bank = ({ balance, onWithdraw, onClose }) => {
    const token = localStorage.getItem('authToken') || '';
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const [method, setMethod] = useState("pix");
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [amount, setAmount] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(true);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

    const formatCpf = (value) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            .slice(0, 14);
    };

    const incrementAmount = (value) => {
        setAmount((prevAmount) => {
            const newAmount = (parseFloat(prevAmount) || 0) + value;
            return newAmount > balance ? balance : newAmount;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !cpf.trim() || !amount) {
            alert("Preencha todos os campos!");
            return;
        }

        const amountNum = parseFloat(amount);
        if (amountNum <= 0) {
            alert("O valor deve ser maior que zero!");
            return;
        }

        if (amountNum > balance) {
            alert("Saldo insuficiente!");
            return;
        }

        try {
            const response = await fetch("/api/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ method, name, cpf, amount: amountNum }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Saque realizado com sucesso!");
                onWithdraw(data);
            } else {
                alert(data.message || "Erro ao processar o saque.");
            }
        } catch (error) {
            console.error("Erro ao sacar:", error);
            alert("Erro ao conectar ao servidor.");
        }
    };

    const handleDepositClick = () => {
        setShowPaymentModal(true);
        setShowWithdrawalModal(false);
    };

    const handleWithdrawClick = () => {
        setShowPaymentModal(false);
        setShowWithdrawalModal(true);
    };

    const goToProfile = () => {
        navigate(`/profile`);
    };

    return (
        <div className="container-fluid">
            <NavInfo />
            <div className="row">
                <div className="col-md-4 d-none d-md-block">
                    <div className="container">
                        <div className="col-6"></div>
                        <img className="img-fluid animate__animated animate__fadeInLeft" src={WomanLeft} alt="blablabla" />
                    </div>
                </div>
                <div className="col-md-4 col-12 bg-dark animate__animated animate__fadeIn" style={{ borderRadius: "12px" }}>
                    <div className="container text-center align-items-center mt-4">
                        <button
                            className={`btn m-4 w-25 animate__animated animate__bounceIn ${showPaymentModal ? "btn-danger text-dark" : "btn-transparent text-white border"}`}
                            onClick={handleDepositClick}
                        >
                            Depósito
                        </button>
                        <button
                            className={`btn w-25 animate__animated animate__bounceIn animate__delay-1s ${showWithdrawalModal ? "btn-light text-dark" : "btn-transparent text-white border"}`}
                            onClick={handleWithdrawClick}
                        >
                            Saque
                        </button>
                    </div>
                    <span style={{ borderBottom: "red" }}></span>

                    {showPaymentModal && (
                        <div className="container-fluid mt-5 animate__animated animate__fadeInUp" style={{ borderRadius: "12px", paddingTop: "-100px" }}>
                            <div className="relative text-center">
                                <div className="bg-dark text-light p-4 animate__animated animate__slideInDown" style={{ borderRadius: "12px" }}>
                                    <h2 className="text-center mb-3">Realize seu depósito abaixo</h2>
                                    <br />
                                    <h4 className="text-center mb-3">Selecione o método de pagamento</h4>
                                    <select
                                        className="form-select bg-secondary text-light mb-3"
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value)}
                                    >
                                        <option className="pix-select option" value="pix">Pix <img src={Pix} alt='cu' /></option>
                                        <option value="banco">Transferência Bancária</option>
                                    </select>

                                    <h5 className="mb-2">Insira suas informações de conta</h5>
                                    <br />
                                    <input
                                        className="form-control bg-secondary text-light mb-2"
                                        placeholder="Nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <input
                                        className="form-control bg-secondary text-light mb-2"
                                        placeholder="CPF"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatCpf(e.target.value))}
                                    />

                                    <br />
                                    <h5 className="mb-2">Escolha um valor</h5>
                                    <br />
                                    <input
                                        className="form-control bg-secondary text-light mb-4"
                                        type="number"
                                        placeholder="Valor (BRL)"
                                        value={amount}
                                        min="1"
                                        max={balance}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                    <div className="container m-0 p-0">
                                        <div className="row">
                                            <div className="col-4 m-0 p-0">
                                                <button className="btn btn-dark animate__animated animate__pulse" onClick={() => incrementAmount(100)}>
                                                    + 100 BRL
                                                </button>
                                            </div>
                                            <div className="col-4 m-0 p-0">
                                                <button className="btn btn-dark animate__animated animate__pulse animate__delay-1s" onClick={() => incrementAmount(200)}>
                                                    + 200 BRL
                                                </button>
                                            </div>
                                            <div className="col-4 m-0 p-0">
                                                <button className="btn btn-dark animate__animated animate__pulse animate__delay-2s" onClick={() => incrementAmount(400)}>
                                                    + 400 BRL
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-dark" onClick={goToProfile}>Voltar</button>
                                        <button className="btn btn-danger w-25" onClick={handleSubmit}>Depostitar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showWithdrawalModal && (
                        <div className="container-fluid mt-5" style={{ borderRadius: "12px", paddingTop: "-100px" }}>
                            <div className="bg-dark text-light p-4" style={{ borderRadius: "12px" }}>
                                <br />
                                <div className="bg-dark k text-light p-0">
                                    <h2 className="text-center mb-3">Faça seu Saque</h2>
                                    <br />
                                    <h4 className="text-center mb-3">Selecione o método de retirada</h4>
                                    <select
                                        className="form-select bg-secondary text-light mb-3"
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value)}
                                    >
                                        <option className="pix-select option" value="pix">Pix</option>
                                        <option value="banco">Transferência Bancária</option>
                                    </select>

                                    <h5 className="mb-2">Insira suas informações de conta</h5>
                                    <br />
                                    <input
                                        className="form-control bg-secondary text-light mb-2"
                                        placeholder="Nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <input
                                        className="form-control bg-secondary text-light mb-2"
                                        placeholder="CPF"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatCpf(e.target.value))}
                                    />

                                    <br />
                                    <h5 className="mb-2">Escolha um valor</h5>
                                    <br />
                                    <input
                                        className="form-control bg-secondary text-light mb-4"
                                        type="number"
                                        placeholder="Valor (BRL)"
                                        value={amount}
                                        min="1"
                                        max={balance}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                    <br />
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-dark" onClick={goToProfile}>Voltar</button>
                                        <button className="btn btn-danger w-25" onClick={handleSubmit}>Sacar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-4 d-none d-md-block">
                    <div className="container">
                        <div className="col-6"></div>
                        <img className='img-fluid' src={WomanRight} alt="blablabla" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bank;