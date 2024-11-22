import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./styles/AdminHome.css";

export default function AdminHub() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReservations: 0,
    totalContent: 0,
    totalSchedules: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStatistics();
    fetchRecentActivity();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact" });
      const { count: reservationCount } = await supabase.from("reservations").select("*", { count: "exact" });
      const { count: contentCount } = await supabase.from("motivational_content").select("*", { count: "exact" });
      const { count: scheduleCount } = await supabase.from("availability").select("*", { count: "exact" });

      setStats({
        totalUsers: userCount || 0,
        totalReservations: reservationCount || 0,
        totalContent: contentCount || 0,
        totalSchedules: scheduleCount || 0,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations_with_users")
        .select("user_email, date, time, status")
        .limit(5);

      if (error) {
        console.error("Error al cargar actividad reciente:", error);
        return;
      }

      setRecentActivity(data || []);
    } catch (error) {
      console.error("Error al cargar actividad reciente:", error);
    }
  };

  return (
    <div className="admin-hub-container">
      <h1>Hola, Arturo Rojas!</h1>

      {/* Estadísticas Generales */}
      <p className="admin-subtitle">Estadísticas Generales</p>
      <div className="admin-stats">
        <div className="stat-item">
          <h3>Usuarios Registrados</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-item">
          <h3>Reservas Realizadas</h3>
          <p>{stats.totalReservations}</p>
        </div>
        <div className="stat-item">
          <h3>Contenido Publicado</h3>
          <p>{stats.totalContent}</p>
        </div>
        <div className="stat-item">
          <h3>Horarios Configurados</h3>
          <p>{stats.totalSchedules}</p>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="admin-recent-activity">
        <h3>Historial de citas</h3>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity, index) => (
              <tr key={index}>
                <td>{activity.user_email}</td>
                <td>{activity.date}</td>
                <td>{activity.time}</td>
                <td>{activity.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Opciones del Administrador */}
      <p className="admin-subtitle">¿Qué deseas hacer hoy?</p>
      <div className="admin-hub-options">
        <div className="admin-option" onClick={() => navigate("/admin")}>
          <img
            src="/images/invite.png"
            alt="Invitar Usuarios"
            className="admin-option-image"
          />
          <h3>Invitar Usuarios</h3>
          <p>Envía invitaciones a nuevos usuarios para unirse a la plataforma.</p>
        </div>
        <div className="admin-option" onClick={() => navigate("/admin-panel")}>
          <img
            src="/images/horario.png"
            alt="Gestionar Horarios"
            className="admin-option-image"
          />
          <h3>Gestionar Horarios</h3>
          <p>Configura tu disponibilidad para las reservas.</p>
        </div>
        <div className="admin-option" onClick={() => navigate("/upload")}>
          <img
            src="images/publicar.png"
            alt="Publicar Contenido"
            className="admin-option-image"
          />
          <h3>Publicar Contenido</h3>
          <p>Sube contenido motivacional para tus usuarios.</p>
        </div>
        <div className="admin-option" onClick={() => navigate("/motivation")}>
          <img
            src="images/ver.png"
            alt="Ver Contenido"
            className="admin-option-image"
          />
          <h3>Ver Contenido</h3>
          <p>Revisa y gestiona el contenido publicado.</p>
        </div>
      </div>
    </div>
  );
}
