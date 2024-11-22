import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const UserFileDownload = ({ userId }) => {
  const [userFile, setUserFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_files') // Cambia esto si tu tabla tiene otro nombre
        .select('file_name, file_path')
        .eq('user_id', userId) // Filtra por el ID del usuario
        .single(); // Obtiene solo un archivo

      if (error) {
        console.error('Error fetching user file:', error);
      } else {
        setUserFile(data);
      }
      setLoading(false);
    };

    fetchUserFile();
  }, [userId]);

  const downloadFile = async (fileName) => {
    const { data, error } = await supabase
      .storage
      .from('uploads') // Nombre del bucket
      .download(`public/Rutinas/${fileName}`); // Ruta del archivo dentro del bucket

    if (error) {
      console.error('Error downloading file:', error);
      return;
    }

    // Crear un objeto URL para el archivo descargado
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="routine-container">
      <h2>Tu Rutina Personalizada</h2>
      {userFile ? (
        <div className="file-info">
          <p className="file-name">Nombre del archivo: {userFile.file_name}</p>
          <button 
            onClick={() => downloadFile(userFile.file_name)} // Llama a la función de descarga
            className="download-button"
          >
            Descargar Archivo
          </button>
        </div>
      ) : (
        <p>No tienes un archivo asignado.</p>
      )}
    </div>
  );
};

export default UserFileDownload;