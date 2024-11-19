import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Cargar la imagen desde el bucket "uploads"
  useEffect(() => {
    async function fetchImage() {
      // Ruta completa dentro del bucket
      const filePath = 'public/Images/Perfil.png'; // Ajusta la ruta según lo obtenido del bucket
      const { data, error } = supabase.storage
        .from('uploads') // Bucket "uploads"
        .getPublicUrl(filePath); // Ruta dentro del bucket

      if (error) {
        console.error('Error al obtener el URL de la imagen:', error.message);
      } else {
        setImageUrl(data.publicUrl);
      }
    }

    fetchImage();
  }, []);

  // Mantener comentado
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
      <img
        src={imageUrl || 'https://via.placeholder.com/150'} // Fallback si no hay imagen
        alt="Foto"
        className="perfil-image"
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #ccc',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      />
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