import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    async function getProfile() {
      if (!session) {
        setLoading(false);
        return; // Si no hay sesión, no hacemos nada
      }

      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number, address, first_name, last_name, date_of_birth, gender, weight, emergency_phone_number, emergency_contact_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn(error);
      } else if (data) {
        setProfileData(data);
      }

      setLoading(false);
    }

    getProfile();
  }, [session]);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  const {
    first_name: firstName = 'N/A',
    last_name: lastName = 'N/A',
    date_of_birth: dateOfBirth = 'N/A',
    gender = 'N/A',
    weight = 'N/A',
    phone_number: phoneNumber = 'N/A',
    address = 'N/A',
    emergency_phone_number: emergencyPhoneNumber = 'N/A',
    emergency_contact_name: emergencyContactName = 'N/A',
  } = profileData;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Perfil de Usuario</h2>
      <div className="profile-details">
        <div className="profile-item">
          <label>Nombre:</label>
          <span>{firstName}</span>
        </div>
        <div className="profile-item">
          <label>Apellido:</label>
          <span>{lastName}</span>
        </div>
        <div className="profile-item">
          <label>Fecha de nacimiento:</label>
          <span>{dateOfBirth}</span>
        </div>
        <div className="profile-item">
          <label>Género:</label>
          <span>{gender}</span>
        </div>
        <div className="profile-item">
          <label>Peso:</label>
          <span>{weight}</span>
        </div>
        <div className="profile-item">
          <label>Número telefónico:</label>
          <span>{phoneNumber}</span>
        </div>
        <div className="profile-item">
          <label>Dirección:</label>
          <span>{address}</span>
        </div>
        <div className="profile-item">
          <label>Número de emergencia:</label>
          <span>{emergencyPhoneNumber}</span>
        </div>
        <div className="profile-item">
          <label>Nombre del contacto de emergencia:</label>
          <span>{emergencyContactName}</span>
        </div>
      </div>
    </div>
  );
}