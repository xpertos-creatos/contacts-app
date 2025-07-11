import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Verificar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Instancia del cliente Supabase.
 * Se utiliza para interactuar con la base de datos y los servicios de autenticación de Supabase.
 * Configurado con la URL y la clave anónima de Supabase obtenidas de las variables de entorno.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseKey)
