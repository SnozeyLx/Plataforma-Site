import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import Banner from '../assets/img/banner2.png';
import BannerSmall from '../assets/img/bannerSmall.png';
import Icon from '../assets/img/whatsapp.png';
import Online from '../assets/img/online.png';
import Live from '../assets/img/aovivo.png';
import Navbar from '../assets/components/Navbar';
import LoadPoupap from '../assets/components/LoadPopup';
import CookieConsent from '../assets/components/CookieConsent';
import Register from '../assets/components/Register';
import Login from '../assets/components/Login';
import ModalSuport from '../assets/components/ModalSuport';
import Welcome from "../assets/img/Bem Vindo.png";

const Suport = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };


  return (
    <div
      style={{ marginTop: "-450px" }}
      className="modal-overlay d-flex justify-content-end align-items-end"
      onClick={handleOverlayClick}
    >
      <div className="modal-dialog m-4" style={{ width: "350px", maxWidth: "90%" }}>
        <div className="modal-content bg-dark text-white p-3 rounded-4 animate__animated animate__fadeInUp">
          <div className="d-flex justify-content-end">
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

const WHATSAPP_NUMBER = "5521994534692";
const handleOpenWhatsapp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ borderRadius: '20px', backgroundColor: "#080A10B2" }} className="modal-overlay modal show d-block">
      <div style={{ width: "400px" }} className="modal-dialog modal-dialog-centered">
        <div
          style={{ background: "#1A242D" }}
          className="modal-content  text-white animate__animated animate__fadeIn" >
          <div
            style={{ background: "#1A242D", borderRadius: "8px" }}
            className="d-flex justify-content-end w-100 m-0 p-2">
            <button className="btn" style={{ color: "white" }} type="button" onClick={onClose}>X</button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};
const ModalRegister = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ borderRadius: '20px', backgroundColor: "#080A10B2" }} className="modal-overlay modal show d-block">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content text-white animate__animated animate__bounceIn">
          {/* <div className="modal-header border-0">
            <button type="button" className="bg-white btn-close ms-auto" onClick={onClose}></button>
          </div> */}
          <div >{children}</div>
        </div>
      </div>
    </div>
  );
};
const Poupap = ({ isOpen, onClose, children }) => {
  const [visible, setVisible] = useState(isOpen);
  useEffect(() => {
    const ageConfirmed = localStorage.getItem("ageConfirmed");
    if (ageConfirmed === "true") {
      setVisible(false);
    } else {
      setVisible(isOpen);
    }
  }, [isOpen]);
  if (!visible) return null;
  return (
    <div style={{ borderRadius: '20px' }} className="modal-overlay modal show d-block">
      <div style={{}} className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body"
            style={{ background: "#1A242D" }}

          >{children}</div>
        </div>
      </div>
    </div>
  );
};
const Indexpage = () => {
  const [isPoupapOpen, setIsPoupapOpen] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSuportOpen, setIsSuportOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken') || '';


  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  useEffect(() => {
    if (token) {
      navigate(ROUTES.HOME);
    }
  }, [token, navigate]);
  return (
    <div className="container-fluid p-0">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />
      <div className="row g-0">
        {/* Conteúdo Principal */}
        <div className="col-md-12 col-lg-12 col-sm-12">
          <div className="container-fluid text-center">
            <div className="row">
              <div className="position-absolute end-0 translate-middle-yy p-5 mb-5 d-none d-lg-block h2 animate__animated animate__fadeInRight" style={{ borderRadius: "0px", }}>
                <div className="text-white text-start" style={{ borderRadius: "10px", marginTop: "0px", top: "50%", transform: "translateY(100%)" }}>
                  <h4 style={{ fontSize: "25px" }} className='poppins-regular animate__animated animate__fadeInDown'>Vem pro Jogo! 🔥</h4>
                  <h1 style={{ fontSize: "55px" }} className='poppins-semibold  animate__animated animate__fadeInLeft animate__delay-1s'>Você está com sorte</h1>
                  <h1 style={{ fontSize: "55px" }} className='poppins-semibold animate__animated animate__zoomIn animate__delay-2s'>Jogue <span className='red-label poppins-extrabold'>Ronda</span> agora!!!</h1>
                  <h6 style={{ fontSize: "14px" }} className='poppins-semibold  animate__animated animate__fadeInUp animate__delay-3s'>Domine a mesa e leve o prêmio para casa! Jogue com estratégia e vença a rodada.</h6>
                  <p className='mt-4'>
                    <button style={{ width: "250px", background: "#F70004" }} onClick={() => setIsRegisterOpen(true)} className="btn btn-danger animate__animated animate__pulse animate__infinite">Cadastre - se
                    </button>
                  </p>

                </div>
              </div>
              <img
                className="img-fluid d-none d-md-block "
                style={{
                  objectFit: "cover",

                  padding: "0px",
                }}
                src={Banner}
                alt="Banner"
              />
              <img
                className="img-fluid w-100 h-100 d-md-none"
                style={{
                  objectFit: "cover",
                  marginTop: "8px",
                  width: "100%",
                  padding: "0px",

                }}
                src={BannerSmall}
                alt="Banner"
              />
              <div className="d-none d-lg-block" style={{ zIndex: 2, position: "relative", marginLeft: "-25px", marginTop: "-150px", borderRadius: "10px" }}>
                <div className="text-white text-end">
                  <img onClick={() => handleOpenWhatsapp()} src={Icon} alt="" />
                </div>
              </div>
              <div className="d-sm-none d-sm-block h2 animate__animated animate__fadeInUp" style={{ paddingTop: "10px", borderRadius: "10px" }}>
                <div className="text-white text-start">
                  <h4 style={{ fontSize: "20px" }} className='poppins-regular animate__animated animate__fadeInDown'>Vem pro Jogo! 🔥</h4>
                  <h1 style={{ fontSize: "35px" }} className='poppins-semibold animate__animated animate__fadeInLeft animate__delay-1s'>Você está com sorte</h1>
                  <h1 style={{ fontSize: "32px" }} className='poppins-semibold animate__animated animate__zoomIn animate__delay-2s'>Jogue <span className='red-label poppins-extrabold'>Ronda</span> agora!!!</h1>
                  <h6 className='poppins-semibold animate__animated animate__fadeInUp animate__delay-3s' >Domine a mesa e leve o prêmio para casa! Jogue com estratégia e vença a rodada.</h6>
                  <p className='mt-4'>
                    <button style={{ background: "#F70004" }} onClick={() => setIsRegisterOpen(true)} className="btn btn-danger w-100 animate__animated animate__pulse animate__infinite">Cadastre - se
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modais */}
      <Suport isOpen={isSuportOpen} onClose={() => setIsSuportOpen(false)}>
        <ModalSuport onClose={() => setIsSuportOpen(false)} />
      </Suport>

      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login
          onClose={() => setIsLoginOpen(false)}
          onOpenRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      </Modal>


      <ModalRegister isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <Register onClose={() => setIsRegisterOpen(false)} />
      </ModalRegister>

      <Poupap isOpen={isPoupapOpen} onClose={() => setIsPoupapOpen(false)}>
        <LoadPoupap onClose={() => setIsPoupapOpen(false)} />
      </Poupap>
    </div>
  );
};

export default Indexpage;