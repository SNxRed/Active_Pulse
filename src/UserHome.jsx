import foto from './assets/Captura de pantalla 2024-11-12 121356.png';

export default function Usuario() {
  return (
    <div className="user-container">
      <div className="user-introduction">
        <h1>Bienvenido a Active Pulse</h1>
        <h3>Te invitamos a que conozcas ⚽️ACTIVE PULSE⚽️, un servicio de clases personalizadas de futbol donde nos preocupamos de la preparación 
          física, técnica y mental para que puedas aumentar tu rendimiento‼️</h3> 
        <h3>Desbloquea tu verdadero potencial‼️ te invitamos a creer y tener fe de tus verdaderas capacidades💪🏼⚽️ 
          Únete a nosotros y descubre el verdadero significado del next level‼️</h3>
      </div>

      {/* Sección de Servicios */}
      <div className="services-section">
        <div className="service-card">
          <img src="./src/assets/453392302_406024249139385_18417203966498385_n.jpg" alt="Servicio 1" className="service-image" />
          <div className="service-text">
            <h2>Rutinas personalizada</h2>
            <h4>Te proporcionamos un programa personalizado que se adapte a tus objetivos y nivel de habilidad.</h4>
            <h4>A través de ejercicios especializados y técnicas avanzadas, trabajarás en mejorar tu resistencia, fuerza, velocidad y agilidad, así como en desarrollar tus habilidades técnicas como el dominio del balón, el pase preciso, el tiro potente y la táctica de juego.</h4>
          </div>
        </div>
        <div className="service-card">
          <img src="./src/assets/451416928_2778011132349710_7851182731826726247_n.jpg" alt="Fútbol como conexión familiar" className="service-image" />
          <div className="service-text">
            <h2>Programa familiar</h2>
            <h4>En Active Pulse, creemos que el fútbol no solo es un deporte, sino una oportunidad para fortalecer los lazos familiares. Nuestro programa de entrenamiento "Fútbol como conexión familiar" está diseñado para involucrar a padres e hijos en un ambiente divertido y colaborativo.</h4>
            <h4>Únete a nosotros y descubre cómo el fútbol puede ser el puente que une a tu familia, creando un espacio donde todos pueden crecer y disfrutar juntos.</h4>
          </div>
        </div>
        <div className="service-card">
          <img src="./src/assets/453230643_911080611063426_2128810663211328593_n.jpg" alt="Testimonios" className="service-image" />
          <div className="service-text">
            <h2>Testimonios</h2>
            <h4>En Active Pulse, valoramos las experiencias de nuestros usuarios. La sección de testimonios es un espacio donde nuestros clientes comparten sus historias, sus logros y cómo nuestras clases personalizadas han impactado positivamente en sus vidas.</h4>
            <h4>Te invitamos a explorar estas experiencias y a unirte a nuestra familia Active Pulse, donde cada paso cuenta y cada historia importa.</h4>
          </div>
        </div>
      </div>

      {/* Contacto con el Administrador */}
      <h2>¿Necesitas más información o quieres agendar una hora?</h2>
      <div className="contact-section">
        <div className="contact-text">
          <h2>Contacto de Arturo Rojas</h2>
          <h3>Teléfono: +56 966 933 685</h3>
          <h3>Instagram: <a href="https://www.instagram.com/activepulse.cl?igsh=cjE5OGQ0NjhuZWVy">@activepulse.cl </a></h3>
        </div>
        <img src={foto} alt="Contacto" className="contact-image" />
      </div>
    </div>
  );
}