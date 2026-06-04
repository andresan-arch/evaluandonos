/**
 * Repositorio de Resultados
 * Encapsula toda la lógica de acceso a datos para tabla eval_resultados
 * 
 * Responsabilidades:
 * - Obtener resultados por periodo, grado, asignatura
 * - Filtrar y transformar datos
 * - Manejar errores de Supabase
 * 
 * Fuente original: index.html líneas ~3500+
 */

import { supabaseDatasource } from '../datasources/SupabaseDatasource.js';
import { getCurrentYear } from '../../shared/utils/index.js';

export class ResultadosRepository {
  /**
   * Obtiene todos los grados con resultados en un periodo
   * @param {number} periodo - Número de periodo
   * @returns {Promise<Array>} Array de grados únicos
   */
  static async obtenerGradosConResultados(periodo) {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('eval_resultados')
        .select('grado')
        .eq('anio', getCurrentYear())
        .eq('periodo', periodo);

      if (error) throw error;

      // Retorna grados únicos y ordenados
      const grados = data ? [...new Set(data.map(d => d.grado))].sort((a, b) => a - b) : [];
      return grados;
    } catch (err) {
      console.error('Error obtenerGradosConResultados:', err);
      return [];
    }
  }

  /**
   * Obtiene el período más reciente con datos
   * @returns {Promise<number|null>} Número de período o null si no hay datos
   */
  static async obtenerPeriodoMasReciente() {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('eval_resultados')
        .select('periodo')
        .eq('anio', getCurrentYear())
        .order('periodo', { ascending: false })
        .limit(1);

      if (error) throw error;

      return data && data.length > 0 ? data[0].periodo : null;
    } catch (err) {
      console.error('Error obtenerPeriodoMasReciente:', err);
      return null;
    }
  }

  /**
   * Verifica si existe data para un período específico
   * @param {number} periodo - Número de período
   * @returns {Promise<boolean>}
   */
  static async existeDataParaPeriodo(periodo) {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('eval_resultados')
        .select('periodo')
        .eq('anio', getCurrentYear())
        .eq('periodo', periodo)
        .limit(1);

      if (error) throw error;

      return data && data.length > 0;
    } catch (err) {
      console.error('Error existeDataParaPeriodo:', err);
      return false;
    }
  }

  /**
   * Obtiene resultados filtrados por grado y período
   * @param {number} grado - Número de grado
   * @param {number} periodo - Número de período
   * @param {Object} options - Opciones adicionales (limit, offset, etc.)
   * @returns {Promise<Array>}
   */
  static async obtenerResultadosPorGradoYPeriodo(grado, periodo, options = {}) {
    try {
      const { limit = 100, offset = 0 } = options;

      let query = supabaseDatasource.getClient()
        .from('eval_resultados')
        .select('*')
        .eq('anio', getCurrentYear())
        .eq('grado', grado)
        .eq('periodo', periodo)
        .range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error obtenerResultadosPorGradoYPeriodo:', err);
      return [];
    }
  }

  /**
   * Obtiene estadísticas resumidas por grado
   * @param {number} periodo - Número de período
   * @returns {Promise<Object>} Mapa de grado -> estadísticas
   */
  static async obtenerEstadisticasPorGrado(periodo) {
    try {
      const { data, error } = await supabaseDatasource.getClient()
        .from('eval_resultados')
        .select('grado')
        .eq('anio', getCurrentYear())
        .eq('periodo', periodo);

      if (error) throw error;

      // Agrupar y contar por grado
      const estadisticas = {};
      if (data) {
        data.forEach(row => {
          estadisticas[row.grado] = (estadisticas[row.grado] || 0) + 1;
        });
      }

      return estadisticas;
    } catch (err) {
      console.error('Error obtenerEstadisticasPorGrado:', err);
      return {};
    }
  }
}
