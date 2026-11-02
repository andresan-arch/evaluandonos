// --- CONFIGURACIONES GLOBALES (CONSTANTES) ---
var CURRENT_APP_VERSION = 'v120';
var SB_URL = 'https://txnecdeccianklqqyrav.supabase.co';
var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM";

// --- MATRIZ DE RANGOS 2026 ---
const MATRIZ_RANGOS = {
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
