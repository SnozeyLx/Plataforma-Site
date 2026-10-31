import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROUTES, API_URLS } from '../../routes';
import 'animate.css';

import logo from '../img/logo.jpg';
import Burguer from '../img/burguer.png';
import logoMobile from '../img/logoMobile.jpg';
import VectorMessage from '../img/VectorMessage.png';
import Avatar from '../img/avatar.png';
import WelcomeUser from '../img/welcomeuser.png';
import { Wallet } from 'react-bootstrap-icons';
import Avatar1 from '../img/avatar/avatar1.png';
import Avatar2 from '../img/avatar/avatar2.png';
import Avatar3 from '../img/avatar/avatar3.png';
import Avatar4 from '../img/avatar/avatar4.png';
import Avatar5 from '../img/avatar/avatar5.png';
import Avatar6 from '../img/avatar/avatar6.png';
import Avatar7 from '../img/avatar/avatar7.png';
import Avatar8 from '../img/avatar/avatar8.png';
import Avatar9 from '../img/avatar/avatar9.png';
import Avatar10 from '../img/avatar/avatar10.png';
import Avatar11 from '../img/avatar/avatar11.png';
import Avatar12 from '../img/avatar/avatar12.png';
import Avatar13 from '../img/avatar/avatar13.png';
import Avatar14 from '../img/avatar/avatar14.png';
import Avatar15 from '../img/avatar/avatar15.png';
import Avatar16 from '../img/avatar/avatar16.png';
import Avatar17 from '../img/avatar/avatar17.png';
import Avatar18 from '../img/avatar/avatar18.png';
import Avatar19 from '../img/avatar/avatar19.png';
import Avatar20 from '../img/avatar/avatar20.png';
import Avatar21 from '../img/avatar/avatar21.png';
import Avatar22 from '../img/avatar/avatar22.png';
import Avatar23 from '../img/avatar/avatar23.png';
import Avatar24 from '../img/avatar/avatar24.png';
const NavInfo = () => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);
  const toggleMenu = () => setShowMenu(prev => !prev);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const avatares = [
    Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6,
    Avatar7, Avatar8, Avatar9, Avatar10, Avatar11, Avatar12,
    Avatar13, Avatar14, Avatar15, Avatar16, Avatar17, Avatar18,
    Avatar19, Avatar20, Avatar21, Avatar22, Avatar23, Avatar24
  ];
  const getUserAvatar = () => {
    const raw = user.image_profile;
    const n = Number(raw);

    if (Number.isFinite(n) && n >= 1 && n <= avatares.length) {
      return avatares[n - 1];
    }
    return Avatar;
  };
  const openModalExit = () => setShowExitModal(true);
  const fetchUser = async () => {
    try {
      const currentToken = localStorage.getItem('authToken') || token;
      const response = await axios.get(`${API_URLS.BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      if (response.data?.profile) {
        setUser(response.data.profile);
        const { name, id, image_profile } = response.data.profile;
        localStorage.setItem('userName', name);
        localStorage.setItem('UserId', id);
        localStorage.setItem('userImageProfile', image_profile || '0');
        const alreadyShown = localStorage.getItem('welcomeShown');
        if (!alreadyShown) {
          setShowSuccessModal(true);
          localStorage.setItem('welcomeShown', '1');
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          const response2 = await axios.get(`${API_URLS.BASE}/users/profile`, {
            headers: { Authorization: `Bearer ${newToken}` }
          });

          if (response2.data?.profile) {
            setUser(response2.data.profile);
            const { name, id, image_profile } = response2.data.profile;
            localStorage.setItem('userName', name);
            localStorage.setItem('UserId', id);
            localStorage.setItem('userImageProfile', image_profile || '0');
          }
        }
      }
    }
  };
  async function refreshToken() {
    const rt = localStorage.getItem('refreshToken');
    if (!rt) return null;
    try {
      const response = await axios.post(`${API_URLS.BASE}/auth/refresh`, { refreshToken: rt });
      const newToken = response.data.accessToken;

      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      return newToken;
    } catch (err) {
      if (!err.response) {
        console.warn('Falha de rede ao renovar token. Mantendo sessão e tentando depois.');
        return null;
      }

      if ([401, 403].includes(err.response.status)) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
      }
      return null;
    }
  }
  useEffect(() => {
    fetchUser();
    refreshToken();

    const intervalId = setInterval(() => {
      refreshToken();
      fetchUser();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [showMenu]);
  useEffect(() => {
    if (!showMenu) return;
    const closeOnScroll = () => setShowMenu(false);
    window.addEventListener('scroll', closeOnScroll, { passive: true });
    window.addEventListener('touchmove', closeOnScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', closeOnScroll);
      window.removeEventListener('touchmove', closeOnScroll);
    };
  }, [showMenu]);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('welcomeShown', '1');
    navigate('/');
  };
  const handleVip = () => navigate(ROUTES.VIP);
  const handleProfile = () => navigate(ROUTES.PROFILE);
  const handleWallet = () => navigate(ROUTES.WALLET);
  const handleSupprt = () => navigate(ROUTES.SUPPORT);
  return (
    <>
      <style>
        {`
  .dropdown-custom {
    border-radius: 25px;
    background: #0F1923;
    z-index: 1050;
    padding-top: 10px;
    position: absolute;
    top: 80px;
    right: 0;
  }
  .dropdown-custom .btn {
    color: white;
    margin-bottom: 5px;
    border: none;
  }
  .dropdown-custom .btn:hover {
    background-color: #273340;
  }
  @media (max-width: 768px) {
    .dropdown-custom {
      position: fixed !important;
      top: 80px !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      border-radius: 0 !important;
    }
  }

  @media (min-width: 769px) {
    .dropdown-custom {
      width: 330px !important;
      right: 10px !important;
    }
  }
`}
      </style>
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          onTouchStart={() => setShowMenu(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'transparent',
            zIndex: 1049,
          }}
        />
      )}
      {showSuccessModal && (
        <>
          <div
            onClick={() => setShowSuccessModal(false)}
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
              <div className="d-flex align-items-center" style={{ gap: 8 }}>
                <img
                  src={WelcomeUser}
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
                  Seja bem-vindo,{" "}
                  <span style={{ color: "#F70004" }}>
                    {user?.name || localStorage.getItem("userName") || "Jogador"}
                  </span>
                </span>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Fechar"
                  onClick={() => setShowSuccessModal(false)}
                  style={{ flexShrink: 0 }}
                />
              </div>
              <p style={{ fontSize: 12, marginTop: 10 }}>
                Boa sorte e que a rodada comece! 🚀
              </p>
            </div>
          </div>
        </>
      )}
      <nav className="navbar navbar-expand-lg" style={{ background: "#0F1923" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <img
              src={Burguer}
              alt="Menu"
              className="d-block d-md-none"
              style={{ width: "24px", height: "24px", cursor: "pointer" }}
              onClick={toggleMenu}
            />
            <a className="navbar-brand" href="/">
              <img className="img-fluid d-none d-md-block" style={{ maxWidth: "150px" }} src={logo} alt="Logo Desktop" />
              <img className="img-fluid d-block d-md-none" style={{ maxWidth: "48px" }} src={logoMobile} alt="Logo Mobile" />
            </a>
          </div>
          <div className="d-flex align-items-center gap-2">
            {user.role === 'user' && (
              <>
                <button className="btn btn-dark text-white" style={{ background: "#080A10", height: "40px" }}>
                  R$ {parseFloat(user.balance || 0).toFixed(2)}
                </button>
                <button className="btn btn-danger text-white" style={{ background: "#F70004", height: "40px" }} onClick={handleWallet}>
                  Depósito
                </button>
              </>
            )}
            <div className="d-flex align-items-center gap-2 position-relative">
              <div className="d-flex justify-content-center align-items-center rounded-circle  d-none d-md-block" style={{ width: "48px", height: "48px" }}>
                <img src={VectorMessage} alt="Mensagens" style={{ width: "43px", height: "43px", margin: "4px" }} />
              </div>
              <div
                className="d-flex justify-content-center align-items-center rounded-circle bg-black d-none d-md-block position-relative"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={toggleMenu}
              >
                <img
                  src={getUserAvatar()}
                  alt="Avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    alignItems: "center",
                  }}
                />
              </div>
              {showMenu && (
                <div id="user-dropdown" className="dropdown-custom responsive-dropdown text-white px-2 animate__animated animate__fadeInDown">
                  <button className="btn btn-sm text-start text-white w-100" onClick={handleVip}>Clube vip</button>
                  <button className="btn btn-sm text-start text-white w-100" onClick={handleProfile}>Perfil</button>
                  <button className="btn btn-sm text-start text-white w-100" onClick={handleWallet}>Carteira</button>
                  <button className="btn btn-sm text-start text-white w-100" onClick={handleSupprt}>Suporte</button>
                  <button className="btn btn-sm text-start text-white w-100" onClick={openModalExit}>Sair</button>
                </div>
              )}
              {showExitModal && (
                <div className="modal fade show animate__animated animate__fadeIn" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div
                      style={{ backgroundColor: "#1A242D", borderRadius: "15px" }}
                      className="modal-content  animate__animated animate__zoomIn"
                    >
                      <div className="modal-header border-0">
                        <h5 style={{ fontSize: "20px" }} className="modal-title text-white poppins-semibold">Encerrar sessão</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowExitModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        <h5 style={{ fontSize: "12px" }} className="container text-white poppins-semibold">
                          Deseja encerrar sua sessão agora?
                        </h5>
                      </div>
                      <div className="modal-footer border-0 d-flex gap-2 ">
                        <button
                          type="button"
                          className="btn btn-lg flex-grow-1 poppins-semibold"
                          onClick={() => setShowExitModal(false)}
                          style={{ background: "#F70004", color: "#fff", borderRadius: "3px", fontSize: "16px" }}
                        >
                          Continuar jogando
                        </button>
                        <button
                          type="button"
                          className="btn btn-lg flex-grow-1 poppins-semibold"
                          onClick={handleLogout}
                          style={{ background: "#0F1923", color: "#B8BABD", borderRadius: "3px", fontSize: "16px" }}
                        >
                          Encerrar Sessão
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default NavInfo;
