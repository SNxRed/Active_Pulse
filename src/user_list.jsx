import "./styles/user_list.css";
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import Drop_File_Zone from "./components/drop_file_zone";

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null); // Almacenar ID del usuario seleccionado
  const [userFiles, setUserFiles] = useState([]); // Almacenar archivos del usuario
  const uploadModal = useRef(null);
  const viewFilesModal = useRef(null);

  function handleInputChange(event) {
    const inputValue = event.target.value.trim().toLowerCase();
    setSearchValue(inputValue);
  }

  function normalizeString(str) {
    return str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Función para subir archivos
  async function uploadFiles(file) {
    if (!selectedUserId || !file) return; // Asegúrate de que haya un usuario seleccionado y un archivo

    // Subir archivo al bucket
    const { data, error } = await supabase.storage
      .from('uploads') // Nombre del bucket
      .upload(`public/Rutinas/${file.name}`, file); // Ruta donde se guardará el archivo
      console.log("File size before upload:", file.size);
    if (error) {
      console.error("Error uploading file:", error);
      return;
    }

    // Aquí puedes construir la URL del archivo subido
    const filePath = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads/public/Rutinas/${file.name}`;

    // Guardar información del archivo en la tabla user_files
    const { error: insertError } = await supabase
      .from('user_files')
      .insert([
        { user_id: selectedUserId, file_name: file.name, file_path: filePath }
      ]);

    if (insertError) {
      console.error("Error inserting file record:", insertError);
    } else {
      console.log("File uploaded and record created successfully.");
      uploadModal.current.close(); // Cerrar el modal de subida después de subir el archivo
      getUserFiles(selectedUserId); // Obtener archivos del usuario nuevamente
    }
  }

  async function getUserFiles(userId) {
    const { data, error } = await supabase
      .from('user_files')
      .select('file_name, file_path')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching user files:", error);
    } else {
      setUserFiles(data);
    }
  }

  async function getUsers() {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("user_id, first_name, last_name")
      .order("first_name", { ascending: true });

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      const filteredUsers = data.filter((user) => user.first_name && user.last_name);
      setUserList(filteredUsers);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  const userListFiltered = userList.filter((user) =>
    normalizeString(`${user.first_name} ${user.last_name}`).includes(normalizeString(searchValue))
  );

  return (
    <div id="user-list-container">
      <div id="user-searcher-container">
        <input
          id="user-searcher-input"
          type="search"
          placeholder="Buscar usuarios"
          onChange={handleInputChange}
        />
      </div>
      <ul id="users-container">
        {userListFiltered.length ? (
          userListFiltered.map((user) => (
            <li className="user-item-container" key={user.user_id}>
              <div className="user-item">
                <div className="user-info-container">
                  <img
                    src="https://ymjjininyltkzfajvwvd.supabase.co/storage/v1/object/public/uploads/public/Images/icon-user-default.png"
                    alt="user_icon"
                    height={"75%"}
                  />
                  <span>{`${user.first_name} ${user.last_name}`}</span>
                </div>
                <div className="user-info-container-buttons">
                  <button onClick={() => {
                    setSelectedUserId(user.user_id); // Almacenar el ID del usuario seleccionado
                    getUserFiles(user.user_id); // Obtener archivos del usuario al seleccionar
                    viewFilesModal.current.showModal(); // Mostrar modal para ver archivos
                  }}>
                    <img
                      src="../src/assets/view_document_icon_1.png"
                      alt="view_document_icon"
                      title="Ver documentos"
                    />
                  </button>
                  <button onClick={() => {
                    setSelectedUserId(user.user_id);
                    uploadModal.current.showModal(); // Mostrar modal para subir archivos
                  }}>
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
      <dialog ref={uploadModal} className="user_list_modal">
        <div id="upload-modal-container">
          <h2 id="modal-header">SUBIR RUTINA</h2>
          <Drop_File_Zone onFileSelect={uploadFiles} /> {/* Pasar la función de subida */}
          <button className="modal-file-button" onClick={() => uploadModal.current.close()}>
            <span>Cerrar</span>
          </button>
        </div>
      </dialog>
      <dialog ref={viewFilesModal} className="user_list_modal">
        <div id="view-files-modal-container">
          <h2 id="modal-header">ARCHIVOS DEL USUARIO</h2>
          <h3>Archivos del Usuario:</h3>
          <ul>
            {userFiles.length ? (
              userFiles.map((file, index) => (
                <li key={index}>
                  <a href={file.file_path} target="_blank" rel="noopener noreferrer">{file.file_name}</a>
                </li>
              ))
            ) : (
              <p>No hay archivos asociados a este usuario.</p>
            )}
          </ul>
          <button className="modal-file-button" onClick={() => viewFilesModal.current.close()}>
            <span>Cerrar</span>
          </button>
        </div>
      </dialog>
    </div>
  );
}