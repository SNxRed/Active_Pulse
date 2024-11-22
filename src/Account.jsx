import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [address, setAddress] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Obtener la sesión al montar el componente
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    // Suscribirse a cambios en el estado de autenticación
    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe(); // Limpiar la suscripción al desmontar el componente
    };
  }, []);

  // Cargar la imagen desde el bucket "uploads"
  useEffect(() => {
    async function fetchImage() {
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

  // Obtener el perfil del usuario
  useEffect(() => {
    async function getProfile() {
      if (!session) return; // Si no hay sesión, no hacer nada

      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, address, phone_number, date_of_birth, gender')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.warn(error);
      } else if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setAddress(data.address);
        setPhoneNumber(data.phone_number);
        setDateOfBirth(data.date_of_birth);
        setGender(data.gender);
      }

      setLoading(false);
    }

    getProfile();
  }, [session]);

  if (loading) {
    return <div>Loading...</div>; // Muestra un mensaje de carga
  }

  if (!session) {
    return <div>No hay sesión activa.</div>; // Mensaje si no hay sesión
  }

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
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          type="text"
          value={firstName || ''}
          disabled // Elimina la capacidad de editar
        />
      </div>
      <div>
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          type="text"
          value={lastName || ''}
 disabled // Elimina la capacidad de editar
        />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          value={address || ''}
          disabled // Elimina la capacidad de editar
        />
      </div>
      <div>
        <label htmlFor="phone_number">Phone Number</label>
        <input
          id="phone_number"
          type="text"
          value={phoneNumber || ''}
          disabled // Elimina la capacidad de editar
        />
      </div>
      <div>
        <label htmlFor="date_of_birth">Date of Birth</label>
        <input
          id="date_of_birth"
          type="date"
          value={dateOfBirth || ''}
          disabled // Elimina la capacidad de editar
        />
      </div>
      <div>
        <label htmlFor="gender">Gender</label>
        <input
          id="gender"
          type="text"
          value={gender || ''}
          disabled // Elimina la capacidad de editar
        />
      </div>
    </div>
  );
}