import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes/routes";
import ProtectedRoute from "./routes/ProtectedRoute";
import IndexPage from "./pages/Index";
import Homepage from "./pages/Home";
import Game from "./pages/Game";
import Bank from "./pages/Bank";
import DealerLive from "./assets/components/DealerLive";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Deposito from "./pages/Deposito";
import Suport from "./pages/Suport";
import Ranking from "./pages/Ranking";
import ResetPassword from "./pages/ResetPassword";
import Vip from "./pages/Vip";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path={ROUTES.LOGIN} element={<IndexPage />} />
        <Route path={ROUTES.INDEX} element={<IndexPage />} />
        <Route path={ROUTES.RESET} element={<ResetPassword />} />
        
        {/* Rotas protegidas */}
        <Route path={ROUTES.HOME} element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.GAME} element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.PROFILE} element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.BANK} element={
          <ProtectedRoute>
            <Bank />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.LIVE} element={
          <ProtectedRoute>
            <DealerLive />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.WALLET} element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.DEPOSIT} element={
          <ProtectedRoute>
            <Deposito />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.SUPPORT} element={
          <ProtectedRoute>
            <Suport />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.RANKING} element={
          <ProtectedRoute>
            <Ranking />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.VIP} element={
          <ProtectedRoute>
            <Vip />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};




export default App;