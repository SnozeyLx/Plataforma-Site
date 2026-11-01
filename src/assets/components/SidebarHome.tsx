import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/navigation";
import { ROUTES } from '../../routes';
import 'animate.css';
const SidebarHome = ({ rooms, onRoomClick, sendToUnity}: any) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
 const router = useRouter();
  return (
    <div className="container-fluid d-flex flex-column flex-lg-row animate__animated animate__fadeIn">
    <div className="d-flex flex-column p-3 text-center w-100 w-lg-25" style={{ backgroundColor: '#000000' }}>
      <div className="dropdown-center">
        <button style={{ background: 'red', width: '100%' }} className="btn dropdown-toggle animate__animated animate__pulse" type="button" data-bs-toggle="dropdown" aria-expanded="true">
          Mesas ao vivo
        </button>
        <ul className="dropdown-menu show animate__animated animate__fadeInDown" style={{ width: '100%', backgroundColor: '#000000' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <li
                key={room.id}
                className="table-borderless"
                style={{
                  cursor: 'pointer',
                  backgroundColor: index % 2 === 0 ? '#000000' : '#333333',
                  color: '#ffffff',
                  padding: '0px',
                  transition: 'background-color 0.3s ease',
                  height:'40px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'red')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#000000' : '#333333')
                } 
                >
                <button
                  className="btn btn-lg btn-link-danger animate__animated animate__fadeInUp"
                  style={{height:'40px', color: '#ffffff' , width: '100%'}}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(ROUTES.GAME);
                    sendToUnity(room.id);
                  }}
                >
                  Mesa ao Vivo {room.id}
                </button>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">Nenhuma sala ativa no momento.</li>
          )}
        </ul>
      </div>
    </div>
    </div>

  );
};
export default SidebarHome;