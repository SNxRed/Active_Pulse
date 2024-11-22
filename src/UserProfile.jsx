import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Perfil({ userId }) {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    async function getProfile() {
      if (!userId) {
        setLoading(false);
        return; // Si no hay userId, no hacemos nada
      }

      setLoading(true);
      console.log('User  ID:', userId); // Log del user.id
      const { data, error } = await supabase
        .from('user_profiles')
        .select('phone_number, address, first_name, last_name, date_of_birth, gender, emergency_contact_phone, emergency_contact_name')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.warn('Error al obtener datos:', error);
      } else if (data) {
        console.log('Datos obtenidos:', data); // Log de los datos obtenidos
        setProfileData(data);
      }

      setLoading(false);
    }

    getProfile();
  }, [userId]);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  // Comprobamos si hay datos de perfil
  if (!Object.keys(profileData).length) {
    return <div>No se encontraron datos de perfil.</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Perfil de Usuario</h2>
      <div className="profile-details">
        <div className="profile-item">
          <label>Nombre:</label>
          <span className='span-color'>{profileData.first_name}</span>
        </div>
        <div className="profile-item">
          <label>Apellido:</label>
          <span className='span-color'>{profileData.last_name}</span>
        </div>
        <div className="profile-item">
          <label>Fecha de nacimiento:</label>
          <span className='span-color'>{profileData.date_of_birth}</span>
        </div>
        <div className="profile-item">
          <label>Género:</label>
          <span className='span-color'>{profileData.gender}</span>
        </div>
        <div className="profile-item">
          <label>Número telefónico:</label>
          <span className='span-color'>{profileData.phone_number}</span>
        </div>
        <div className="profile-item">
          <label>Dirección:</label>
          <span className='span-color'>{profileData.address}</span>
        </div>
        <div className="profile-item">
          <label>Número de emergencia:</label>
          <span className='span-color'>{profileData.emergency_contact_phone}</span>
        </div>
        <div className="profile-item">
          <label>Nombre del contacto de emergencia:</label>
          <span className='span-color'>{profileData.emergency_contact_name}</span>
        </div>
      </div>
    </div>
  );
}