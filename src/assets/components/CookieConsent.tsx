import React, { useState, useEffect } from "react";
const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const cookieAccepted = localStorage.getItem("cookieAccepted");
    if (cookieAccepted === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieAccepted", "true");
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return (
    <div className="container-fluid g-3">
      <div className="fixed-bottom left-0 w-full bg-dark text-white p-4 border-t border-gray-700">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-3 md:mb-0">
            <strong>ESTE SITE USA COOKIES</strong>
            <p className="text-sm">Usamos cookies para melhorar a experiência. Ao continuar, você aceita...</p>
          </div>
          <button
            className="btn btn-danger"
            onClick={handleAcceptCookies}
          >
            Aceitar todos os Cookies
          </button>
        </div>
      </div>
    </div>
  );
};
export default CookieConsent;

