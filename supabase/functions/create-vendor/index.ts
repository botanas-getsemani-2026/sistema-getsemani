import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import {
  ROLES,
  USERNAME_RE,
  EMAIL_DOMAIN
} from '../_shared/constants.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user: caller },
      error: callerErr,
    } = await callerClient.auth.getUser()
    if (callerErr || !caller) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: callerProfile } = await callerClient
      .from('perfiles')
      .select('rol')
      .eq('id', caller.id)
      .single()

    if (callerProfile?.rol.toLowerCase() !== 'admin') {
      return new Response(
        JSON.stringify({
          error: 'Solo administradores pueden crear usuarios',
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const {
      username,
      password,
      nombre,
      papellido,
      sapellido,
      rol,
      estado,
    } = await req.json()

    if (!USERNAME_RE.test(username ?? '')) {
      return new Response(
        JSON.stringify({
          error: 'Formato de usuario inválido (esperado: get1234)',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('body recibido',{
      username,
      password,
      nombre,
      papellido,
      sapellido,
      rol,
      estado,
    });

    if (!password || !nombre || !papellido) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('ROLES', ROLES);
    console.log('rol recibido', rol)

    if (!ROLES.includes(rol)) {
      return new Response(
        JSON.stringify({ error: 'Rol invalido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const email = `${username}${EMAIL_DOMAIN}`

    const { data: existingProfile } = await adminClient
      .from('perfiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    console.log('existingProfile', existingProfile);

    if (existingProfile) {
      return new Response(
        JSON.stringify({ error: 'El usuario ya existe en perfiles.', code: 'USER_EXISTS' }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const { data: authData, error: authErr } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          nombre,
          papellido,
          sapellido: sapellido ?? '',
          rol: rol ?? 'vendedor'
        }
      })

      console.log('authData', authData)
      console.log('authError', authErr)

    if (authErr || !authData?.user) {
      return new Response(
        JSON.stringify({
          error: authErr?.message ?? 'No se pudo crear el usuario en auth',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({ ok: true, username, email }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Error interno' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})