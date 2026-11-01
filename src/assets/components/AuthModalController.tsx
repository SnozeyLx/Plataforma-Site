import React, { useState } from "react";
import Login from "./Login";
import ModalForgout from "./ModalForgout";

const AuthModalController = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showForgout, setShowForgout] = useState(false);

<Login 
  onClose={() => setShowLogin(false)} 
  onForgotPassword={() => {
    setShowLogin(false);
    setShowForgout(true);
  }} 
/>


  return (
    <>
      {showLogin && (
        <div
          className="modal-overlay d-flex justify-content-end align-items-end"
          style={{ marginTop: "-450px" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogin(false);
          }}
        >
          <div className="modal-dialog m-4" style={{ width: "350px", maxWidth: "90%" }}>
            <div className="modal-content bg-dark text-white p-3 rounded-4 animate-fade-slide">
              <div className="modal-body">
                <Login
                  onClose={() => setShowLogin(false)}
                  onForgotPassword={() => {
                    setShowLogin(false);
                    setShowForgout(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showForgout && (
        <div
          className="modal-overlay d-flex justify-content-end align-items-end"
          style={{ marginTop: "-450px" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForgout(false);
          }}
        >
          <div className="modal-dialog m-4" style={{ width: "350px", maxWidth: "90%" }}>
            <div className="modal-content bg-dark text-white p-3 rounded-4 animate-fade-slide">
              <div className="modal-body">
                <ModalForgout onClose={() => setShowForgout(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModalController;
