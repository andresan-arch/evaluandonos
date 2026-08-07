/**
 * Matriz de rangos por grado
 * Define las asignaturas y sus rangos de preguntas para cada grupo de grados
 * Fuente: index.html línea 2572
 */

export const MATRIZ_RANGOS = {
  // PRIMARIA — sin cambios en ninguna evaluacion
  '3-4': [
    { start: 1,  end: 10, label: 'Matematicas' },
    { start: 11, end: 20, label: 'Ciencias Sociales' },
    { start: 21, end: 30, label: 'Lenguaje' },
    { start: 31, end: 40, label: 'Biologia' },
    { start: 41, end: 45, label: 'Ingles' }
  ],
  '5': [
    { start: 1,  end: 20, label: 'Matematicas' },
    { start: 21, end: 40, label: 'Ciencias Sociales' },
    { start: 41, end: 60, label: 'Lenguaje' },
    { start: 61, end: 80, label: 'Biologia' },
    { start: 81, end: 90, label: 'Ingles' }
  ],

  // E1 (1P) — hoja unica de 120 preguntas — orden original preservado
  '6-9-E1': [
    { start: 1,   end: 20,  label: 'Matematicas' },
    { start: 21,  end: 40,  label: 'Competencias Ciudadanas' },
    { start: 41,  end: 60,  label: 'Ciencias Sociales' },
    { start: 61,  end: 80,  label: 'Lenguaje' },
    { start: 81,  end: 100, label: 'Biologia' },
    { start: 101, end: 120, label: 'Ingles' }
  ],
  '10-11-E1': [
    { start: 1,   end: 20,  label: 'Matematicas' },
    { start: 21,  end: 30,  label: 'Competencias Ciudadanas' },
    { start: 31,  end: 50,  label: 'Ciencias Sociales' },
    { start: 51,  end: 70,  label: 'Lenguaje' },
    { start: 71,  end: 80,  label: 'Biologia' },
    { start: 81,  end: 100, label: 'Ingles' }
  ],

  // E2/E3 (2P y 3P) — doble hoja 60+60, numeracion virtual 1-120 con offset
  '6-9-E2E3': [
    { start: 1,   end: 20,  label: 'Matematicas' },
    { start: 21,  end: 40,  label: 'Ciencias Sociales' },
    { start: 41,  end: 60,  label: 'Ingles' },
    { start: 61,  end: 80,  label: 'Competencias Ciudadanas' },
    { start: 81,  end: 100, label: 'Ciencias Naturales' },
    { start: 101, end: 120, label: 'Lenguaje' }
  ],
  '10-11-E2E3': [
    { start: 1,   end: 20,  label: 'Matematicas' },
    { start: 21,  end: 40,  label: 'Ciencias Sociales' },
    { start: 41,  end: 60,  label: 'Ingles' },
    { start: 61,  end: 70,  label: 'Competencias Ciudadanas' },
    { start: 71,  end: 80,  label: 'Biologia' },
    { start: 81,  end: 90,  label: 'Fisica' },
    { start: 91,  end: 100, label: 'Quimica' },
    { start: 101, end: 120, label: 'Lenguaje' }
  ]
};

// Alias activos — codigo legacy que usa '6-9' o '10-11' obtiene la version E2E3 (vigente)
MATRIZ_RANGOS['6-9']   = MATRIZ_RANGOS['6-9-E2E3'];
MATRIZ_RANGOS['10-11'] = MATRIZ_RANGOS['10-11-E2E3'];

/**
 * Obtiene la configuracion de asignaturas para un grado y periodo
 * @param {string|number} grado - Grado (ej: "3", "5", "9", "10")
 * @param {number} [periodo=2] - Periodo: 1=E1 (hoja unica), 2+=E2E3 (doble hoja)
 * @returns {Array} Array de configuracion de asignaturas
 */
export function obtenerConfigAsignaturas(grado, periodo = 2) {
  if (!grado) return MATRIZ_RANGOS['6-9-E2E3'];

  const g = parseInt(grado);
  const esE1 = periodo === 1;

  if (g <= 4) return MATRIZ_RANGOS['3-4'];
  if (g === 5) return MATRIZ_RANGOS['5'];
  if (g <= 9)  return esE1 ? MATRIZ_RANGOS['6-9-E1']   : MATRIZ_RANGOS['6-9-E2E3'];
  return           esE1 ? MATRIZ_RANGOS['10-11-E1'] : MATRIZ_RANGOS['10-11-E2E3'];
}
