/**
 * Repositorio de Estudiantes
 * Encapsula toda la lógica de acceso a datos para tabla maestro_estudiantes
 * 
 * Responsabilidades:
 * - Búsqueda y validación de estudiantes
 * - Sincronización de datos maestros
 * - Transformaciones de datos de estudiantes
 * 
 * Fuente original: index.html líneas ~3039+, ~3112+
 */

import { supabaseDatasource } from '../datasources/SupabaseDatasource.js';
import { getCurrentYear } from '../../shared/utils/index.js';

export class EstudianteRepository {
  /**
   * Busca un estudiante por identificación
   * @param {string} identificacion - ID del estudiante
   * @returns {Promise<Object|null>} Datos del estudiante o null
   */
  static async buscarPorIdentificacion(identificacion) {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('maestro_estudiantes')
        .select('nombre, identificacion, zipgrade_id')
        .eq('anio', getCurrentYear())
        .eq('identificacion', identificacion)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error buscarPorIdentificacion:', err);
      return null;
    }
  }

  /**
   * Obtiene todos los estudiantes (con paginación)
   * @param {Object} options - { limit: 100, offset: 0 }
   * @returns {Promise<Array>}
   */
  static async obtenerTodos(options = {}) {
    try {
      const { limit = 100, offset = 0 } = options;

      const { data, error } = await supabaseDatasource.getClient()
        .from('maestro_estudiantes')
        .select('*')
        .eq('anio', getCurrentYear())
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error obtenerTodos:', err);
      return [];
    }
  }

  /**
   * Obtiene estudiantes de un grado específico
   * @param {number} grado - Número de grado
   * @returns {Promise<Array>}
   */
  static async obtenerPorGrado(grado) {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('maestro_estudiantes')
        .select('*')
        .eq('anio', getCurrentYear())
        .eq('grado', grado);

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error obtenerPorGrado:', err);
      return [];
    }
  }

  /**
   * Sincroniza lista de estudiantes desde CSV/TSV
   * Usa UPSERT para evitar duplicados
   * @param {Array} estudiantes - Array de objetos con {identificacion, nombre, grado, ...}
   * @returns {Promise<Object>} { success, rowsAffected, error }
   */
  static async sincronizar(estudiantes) {
    try {
      if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
        return { success: false, rowsAffected: 0, error: 'Array vacío' };
      }

      const { error } = await supabaseDatasource.getClient()
        .from('maestro_estudiantes')
        .upsert(estudiantes, { onConflict: 'identificacion,anio' });

      if (error) throw error;

      return {
        success: true,
        rowsAffected: estudiantes.length,
        error: null
      };
    } catch (err) {
      console.error('Error sincronizar estudiantes:', err);
      return { success: false, rowsAffected: 0, error: err.message };
    }
  }

  /**
   * Cuenta total de estudiantes
   * @returns {Promise<number>}
   */
  static async contar() {
    try {
      const { count, error } = await supabaseDatasource.getClient()
        .from('maestro_estudiantes')
        .select('*', { count: 'exact', head: true })
        .eq('anio', getCurrentYear());

      if (error) throw error;

      return count || 0;
    } catch (err) {
      console.error('Error contar estudiantes:', err);
      return 0;
    }
  }
}
