// validate-signup.js (Edge Function en Supabase)
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
    storage: {
      getItem() {
        return null;
      },
      setItem() {},
      removeItem() {},
    },
  },
  global: {
    fetch: fetch.bind(globalThis),
  },
});

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("Solicitud recibida:", req.method);

  // Manejo de preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    console.log("Solicitud OPTIONS recibida para CORS");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Verificar método POST
  if (req.method !== "POST") {
    console.log("Método no permitido:", req.method);
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    console.log("Intentando leer el cuerpo de la solicitud...");
    const {
      userId,
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
      gender,
      emergencyContactName,
      emergencyContactPhone,
    } = await req.json();

    console.log("Datos recibidos:", {
      userId,
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
      gender,
      emergencyContactName,
      emergencyContactPhone,
    });

    // Validación básica de los datos
    if (!userId || !firstName || !lastName || !phoneNumber) {
      console.log("Error de validación: Faltan datos obligatorios");
      return new Response(
        JSON.stringify({ error: "Faltan datos obligatorios" }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("Insertando perfil en la tabla `user_profiles`...");
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        address,
        date_of_birth: dateOfBirth,
        gender,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
      });

    if (profileError) {
      console.error("Error al insertar el perfil de usuario:", profileError);
      return new Response(
        JSON.stringify({ error: "Error al insertar el perfil de usuario" }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log("Perfil insertado exitosamente.");
    return new Response(
      JSON.stringify({ message: "Perfil creado exitosamente" }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return new Response(
      JSON.stringify({ error: "Error desconocido en el servidor" }),
      { status: 500, headers: corsHeaders }
    );
  }
});