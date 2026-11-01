import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import Banner from '../assets/img/banner.png';
import Online from '../assets/img/online.png';
import Live from '../assets/img/aovivo.png';
import Navbar from '../assets/components/Navbar';
import LoadPoupap from '../assets/components/LoadPopup';
import CookieConsent from '../assets/components/CookieConsent';
import Register from '../assets/components/Register';
import Login from '../assets/components/Login';
import Welcome from "../assets/img/Bem Vindo.png";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;


  return (
    <div style={{ borderRadius: '20px' }} className="modal-overlay modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white" >
          <div className="modal-header border-0">
            <button type="button" className="bg-white btn-close ms-auto" onClick={onClose}></button>
          </div>
          <div className="modal-header border-0"></div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

const ModalRegister = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;


  return (
    <div style={{ borderRadius: '20px' }} className="modal-overlay modal show d-block">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header border-0">
            <button type="button" className="bg-white btn-close ms-auto" onClick={onClose}></button>
          </div>
          <div className="modal-body bg-dark">{children}</div>
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
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body bg-dark">{children}</div>
        </div>
      </div>
    </div>
  );
};

const Indexpage = () => {
  const [isPoupapOpen, setIsPoupapOpen] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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
        <div className="col-md-9 col-lg-9 col-sm-12">
          <div className="container-fluid text-center">
            <div className="row">
              <div className="col-12 p-0 position-relative">

                <div className="position-absolute top-50 end-0 translate-middle-y p-5 mb-5 d-none d-lg-block" style={{ borderRadius: "10px" }}>
                  <div className="text-white text-end">
                    <span onClick={() => setIsLoginOpen(true)} className="text-danger">Entre</span> ou
                    <span onClick={() => setIsRegisterOpen(true)}> Cadastre-se</span> para continuar
                  </div>
                </div>

                <img
                  className="img-fluid w-100"
                  style={{
                    objectFit: "cover",
                    marginTop: "-15px",
                  }}
                  src={Banner}
                  alt="Banner"
                />
              </div>

              <div className="col-md-6 col-lg-6 col-sm-3 p-2"
                style={{ marginTop: "46px" }}>
                <div className="position-relative">
                  <img
                    className="img-fluid w-100"
                    src={Live}
                    alt="Live"
                  />
                  <div className="position-absolute bottom-0 start-0 p-3 w-100">
                    <div className="text-white text-start">
                      <span onClick={() => setIsLoginOpen(true)} className="text-danger">Entre</span> ou <span onClick={() => setIsRegisterOpen(true)}>Cadastre-se</span>  para continuar
                    </div>

                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-3 p-2"
                style={{ marginTop: "46px" }}>
                <div className="position-relative">
                  <img
                    className="img-fluid w-100"
                    style={{ borderRadius: "20px" }}
                    src={Online}
                    alt="Online"
                  />
                  <div className="position-absolute bottom-0 start-0 p-3 w-100">
                    <div className="text-white text-start">
                      <span onClick={() => setIsLoginOpen(true)} className="text-danger">Entre</span> ou <span onClick={() => setIsRegisterOpen(true)}>Cadastre-se</span> para continuar
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-lg-3 col-sm-3 p-0 d-none d-lg-block"
          style={{ marginTop: "70px", }}
        >
          <div className="container-fluid text-center">
            <img
              className="img-fluid w-100"
              style={{ borderRadius: "20px", height: "auto", maxHeight: "94vh" }}
              src={Welcome}
              alt="Welcome"
            />
          </div>
        </div>
      </div>

      {/* Modais */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login onClose={() => setIsLoginOpen(false)} />
      </Modal>

      <ModalRegister isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <Register onClose={() => setIsRegisterOpen(false)} />
      </ModalRegister>

      <Poupap isOpen={isPoupapOpen} onClose={() => setIsPoupapOpen(false)}>
        <LoadPoupap onClose={() => setIsPoupapOpen(false)} />
      </Poupap>

      <CookieConsent isOpen={isPoupapOpen} onClose={() => setIsPoupapOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body" style={{ backgroundColor: 'black' }}>Aceita os cookies?</div>
        </div>
      </CookieConsent>
    </div>
  );
};

export default Indexpage;