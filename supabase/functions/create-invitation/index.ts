import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { email, createdBy } = await req.json();

    console.log('Creating invitation for:', email);
    console.log('Created by:', createdBy);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('invitations')
      .insert([{ email, expires_at: expiresAt, created_by: createdBy }])
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting invitation:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    console.log('Invitation created:', data);

    const registrationLink = `http://localhost:5173/register?invitationId=${data.id}`;

    // **Enviar el correo electrónico usando Resend**
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY no está configurada');
      return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const fromEmail = 'mailing@ringeling.cl'; // Reemplaza con tu correo verificado en Resend
    const fromName = 'ActivePulse';

    const emailBody = {
      from: `${fromName} <${fromEmail}>`,
      to: email,
      subject: 'Invitación a unirse a la aplicación',
      html: `
        <p>Hola,</p>
        <p>Has sido invitado a unirte a nuestra aplicación. Por favor, utiliza el siguiente enlace para registrarte:</p>
        <p><a href="${registrationLink}">${registrationLink}</a></p>
        <p>Este enlace expirará en 24 horas.</p>
        <p>Saludos,<br>${fromName}</p>
      `,
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Error sending email:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Responder con un mensaje de éxito
    return new Response(
      JSON.stringify({
        message: 'Invitation sent successfully!',
        registrationLink,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing the request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});