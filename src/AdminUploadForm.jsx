import React, { useState } from 'react';
import './styles/AdminUploadForm.css';

export default function AdminUploadForm() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title || !description) {
      alert("Por favor completa todos los campos.");
      return;
    }
    alert(`Contenido subido con éxito:
      - Título: ${title}
      - Descripción: ${description}
      - Categoría: ${selectedOption}
    `);

    setFile(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setSelectedOption(null); // Cierra el modal
  };
  
  const openModal = (option) => {
    setSelectedOption(option);
  };

  const closeModal = () => {
    setSelectedOption(null);
  };

  return (
    <>
      {/* Encabezado */}
      <header
        style={{
          width: '100%',
          background: 'linear-gradient(to top, #370061 0%, #7f00b2 100%)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start', // Logo y título alineados a la izquierda
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo */}
        <img
          src="/images/logo1.png" // Ajusta la ruta del logo
          alt="Logo Active Pulse"
          style={{
            height: '100px', // Ajusta el tamaño del logo
            marginRight: '1rem', // Espacio entre el logo y el título
          }}
        />
      </header>

      <div className="admin-options-container">
        {/* Título de la página */}
        <h1 className="admin-options-title">¿Qué quieres subir hoy?</h1>

        {/* Contenedor de las opciones */}
        <div className="admin-options">
          {/* Botón para frases motivacionales */}
          <button className="admin-option" onClick={() => openModal('Frases Motivacionales')}>
            <img src="/images/text.png" alt="Frases" className="option-icon" />
            <span>Frases Motivacionales</span>
          </button>

          {/* Botón para imágenes motivacionales */}
          <button className="admin-option" onClick={() => openModal('Imágenes Motivacionales')}>
            <img src="/images/image.png" alt="Imágenes" className="option-icon" />
            <span>Imágenes Motivacionales</span>
          </button>

          {/* Botón para videos motivacionales */}
          <button className="admin-option" onClick={() => openModal('Videos Motivacionales')}>
            <img src="/images/video.png" alt="Videos" className="option-icon" />
            <span>Videos Motivacionales</span>
          </button>

          {/* Botón para otros */}
          <button className="admin-option" onClick={() => openModal('Otros')}>
            <img src="/images/other.png" alt="Otros" className="option-icon" />
            <span>Otros</span>
          </button>
        </div>
      </div>

      {/* Fondo decorativo */}
      <div className="background-images">
        <img src="/images/logo3.1.png" alt="Esquina izquierda" className="corner-image left" />
        <img src="/images/logo3.1.png" alt="Esquina derecha" className="corner-image right" />
      </div>

      {/* Modal */}
      {selectedOption && (
        <div className="modal">
          <div className="modal-content">
            <h2>{`Subir ${selectedOption}`}</h2>
            <form onSubmit={handleSubmit}>
              {/* Campo para el título */}
              <label htmlFor="title">Título:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Escribe un título para el contenido"
                required
              />

              {/* Campo para la descripción */}
              <label htmlFor="description">Descripción:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el contenido"
                required
              ></textarea>

              {/* Selección de archivo */}
              <label htmlFor="file">Selecciona un archivo:</label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                required
              />

              {/* Botones */}
              <div className="modal-buttons">
                <button type="submit" className="submit-button">
                  Subir
                </button>
                <button
                  type="button"
                  className="close-button"
                  onClick={closeModal}
                >
                  Volver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}