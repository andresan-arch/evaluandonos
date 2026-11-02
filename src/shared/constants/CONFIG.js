/**
 * Configuración de aplicación y constantes globales
 * 
 * IMPORTANTE: Credenciales deben moverse a variables de entorno en fase de hardening
 * Ver ESTADO_TECNICO.md sección 6 y AGENTS.md sección 9
 */

export const APP_CONFIG = {
  version: 'v96',
  
  // Supabase configuration - TODO: mover a .env en Fase 6 (hardening)
  supabase: {
    url: "https://txnecdeccianklqqyrav.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM"
  },

  // Periodos de evaluación
  periodos: {
    default: 2,
    total: 3
  },

  // Roles del sistema
  roles: {
    admin: 'admin',
    lector: 'lector',
    docente: 'docente',
    tesis: 'tesis',
    estudiante: 'estudiante'
  }
};

/**
 * Obtiene la URL del servidor Supabase
 * @returns {string} URL de Supabase
 */
export function getSupabaseUrl() {
  // En fase futura (Fase 6), esto vendrá de process.env.VITE_SUPABASE_URL
  return APP_CONFIG.supabase.url;
}

/**
 * Obtiene la clave anon de Supabase
 * @returns {string} Clave anón de Supabase
 */
export function getSupabaseKey() {
  // En fase futura (Fase 6), esto vendrá de process.env.VITE_SUPABASE_KEY
  return APP_CONFIG.supabase.anonKey;
}
