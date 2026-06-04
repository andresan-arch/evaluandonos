/**
 * Servicio de Administración
 * Encapsula la lógica de negocio para la gestión administrativa y carga de datos
 */

import { supabaseDatasource } from '../../data/index.js';
import { EstudianteRepository, ResultadosRepository } from '../../data/index.js';
import { getCurrentYear } from '../../shared/utils/normalization.js';

export class AdminService {
  /**
   * Sincroniza las notas/registros de estudiantes en la base de datos
   * @param {Array} estudiantes - Registros de estudiantes
   * @returns {Promise<Object>} { success, count, error }
   */
  static async subirEstudiantesNotas(estudiantes) {
    try {
      if (!estudiantes || estudiantes.length === 0) {
        return { success: false, count: 0, error: 'No hay datos para subir' };
      }
      
      const result = await EstudianteRepository.sincronizar(estudiantes);
      return {
        success: result.success,
        count: result.rowsAffected,
        error: result.error
      };
    } catch (err) {
      console.error('Error AdminService.subirEstudiantesNotas:', err);
      return { success: false, count: 0, error: err.message };
    }
  }

  /**
   * Sincroniza los resultados de exámenes en la base de datos
   * @param {Array} resultados - Registros de resultados
   * @returns {Promise<Object>} { success, count, error }
   */
  static async subirResultados(resultados) {
    try {
      if (!resultados || resultados.length === 0) {
        return { success: false, count: 0, error: 'No hay datos para subir' };
      }

      const client = supabaseDatasource.getClient();
      const { error } = await client
        .from('eval_estudiantes_notas')
        .upsert(resultados, { onConflict: 'zipgrade_id,periodo,anio' });

      if (error) throw error;

      return {
        success: true,
        count: resultados.length,
        error: null
      };
    } catch (err) {
      console.error('Error AdminService.subirResultados:', err);
      return { success: false, count: 0, error: err.message };
    }
  }

  /**
   * Carga la lista completa de docentes y sus permisos
   * @returns {Promise<Array>}
   */
  static async cargarDocentesYPermisos() {
    try {
      const client = supabaseDatasource.getClient();
      const { data, error } = await client
        .from('docentes_privacidad')
        .select('*')
        .eq('anio', getCurrentYear())
        .order('docente', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error AdminService.cargarDocentesYPermisos:', err);
      return [];
    }
  }

  /**
   * Guarda o actualiza los permisos de privacidad de un docente
   * @param {Object} permiso - Permiso del docente a guardar
   * @returns {Promise<Object>} { success, error }
   */
  static async guardarPermisoDocente(permiso) {
    try {
      const client = supabaseDatasource.getClient();
      permiso.anio = getCurrentYear();
      const { error } = await client
        .from('docentes_privacidad')
        .upsert(permiso); // Let Supabase use the table's Primary Key automatically

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      console.error('Error AdminService.guardarPermisoDocente:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Elimina un registro de permiso de docente
   * @param {string|number} id - ID del permiso
   * @returns {Promise<Object>} { success, error }
   */
  static async eliminarPermisoDocente(id) {
    try {
      const client = supabaseDatasource.getClient();
      const { error } = await client
        .from('docentes_privacidad')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      console.error('Error AdminService.eliminarPermisoDocente:', err);
      return { success: false, error: err.message };
    }
  }
}
