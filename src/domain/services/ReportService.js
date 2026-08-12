/**
 * Servicio de Reportes
 * Encapsula la lógica de negocio para la generación de reportes (Individual, Grupal y por Asignatura)
 */

import { extraerGradoBase, detectarSede, getValoration } from '../../shared/utils/normalization.js';
import { MATRIZ_RANGOS } from '../../shared/constants/MATRIZ_RANGOS.js';

export class ReportService {
  /**
   * Procesa los datos de un estudiante para el reporte individual
   * @param {Object} estudiante - Datos del estudiante y sus respuestas
   * @param {number} gBase - Grado base
   * @param {number} [periodo=2] - Periodo: 1=E1 (hoja unica), 2+=E2E3 (doble hoja)
   * @returns {Object} Datos formateados para el reporte individual
   */
  static procesarReporteIndividual(estudiante, gBase, periodo = 2) {
    if (!estudiante) return null;

    const esE1 = periodo === 1;
    let mKey;
    if (gBase <= 4) mKey = '3-4';
    else if (gBase === 5) mKey = '5';
    else if (gBase >= 10) mKey = esE1 ? '10-11-E1' : '10-11-E2E3';
    else mKey = esE1 ? '6-9-E1' : '6-9-E2E3';

    const config = MATRIZ_RANGOS[mKey] || [];
    const asignaturasReporte = [];

    let totalCorrectas = 0;
    let totalPreguntas = 0;

    config.forEach(subj => {
      let correctas = 0;
      let incorrectas = 0;
      let totalSubj = 0;

      for (let i = subj.start; i <= subj.end; i++) {
        totalSubj++;
        if (estudiante.respuestas && estudiante.respuestas[i] === 1) {
          correctas++;
        } else {
          incorrectas++;
        }
      }

      totalCorrectas += correctas;
      totalPreguntas += totalSubj;

      const porcentaje = totalSubj > 0 ? Math.round((correctas / totalSubj) * 100) : 0;
      const valoracion = getValoration(porcentaje);

      asignaturasReporte.push({
        label: subj.label,
        correctas,
        incorrectas,
        total: totalSubj,
        porcentaje,
        valoracion
      });
    });

    const porcentajeGeneral = totalPreguntas > 0 ? Math.round((totalCorrectas / totalPreguntas) * 100) : 0;
    const valoracionGeneral = getValoration(porcentajeGeneral);

    return {
      nombre: estudiante.nombre,
      identificacion: estudiante.identificacion,
      zipgradeId: estudiante.zipgrade_id,
      grupo: estudiante.grupo || 'N/A',
      sede: detectarSede(estudiante.grupo || ''),
      asignaturas: asignaturasReporte,
      totalCorrectas,
      totalPreguntas,
      porcentajeGeneral,
      valoracionGeneral
    };
  }

  /**
   * Procesa las respuestas de un grupo para el reporte grupal
   * @param {Array} alumnosGrupo - Alumnos pertenecientes al grupo
   * @param {number} gBase - Grado base
   * @param {number} [periodo=2] - Periodo: 1=E1 (hoja unica), 2+=E2E3 (doble hoja)
   * @returns {Object} Datos procesados para el reporte grupal
   */
  static procesarReporteGrupal(alumnosGrupo, gBase, periodo = 2) {
    if (!alumnosGrupo || alumnosGrupo.length === 0) return null;

    const esE1 = periodo === 1;
    let mKey;
    if (gBase <= 4) mKey = '3-4';
    else if (gBase === 5) mKey = '5';
    else if (gBase >= 10) mKey = esE1 ? '10-11-E1' : '10-11-E2E3';
    else mKey = esE1 ? '6-9-E1' : '6-9-E2E3';

    const config = MATRIZ_RANGOS[mKey] || [];
    const totalPreguntas = config.reduce((acc, curr) => acc + (curr.end - curr.start + 1), 0);

    // Calcular acierto por cada pregunta (1 a totalPreguntas)
    const aciertosPorPregunta = Array(totalPreguntas + 1).fill(0);
    alumnosGrupo.forEach(al => {
      for (let i = 1; i <= totalPreguntas; i++) {
        if (al.respuestas && al.respuestas[i] === 1) {
          aciertosPorPregunta[i]++;
        }
      }
    });

    const porcentajesPreguntas = aciertosPorPregunta.map((aciertos, idx) => {
      if (idx === 0) return 0;
      return Math.round((aciertos / alumnosGrupo.length) * 100);
    });

    // Acierto promedio por asignatura
    const promediosAsignaturas = config.map(subj => {
      let sumaPorcentajes = 0;
      let count = 0;
      for (let i = subj.start; i <= subj.end; i++) {
        sumaPorcentajes += percentagesPreguntasCheck(i);
        count++;
      }
      const promedio = count > 0 ? Math.round(sumaPorcentajes / count) : 0;
      return {
        label: subj.label,
        promedio,
        valoracion: getValoration(promedio)
      };
    });

    function percentagesPreguntasCheck(idx) {
      return percentagesPreguntas(idx);
    }

    function percentagesPreguntas(idx) {
      return percentagesPreguntasRaw()[idx] || 0;
    }

    function percentagesPreguntasRaw() {
      return percentagesPreguntasMemo || (percentagesPreguntasMemo = aciertosPorPregunta.map(aciertos => {
        return Math.round((aciertos / alumnosGrupo.length) * 100);
      }));
    }

    let percentagesPreguntasMemo = null;

    // Calcular promedio general del grupo
    const sumaPromedios = promediosAsignaturas.reduce((acc, curr) => acc + curr.promedio, 0);
    const promedioGeneral = promediosAsignaturas.length > 0 ? Math.round(sumaPromedios / promediosAsignaturas.length) : 0;

    return {
      alumnosCount: alumnosGrupo.length,
      promediosAsignaturas,
      promedioGeneral,
      porcentajesPreguntas: percentagesPreguntasRaw(),
      totalPreguntas
    };
  }

  /**
   * Procesa los promedios por sede para el reporte por asignatura
   * @param {Array} alumnosNivel - Todos los alumnos del nivel/grado base
   * @param {number} gBase - Grado base
   * @param {number} [periodo=2] - Periodo: 1=E1 (hoja unica), 2+=E2E3 (doble hoja)
   * @returns {Object} Datasets y etiquetas para el gráfico
   */
  static procesarComparativoSedes(alumnosNivel, gBase, periodo = 2) {
    if (!alumnosNivel || alumnosNivel.length === 0) return null;

    const sedesUnicas = [...new Set(alumnosNivel.map(d => detectarSede(d.zipgrade_id || '')))]
      .filter(s => s)
      .sort((a, b) => a.localeCompare(b));

    const esE1 = periodo === 1;
    let mKey;
    if (gBase <= 4) mKey = '3-4';
    else if (gBase === 5) mKey = '5';
    else if (gBase >= 10) mKey = esE1 ? '10-11-E1' : '10-11-E2E3';
    else mKey = esE1 ? '6-9-E1' : '6-9-E2E3';

    const config = MATRIZ_RANGOS[mKey] || [];
    const labels = config.map(c => c.label);

    const promediosPorSede = sedesUnicas.map(sede => {
      const alumnosSede = alumnosNivel.filter(d => detectarSede(d.zipgrade_id || '') === sede);
      
      const data = config.map(subj => {
        let suma = 0;
        let count = 0;
        
        alumnosSede.forEach(est => {
          let ok = 0;
          for (let i = subj.start; i <= subj.end; i++) {
            if (est.respuestas && est.respuestas[i] === 1) ok++;
          }
          suma += Math.round((ok / (subj.end - subj.start + 1)) * 100);
          count++;
        });
        
        return count > 0 ? Math.round(suma / count) : 0;
      });

      return {
        sede,
        data
      };
    });

    return {
      labels,
      sedes: sedesUnicas,
      promedios: promediosPorSede
    };
  }
}
