# PLAN DE TRABAJO — Nueva Lógica Doble Hoja E2/E3
**Fecha de análisis:** 2026-08-06  
**Estado:** Listo para ejecutar  
**Este archivo es autosuficiente — no requiere preguntas adicionales al usuario.**

---

## 1. Contexto y Hallazgos

### Cambio en el sistema de evaluación
Para **E2 (2P) y E3 (3P/FINAL)** de 2026 se cambió de UNA hoja de 120 preguntas a **DOS hojas de 60 preguntas**:
- **_S1** = Primera parte de la jornada
- **_S2** = Segunda parte de la jornada

**E1 (1P) NO cambia** — sigue con 120 preguntas en un solo archivo.  
**Primaria (grados 3-4-5) NO cambia** — sigue con hoja única.

### Estructura de archivos CSV reales verificados

| Evaluación | Archivo ejemplo | Quiz Name en CSV | Num Questions |
|-----------|----------------|-----------------|---------------|
| **E1** | `quiz-EVALUANDONOS 6 1P 2026-standard.csv` | `EVALUANDONOS 6 1P 2026` | **120** |
| **E2 S1** | `quiz-EVALUNDONOS 6 2P_S1 2026-standard.csv` | `EVALUNDONOS 6 2P_S1 2026` | **60** |
| **E2 S2** | `quiz-EVALUNDONOS 6 2P_S2 2026-standard.csv` | `EVALUNDONOS 6 2P_S2 2026` | **60** |

**Mecanismo de detección:** El campo `Quiz Name` (col 1 del CSV) contiene `_S1` o `_S2`.
Deteccion es 100% automatica — sin selector en UI.

Archivos de prueba disponibles en:
- E2 S1: `resultados/E2/quiz-EVALUNDONOS 6 2P_S1 2026-standard20180510.csv`
- E1 grado 6: `resultados/standar/quiz-EVALUANDONOS 6 1P 2026-standard20180510.csv`

---

## 2. Nueva Distribucion de Preguntas (Mapeo interno con offset)

### SEXTO A NOVENO (grados 6, 7, 8, 9)

| Parte CSV | Asignatura | Q en hoja | Q interna en BD |
|-----------|-----------|-----------|-----------------|
| S1 | Matematicas | 1-20 | 1-20 (sin offset) |
| S1 | Ciencias Sociales | 21-40 | 21-40 |
| S1 | Ingles | 41-60 | 41-60 |
| S2 | Competencias Ciudadanas | 1-20 | 61-80 (+60) |
| S2 | Ciencias Naturales | 21-40 | 81-100 (+60) |
| S2 | Lenguaje | 41-60 | 101-120 (+60) |

### DECIMO Y ONCE (grados 10, 11)

| Parte CSV | Asignatura | Q en hoja | Q interna en BD |
|-----------|-----------|-----------|-----------------|
| S1 | Matematicas | 1-20 | 1-20 |
| S1 | Ciencias Sociales | 21-40 | 21-40 |
| S1 | Ingles | 41-60 | 41-60 |
| S2 | Competencias Ciudadanas | 1-10 | 61-70 (+60) |
| S2 | Biologia | 11-20 | 71-80 (+60) |
| S2 | Fisica | 21-30 | 81-90 (+60) |
| S2 | Quimica | 31-40 | 91-100 (+60) |
| S2 | Lenguaje | 41-60 | 101-120 (+60) |

---

## 3. Decisiones Tomadas (no requieren confirmacion del usuario)

### Decision 1 — Estrategia: Re-numeracion virtual con offset
Al subir un archivo _S2, aplicar offset +60 a todas las claves de respuestas antes de guardar en Supabase.
Internamente los registros siguen siendo un mapa {1..120}. ReportService, estadisticas y graficas NO cambian.

### Decision 2 — Compatibilidad hacia atras con E1
La MATRIZ_RANGOS actual para '6-9' y '10-11' tiene orden DIFERENTE al nuevo esquema E2E3.
Solucion: renombrar las claves actuales como '6-9-E1' y '10-11-E1', crear nuevas '6-9-E2E3' y '10-11-E2E3'.
Los alias '6-9' y '10-11' se redirigen a las nuevas claves E2E3 (formato vigente en produccion).
La funcion obtenerConfigAsignaturas recibe un parametro `periodo` opcional para distinguir E1 vs E2E3.

### Decision 3 — Deteccion automatica por Quiz Name
  _S2 en Quiz Name => offset = 60
  _S1 en Quiz Name => offset = 0
  Sin _S1/_S2       => offset = 0 (E1 o primaria)

### Decision 4 — Upsert tolerante al orden
El sistema tolera subir S2 antes que S1 porque la clave de upsert es zipgrade_id + periodo + anio.
Las respuestas se completan con la segunda subida.

### Decision 5 — Archivos a modificar (SOLO estos 4)
1. src/shared/constants/MATRIZ_RANGOS.js
2. src/shared/constants.js (copia legacy)
3. src/presentation/controllers/AdminController.js
4. index.html (bloque legacy de carga de resultados)
NO se toca: ReportService, ReportController, AnalisisService, AuthService, repositorios, CSS, vistas.

---

## 4. Cambios Exactos por Archivo

---

### 4.1 — src/shared/constants/MATRIZ_RANGOS.js

Reemplazar el objeto MATRIZ_RANGOS completo con:

```javascript
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
```

Reemplazar la funcion obtenerConfigAsignaturas con:

```javascript
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
```

---

### 4.2 — src/shared/constants.js (legado)

Reemplazar el objeto const MATRIZ_RANGOS = { ... } con la misma estructura de 4.1
pero SIN la palabra export (es var global en el legado).
Agregar al final del objeto los alias:
  MATRIZ_RANGOS['6-9']   = MATRIZ_RANGOS['6-9-E2E3'];
  MATRIZ_RANGOS['10-11'] = MATRIZ_RANGOS['10-11-E2E3'];

---

### 4.3 — src/presentation/controllers/AdminController.js

En el metodo procesarResultadosCSV(text, filename), en el bloque rows.forEach:

BUSCAR este bloque (aprox lineas 169-177):
```javascript
const respuestas = {};
// Mapear respuestas correctas por numero de pregunta
Object.keys(row).forEach(key => {
  const match = key.match(/^Q(\d+)$/i);
  if (match) {
    const num = parseInt(match[1], 10);
    respuestas[num] = row[key] === '1' || row[key] === 'Correct' ? 1 : 0;
  }
});
```

REEMPLAZAR con:
```javascript
const respuestas = {};
// Detectar si es 2da parte (S2) de evaluacion con doble hoja (E2/E3)
// El Quiz Name viene en el CSV mismo, o en el nombre del archivo
const quizNameRaw = row['Quiz Name'] || row['QuizName'] || '';
const esParte2 = /_S2/i.test(quizNameRaw) || /_S2/i.test(filename || '');
const offset = esParte2 ? 60 : 0;

// Mapear respuestas con offset para S2 (Q1 del CSV -> respuestas[61], etc.)
Object.keys(row).forEach(key => {
  const match = key.match(/^Q(\d+)$/i);
  if (match) {
    const num = parseInt(match[1], 10) + offset;
    respuestas[num] = row[key] === '1' || row[key] === 'Correct' ? 1 : 0;
  }
});
```

---

### 4.4 — index.html (bloque legacy)

Buscar en el archivo la funcion/bloque que procesa resultados CSV con PapaParse.
Buscar por: const match = key.match(/^Q(\d+)$/i)
Cuando se encuentre el bloque equivalente al de AdminController, aplicar el mismo cambio de offset.

El bloque a buscar se parece a:
  rows.forEach(row => {
    ...
    const respuestas = {};
    Object.keys(row).forEach(key => {
      const match = key.match(/^Q(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        respuestas[num] = ...
      }
    });

Agregar antes del forEach:
  const quizNameRaw = row['Quiz Name'] || row['QuizName'] || '';
  const esParte2 = /_S2/i.test(quizNameRaw) || /_S2/i.test(filename || '');
  const offset = esParte2 ? 60 : 0;

Cambiar: const num = parseInt(match[1], 10);
Por:     const num = parseInt(match[1], 10) + offset;

---

### 4.5 — src/shared/constants/ASIGNATURA_COLORES.js (verificar, no modificar si no es necesario)

Verificar que existan entradas para: 'CIENCIAS NATURALES', 'FISICA', 'QUIMICA', 'BIOLOGIA'.
Si falta alguna, agregar con un color apropiado.

---

## 5. Checklist de Verificacion Post-implementacion

- [ ] No hay errores de consola al cargar la app
- [ ] Subida CSV S1 grado 6: respuestas[1..60] guardadas en Supabase
- [ ] Subida CSV S2 grado 6: respuestas[61..120] guardadas en Supabase (offset aplicado)
- [ ] Reporte individual grado 6 periodo 2: 6 asignaturas visibles con datos correctos
- [ ] Subida CSV E1 grado 6 (120 preguntas): datos 1-120 sin offset
- [ ] Reporte individual grado 6 periodo 1: usa E1 matrix, asignaturas correctas  
- [ ] Primaria grado 3: sin cambios, sin offset
- [ ] Estadisticas y graficas: sin regresion visual
- [ ] Login docente y estudiante: funcionan normalmente

---

## 6. Rollback

Si algo falla:
1. git checkout -- src/shared/constants/MATRIZ_RANGOS.js
2. git checkout -- src/shared/constants.js
3. git checkout -- src/presentation/controllers/AdminController.js
4. Revertir bloque en index.html manualmente

NOTA: Si se subieron datos S2 sin offset (bug), re-subir esos archivos una vez corregido el codigo.

---

## 7. Notas para el Agente al Retomar

1. Leer este archivo completo primero.
2. Ejecutar los cambios en orden: 4.1 -> 4.2 -> 4.3 -> 4.4 -> 4.5
3. Hacer smoke test despues de cada paso.
4. El archivo de prueba real E2 esta en resultados/E2/ — usarlo para verificar el offset.
5. NO eliminar claves '6-9' y '10-11' — convertirlas en alias que apunten a E2E3.
6. El index.html es el mas delicado — buscar bien el bloque antes de editar.
7. Respetar AGENTS.md: cambios pequenos, aislados y verificables. Un cambio = una intencion.
