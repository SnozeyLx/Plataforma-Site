import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ROUTES, API_URLS } from "../routes";
import NavInfo from "../assets/components/NavInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
const ClipPath = "clippath" as any;

const avatar1 = "/assets/img/avatar/avatar1.png";
const avatar2 = "/assets/img/avatar/avatar2.png";
const avatar3 = "/assets/img/avatar/avatar3.png";
const avatar4 = "/assets/img/avatar/avatar4.png";
const avatar5 = "/assets/img/avatar/avatar5.png";
const avatar6 = "/assets/img/avatar/avatar6.png";
const avatar7 = "/assets/img/avatar/avatar7.png";
const avatar8 = "/assets/img/avatar/avatar8.png";
const avatar9 = "/assets/img/avatar/avatar9.png";
const avatar10 = "/assets/img/avatar/avatar10.png";
const avatar11 = "/assets/img/avatar/avatar11.png";
const avatar12 = "/assets/img/avatar/avatar12.png";
const avatar13 = "/assets/img/avatar/avatar13.png";
const avatar14 = "/assets/img/avatar/avatar14.png";
const avatar15 = "/assets/img/avatar/avatar15.png";
const avatar16 = "/assets/img/avatar/avatar16.png";
const avatar17 = "/assets/img/avatar/avatar17.png";
const avatar18 = "/assets/img/avatar/avatar18.png";
const avatar19 = "/assets/img/avatar/avatar19.png";
const avatar20 = "/assets/img/avatar/avatar20.png";
const avatar21 = "/assets/img/avatar/avatar21.png";
const avatar22 = "/assets/img/avatar/avatar22.png";
const avatar23 = "/assets/img/avatar/avatar23.png";
const avatar24 = "/assets/img/avatar/avatar24.png";
const gold = "/assets/img/gold.png";
const avatarMap = {
  avatar1, avatar2, avatar3, avatar4, avatar5, avatar6,
  avatar7, avatar8, avatar9, avatar10, avatar11, avatar12,
  avatar13, avatar14, avatar15, avatar16, avatar17, avatar18,
  avatar19, avatar20, avatar21, avatar22, avatar23, avatar24,
};
const PRIZES_BY_PERIOD = {
  daily: { top1: 90, top2: 60, top3: 45, top4: 30 },
  weekly: { top1: 600, top2: 350, top3: 250, top4: 180 },
  monthly: { top1: 2000, top2: 1400, top3: 900, top4: 600 },
};
const PrizeIcon = ({ type, size = 28 }: any) => {
  const common = { width: size, height: size, viewBox: "0 0 16 16" };
  if (type === "gold") {
    return (
      <svg {...common} fill="#ffc107" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5a2 2 0 1 1 4 0l1.5-.75L11 5l3-3-1 5-3.5-1.5L8 7 6.5 5.5 3 6 2 1l3 3z" />
        <rect x="2" y="12" width="12" height="2" fill="#e0b100" />
      </svg>
    );
  }
  if (type === "silver") {
    return (
      <svg {...common} fill="#c0c0c0" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="6" r="4" />
        <rect x="3" y="11" width="10" height="3" fill="#9ea3ad" />
      </svg>
    );
  }
  if (type === "bronze") {
    return (
      <svg {...common} fill="#cd7f32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="6" r="4" />
        <rect x="3" y="11" width="10" height="3" fill="#a86426" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="#3aa0ff" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1h4v4h2l-4 5-4-5h2z" />
      <rect x="5" y="12" width="6" height="3" fill="#1e6fd9" />
    </svg>
  );
};
const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
const PrizeCard = ({ themeClass, amount, iconType }: any) => {
  return (
    <div className={`card flex-fill p-3 rounded ${themeClass} text-white d-flex align-items-center justify-content-between`}>
      <div className="row text-center">
        <PrizeIcon type={iconType} />
        <span>R$ {Number(amount || 0).toLocaleString("pt-BR")}</span>
      </div>
    </div>
  );
};
const formatName = (fullName) => {
  if (!fullName) return "***--- ---***";
  const parts = fullName.trim().split(" ");
  const first = (parts[0] || "").padEnd(3, "-").slice(0, 3);
  const last = (parts.length > 1 ? parts[parts.length - 1] : "")
    .padEnd(3, "-")
    .slice(0, 3);
  return `***${first} ${last}***`;
};
const Ranking = () => {
  const router = useRouter();
  const token = localStorage.getItem("authToken") || "";
  const [ranking, setRanking] = useState<any[]>([]);
  const [endingAt, setEndingAt] = useState<any>(null);
  const [period, setPeriod] = useState("daily");
  const [prizes, setPrizes] = useState(PRIZES_BY_PERIOD.daily);
  const fetchData = async (p) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_URLS.BASE}/ranking/${p}`, { headers });
      if (response.data?.ranking && Array.isArray(response.data.ranking)) {
        setRanking(response.data.ranking);
      } else {
        setRanking([]);
      }
      if (response.data?.prizes) setPrizes(response.data.prizes);
      if (response.data?.ending_at) setEndingAt(response.data.ending_at);
    } catch (e) {
      setRanking([]);
    }
  };
  useEffect(() => {
    fetchData(period);
  }, [period]);
  useEffect(() => {
    setPrizes(PRIZES_BY_PERIOD[period] || PRIZES_BY_PERIOD.daily);
  }, [period]);
  const getRowStyle = (idx, isCurrent) => {
    const base = {
      color: "#fff",
      border: isCurrent ? "2px solid #c53030" : "none",
      marginBottom: "clamp(4px, 1.2vw, 6px)",
      borderRadius: "clamp(8px, 2vw, 10px)",
      background: "linear-gradient(90deg, #1e222b 0%, #171b25 70%)"
    };
    if (idx === 0) {
      base.background = "linear-gradient(90deg, #7d6120 0%, #171b25 70%)";
    } else if (idx === 1) {
      base.background = "linear-gradient(90deg, #2a3142 0%, #171b25 70%)";
    } else if (idx === 2) {
      base.background = "linear-gradient(90deg, #6a3f22 0%, #171b25 70%)";
    }
    return base;
  };
  const formatMoney = (v) => {
    if (typeof v === "string") return v;
    const n = Number(v ?? 0);
    return `R$ ${n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  const getPositionIcon = (position) => {
    if (position === 0) {
      return (
        <svg width={17} height={18} viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M2.84773 14.0947H13.3477M7.76923 0.794231C7.8016 0.735436 7.84916 0.686406 7.90694 0.652259C7.96472 0.618111 8.03061 0.600098 8.09773 0.600098C8.16485 0.600098 8.23074 0.618111 8.28852 0.652259C8.3463 0.686406 8.39386 0.735436 8.42623 0.794231L10.6402 4.99723C10.693 5.09455 10.7667 5.17898 10.856 5.24445C10.9453 5.30991 11.048 5.3548 11.1567 5.37588C11.2654 5.39695 11.3774 5.39371 11.4847 5.36636C11.592 5.33902 11.6919 5.28826 11.7772 5.21773L14.985 2.46973C15.0466 2.41965 15.1224 2.39039 15.2017 2.38618C15.281 2.38197 15.3595 2.40302 15.4261 2.44629C15.4926 2.48957 15.5437 2.55284 15.572 2.627C15.6003 2.70116 15.6043 2.78238 15.5835 2.85898L13.458 10.5435C13.4146 10.7007 13.3211 10.8395 13.1917 10.9389C13.0623 11.0382 12.9041 11.0927 12.741 11.094H3.45523C3.29198 11.0928 3.13356 11.0385 3.00402 10.9391C2.87449 10.8398 2.7809 10.7009 2.73748 10.5435L0.61273 2.85973C0.591918 2.78313 0.595946 2.70191 0.624236 2.62775C0.652526 2.55359 0.703617 2.49032 0.770156 2.44704C0.836695 2.40377 0.915249 2.38272 0.99451 2.38693C1.07377 2.39114 1.14965 2.4204 1.21123 2.47048L4.41823 5.21848C4.50358 5.28901 4.60349 5.33977 4.71078 5.36711C4.81807 5.39446 4.93008 5.39771 5.03878 5.37663C5.14748 5.35555 5.25016 5.31066 5.33945 5.24519C5.42874 5.17973 5.50243 5.0953 5.55523 4.99798L7.76923 0.794231Z" stroke="#F0B100" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      );
    } else if (position === 1) {
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexGrow: 0, flexShrink: 0, width: 18, height: 18, position: "relative" }} preserveAspectRatio="none">
          <g clip-path="url(#clip0_1460_35111)">
            <path d="M4.92247 11.4653L1.04733 5.00645C0.880229 4.72778 0.801643 4.40789 0.821326 4.0865C0.841009 3.76511 0.958095 3.45637 1.15805 3.19863L2.52925 1.44011C2.68792 1.23599 2.89365 1.07032 3.13017 0.956221C3.3667 0.842119 3.6275 0.782715 3.89194 0.782715H14.1121C14.3765 0.782715 14.6374 0.842119 14.8739 0.956221C15.1104 1.07032 15.3161 1.23599 15.4748 1.44011L16.8375 3.19863C17.0388 3.45555 17.1574 3.76386 17.1786 4.08526C17.1998 4.40666 17.1226 4.72699 16.9567 5.00645L13.0816 11.4653M8.15034 9.00012L3.14246 0.947073M9.8537 9.00012L14.8616 0.947073M5.5953 4.89141H12.4087M9.00202 13.9305V12.2871H8.57618M13.2604 13.1088C13.2604 15.378 11.3539 17.2175 9.00202 17.2175C6.65017 17.2175 4.74362 15.378 4.74362 13.1088C4.74362 10.8396 6.65017 9.00011 9.00202 9.00011C11.3539 9.00011 13.2604 10.8396 13.2604 13.1088Z" stroke="#99A1AF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <ClipPath id="clip0_1460_35111">
              <rect width={18} height={18} fill="white" />
            </ClipPath>
          </defs>
        </svg>
      );
    } else if (position === 2) {
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexGrow: 0, flexShrink: 0, width: 18, height: 18, position: "relative" }} preserveAspectRatio="none">
          <g clip-path="url(#clip0_1463_35599)">
            <path d="M4.92247 11.4653L1.04733 5.00645C0.880229 4.72778 0.801643 4.40789 0.821326 4.0865C0.841009 3.76511 0.958095 3.45637 1.15805 3.19863L2.52925 1.44011C2.68792 1.23599 2.89365 1.07032 3.13017 0.956221C3.3667 0.842119 3.6275 0.782715 3.89194 0.782715H14.1121C14.3765 0.782715 14.6374 0.842119 14.8739 0.956221C15.1104 1.07032 15.3161 1.23599 15.4748 1.44011L16.8375 3.19863C17.0388 3.45555 17.1574 3.76386 17.1786 4.08526C17.1998 4.40666 17.1226 4.72699 16.9567 5.00645L13.0816 11.4653M8.15034 9.00012L3.14246 0.947073M9.8537 9.00012L14.8616 0.947073M5.5953 4.89141H12.4087M9.00202 13.9305V12.2871H8.57618M13.2604 13.1088C13.2604 15.378 11.3539 17.2175 9.00202 17.2175C6.65017 17.2175 4.74362 15.378 4.74362 13.1088C4.74362 10.8396 6.65017 9.00011 9.00202 9.00011C11.3539 9.00011 13.2604 10.8396 13.2604 13.1088Z" stroke="#BB4D00" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <ClipPath id="clip0_1463_35599">
              <rect width={18} height={18} fill="white" />
            </ClipPath>
          </defs>
        </svg>
      );
    } else if (position === 3) {
      return (
        <svg width={17} height={17} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M3.59961 5.8501H2.47461C1.97733 5.8501 1.50041 5.65255 1.14878 5.30092C0.797153 4.94929 0.599609 4.47238 0.599609 3.9751C0.599609 3.47782 0.797153 3.0009 1.14878 2.64927C1.50041 2.29764 1.97733 2.1001 2.47461 2.1001H3.59961M3.59961 5.8501L3.59961 0.600098H12.5996V5.8501M3.59961 5.8501C3.59961 7.04357 4.07372 8.18816 4.91763 9.03208C5.76154 9.87599 6.90614 10.3501 8.09961 10.3501C9.29308 10.3501 10.4377 9.87599 11.2816 9.03208C12.1255 8.18816 12.5996 7.04357 12.5996 5.8501M12.5996 5.8501H13.7246C14.2219 5.8501 14.6988 5.65255 15.0504 5.30092C15.4021 4.94929 15.5996 4.47238 15.5996 3.9751C15.5996 3.47782 15.4021 3.0009 15.0504 2.64927C14.6988 2.29764 14.2219 2.1001 13.7246 2.1001H12.5996M2.09961 15.6001H14.0996M6.59961 10.0951V11.8501C6.59961 12.2626 6.24711 12.5851 5.87211 12.7576C4.98711 13.1626 4.34961 14.2801 4.34961 15.6001M9.59961 10.0951V11.8501C9.59961 12.2626 9.95211 12.5851 10.3271 12.7576C11.2121 13.1626 11.8496 14.2801 11.8496 15.6001" stroke="#2B7FFF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      );
    }
    return null;
  };
  return (
    <div className="container-fluid p-1  poppins-regular">
      <NavInfo />
      <div className="container-fluid mt-3">
        <div
          style={{
            height: "64px",
            backgroundColor: "#1A242D",
            borderRadius: "8px",
          }}
          className="d-flex align-items-center mb-3">
          <button className="btn btn-link text-white text-decoration-none me-2" onClick={() => router.push(ROUTES.HOME)}>❮</button>
          <h4
            style={{
              fontSize: "20px"
            }}
            className="text-white m-0 poppins-semibold">Ranking</h4>
          <div className="ms-auto text-white-50">{endingAt ? `Termina em ${endingAt}` : ""}</div>
        </div>

        <div className="row">
          <div
            className="d-lg-none d-block d-flex justify-content-between align-items-cente"
            style={{
              padding: "20px 8px 0",
              height: 48,
              background: "#1a242d",
              marginLeft: 2,
              marginRight: 2,
              paddingRight: 2,
              paddingLeft: 8,

            }}
          >
            {[
              { label: "Diário", value: "daily" },
              { label: "Semanal", value: "weekly" },
              { label: "Mensal", value: "monthly" },
            ].map((item) => (
              <div
                key={item.value}
                style={{
                  flex: 1,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => setPeriod(item.value)}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 500,
                    color: period === item.value ? "#fdfdfd" : "#b8babd",
                  }}
                >
                  {item.label}
                </p>

                <div
                  style={{
                    //marginTop: "-6px",
                    margin: isMobile ? "-2px auto 0" : "6px auto 0",
                    width: "70%",
                    height: 2,
                    background: period === item.value ? "#E63A44" : "transparent",
                    transition: "0.3s",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="w-100">
            <div className="d-flex">
              <div className="m-1 prize-card text-center rounded"
                style={{ minHeight: "150px", minWidth: "81px", background: "linear-gradient(to top, rgba(240,177,0,.4), rgba(204,154,16,.17), rgba(240,177,0,.4))" }}>
                <svg
                  width={60}
                  height={54}
                  viewBox="0 0 60 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M10.3947 52H49.6025M28.772 2.7193C28.8928 2.50145 29.0704 2.31979 29.2862 2.19327C29.5019 2.06674 29.748 2 29.9986 2C30.2492 2 30.4953 2.06674 30.711 2.19327C30.9268 2.31979 31.1044 2.50145 31.2252 2.7193L39.4925 18.2921C39.6897 18.6527 39.9648 18.9655 40.2983 19.2081C40.6317 19.4507 41.0151 19.617 41.421 19.6951C41.8269 19.7732 42.2451 19.7612 42.6458 19.6598C43.0464 19.5585 43.4195 19.3705 43.7382 19.1091L55.7162 8.92732C55.9461 8.74175 56.2294 8.63336 56.5254 8.61775C56.8214 8.60214 57.1147 8.68012 57.3632 8.84047C57.6116 9.00081 57.8024 9.23524 57.908 9.51002C58.0137 9.7848 58.0287 10.0858 57.951 10.3696L50.0142 38.842C49.8522 39.4246 49.5032 39.9389 49.02 40.307C48.5369 40.6751 47.946 40.8768 47.3369 40.8817H12.6631C12.0535 40.8774 11.462 40.676 10.9783 40.3079C10.4946 39.9397 10.1451 39.4251 9.98299 38.842L2.04899 10.3723C1.97128 10.0885 1.98632 9.78758 2.09196 9.5128C2.19759 9.23802 2.38837 9.00359 2.63683 8.84324C2.8853 8.6829 3.17862 8.60492 3.47459 8.62053C3.77056 8.63614 4.05391 8.74453 4.28384 8.9301L16.259 19.1119C16.5777 19.3732 16.9508 19.5613 17.3514 19.6626C17.7521 19.7639 18.1704 19.776 18.5762 19.6979C18.9821 19.6198 19.3655 19.4535 19.699 19.2109C20.0324 18.9683 20.3075 18.6555 20.5047 18.2949L28.772 2.7193Z"
                    stroke="#F0B100"
                    stroke-width={4}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>;
                <div className="fs-3 fw-semibold text-warning">{formatMoney(prizes.top1 || 0)}</div>
                <div className="fs-4 fw-semibold text-white">1º lugar</div>
              </div>
              <div className="m-1 prize-card text-center rounded"
                style={{ minHeight: "150px", minWidth: "81px", background: "linear-gradient(to top, rgba(254,254,254,.4), rgba(141,141,141,.17), rgba(245,245,245,.4))" }}>
                <svg
                  width={60}
                  height={54}
                  viewBox="0 0 60 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M14.5404 34.5L2.69963 14.85C2.18905 14.0022 1.94892 13.029 2.00907 12.0512C2.06921 11.0734 2.42697 10.1342 3.03793 9.35L7.22773 4C7.71253 3.37902 8.34118 2.875 9.06388 2.52786C9.78658 2.18073 10.5835 2 11.3915 2H42.6198C43.4278 2 44.2247 2.18073 44.9474 2.52786C45.6701 2.875 46.2988 3.37902 46.7836 4L50.9473 9.35C51.5623 10.1316 51.9247 11.0696 51.9895 12.0474C52.0543 13.0252 51.8186 13.9998 51.3117 14.85L39.4709 34.5M24.4033 27L9.10141 2.50003M29.608 27L44.9098 2.50003M16.5962 14.5H37.4151M27.0056 42V37H25.7045M40.0174 39.5C40.0174 46.4036 34.1918 52 27.0056 52C19.8194 52 13.9939 46.4036 13.9939 39.5C13.9939 32.5964 19.8194 27 27.0056 27C34.1918 27 40.0174 32.5964 40.0174 39.5Z"
                    stroke="#99A1AF"
                    stroke-width={4}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>;
                <div className="fs-3 fw-semibold text-light" style={{ color: "#8e8c88ff" }}>{formatMoney(prizes.top2 || 0)}</div>
                <div className="fs-4 fw-semibold text-white">2º lugar</div>
              </div>
              <div className="m-1 prize-card text-center rounded"
                style={{ minHeight: "150px", minWidth: "81px", background: "linear-gradient(to top, rgba(187,77,0,.4), rgba(187,77,0,.17), rgba(187,77,0,.4))" }}>
                <svg
                  width={60}
                  height={54}
                  viewBox="0 0 60 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ flexGrow: 0, flexShrink: 0, width: 63, height: 57, position: "relative" }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M18.5404 34.5L6.69963 14.85C6.18905 14.0022 5.94892 13.029 6.00907 12.0512C6.06921 11.0734 6.42697 10.1342 7.03793 9.35L11.2277 4C11.7125 3.37902 12.3412 2.875 13.0639 2.52786C13.7866 2.18073 14.5835 2 15.3915 2H46.6198C47.4278 2 48.2247 2.18073 48.9474 2.52786C49.6701 2.875 50.2988 3.37902 50.7836 4L54.9473 9.35C55.5623 10.1316 55.9247 11.0696 55.9895 12.0474C56.0543 13.0252 55.8186 13.9998 55.3117 14.85L43.4709 34.5M28.4033 27L13.1014 2.50003M33.608 27L48.9098 2.50003M20.5962 14.5H41.4151M31.0056 42V37H29.7045M44.0174 39.5C44.0174 46.4036 38.1918 52 31.0056 52C23.8194 52 17.9939 46.4036 17.9939 39.5C17.9939 32.5964 23.8194 27 31.0056 27C38.1918 27 44.0174 32.5964 44.0174 39.5Z"
                    stroke="#BB4D00"
                    stroke-width={4}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>;
                <div className="fs-3 fw-semibold text-orange" style={{ color: "#d44a05ff" }}>{formatMoney(prizes.top3 || 0)}</div>
                <div className="fs-4 fw-semibold text-white">3º lugar</div>
              </div>
              <div
                style={{ minHeight: "150px", minWidth: "81px", background: "#1A242D" }}
                className="m-1 prize-card text-center rounded bg-dark">
                <svg
                  width={60}
                  height={54}
                  viewBox="0 0 60 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ flexGrow: 0, flexShrink: 0, width: 63, height: 57, position: "relative" }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M20.166 21H16.416C14.7584 21 13.1687 20.3415 11.9966 19.1694C10.8245 17.9973 10.166 16.4076 10.166 14.75C10.166 13.0924 10.8245 11.5027 11.9966 10.3306C13.1687 9.15848 14.7584 8.5 16.416 8.5H20.166M20.166 21L20.166 3.5H50.166V21M20.166 21C20.166 24.9782 21.7464 28.7936 24.5594 31.6066C27.3725 34.4196 31.1878 36 35.166 36C39.1443 36 42.9596 34.4196 45.7726 31.6066C48.5857 28.7936 50.166 24.9782 50.166 21M50.166 21H53.916C55.5736 21 57.1633 20.3415 58.3354 19.1694C59.5075 17.9973 60.166 16.4076 60.166 14.75C60.166 13.0924 59.5075 11.5027 58.3354 10.3306C57.1633 9.15848 55.5736 8.5 53.916 8.5H50.166M15.166 53.5H55.166M30.166 35.1499V40.9999C30.166 42.3749 28.991 43.4499 27.741 44.0249C24.791 45.3749 22.666 49.0999 22.666 53.4999M40.166 35.1499V40.9999C40.166 42.3749 41.341 43.4499 42.591 44.0249C45.541 45.3749 47.666 49.0999 47.666 53.4999"
                    stroke="#2B7FFF"
                    stroke-width={4}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>;
                <div className="fs-3 fw-semibold text-secondary">{formatMoney(prizes.top4 || 0)}</div>
                <div className="fs-4 fw-semibold text-white">4º ao 10º lugar</div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="d-none d-lg-block">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              padding: "20px 8px 0",
              height: 48,
              background: "#1a242d",
            }}
          >
            {[
              { label: "Diário", value: "daily" },
              { label: "Semanal", value: "weekly" },
              { label: "Mensal", value: "monthly" },
            ].map((item) => (
              <div
                key={item.value}
                style={{
                  flex: 1,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => setPeriod(item.value)}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 500,
                    color: period === item.value ? "#fdfdfd" : "#b8babd",
                    marginTop: -22,
                  }}
                >
                  {item.label}
                </p>

                <div
                  style={{
                    margin: "6px auto 0",
                    width: "70%",
                    height: 2,
                    background: period === item.value ? "#E63A44" : "transparent",
                    transition: "0.3s",
                    marginTop: -1,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <br />
        <div className="text-white mb-2">Classificação</div>
        {ranking.map((item, idx) => {
          const name = item.name?.slice(0, 13); //formatName(item.name);
          const rowStyle = getRowStyle(idx, item.is_current_user);
          return (
            <div
              key={item.id || idx}
              className="d-flex justify-content-center align-items-center px-3 py-1 rounded-3 mb-2"
              style={rowStyle}
            >
              <div className="d-flex w-100 gap-3">
                <div className="d-flex align-items-center flex-grow-1 gap-2">
                  <img
                    src={
                      avatarMap[`avatar${item.avatar}`]

                    }
                    alt="avatar"
                    style={{
                      width: "clamp(36px, 8vw, 48px)",
                      height: "clamp(36px, 8vw, 48px)",
                      borderRadius: "50%",
                    }}
                  />
                  <div className="d-flex flex-column text-start">
                    <span
                      className="poppins-semibold text-white"
                      style={{
                        fontSize: "clamp(12px, 3.5vw, 16px)",
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.05em"
                      }}
                    >
                      {name}
                    </span>
                    <small className="text-secondary">
                      {idx < 4 ? (
                        getPositionIcon(idx)
                      ) : (
                        <span className="text-white-50" style={{ fontSize: "clamp(12px, 3.5vw, 18px)" }}>#{idx + 1}</span>
                      )} <span style={{
                        fontSize: "clamp(12px, 3.5vw, 16px)",
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.05em"
                      }}>
                        {item.bets_count || 0} apostas</span>
                    </small>
                  </div>
                </div>
                <div className="d-flex justify-content-between flex-grow-1">
                  <div className="d-flex flex-column text-end">
                    <small className="text-white-50" style={{ fontSize: "clamp(10px, 2.8vw, 11px)" }}>PTS</small>
                    <span className="text-white"
                      style={{
                        fontSize:  isMobile ? "11px" : "clamp(12px, 3.5vw, 16px)",
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.05em"
                      }}
                    >
                      {item.point_daily}
                      {item.point_weekly}
                      {item.point_monthly}
                    </span>
                  </div>
                  <div className="d-flex flex-column text-end">
                    <small className="text-white-50" style={{ fontSize: "clamp(10px, 2.8vw, 11px)" }}>Taxa</small>
                    <span className="text-white" style={{
                      fontSize:  isMobile ? "11px" : "clamp(12px, 3.5vw, 16px)",
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.05em"
                    }}>
                      {typeof item.percentage === "number"
                        ? `${item.percentage.toFixed(2)}%`
                        : `${Number(item.percentage || 0).toFixed(2)}%`}
                    </span>
                  </div>
                  <div className="d-flex flex-column text-end">
                    <small className="text-white-50" style={{ fontSize: "clamp(10px, 2.8vw, 11px)" }}>Maior Vitória</small>
                    <span className="text-white" style={{ fontSize: isMobile ? "11px" : "clamp(12px, 3.5vw, 16px)",  fontWeight: 600 }}>
                      {formatMoney(item.biggest_bet || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {ranking.length === 0 && (
          <div className="list-group-item bg-dark text-white-50">
            Sem dados para o período selecionado
          </div>
        )}
      </div>
    </div>
  );
};
export default Ranking;
