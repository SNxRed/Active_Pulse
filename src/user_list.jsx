import "./styles/user_list.css";
import { useState, useEffect } from "react";
export default function user_list() {
  const [user_list, set_user_list] = useState([]);
  const [search_value, set_search_value] = useState("");
  
    function Handle_Input_Change(event) {
      const input_value = event.target.value.trim().toLowerCase();
      set_search_value(input_value);
    }
    function Normalize_String(str) {
      return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
      
  useEffect(() => {
    const random_names = ["Bob El Constructor", "Eren Jaeger", "Don Quijote Doflamingo", "Bob Esponja", "El Loco Rene", "Weito rey", "Ya Veremos Dijo El Ciego", "Don Francisco", "Yaaaa Inaaaa", "Pongan Bachata"];
    set_user_list(random_names);
  }, []);


  const user_list_filtered = user_list.filter((user) => Normalize_String(user).includes(Normalize_String(search_value))) ;

  return (
    <div id="user-list-container">
      <div id="user-searcher-container">
        <svg viewBox="0 0 24 24" aria-hidden="true" id="search-icon">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
          </g>
        </svg>
        <input id="user-searcher-input" type="search" placeholder="Buscar usuarios" onChange={Handle_Input_Change} />
      </div>
      <ul id="users-container">
        {user_list_filtered.length ? (
            
            user_list_filtered.map((user, index) => (
                    <li className="user-item-container" key={index}>
                  <div className="user-item">
                    <div className="user-info-container">
                      <img
                        src="https://ymjjininyltkzfajvwvd.supabase.co/storage/v1/object/public/uploads/public/Images/icon-user-default.png"
                        alt="user_icon"
                        height={"75%"}
                      />
                      <span>{user}</span>
                    </div>
                    <div className="user-info-container-buttons">
                      <img
                        src="../src/assets/view_document_icon_1.png"
                        alt="view_document_icon"
                        height={"45%"}
                        title="Ver documentos"
                      />
                      <img src="../src/assets/upload_icon_3.png" alt="upload_icon" height={"45%"} title="Subir documentos" />
                    </div>
                  </div>
                </li>
                ))
              
        ): (
            <h2 style={{textAlign: "center"}}>No hay usuarios disponibles.</h2>
        )}
      </ul>
    </div>
  );
}
