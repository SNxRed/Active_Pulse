import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar"; // Asegúrate de tener instalada react-calendar

function AdminPanel({ adminId }) {
  const [reservations, setReservations] = useState([]); // Todas las reservas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    fetchAllReservations(); // Cargar reservas al montar el componente
  }, []);

  const fetchAllReservations = async () => {
    try {
      const { data: reservations, error } = await supabase
        .from("reservations_with_users")
        .select("*");
  
      if (error) {
        console.error("Error al obtener reservas:", error);
        toast.error("Error al cargar las reservas.");
        setLoading(false);
        return;
      }
  
      // Procesar los datos para incluir directamente el correo
      const processedReservations = reservations.map((res) => ({
        id: res.reservation_id,
        date: res.date,
        time: res.time,
        status: res.status,
        user_id: res.user_id,
        email: res.user_email, // El correo ya está directamente en los datos
      }));
  
      setReservations(processedReservations);
      setLoading(false);
    } catch (err) {
      console.error("Error inesperado al cargar reservas:", err);
      toast.error("Ocurrió un error inesperado.");
      setLoading(false);
    }
  };

  // Crear una lista de horarios de 8 AM a 8 PM (con intervalos de 1 hora)
  const generateAvailableSlots = () => {
    const slots = [];
    for (let i = 8; i <= 20; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`; // Formatear la hora correctamente
      slots.push(hour);
    }
    return slots;
  };

  // Obtener horarios disponibles para la fecha seleccionada
  // Obtener horarios disponibles para la fecha seleccionada
  const fetchAvailableSlots = async (date) => {
    const dateString = date.toISOString().split("T")[0]; // Formatear la fecha correctamente
    try {
      const { data, error } = await supabase
        .from("availability")
        .select("time_slots")
        .eq("date", dateString)
        .order("created_at", { ascending: false }) // Ordenar por fecha de creación para obtener la más reciente
        .limit(1) // Limitar a una sola fila
        .single(); // Asegurarnos que solo obtenemos una fila

      if (error && error.code !== "PGRST116") {
        console.error("Error al obtener disponibilidad:", error);
        toast.error("Error al cargar la disponibilidad.");
        return;
      }

      if (!data || !data.time_slots || data.time_slots.length === 0) {
        // Si no hay datos o la respuesta es vacía, asumimos que no hay disponibilidad
        setAvailableSlots([]);
        setSelectedSlots([]); // No hay horarios seleccionados
      } else {
        // Si existen datos, los usamos
        setAvailableSlots(data.time_slots);
        setSelectedSlots(data.time_slots); // Preseleccionamos los horarios disponibles
      }
    } catch (err) {
      console.error("Error al cargar los horarios disponibles:", err);
      toast.error("Ocurrió un error al cargar los horarios.");
    }
  };

  const handleCancelReservation = async (id, date, time, email) => {
    try {
      // Actualizar el estado de la reserva a "cancelled"
      const { error } = await supabase
        .from("reservations")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) {
        console.error("Error al cancelar la reserva:", error);
        toast.error("No se pudo cancelar la reserva.");
        return;
      }

      toast.success(
        `Reserva para ${date} a las ${time} cancelada correctamente.`
      );

      // Enviar correo notificando la cancelación
      const subject = "Notificación de cancelación de reserva";
      const html = `
        <p>Hola,</p>
        <p>Te informamos que tu reserva para el día <strong>${date}</strong> a las <strong>${time}</strong> ha sido cancelada.</p>
        <p>Si tienes preguntas, no dudes en contactarnos.</p>
      `;

      await sendEmail(email, subject, html);

      // Recargar las reservas después de la cancelación
      fetchAllReservations();
    } catch (err) {
      console.error("Error inesperado al cancelar la reserva:", err);
      toast.error("Ocurrió un error al cancelar la reserva.");
    }
  };
  const getAccessToken = async () => {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "Error obteniendo el token de acceso:",
        sessionError.message
      );
      toast.error(
        "No se pudo obtener el token de acceso. Por favor, inicia sesión nuevamente."
      );
      return null;
    }

    return sessionData?.session?.access_token || null;
  };

  const sendEmail = async (email, subject, html) => {
    if (!email) {
      console.error("Correo destinatario no válido:", email);
      toast.error("No se pudo enviar el correo. El destinatario es inválido.");
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) return;

    try {
      const response = await fetch(
        "https://ymjjininyltkzfajvwvd.supabase.co/functions/v1/send-mail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ email, subject, html }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Correo enviado correctamente.");
      } else {
        console.error("Error al enviar el correo:", result.error);
        toast.error(`Error enviando correo: ${result.error}`);
      }
    } catch (fetchError) {
      console.error("Error inesperado al enviar el correo:", fetchError);
      toast.error("Ocurrió un error inesperado al enviar el correo.");
    }
  };

  // Manejar la selección de fechas en el calendario
  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAvailableSlots(date); // Actualizar la disponibilidad cada vez que cambie la fecha
  };

  // Activar o desactivar horarios
  const handleSlotChange = (slot) => {
    const updatedSlots = selectedSlots.includes(slot)
      ? selectedSlots.filter((s) => s !== slot) // Si ya está seleccionado, lo deseleccionamos
      : [...selectedSlots, slot]; // Si no está seleccionado, lo agregamos

    setSelectedSlots(updatedSlots);
  };

  const saveAvailability = async () => {
    const dateString = selectedDate.toISOString().split("T")[0];

    try {
      const { data, error } = await supabase.from("availability").upsert(
        {
          date: dateString,
          time_slots: selectedSlots,
        },
        { onConflict: ["date"] } // Garantiza que se actualice si ya existe una fila con la misma fecha
      );

      if (error) {
        console.error("Error al actualizar la disponibilidad:", error);
        toast.error("Error al guardar la disponibilidad.");
        return;
      }

      toast.success("Disponibilidad actualizada correctamente.");
      fetchAvailableSlots(selectedDate); // Refrescar los horarios disponibles
    } catch (err) {
      console.error("Error al guardar disponibilidad:", err);
      toast.error("Ocurrió un error al guardar la disponibilidad.");
    }
  };
  return (
    <div>
      <h2>Gestión de Reservas</h2>

      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservations.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Nombre
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Fecha
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hora</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Estado
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {res.user_id} {/* Reemplazar con el nombre completo */}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {res.date}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {res.time}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {res.status}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {res.status === "active" && (
                    <button
                      onClick={() =>
                        handleCancelReservation(
                          res.id,
                          res.date,
                          res.time,
                          res.email
                        )
                      }
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay reservas disponibles.</p>
      )}

      <h2>Gestión de Disponibilidad</h2>

      <Calendar onChange={handleDateChange} value={selectedDate} />

      <h3>
        Horarios disponibles para {selectedDate.toISOString().split("T")[0]}:
      </h3>
      <div>
        {generateAvailableSlots().map((slot) => (
          <div key={slot}>
            <label>
              <input
                type="checkbox"
                checked={selectedSlots.includes(slot)}
                onChange={() => handleSlotChange(slot)}
              />
              {slot}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={saveAvailability}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          color: "white",
        }}
      >
        Guardar Disponibilidad
      </button>
    </div>
  );
}

export default AdminPanel;
