/**
 * Repositorio de Preguntas
 * Encapsula acceso a datos de la tabla eval_preguntas
 * 
 * Responsabilidades:
 * - Obtener banco de preguntas por grado/periodo
 * - Búsqueda y filtrado de preguntas
 * - Gestión de categorías de preguntas
 * 
 * Fuente original: index.html líneas ~2945+
 */

import { supabaseDatasource } from '../datasources/SupabaseDatasource.js';
import { getCurrentYear } from '../../shared/utils/index.js';

export class PreguntasRepository {
  /**
   * Obtiene todos los grados con preguntas
   * @param {number} periodo - Número de período
   * @returns {Promise<Array>} Array de grados únicos
   */
  static async obtenerGradosConPreguntas(periodo) {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('eval_preguntas')
        .select('grado')
        .eq('anio', getCurrentYear())
        .eq('periodo', periodo);

      if (error) throw error;

      // Retorna grados únicos y ordenados
      const grados = data ? [...new Set(data.map(d => d.grado))].sort((a, b) => a - b) : [];
      return grados;
    } catch (err) {
      console.error('Error obtenerGradosConPreguntas:', err);
      return [];
    }
  }

  /**
   * Obtiene preguntas de un grado específico
   * @param {number} grado - Número de grado
   * @param {number} periodo - Número de período
   * @returns {Promise<Array>}
   */
  static async obtenerPorGradoYPeriodo(grado, periodo) {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('eval_preguntas')
        .select('*')
        .eq('anio', getCurrentYear())
        .eq('grado', grado)
        .eq('periodo', periodo);

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error obtenerPorGradoYPeriodo:', err);
      return [];
    }
  }

  /**
   * Cuenta de preguntas por grado
   * @param {number} grado - Número de grado
   * @param {number} periodo - Número de período
   * @returns {Promise<number>}
   */
  static async contarPorGradoYPeriodo(grado, periodo) {
    try {
      const { count, error } = await supabaseDatasource.getClient()
        .from('eval_preguntas')
        .select('*', { count: 'exact', head: true })
        .eq('anio', getCurrentYear())
        .eq('grado', grado)
        .eq('periodo', periodo);

      if (error) throw error;

      return count || 0;
    } catch (err) {
      console.error('Error contarPorGradoYPeriodo:', err);
      return 0;
    }
  }

  /**
   * Obtiene pregunta específica por ID
   * @param {string} id - ID de la pregunta
   * @returns {Promise<Object|null>}
   */
  static async obtenerPorId(id) {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('eval_preguntas')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error obtenerPorId:', err);
      return null;
    }
  }
}
