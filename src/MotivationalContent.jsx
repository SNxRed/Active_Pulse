import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './styles/MotivationalContent.css';

export default function MotivationalContent() {
  const [content, setContent] = useState([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // Filtrar contenido por categoría
  const imageContent = content.filter((item) => item.category === 'Imágenes Motivacionales');
  const videoContent = content.filter((item) => item.category === 'Videos Motivacionales');
  const phraseContent = content.filter((item) => item.category === 'Frases Motivacionales');

  // Obtener todos los datos de la base de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('motivational_content').select('*');
        if (error) {
          console.error('Error al obtener los datos:', error);
          return;
        }
        console.log('Datos obtenidos:', data);
        setContent(data);
      } catch (error) {
        console.error('Error al conectarse a la base de datos:', error.message);
      }
    };

    fetchData();
  }, []);

  // Cambiar automáticamente la frase cada 5 segundos
  useEffect(() => {
    if (phraseContent.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhraseIndex((prevIndex) =>
          prevIndex + 1 === phraseContent.length ? 0 : prevIndex + 1
        );
      }, 5000); // Cambia cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [phraseContent]);

  return (
    <>
      {/* Header */}
      <header
        style={{
          width: '100%',
          background: 'linear-gradient(to bottom, #7f00b2, #510085)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src="/images/logo1.png"
          alt="Logo Active Pulse"
          style={{
            height: '100px',
            marginRight: '1rem',
          }}
        />
        
      </header>

      <div className="motivational-content-container">
        <h1 className="motivational-title">Contenido Motivacional</h1>

        {/* Carrusel de imágenes */}
        <h2 className="content-section-title">Imágenes Motivacionales</h2>
        {imageContent.length > 0 ? (
          <div className="carousel rounded-box" style={{ display: 'flex', overflowX: 'scroll' }}>
            {imageContent.slice(0, 3).map((item) => (
              <div key={item.id} className="carousel-item">
                <img
                  src={item.file_url}
                  alt={item.title}
                  className="carousel-image"
                  style={{
                    maxHeight: '500px',
                    objectFit: 'cover',
                    margin: '0 10px',
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="no-content-message">No hay imágenes motivacionales disponibles.</p>
        )}

        {/* Carrusel de videos */}
        <h2 className="content-section-title">Videos Motivacionales</h2>
        {videoContent.length > 0 ? (
          <div className="carousel rounded-box" style={{ display: 'flex', overflowX: 'scroll' }}>
            {videoContent.slice(0, 3).map((item) => (
              <div key={item.id} className="carousel-item">
                <video
                  controls
                  className="carousel-video"
                  style={{
                    maxHeight: '500px',
                    objectFit: 'cover',
                    margin: '0 10px',
                  }}
                >
                  <source src={item.file_url} type="video/mp4" />
                  Tu navegador no soporta videos.
                </video>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-content-message">No hay videos motivacionales disponibles.</p>
        )}

        {/* Carrusel de frases */}
        <h2 className="content-section-title">Frases Motivacionales</h2>
        {phraseContent.length > 0 ? (
          <div
            className="phrase-box"
            style={{
              padding: '20px',
              borderRadius: '10px',
              background: 'white',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              margin: '0 auto',
              textAlign: 'center',
              maxWidth: '600px',
            }}
          >
            <p style={{ fontSize: '1.5rem', color: '#510085' }}>
              {phraseContent[currentPhraseIndex]?.description}
            </p>
            <h3 style={{ marginTop: '10px', fontWeight: 'bold' }}>
              {phraseContent[currentPhraseIndex]?.title}
            </h3>
          </div>
        ) : (
          <p className="no-content-message">No hay frases motivacionales disponibles.</p>
        )}
      </div>
      <div className="background-images">
                <img src="/images/logo3.1.png" alt="Esquina izquierda" className="corner-image left" />
                <img src="/images/logo3.1.png" alt="Esquina derecha" className="corner-image right" />
            </div>
    </>
  );
}
