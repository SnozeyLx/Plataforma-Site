import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const GetPayments = ({ balance = 5000, onWithdraw, onClose }) => {
  const [method, setMethod] = useState("pix");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [amount, setAmount] = useState("");

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

  return (
    <div className="container">
      <div className="relative text-center">
        <div className="bg-black text-light p-4">
          <h4 className="text-center mb-3">Selecione o método de retirada</h4>
          <select
            className="form-select bg-secondary text-light mb-3"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="pix">Pix</option>
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
            <button className="btn btn-dark" onClick={onClose}>Voltar</button>
            <button className="btn btn-danger" onClick={handleSubmit}>Sacar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetPayments;
