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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Cambia esto por tu dominio en producción
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
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

    // Validación básica de los datos
    if (!userId || !firstName || !lastName || !phoneNumber) {
      return new Response(
        JSON.stringify({ error: "Faltan datos obligatorios" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Insertar el perfil del usuario en la tabla `user_profiles`
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
      return new Response(
        JSON.stringify({ error: "Error al insertar el perfil de usuario" }),
        { status: 500, headers: corsHeaders }
      );
    }

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