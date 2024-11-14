import React, { useState, useEffect } from 'react';
import './styles/MotivationalContent.css';

export default function MotivationalContent() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dummyData = [
        { id: 1, type: 'text', title: 'Frase Motivacional', content: '¡Cree en ti mismo y todo será posible!' },
        { id: 2, type: 'image', title: 'Imagen Motivacional', content: '/images/example1.jpg' },
        { id: 3, type: 'video', title: 'Video Motivacional', content: '/videos/example.mp4' },
        { id: 4, type: 'image', title: 'Imagen Motivacional', content: '/images/example2.jpg' },
      ];
      setContent(dummyData); // Simulación de datos desde un backend
    };

    fetchData();
  }, []);

  // Filtrar imágenes para el carrusel
  const imageContent = content.filter((item) => item.type === 'image');

  return(
    <>
      {/* Header */}
      <header
        style={{
          width: '100%',
          background: 'linear-gradient(to bottom, #7f00b2, #510085)', // Degradado
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

      <div className="motivational-content-container">
        {/* Título de la página */}
        <h1 className="motivational-title">Contenido Motivacional</h1>

        {/* Carrusel para imágenes motivacionales */}
        {imageContent.length > 0 && (
          <div className="carousel-container">
            <div className="carousel carousel-vertical rounded-box h-96">
              {imageContent.map((item) => (
                <div key={item.id} className="carousel-item h-full">
                  <img src={item.content} alt={item.title} className="carousel-image" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid de contenido */}
        <div className="content-grid">
          {content.map((item) => (
            <div key={item.id} className="content-card">
              <h2 className="content-title">{item.title}</h2>
              {item.type === 'text' && <p className="content-text">{item.content}</p>}
              {item.type === 'image' && (
                <img src={item.content} alt={item.title} className="content-image" />
              )}
              {item.type === 'video' && (
                <video className="content-video" controls>
                  <source src={item.content} type="video/mp4" />
                  Tu navegador no soporta videos.
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
  