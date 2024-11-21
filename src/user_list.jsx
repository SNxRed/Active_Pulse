import "./styles/user_list.css";
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient"; // Asegúrate de importar tu cliente de Supabase
import Drop_File_Zone from "./components/drop_file_zone";
export default function UserList() {
  const [user_list, set_user_list] = useState([]);
  const [search_value, set_search_value] = useState("");

  const upload_modal = useRef(null);

  function Handle_Input_Change(event) {
    const input_value = event.target.value.trim().toLowerCase();
    set_search_value(input_value);
  }

  function Normalize_String(str) {
    return str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  async function Upload_Files() {

  }
  async function Get_Users() {
    const { data, error } = await supabase
      .from("user_profiles") // Cambia esto al nombre de tu tabla
      .select("user_id, first_name, last_name") // Asegúrate de que estas columnas existan
      .order("first_name", { ascending: true }); // Ordenar por first_name
    console.log(data); // Añade esto para depurar
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      // Filtrar usuarios que tienen valores no nulos para first_name y last_name
      const filteredUsers = data.filter((user) => user.first_name && user.last_name);

      // Combina el nombre y apellido en un solo string
      const formattedUsers = filteredUsers.map((user) => `${user.first_name} ${user.last_name}`);
      set_user_list(formattedUsers);
    }
  };
  useEffect(() => Get_Users, []);

  const user_list_filtered = user_list.filter((user) =>
    Normalize_String(user).includes(Normalize_String(search_value))
  );

  return (
    <div id="user-list-container">
      <div id="user-searcher-container">
        <svg viewBox="0 0 24 24" aria-hidden="true" id="search-icon">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
          </g>
        </svg>
        <input
          id="user-searcher-input"
          type="search"
          placeholder="Buscar usuarios"
          onChange={Handle_Input_Change}
        />
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
                  <button>
                    <img
                      src="../src/assets/view_document_icon_1.png"
                      alt="view_document_icon"
                      title="Ver documentos"
                    />
                  </button>
                  <button onClick={() => upload_modal.current.showModal()}>
                    <img
                      src="../src/assets/upload_icon_3.png"
                      alt="upload_icon"
                      title="Subir documentos"
                    />
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <h2 style={{ textAlign: "center" }}>No hay usuarios disponibles.</h2>
        )}
      </ul>
      <dialog ref={upload_modal} className="user_list_modal">
        <div id="upload-modal-container">
          <h2 id="modal-header">SUBIR RUTINA</h2>
          {/* <Upload_Square_Form /> */}
          <Drop_File_Zone />
          <button className="modal-file-button" onClick={Upload_Files}>
            <span>Enviar</span>
          </button>
        </div>
      </dialog>
    </div>
  );
}
