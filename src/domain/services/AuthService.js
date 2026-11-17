/**
 * Servicio de Autenticación
 * Encapsula lógica de login de docentes y estudiantes
 * 
 * Responsabilidades:
 * - Validar credenciales
 * - Gestionar sesiones
 * - Determinar permisos y rol
 * 
 * Fuente original: index.html líneas ~2994+, ~3039+, ~3241+
 */

import { EstudianteRepository } from '../../data/index.js';
import { supabaseDatasource } from '../../data/index.js';

export class AuthService {
  /**
   * Login de estudiante por identificación
   * @param {string} identificacion - ID del estudiante
   * @returns {Promise<Object>} { success, student, error }
   */
  static async loginEstudiante(identificacion) {
    try {
      if (!identificacion || identificacion.trim().length === 0) {
        return { success: false, student: null, error: 'Identificación requerida' };
      }

      let student = await EstudianteRepository.buscarPorIdentificacion(identificacion.trim());

      if (!student) {
        // Fallback: buscar en eval_estudiantes_notas por zipgrade_id
        const { data: dataNotas } = await supabaseDatasource.getClient()
          .from('eval_estudiantes_notas')
          .select('estudiante_nombre, zipgrade_id')
          .eq('zipgrade_id', identificacion.trim())
          .limit(1);

        if (dataNotas && dataNotas.length > 0) {
          student = {
            identificacion: identificacion.trim(),
            nombre: dataNotas[0].estudiante_nombre,
            zipgrade_id: dataNotas[0].zipgrade_id
          };
        }
      }

      if (!student) {
        return { success: false, student: null, error: 'Identificación no encontrada en el sistema.' };
      }

      // Guardar sesión en localStorage
      localStorage.setItem('studentId', identificacion.trim());
      localStorage.setItem('studentName', student.nombre || student.estudiante_nombre || 'Estudiante');
      localStorage.setItem('studentZipId', student.zipgrade_id || "");

      return { success: true, student, error: null };
    } catch (err) {
      console.error('Error loginEstudiante:', err);
      return { success: false, student: null, error: err.message };
    }
  }

  /**
   * Login de docente mediante Supabase Auth
   * @param {string} email - Email del docente
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} { success, user, error }
   */
  static async loginDocente(email, password) {
    try {
      const client = supabaseDatasource.getClient();

      let emailToUse = email.trim();
      if (!emailToUse.includes('@')) {
        emailToUse = emailToUse + "@andresan.com";
      }

      const { data, error } = await client.auth.signInWithPassword({
        email: emailToUse,
        password
      });

      if (error) {
        console.error('Error login Supabase Auth:', error);
        return { success: false, user: null, error: error.message };
      }

      if (!data.user) {
        return { success: false, user: null, error: 'Usuario no encontrado' };
      }

      return { success: true, user: data.user, error: null };
    } catch (err) {
      console.error('Error loginDocente:', err);
      return { success: false, user: null, error: err.message };
    }
  }

  /**
   * Obtiene perfil/rol del docente
   * @param {string} email - Email del docente
   * @returns {Promise<Object|null>} { rol, nombre, grado_asignado, ... }
   */
  static async obtenerPerfilDocente(email) {
    try {
      const client = supabaseDatasource.getClient();

      const { data, error } = await client
        .from('perfiles')
        .select('rol, nombre, grado_asignado')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error obtenerPerfilDocente:', err);
      return null;
    }
  }

  /**
   * Logout
   * @returns {Promise<boolean>}
   */
  static async logout() {
    try {
      // Limpiar localStorage de estudiante
      localStorage.removeItem('studentId');
      localStorage.removeItem('studentName');
      localStorage.removeItem('studentZipId');

      const client = supabaseDatasource.getClient();
      const { error } = await client.auth.signOut();

      if (error) throw error;

      return true;
    } catch (err) {
      console.error('Error logout:', err);
      return false;
    }
  }

  /**
   * Valida si hay sesión activa
   * @returns {Promise<boolean>}
   */
  static async validarSesion() {
    try {
      const client = supabaseDatasource.getClient();
      const { data, error } = await client.auth.getSession();

      if (error) throw error;

      return data.session !== null;
    } catch (err) {
      console.error('Error validarSesion:', err);
      return false;
    }
  }
}
