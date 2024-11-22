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
  async function uploadFiles(fileObject) {
    // Asegúrate de extraer el archivo real
    const file = fileObject.file; // Accede al archivo desde la propiedad 'file'

    if (!file) {
        console.error("Archivo no proporcionado.");
        return;
    }

    if (!(file instanceof File)) {
        console.error("El objeto proporcionado no es un archivo válido:", file);
        return;
    }

    if (!selectedUserId) {
        console.error("Usuario no seleccionado.");
        return;
    }

    // Verificar tipo MIME permitido
    const validMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
        'application/pdf' // PDF
    ];

    if (!validMimeTypes.includes(file.type)) {
        console.error("Tipo de archivo no permitido. Solo se aceptan archivos Excel o PDF.");
        return;
    }

    // Verificar tamaño del archivo
    if (file.size === 0) {
        console.error("El archivo está vacío.");
        return;
    }

    console.log("Nombre del archivo:", file.name);
    console.log("Tipo MIME detectado:", file.type);
    console.log("Tamaño del archivo:", file.size, "bytes");

    // Usar FileReader para leer el archivo como ArrayBuffer
    const reader = new FileReader();

    reader.onload = async (event) => {
        try {
            // Convertir el contenido leído a Blob
            const blob = new Blob([event.target.result], { type: file.type });

            console.log("Blob generado, tamaño:", blob.size);

            // Subir archivo al bucket de Supabase
            const { data, error } = await supabase.storage
                .from('uploads') // Nombre del bucket
                .upload(`Rutinas/${file.name}`, blob, {
                    contentType: file.type, // Tipo MIME
                    cacheControl: '3600', // Control de caché
                });

            if (error) {
                console.error("Error al subir el archivo:", error);
                return;
            }

            console.log("Archivo subido correctamente:", data);

            // Construir la URL del archivo subido
            const filePath = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads/Rutinas/${file.name}`;
            console.log("URL del archivo:", filePath);

            // Guardar información del archivo en la base de datos
            const { error: insertError } = await supabase
                .from('user_files') // Tabla en Supabase
                .insert([
                    { user_id: selectedUserId, file_name: file.name, file_path: filePath }
                ]);

            if (insertError) {
                console.error("Error al insertar el registro del archivo:", insertError);
            } else {
                console.log("Registro del archivo creado exitosamente.");
                uploadModal.current.close(); // Cerrar modal después de subir
                getUserFiles(selectedUserId); // Actualizar lista de archivos
            }
        } catch (err) {
            console.error("Error inesperado:", err);
        }
    };

    reader.onerror = (error) => {
        console.error("Error al leer el archivo:", error);
    };

    // Leer archivo como ArrayBuffer para garantizar integridad
    reader.readAsArrayBuffer(file);
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
      <svg viewBox="0 0 24 24" aria-hidden="true" id="search-icon">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
          </g>
        </svg>
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
                  <button
                    onClick={() => {
                      setSelectedUserId(user.user_id); // Almacenar el ID del usuario seleccionado
                      getUserFiles(user.user_id); // Obtener archivos del usuario al seleccionar
                      viewFilesModal.current.showModal(); // Mostrar modal para ver archivos
                    }}
                  >
                    <img
                      src="https://ymjjininyltkzfajvwvd.supabase.co/storage/v1/object/public/uploads/public/Images/view_document_icon_1.png"
                      alt="view_document_icon"
                      title="Ver documentos"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUserId(user.user_id);
                      uploadModal.current.showModal(); // Mostrar modal para subir archivos
                    }}
                  >
                    <img
                      src="https://ymjjininyltkzfajvwvd.supabase.co/storage/v1/object/public/uploads/public/Images/upload_icon_3.png"
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
      <dialog ref={uploadModal} className="user-list-modal">
        <div className="users-modal-container">
          <h2 className="modal-header">SUBIR RUTINA</h2>
          <Drop_File_Zone onFileSelect={uploadFiles} /> {/* Pasar la función de subida */}
          <span className="close-modal-button" onClick={() => uploadModal.current.close()} title="Cerrar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="41px"
              viewBox="0 0 24 24"
              fill="#943eb6"
              className=""
            >
              <path d="M0 0h24v24H0V0z" fill="none" opacity=".87"></path>
              <path
                d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm5 11.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                fill="none"
                opacity=".5"
              ></path>
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path>
            </svg>
          </span>
        </div>
      </dialog>
      <dialog ref={viewFilesModal} className="user-list-modal">
        <div className="users-modal-container">
          <h2 className="modal-header">ARCHIVOS DEL USUARIO</h2>
          <ul className="user-files-list">
            {userFiles.length ? (
              userFiles.map((file, index) => (
                <li key={index}>
                  <a href={file.file_path} target="_blank" rel="noopener noreferrer">
                    {file.file_name}
                  </a>
                </li>
              ))
            ) : (
              <a>No hay archivos asociados a este usuario.</a>
            )}
          </ul>
          <span className="close-modal-button" onClick={() => viewFilesModal.current.close()} title="Cerrar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="41px"
              viewBox="0 0 24 24"
              fill="#943eb6"
              className=""
            >
              <path d="M0 0h24v24H0V0z" fill="none" opacity=".87"></path>
              <path
                d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm5 11.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                fill="none"
                opacity=".5"
              ></path>
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path>
            </svg>
          </span>
        </div>
      </dialog>
    </div>
  );
}