import React from 'react';
import logo from '../img/logo.jpg';
import logoMobile from '../img/logoMobile.jpg';
import 'animate.css';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  return (
    <nav style={{ backgroundColor:"#0F1923" }} className="navbar navbar-expand-lg animate__animated animate__fadeInDown">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="/">
            <img className="img-fluid d-none d-md-block" style={{ maxWidth: "169px" }} src={logo} alt="Logo Desktop" />
              <img className="img-fluid d-block d-md-none" style={{ maxWidth: "90px" }} src={logo} alt="Logo Mobile" />
        </a>



        {/* Itens do Menu */}

        <ul className="navbar-nav text-center d-flex flex-row justify-content-center justify-content-ms-start gap-2">
          <li className="nav-item">
            <button style={{ background:"#16407D2B" }} className="btn btn-dark animate__animated animate__pulse" onClick={onLoginClick}>
              Entrar
            </button>
          </li>
          <li className="nav-item">
            <button  style={{  background:"#F70004" }} className="btn btn-danger animate__animated animate__pulse" onClick={onRegisterClick}>
              Cadastre-se
            </button>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
