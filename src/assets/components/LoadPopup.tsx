import React, { useEffect, useState } from "react";
const logo = "/assets/img/logo.jpg";
const LoadPopup = ({ onClose }: any) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const ageConfirmed = localStorage.getItem("ageConfirmed");
    if (ageConfirmed === "true") {
      setIsVisible(false);
    }
  }, []);
  const handleConfirmAge = () => {
    localStorage.setItem("ageConfirmed", "true");
    setIsVisible(false);
    if (onClose) onClose();
  };
  const handleUnderage = () => {
    window.location.href = "https://www.google.com";
  };
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className=" text-white p-6 rounded-lg  w-96 text-center relative">
        <img className="mx-auto mb-4" width="169px" src={logo} alt="Logo" />
        <p className="mb-4">VOCÊ TEM MAIS DE 18 ANOS?</p>
        <div className="col-12 d-flex justify-content-center gap-3">
          <button
            style={{ background: "#16407D2B" }}
            className="btn btn-dark" onClick={handleUnderage}>
            Não
          </button>
          <button
            style={{ background: "#F70004" }}
            className="btn btn-danger" onClick={handleConfirmAge}>
            Sim
          </button>
        </div>
      </div>
      <br />
    </div>
  );
};
export default LoadPopup;
