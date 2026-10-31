import React, { useState, useEffect } from "react";
import axios from "axios";
import Vetor from "../assets/img/Vector.png";
import Icon_folha from "../assets/img/Icon_folha.png";
import Botao_avatar from "../assets/img/avatar.png";
import Chevron from "../assets/img/chevron.png";
import Aba from "../assets/img/caneta_avatar.png";
import Avatar from "../assets/img/avatar.png";
import Copia from "../assets/img/copia.png";
import "bootstrap/dist/css/bootstrap.min.css";
import NavInfo from "../assets/components/NavInfo";
import { useNavigate } from "react-router-dom";
import { ROUTES, API_URLS } from "../routes";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import InputMask from "react-input-mask";
import "animate.css";
import Avatar1 from "../assets/img/avatar/avatar1.png";
import Avatar2 from "../assets/img/avatar/avatar2.png";
import Avatar3 from "../assets/img/avatar/avatar3.png";
import Avatar4 from "../assets/img/avatar/avatar4.png";
import Avatar5 from "../assets/img/avatar/avatar5.png";
import Avatar6 from "../assets/img/avatar/avatar6.png";
import Avatar7 from "../assets/img/avatar/avatar7.png";
import Avatar8 from "../assets/img/avatar/avatar8.png";
import Avatar9 from "../assets/img/avatar/avatar9.png";
import Avatar10 from "../assets/img/avatar/avatar10.png";
import Avatar11 from "../assets/img/avatar/avatar11.png";
import Avatar12 from "../assets/img/avatar/avatar12.png";
import Avatar13 from "../assets/img/avatar/avatar13.png";
import Avatar14 from "../assets/img/avatar/avatar14.png";
import Avatar15 from "../assets/img/avatar/avatar15.png";
import Avatar16 from "../assets/img/avatar/avatar16.png";
import Avatar17 from "../assets/img/avatar/avatar17.png";
import Avatar18 from "../assets/img/avatar/avatar18.png";
import Avatar19 from "../assets/img/avatar/avatar19.png";
import Avatar20 from "../assets/img/avatar/avatar20.png";
import Avatar21 from "../assets/img/avatar/avatar21.png";
import Avatar22 from "../assets/img/avatar/avatar22.png";
import Avatar23 from "../assets/img/avatar/avatar23.png";
import Avatar24 from "../assets/img/avatar/avatar24.png";
const calcVipLevelProgress = (totalPoints) => {
  const points = Math.max(0, Number(totalPoints || 0));
  let level = 0;
  let threshold = 500;
  while (points >= threshold) {
    level += 1;
    threshold = threshold * 2;
  }
  return {
    level,
    xpCurrent: points,
    xpTotal: threshold,
  };
};
const Profile = () => {
  const navigate = useNavigate();
  const [showPasswordAtual, setShowPasswordAtual] = useState(false);
  const [showPasswordNova, setShowPasswordNova] = useState(false);
  const [showPasswordConfirme, setShowPasswordConfirme] = useState(false);
  const [id, setId] = useState("");
  const [imgProfile, setImgProflie] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [showCopiedModal, setShowCopiedModal] = useState(false);
  const [showUpdateProfile, SetUpdateProfile] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(Botao_avatar);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [userPoint, setUserPoint] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [activeTab, setActiveTab] = useState("personal");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userGames, setUserGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  });
  const api = axios.create({
    baseURL: API_URLS.BASE,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  });
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
    fetchProfile();
    fetchUserPoints();
    if (activeTab === "bets") {
      fetchUserGames(pagination.currentPage);
    }
  }, [activeTab]);
  const avatares = [
    Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6,
    Avatar7, Avatar8, Avatar9, Avatar10, Avatar11, Avatar12,
    Avatar13, Avatar14, Avatar15, Avatar16, Avatar17, Avatar18,
    Avatar19, Avatar20, Avatar21, Avatar22, Avatar23, Avatar24
  ];
  const vipInfo = calcVipLevelProgress(userPoint);
  const vipLevel = vipInfo.level;
  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      const { id, image_profile, name, email, birth_day, cpf, phone } = response.data.profile;
      setId(id || "");
      setImgProflie(image_profile || "");
      setName(name || "");
      setEmail(email || "");
      setCpf(cpf || "");
      setPhone(phone || "");
      if (image_profile && !isNaN(image_profile)) {
        const n = Number(image_profile);
        if (Number.isFinite(n) && n >= 1 && n <= avatares.length) {
          setSelectedAvatar(n);
          setAvatarUrl(avatares[n - 1]);
        }
      }
      if (birth_day) {
        const [year, month, day] = birth_day.split("-");
        setBirthYear(year);
        setBirthMonth(month);
        setBirthDay(day);
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate(ROUTES.LOGIN);
      }
    }
  };
  const fetchUserPoints = async () => {
    try {
      const res = await api.get("/vip");
      if (res.data?.success) {
        const xpTotalUser = Number(res.data?.xp?.current ?? 0);
        setUserPoint(xpTotalUser);
      } else {
        setUserPoint(0);
      }
    } catch (error) {
      console.error("Erro ao buscar pontos (VIP/points):", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate(ROUTES.LOGIN);
      }
      setUserPoint(0);
    }
  };
  const handleUpdateProfile = () => {
    SetUpdateProfile(true);
    setTimeout(() => {
      SetUpdateProfile(false);
    }, 2000);
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setShowCopiedModal(true);
      setTimeout(() => {
        setShowCopiedModal(false);
      }, 2000);
    });
  };
  const getUnlockedAvatarCount = (level, totalAvatars) => {
    const lv = Math.max(0, Number(level) || 0);
    return Math.min(lv, totalAvatars);
  };
  const canSelectAvatar = (avatarNumber, level, totalAvatars) => {
    const unlocked = getUnlockedAvatarCount(level, totalAvatars);
    return avatarNumber >= 1 && avatarNumber <= unlocked;
  };
  const openModalAvatar = () => {
    setShowAvatarModal(true);
  };
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(value);
  };
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
    setPhone(value);
  };
  const handleSave = async () => {
    const formattedDate = `${birthYear.padStart(4, "0")}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;
    try {
      await api.put("/users/profile/update", {
        name,
        email,
        birth_day: formattedDate,
        cpf,
        phone,
      });
      handleUpdateProfile();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/");
      }
    }
  };
  const getImageSrc = () => {
    if (Number.isInteger(selectedAvatar) && selectedAvatar >= 1 && selectedAvatar <= avatares.length) {
      return avatares[selectedAvatar - 1];
    }
    if (imgProfile && imgProfile.trim() !== "" && !isNaN(imgProfile)) {
      const n = Number(imgProfile);
      if (Number.isFinite(n) && n >= 1 && n <= avatares.length) {
        return avatares[n - 1];
      }
    }
    return Avatar;
  };
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return alert("A nova senha e a confirmação não coincidem.");
    }
    try {
      await api.put("/users/password/update", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    }
  };
  const fetchUserGames = async (page = 1) => {
    setLoadingGames(true);
    try {
      const response = await api.get(`/users/games?page=${page}`);
      if (response.data?.games?.data && Array.isArray(response.data.games.data)) {
        setUserGames(response.data.games.data);
        setPagination({
          currentPage: response.data.games.current_page || 1,
          totalPages: response.data.games.last_page || 1,
          perPage: response.data.games.per_page || 10,
          total: response.data.games.total || 0,
        });
      } else if (response.data?.games && Array.isArray(response.data.games)) {
        setUserGames(response.data.games);
        setPagination((prev) => ({ ...prev, currentPage: page }));
      } else if (Array.isArray(response.data)) {
        setUserGames(response.data);
        setPagination((prev) => ({ ...prev, currentPage: page }));
      } else {
        setUserGames([]);
      }
    } catch (error) {
      console.error("Erro ao buscar apostas:", error);
      setUserGames([]);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate(ROUTES.LOGIN);
      }
    } finally {
      setLoadingGames(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const [currentDate, setCurrentDate] = useState(new Date());
  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month - 1, 1).getDay();
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  const handleDateSelect = (day) => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    setBirthDay(String(day).padStart(2, "0"));
    setBirthMonth(String(month).padStart(2, "0"));
    setBirthYear(year);
    setShowCalendarModal(false);
  };
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const today = new Date();
    const isCurrentMonth =
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
    const isSelectedDate = (day) => {
      return (
        day === parseInt(birthDay) &&
        month === parseInt(birthMonth) &&
        year === parseInt(birthYear)
      );
    };
    let days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="calendar-day empty text-center py-2"
          style={{
            minHeight: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></div>
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = isSelectedDate(day);
      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day text-center py-2 
          ${isToday ? "text-danger fw-bold" : ""} 
          ${isSelected ? "bg-danger text-white rounded" : "hover-bg-light hover-cursor-pointer"}`}
          onClick={() => handleDateSelect(day)}
          style={{
            minHeight: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {day}
        </div>
      );
    }
    return days;
  };
  const formatId = (value, length = 7) => {
    return String(value ?? "").padStart(length, "0");
  };
  const handleAvatarUpdate = async () => {
    const unlocked = canSelectAvatar(selectedAvatar, vipLevel, avatares.length);
    if (!unlocked) {
    }
    try {
      await api.put("/users/profile/update", {
        image_profile: selectedAvatar.toString(),
      });
      setImgProflie(selectedAvatar.toString());
      setAvatarUrl(avatares[selectedAvatar - 1]);
      setShowAvatarModal(false);
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert(error.response?.data?.message || "Erro ao atualizar avatar. Tente novamente.");
    }
  };
  return (
    <div>
      {showUpdateProfile && (
        <div
          className="end-0 translate-middle-x rounded "
          style={{
            position: "absolute",
            zIndex: 1055,
            background: " #fff",
            marginTop: "100px",
            width: "210px",
            height: "42px",
            color: "#080A10",
          }}
        >
          <p style={{ right: "4px", marginTop: "6px" }}>
            <img src={Copia} alt="" /> Perfil alterado com sucesso!
          </p>
        </div>
      )}
      {showCopiedModal && (
        <div
          className="end-0 translate-middle-x rounded "
          style={{
            position: "absolute",
            zIndex: 1055,
            background: " #fff",
            marginTop: "100px",
            width: "210px",
            height: "42px",
            color: "#080A10",
          }}
        >
          <p style={{ right: "4px", marginTop: "6px" }}>
            <img src={Copia} alt="" /> ID copiado com sucesso!
          </p>
        </div>
      )}
      {showCalendarModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCalendarModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="calendar-container">
                  <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
                    <div className="calendar-month fw-bold">
                      {months[currentDate.getMonth()]}
                    </div>
                    <div className="calendar-navigation d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => navigateMonth("prev")}
                      >
                        &lt;
                      </button>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => navigateMonth("next")}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                  <div
                    className="calendar-weekdays mb-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "2px",
                    }}
                  >
                    {weekdays.map((day) => (
                      <div
                        key={day}
                        className="weekday text-center text-white small"
                        style={{
                          minHeight: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div
                    className="calendar-days"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "2px",
                    }}
                  >
                    {renderCalendar()}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCalendarModal(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAvatarModal && (
        <div
          className="modal fade show animate__animated animate__fadeIn"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content animate__animated animate__zoomIn"
              style={{ backgroundColor: "#1A242D" }}
            >
              <div className="modal-header border-0" style={{ borderRadius: "15px" }}>
                <h5 className="modal-title text-white">Selecione seu avatar</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAvatarModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  {[0, 6, 12, 18].map((start) => (
                    <div key={start} className="row mb-3 m-0 justify-content-center">
                      {avatares.slice(start, start + 6).map((avatar, index) => {
                        const avatarNumber = start + index + 1;
                        const unlocked = canSelectAvatar(avatarNumber, vipLevel, avatares.length);
                        const avatarIndex = start + index;
                        return (
                          <div key={avatarIndex} className="col-md-2 col-4 text-center">
                            <img
                              src={avatar}
                              alt={`Avatar ${avatarNumber}`}
                              className={`img-fluid rounded-circle
            ${selectedAvatar === avatarNumber ? "border border-danger animate__animated animate__pulse" : ""}
            ${!unlocked ? "opacity-50" : ""}
          `}

                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                                cursor: unlocked ? "pointer" : "not-allowed",
                              }}
                              onClick={() => {
                                if (unlocked) setSelectedAvatar(avatarNumber);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  style={{ backgroundColor: "#F70004" }}
                  type="button"
                  className="btn btn-lg w-100 btn-danger"
                  onClick={handleAvatarUpdate}
                >
                  Salvar Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <NavInfo />
      <div className="container-fluid">
        <div className="container-fluid">
          <div className="col-12">
            <div
              className="mt-3 d-flex justify-content-between poppins-semibold align-items-center px-3 py-2"
              style={{
                marginTop: "10px",
                fontSize: "20px",
                backgroundColor: "#1A242D",
                borderRadius: "4px",
                padding: "10px 16px",
                height: "40px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
              }}
            >
              <p
                className="text-white fs-5 m-0 d-flex align-items-center"
                style={{ cursor: "pointer", height: "40px" }}
                onClick={() => navigate(ROUTES.HOME)}
              >
                <img src={Vetor} alt="Voltar" className="me-2 poppins-regular" /> Perfil
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "20px",
              backgroundColor: "#1A242D",
              borderRadius: "10px",
              padding: "10px 16px",
              height: "40px",
              paddingBottom: "18px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            }}
            className="d-flex d-lg-none flex-row justify-content-between gap-3 mb-3"
          >
            <div className="text-center flex-fill">
              <p
                className={`text-white poppins-regular d-inline-block ${activeTab === "personal" ? "border-bottom border-danger" : "border-transparent"
                  }`}
                onClick={() => setActiveTab("personal")}
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                Dados pessoais
              </p>
            </div>
            <div className="text-center flex-fill">
              <p
                className={`text-white poppins-regular d-inline-block ${activeTab === "account" ? "border-bottom border-danger" : "border-transparent"
                  }`}
                onClick={() => setActiveTab("account")}
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                Dados da conta
              </p>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 col-lg-2">
              <div
                className="p-3 d-none d-lg-block"
                style={{
                  background: "#1A242D",
                  borderRadius: "14px",
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-inline-flex justify-content-center align-items-center position-relative"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <img
                      className="img-fluid rounded-circle"
                      src={getImageSrc()}
                      alt="Avatar"
                      style={{ width: "80px", height: "80px", objectFit: "cover", cursor: "pointer" }}
                      onClick={openModalAvatar}
                    />
                    <img
                      src={Aba}
                      alt="Editar avatar"
                      className="img-fluid"
                      style={{
                        position: "absolute",
                        marginBottom: "90px",
                        marginTop: "34px",
                        right: "0",
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                      onClick={openModalAvatar}
                    />
                  </div>
                  <div>
                    <p className="text-white mb-0 fw-bold poppins-regular">
                      {name.length > 10 ? name.substring(0, 10) + "..." : name}
                    </p>
                    <small className="text-white-50 poppins-regular">
                      ID: {formatId(id)}
                      <img
                        src={Icon_folha}
                        alt=""
                        onClick={() => handleCopyId(id)}
                        style={{ cursor: "pointer", marginLeft: "6px" }}
                      />
                    </small>
                  </div>
                </div>
                <hr className="bg-light" />
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex flex-column gap-3">
                    <div className="text-center">
                      <p
                        className={`h4 text-white poppins-regular d-inline-block ${activeTab === "personal" ? "border-bottom border-danger" : "border-transparent"
                          }`}
                        onClick={() => setActiveTab("personal")}
                        style={{ cursor: "pointer", fontSize: "16px" }}
                      >
                        Dados pessoais
                      </p>
                    </div>
                    <div className="text-center">
                      <p
                        className={`h4 text-white poppins-regular d-inline-block ${activeTab === "account" ? "border-bottom border-danger" : "border-transparent"
                          }`}
                        onClick={() => setActiveTab("account")}
                        style={{ cursor: "pointer", fontSize: "16px" }}
                      >
                        Dados da conta
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-10">
              <div
                className="p-4"
                style={{
                  background: "#1A242D",
                  borderRadius: "14px",
                }}
              >
                <div
                  className="d-block d-lg-none mb-3"
                  style={{
                    background: "#1A242D",
                    borderRadius: "14px",
                    padding: "16px",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="position-relative" style={{ width: "64px", height: "64px" }}>
                      <img
                        src={getImageSrc()}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={openModalAvatar}
                      />
                      <img
                        src={Aba}
                        alt="Editar avatar"
                        style={{
                          position: "absolute",
                          marginBottom: "48px",
                          bottom: "0",
                          right: "0",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                        onClick={openModalAvatar}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-white fw-bold poppins-regular mb-1" style={{ fontSize: "16px" }}>
                        {name}
                      </p>
                      <small
                        className="text-white-50 poppins-regular d-flex align-items-center gap-1"
                        style={{ fontSize: "12px" }}
                      >
                        ID: {formatId(id)}
                        <img
                          src={Icon_folha}
                          alt="Copiar ID"
                          style={{ width: "14px", cursor: "pointer" }}
                          onClick={() => handleCopyId(id)}
                        />
                      </small>
                    </div>
                  </div>
                </div>
                {activeTab === "personal" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label text-white poppins-regular">Nome</label>
                      <input
                        style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                        type="text"
                        className="form-control  poppins-regular border-0"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white poppins-regular">E-mail</label>
                      <input
                        style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                        type="email"
                        className="form-control  poppins-regular border-0"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white  poppins-regular">Data de nascimento</label>
                      <div className="d-flex gap-2">
                        <div className="d-flex flex-column" style={{ width: "100px" }}>
                          <div className="position-relative" style={{ width: "100px" }}>
                            <input
                              className="form-control poppins-regular border-0 pe-5"
                              style={{ backgroundColor: "#0F1923", color: "#fff" }}
                              placeholder="Dia"
                              maxLength="2"
                              value={birthDay}
                              onChange={(e) => setBirthDay(e.target.value)}
                              onClick={() => setShowCalendarModal(true)}
                            />
                            <img
                              src={Chevron}
                              alt="Abrir calendário"
                              className="position-absolute top-50 end-0 translate-middle-y me-3"
                              style={{ cursor: "pointer", width: "16px" }}
                              onClick={() => setShowCalendarModal(true)}
                            />
                          </div>
                        </div>
                        <div className="position-relative" style={{ width: "100px" }}>
                          <input
                            className="form-control poppins-regular border-0 pe-5"
                            style={{ backgroundColor: "#0F1923", color: "#fff" }}
                            placeholder="Mês"
                            maxLength="2"
                            value={birthMonth}
                            onChange={(e) => setBirthMonth(e.target.value)}
                            onClick={() => setShowCalendarModal(true)}
                          />
                          <img
                            src={Chevron}
                            alt="Abrir calendário"
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            style={{ cursor: "pointer", width: "16px" }}
                            onClick={() => setShowCalendarModal(true)}
                          />
                        </div>
                        <div className="position-relative" style={{ width: "120px" }}>
                          <select
                            className="form-control poppins-regular border-0 pe-5"
                            style={{
                              backgroundColor: "#0F1923",
                              color: "#fff",
                              appearance: "none",
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                            }}
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value)}
                          >
                            <option value="">Ano</option>
                            {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i)
                              .reverse()
                              .map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                          </select>
                          <img
                            src={Chevron}
                            alt="Abrir anos"
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            style={{ width: "16px", pointerEvents: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white">CPF</label>
                      <input
                        style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                        type="text"
                        className="form-control  poppins-regular border-0"
                        value={cpf}
                       // onChange={handleCpfChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-white">Telefone</label>
                      <input
                        style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                        type="tel"
                        className="form-control poppins-regular border-0"
                        value={phone}
                        onChange={handlePhoneChange}
                      />
                    </div>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn  text-white w-50 me-2"
                        onClick={() => navigate(ROUTES.HOME)}
                        style={{ backgroundColor: "#FFFFFF1A", height: "48px" }}
                      >
                        Retornar
                      </button>
                      <button
                        style={{ backgroundColor: "#F70004", height: "48px" }}
                        className="btn btn-danger w-50"
                        onClick={handleSave}
                      >
                        Salvar
                      </button>
                    </div>
                  </>
                )}
                {activeTab === "account" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label poppins-regular text-white">Senha</label>
                      <div className="input-group">
                        <input
                          style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                          type={showPasswordAtual ? "text" : "password"}
                          className="form-control  poppins-regular border-0"
                          value={currentPassword}
                          placeholder="Digite sua senha "
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                          className="btn text-white"
                          type="button"
                          onClick={() => setShowPasswordAtual(!showPasswordAtual)}
                        >
                          {showPasswordAtual ? <EyeSlashFill /> : <EyeFill />}
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label poppins-regular text-white">Nova senha</label>
                      <div className="input-group">
                        <input
                          style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                          type={showPasswordNova ? "text" : "password"}
                          className="form-control poppins-regular border-0"
                          value={newPassword}
                          placeholder="Digite sua nova senha "
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                          className="btn  text-white"
                          type="button"
                          onClick={() => setShowPasswordNova(!showPasswordNova)}
                        >
                          {showPasswordNova ? <EyeSlashFill /> : <EyeFill />}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label poppins-regular text-white">Confirmar nova senha</label>
                      <div className="input-group">
                        <input
                          style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                          type={showPasswordConfirme ? "text" : "password"}
                          className="form-control poppins-regular border-0"
                          value={confirmPassword}
                          placeholder="Confirme sua nova senha"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          style={{ backgroundColor: "#0F1923", color: "#B8BABD" }}
                          className="btn text-white"
                          type="button"
                          onClick={() => setShowPasswordConfirme(!showPasswordConfirme)}
                        >
                          {showPasswordConfirme ? <EyeSlashFill /> : <EyeFill />}
                        </button>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn  text-white w-50 me-2"
                        onClick={() => navigate(ROUTES.HOME)}
                        style={{ backgroundColor: "#FFFFFF1A", height: "48px" }}
                      >
                        Retornar
                      </button>
                      <button
                        className="btn btn-danger w-50"
                        onClick={handlePasswordChange}
                        style={{ backgroundColor: "#F70004", height: "48px" }}
                      >
                        Confirmar
                      </button>
                    </div>
                  </>
                )}
                {activeTab === "bets" && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="text-white mb-0">Histórico de Apostas</h4>
                      <button
                        className="btn btn-outline-light btn-sm"
                        onClick={fetchUserGames}
                        disabled={loadingGames}
                      >
                        {loadingGames ? "Carregando..." : "Atualizar"}
                      </button>
                    </div>
                    {loadingGames ? (
                      <div className="text-center py-5 animate__animated animate__pulse animate__infinite">
                        <div className="spinner-border text-light" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                        <p className="text-white mt-2">Carregando apostas...</p>
                      </div>
                    ) : !Array.isArray(userGames) || userGames.length === 0 ? (
                      <div className="text-center py-5">
                        <p className="text-white-50 mb-0">Nenhuma aposta encontrada</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <style>
                          {`
                          @media (max-width: 576px) {
                            .table-sm-text {
                              font-size: 0.75rem;
                            }
                            .table-sm-padding td, .table-sm-padding th {
                              padding: 0.3rem 0.3rem;
                            }
                          }
                        `}
                        </style>
                        <table className="table table-dark table-striped table-sm-text table-sm-padding">
                          <thead>
                            <tr>
                              <th className="text-white d-none d-md-table-cell">Data</th>
                              <th className="text-white">Sala</th>
                              <th className="text-white">Valor</th>
                              <th className="text-white">Cartas</th>
                              <th className="text-white">Ganhos</th>
                              <th className="text-white">Resultado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userGames.map((game, index) => (
                              <tr key={game.id || index}>
                                <td className="text-white-50 d-none d-md-table-cell">
                                  {formatDate(game.created_at)}
                                </td>
                                <td className="text-white">
                                  <div>
                                    {game.room?.id ? `Sala ${game.room.id}` : `Sala ${game.room_id || "N/A"}`}
                                  </div>
                                  <small className="d-md-none text-white-50">{formatDate(game.created_at)}</small>
                                </td>
                                <td className="text-white">
                                  <span className="small">{formatCurrency(game.bet_amount || 0)}</span>
                                </td>
                                <td className="text-white">
                                  <span className="small">
                                    {game.card_left && game.card_right
                                      ? `${game.card_left} vs ${game.card_right}`
                                      : game.multiplier
                                        ? `${game.multiplier}x`
                                        : "N/A"}
                                  </span>
                                </td>
                                <td className="text-white">
                                  <span className={`small ${game.winnings > 0 ? "text-success" : "text-danger"}`}>
                                    {formatCurrency(game.winnings || 0)}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`badge badge-sm ${game.card_winner && game.card_winner === game.card_left
                                      ? "bg-success"
                                      : game.card_winner && game.card_winner === game.card_right
                                        ? "bg-danger"
                                        : game.status === "won"
                                          ? "bg-success"
                                          : game.status === "lost"
                                            ? "bg-danger"
                                            : game.status === "pending" || game.finished_at === null
                                              ? "bg-warning"
                                              : "bg-secondary"
                                      }`}
                                  >
                                    {game.card_winner && game.card_winner === game.card_left
                                      ? "Ganhou"
                                      : game.card_winner && game.card_winner === game.card_right
                                        ? "Perdeu"
                                        : game.status === "won"
                                          ? "Ganhou"
                                          : game.status === "lost"
                                            ? "Perdeu"
                                            : game.status === "pending" || game.finished_at === null
                                              ? "Pendente"
                                              : game.status || "N/A"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="mt-4">
                      <div className="d-none d-md-block mb-3 text-center">
                        {pagination.total > 0 && (
                          <span className="text-white-50">
                            Mostrando {userGames.length} de {pagination.total} apostas
                          </span>
                        )}
                      </div>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                        <div className="d-flex justify-content-center mb-3 mb-md-0 w-100 w-md-auto">
                          <button
                            className="btn btn-sm btn-outline-light me-2"
                            onClick={() => fetchUserGames(pagination.currentPage - 1)}
                            disabled={pagination.currentPage <= 1 || loadingGames}
                          >
                            &laquo; Anterior
                          </button>
                          <span className="btn btn-sm btn-secondary mx-1">
                            {pagination.currentPage} / {pagination.totalPages}
                          </span>
                          <button
                            className="btn btn-sm btn-outline-light ms-2"
                            onClick={() => fetchUserGames(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages || loadingGames}
                          >
                            Próxima &raquo;
                          </button>
                        </div>
                        <div className="d-block d-md-none mb-3 text-center w-100">
                          {pagination.total > 0 && (
                            <span className="text-white-50 small">
                              {userGames.length} de {pagination.total} apostas
                            </span>
                          )}
                        </div>
                        <button className="btn bg-secondary text-white w-100 w-md-auto" onClick={() => navigate(ROUTES.HOME)}>
                          Retornar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;