import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { supabase } from "./supabaseClient";
import { toast } from "react-toastify";
import "react-calendar/dist/Calendar.css";
import "react-toastify/dist/ReactToastify.css";

function BookingCalendar({ userId, userEmail: propUserEmail }) {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userEmail, setUserEmail] = useState(propUserEmail || null);

  useEffect(() => {

    // Obtener el correo desde la sesión si no se pasa como prop
    const fetchUserEmail = async () => {
      if (!propUserEmail) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error obteniendo la sesión:", sessionError.message);
          toast.error("No se pudo obtener la información de la sesión.", {
            position: "bottom-right",
          });
          return;
        }

        const email = sessionData?.session?.user?.email || null;
        if (email) {
          setUserEmail(email);
        } else {
          console.error("No se encontró el correo en la sesión.");
        }
      }
    };

    fetchUserEmail();
  }, [propUserEmail]);

  useEffect(() => {
    fetchAvailableSlots();
    fetchReservations();
  }, [date, userId]);

  useEffect(() => {
   
  }, []);
  

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
        , {
          position: "bottom-right",
        });
      return null;
    }

    return sessionData?.session?.access_token || null;
  };

  const sendEmail = async (email, subject, html) => {
    if (!email) {
      console.error("Correo destinatario no válido:", email);
      toast.error("No se pudo enviar el correo. El destinatario es inválido.", {
        position: "bottom-right",
      });
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
        toast.success("Correo enviado correctamente.", {
          position: "bottom-right",
        });
      } else {
        console.error("Error al enviar el correo:", result.error);
        toast.error(`Error enviando correo: ${result.error}`, {
          position: "bottom-right",
        });
      }
    } catch (fetchError) {
      console.error("Error inesperado al enviar el correo:", fetchError);
      toast.error("Ocurrió un error inesperado al enviar el correo.", {
        position: "bottom-right",
      });
    }
  };

  const fetchAvailableSlots = async () => {
    console.log("bob")
    try {
      const { data, error } = await supabase
        .from("availability")
        .select("time_slots")
        .eq("date", date.toISOString().split("T")[0])
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error al obtener horarios disponibles:", error);
        toast.error("Error al cargar los horarios disponibles.", {
          position: "bottom-right",
        });
      } else {
        setAvailableSlots(data?.time_slots || []);
        if (data?.time_slots?.length === 0) {
          toast.info("No hay horarios disponibles para esta fecha.", {
            position: "bottom-right",
          });
        }
      }
    } catch (err) {
      console.error("Error inesperado al cargar horarios disponibles:", err);
      toast.error("Ocurrió un error inesperado.", {
        position: "bottom-right",
      });
    }
  };

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_id", userId);

      if (!error) {
        setReservations(data);
      } else {
        console.error("Error al obtener reservas:", error);
        toast.error("Error al cargar tus reservas.", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Error inesperado al cargar reservas:", err);
      toast.error("Ocurrió un error inesperado.", {
        position: "bottom-right",
      });
    }
  };

  const handleReserve = async () => {
    if (!selectedSlot) {
      toast.error("Debes seleccionar una hora antes de reservar.", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const { data: availability, error: availabilityError } = await supabase
        .from("availability")
        .select("time_slots")
        .eq("date", date.toISOString().split("T")[0])
        .single();

      if (
        availabilityError ||
        !availability?.time_slots.includes(selectedSlot)
      ) {
        toast.error("El horario seleccionado no está disponible.", {
          position: "bottom-right",
        });
        return;
      }

      const { error: reserveError } = await supabase
        .from("reservations")
        .insert({
          user_id: userId,
          date: date.toISOString().split("T")[0],
          time: selectedSlot,
        });

      if (!reserveError) {
        const updatedSlots = availability.time_slots.filter(
          (slot) => slot !== selectedSlot
        );

        await supabase
          .from("availability")
          .update({ time_slots: updatedSlots })
          .eq("date", date.toISOString().split("T")[0]);

        toast.success("Reserva realizada con éxito.", {
          position: "bottom-right",
        });
        setSelectedSlot(null);
        fetchAvailableSlots();
        fetchReservations();

        const subject = "Confirmación de reserva";
        const html = `
          <p>Hola,</p>
          <p>Tu reserva ha sido confirmada:</p>
          <p><strong>Fecha:</strong> ${date.toISOString().split("T")[0]}</p>
          <p><strong>Hora:</strong> ${selectedSlot}</p>
          <p>Gracias por usar ActivePulse.</p>
        `;
        await sendEmail(userEmail, subject, html);
      } else {
        toast.error("Error al realizar la reserva.", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Error inesperado al realizar la reserva:", err);
      toast.error("Ocurrió un error inesperado.", {
        position: "bottom-right",
      });
    }
  };

  const handleCancel = async (reservationId, timeSlot, reservationDate) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: "cancelled" }) // Cambiar "canceled" a "cancelled"
        .eq("id", reservationId);

      if (!error) {
        const { data: availability, error: availabilityError } = await supabase
          .from("availability")
          .select("time_slots")
          .eq("date", reservationDate)
          .single();

        if (!availabilityError) {
          const updatedSlots = [...availability.time_slots, timeSlot];

          await supabase
            .from("availability")
            .update({ time_slots: updatedSlots })
            .eq("date", reservationDate);

          toast.success("Reserva cancelada.", {
            position: "bottom-right",
          });
          fetchAvailableSlots();
          fetchReservations();

          const subject = "Cancelación de reserva";
          const html = `
            <p>Hola,</p>
            <p>Lamentamos informarte que tu reserva ha sido cancelada:</p>
            <p><strong>Fecha:</strong> ${reservationDate}</p>
            <p><strong>Hora:</strong> ${timeSlot}</p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          `;
          await sendEmail(userEmail, subject, html);
        }
      } else {
        toast.error("Error al cancelar la reserva.", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Error inesperado al cancelar la reserva:", err);
      toast.error("Ocurrió un error inesperado.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div>
      <h2>Selecciona una fecha</h2>
      <Calendar onChange={setDate} value={date} />

      <h3>Horarios disponibles:</h3>
      {availableSlots.length > 0 ? (
        availableSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            style={{
              backgroundColor: selectedSlot === slot ? "#4caf50" : "",
              color: selectedSlot === slot ? "white" : "",
              margin: "5px",
            }}
          >
            {slot}
          </button>
        ))
      ) : (
        <p>No hay horarios disponibles para esta fecha.</p>
      )}

      {selectedSlot && (
        <div style={{ marginTop: "20px" }}>
          <p>
            Hora seleccionada: <strong>{selectedSlot}</strong>
          </p>
          <button onClick={handleReserve} style={{ marginTop: "10px" }}>
            Reservar
          </button>
        </div>
      )}

      <h3>Todas tus reservas:</h3>
      {reservations.length > 0 ? (
        reservations.map((res) => (
          <p key={res.id}>
            Fecha: {res.date}, Hora: {res.time}, Estado: {res.status}{" "}
            {res.status === "active" && (
              <button onClick={() => handleCancel(res.id, res.time, res.date)}>
                Cancelar
              </button>
            )}
          </p>
        ))
      ) : (
        <p>No tienes reservas registradas.</p>
      )}
    </div>
  );
}

export default BookingCalendar;
