import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import foto from './assets/Captura de pantalla 2024-11-12 121356.png';

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);

  // useEffect(() => {
  //   // let ignore = false;

  //   async function getProfile() {
  //     setLoading(true);
  //     const { user } = session || { user: { id: '', email: '' } };

  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('username, website')
  //       .eq('id', user.id)
  //       .single();

  //     if (!ignore) {
  //       if (error) {
  //         console.warn(error);
  //       } else if (data) {
  //         setUsername(data.username);
  //         setWebsite(data.website);
  //       }
  //     }

  //     setLoading(false);
  //   }

  //   /*if (session) {
  //     getProfile();
  //   } else {
  //     setLoading(false); // Si no hay sesión, no se carga el perfil
  //   }*/

  //   return () => {
  //     ignore = true;
  //   };
  // }, [session]);

  // if (loading) {
  //   return <div>Loading...</div>; // Muestra un mensaje de carga
  // }

  // if (!session) {
  //   return <div>No hay sesión activa.</div>; // Mensaje si no hay sesión
  // }

  return (
    <div className="account-container">
      <img src={foto} alt="Foto" className="perfil-image" />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          disabled // Elimina la capacidad de editar
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          disabled // Elimina la capacidad de editar
        />
      </div>
    </div>
  );
}