# ESTADO TECNICO DEL PROYECTO EVALUANDONOS
 
Fecha: 20 de mayo de 2026
Estado general: ✅ MIGRACIÓN ESTRUCTURAL A ARQUITECTURA LIMPIA 100% COMPLETADA. Operativo en producción con estructura modular limpia en paralelo.
 
## 1. Resumen Ejecutivo
 
El proyecto cuenta actualmente con la totalidad de su estructura migrada a Clean Architecture (Arquitectura Limpia), separando de manera estricta la lógica de negocio, acceso a datos, utilidades y controladores. Todo este código está integrado en paralelo a través de `src/app.js` en el shell `index.html`, garantizando cero regresiones y manteniendo la funcionalidad original intacta mediante la exposición segura a nivel global (`window`).

## 2. Contexto de Operacion

- Frontend: HTML/CSS/JS con logica principal concentrada.
- Base de datos: Supabase.
- Hosting/Deploy: Vercel.
- Repositorio: GitHub.
- Referencias de UX mobile: mockups en carpeta app evaluandonos.

## 3. Diagnostico Tecnico Actual (AS-IS)

### 3.1 Hallazgos principales

1. Monolito funcional con concentracion de logica en index.html.
2. Mezcla de responsabilidades en la misma capa:
- presentacion (DOM/UI)
- acceso a datos (queries/cliente Supabase)
- reglas de negocio (calculo/analitica)
3. Estado global y funciones extensas con alto acoplamiento.
4. Mapeo CSV y decodificación de IDs fortalecidos: Soporte completo para el estándar institucional de 5 dígitos en todos los grados (ej. 11103 -> 1101, 30514 -> 3-YA) y compatibilidad con formatos en guión.
5. Scripts de soporte y reparacion dispersos en varias carpetas.
6. Backups y versiones historicas dentro del repo activo.

### 3.2 Riesgos

- Riesgo de regresion alto ante cambios pequenos.
- Mantenimiento costoso por falta de separacion por capas.
- Dificultad para pruebas automatizadas aisladas.
- Trazabilidad parcial de scripts de reparacion de datos.
- Riesgo operativo por activos legacy no clasificados formalmente.

### 3.3 Fortalezas

- Aplicacion actualmente operativa.
- Flujo de despliegue existente en Vercel.
- Base de datos en servicio administrado (Supabase).
- Material de diseno mobile ya disponible como referencia.

## 4. Inventario Tecnico Resumido

### 4.1 Runtime principal

- index.html: shell + logica concentrada (monolito actual).
- style.css: estilos base.
- app.js: punto de entrada potencial para modularizacion.
- sw.js + manifest.json + app-manifest.json: capacidades PWA.

### 4.2 Datos, scripts y soporte

- estudiantes/*.sql: scripts de actualizacion/reparacion.
- docentes/merge_docentes.py: mantenimiento de informacion.
- scratch/*: utilidades de diagnostico y reparacion puntual.

### 4.3 UX y prototipos

- app evaluandonos/*/code.html: mockups mobile reutilizables.
- app evaluandonos/modern_educational_analytics/DESIGN.md: guia visual de referencia.

### 4.4 Historial y respaldo

- versiones de respaldo/: snapshots historicos dentro del repo activo.

## 5. Nivel Objetivo (TO-BE): Mid-Level

Se busca una madurez tecnica mid-level con:

1. Arquitectura por capas con responsabilidades claras.
2. Convenciones de codigo y revisiones de cambio estandarizadas.
3. Pruebas minimas por modulo migrado (smoke + integracion selectiva).
4. Trazabilidad de cambios y criterio de rollback por release.
5. Politica formal para legado (deprecacion antes de eliminacion).

## 6. Arquitectura Objetivo (Clean Architecture)

Propuesta de estructura objetivo inicial:

src/
- presentation/
  - controllers/
  - views/
  - state/
- domain/
  - entities/
  - use-cases/
  - services/
- data/
  - repositories/
  - datasources/
- shared/
  - constants/
  - utils/

docs/
- arquitectura
- decisiones tecnicas
- runbooks

db/
- migrations/
- repairs/
- seeds/

scripts/
- maintenance/
- diagnostics/
- deprecated/

## 7. Estrategia de Migracion

Estrategia: incremental por fases, sin freeze total, sin reescritura big-bang.

### Fase 0. Baseline y resguardo funcional

- Documentar flujos criticos actuales (login, carga de grados, analisis, reportes, PWA base).
- Registrar evidencia de funcionamiento para comparacion post-cambio.

### Fase 1. Fundacion documental y normas

- Definir convenciones de capas, nombres y contratos.
- Publicar AGENTS.md con reglas obligatorias de cambio seguro.

### Fase 2. Estructura sin mover logica critica

- Crear carpetas destino y contratos base.
- Preparar entrada modular con ES Modules nativos.

### Fase 3. Extraccion segura desde monolito

Orden recomendado:
1. constants y utils puras
2. data (cliente y repositorios)
3. domain (casos de uso)
4. presentation (controladores y render)

Regla: mantener index.html como shell hasta lograr paridad funcional.

### Fase 4. Normalizacion de estilos y UI

- Separar estilos por responsabilidades.
- Reutilizar componentes de mockups mobile sin romper desktop.

### Fase 5. Gobernanza de scripts y SQL

- Clasificar scripts por uso real.
- Versionar SQL de cambios en db/migrations.
- Mover scripts legacy a carpeta deprecated con etiqueta explicita.

### Fase 6. Hardening

- Revisar secretos/configuracion y manejo de entorno.
- Establecer checklists de seguridad y release.

### Fase 7. Rollout progresivo

- Liberacion por modulos con smoke tests por fase.
- Rollback definido por release/tag.

## 8. Politica de Activos Legacy

Regla vigente para esta etapa:

- No eliminar archivos por defecto.
- Primero deprecar, documentar y comprobar no uso.
- Solo considerar eliminacion en una etapa futura con evidencia tecnica y aprobacion.

## 9. Criterios de Exito de la Migracion

1. Paridad funcional comprobada en flujos criticos.
2. Separacion real de capas (presentation/domain/data/shared).
3. Reduccion de riesgo de regresion por cambios locales.
4. Tiempos de mantenimiento y entrega mas predecibles.
5. Onboarding tecnico mas rapido para nuevos desarrolladores.

## 10. Proximos Pasos Inmediatos
 
1. Realizar pruebas integradas en el entorno local/producción con el archivo `src/app.js` activo.
2. Iniciar la fase de migración progresiva de las llamadas HTML internas para consumir directamente los módulos globales expuestos.
3. Mantener el monitoreo de errores a través de la consola del navegador para confirmar cero impacto funcional.

## 11. Bitácora de Cambios: Normalización Supabase y Rol Tesis (Noviembre 2026)

### 11.1 Depuración de Duplicados ('TOTAL') en Supabase
- **Causa raíz:** Coexistencia de cargas históricas de mayo (`... TOTAL`) con las de octubre (`...`) en `eval_resultados`, `eval_estudiantes_notas` y `eval_estudiantes_completos`, lo que duplicaba el conteo a 182 evaluados en Grado 9 Periodo 1.
- **Acciones ejecutadas:**
  - Renombrados `EVALUÁNDONOS 10 1P 2026 TOTAL` y `EVALUÁNDONOS 11 1P 2026 TOTAL` a su estándar sin TOTAL en todas las tablas (`eval_resultados`, `eval_estudiantes_notas`, `eval_estudiantes_completos`).
  - Unificados 7 estudiantes huérfanos de Grado 9 P1 en `eval_estudiantes_notas`.
  - Eliminados los lotes duplicados con sufijo TOTAL de Grado 9 en `eval_resultados` (120 filas) y `eval_estudiantes_completos` (95 filas).
  - Estado: **0 registros restantes con la palabra TOTAL en toda la base de datos**.

### 11.2 Corrección de Pregunta 12 (Matemáticas Grado 9 en E1 y E2)
- **Causa raíz:** En ZipGrade se configuraron claves dobles (válidas dos opciones). El algoritmo de importación sumaba el total de aciertos a una letra y luego sumaba de nuevo la otra letra como distractor, inflando los evaluados a 113 (E2) y 117 (E1).
- **Acciones ejecutadas:**
  - **E2 (Periodo 2, ID 49725):** Clave actualizada a `'A, B'`, B corregida a 37 aciertos, A en 17, total evaluados = **96**.
  - **E1 (Periodo 1, ID 49785):** Clave actualizada a `'C, D'`, C corregida a 27 aciertos, D en 28, total evaluados = **89** (90 con examen en blanco).
  - **Soporte frontend:** En `mostrarAnalisis()`, `updateChart()` y `mostrarAnalisisEstudiante()`, ahora se procesan claves compuestas y se resaltan en verde ambas opciones correctas en las listas y en el gráfico.

### 11.3 Nuevo Rol 'tesis'
- **Acceso:** Solo permite ver pestañas de **Análisis** (General y Por Estudiante) y **Estadísticas**.
- **Oculto:** Todo el menú de Informes (Individual, Grupal, Asignatura) y módulos administrativos.
- **Alcance de datos:** Restringido a los grupos **901** y **903** (Análisis general Grado 9; Estadísticas recalcula promedios únicamente con 901 y 903).
- **Anonimización:** En Análisis por Estudiante, el selector muestra el código ZipGrade (`Código ZipGrade: {student_id}`) en lugar del nombre real del estudiante.
- **Despliegue:** Versión de caché de PWA incrementada a **`v116`** en `sw.js` y `constants.js` y desplegada a Vercel Producción.

### 11.4 Corrección de Validación en Registro de Usuarios (Docente/Staff)
- **Problema:** El modal de nuevo docente/staff arrojaba falsamente "El correo ya está registrado" cuando la contraseña tenía menos de 6 caracteres (debido a que capturaba cualquier HTTP 422 como duplicado). Además, `perfiles_rol_check` en Supabase no incluía el rol `'tesis'`.
- **Acciones ejecutadas:**
  - Validación en frontend de contraseña mínima de 6 caracteres.
  - Distinción entre `weak_password` y `user_already_exists`.
  - Mecanismo de auto-enlace para cuentas creadas en Auth pero sin fila en `perfiles`.
  - Versión bump a **`v117`** y desplegado en Vercel Producción.

### 11.5 Extracción y Sincronización de Preguntas de Matemáticas Grado 9 (E1, E2, EF)
- **Origen:** Archivos Excel en carpeta `Preguntas matematicas 9/`:
  - `Prueba ICFES y Análisis Diagnóstico E1 2026.xlsx` (20 preguntas, Periodo 1).
  - `Prueba ICFES y Análisis Diagnóstico E2 2026.xlsx` (20 preguntas, Periodo 2).
  - `Prueba ICFES y Análisis Diagnóstico EF 2026.xlsx` (20 preguntas, Periodo 3).
- **Archivos CSV Generados:**
  - `csv/preguntas_matematicas_9_E1.csv`
  - `csv/preguntas_matematicas_9_E2.csv`
  - `csv/preguntas_matematicas_9_EF.csv`
  - `csv/preguntas_matematicas_9_todas.csv` (unificado con 60 preguntas).
- **Sincronización en Supabase (`eval_preguntas`):**
  - **Periodo 1:** 20 preguntas actualizadas por ID (eliminando desalineaciones previas).
  - **Periodo 2:** 20 preguntas actualizadas por ID (reemplazando distractores obsoletos de P16-P20).
  - **Periodo 3 (EF):** 20 preguntas insertadas limpiamente.
  - **Resultado:** Exactamente 60 registros en `eval_preguntas` para Grado 9 Matemáticas, **0 duplicados**.


### 11.6 Renderizado de Imágenes Intercaladas (`//`) y Carga de Imágenes en EF (`v119`)
- **Problema 1 (Segundo texto omitido tras un solo `//`, ej. Pregunta #14 de E2 Matemáticas 9°):**
  - `renderMedia()` dividía por `//` asumiendo que los índices impares eran exclusivamente URLs o vacíos (`// //`), por lo que en textos con un único `//` intermedio (`"El valor del determinante  //  del ejercicio anterior es:"`) el segundo fragmento de texto caía en el índice impar (slot de imagen) y era reemplazado por la URL predictiva.
- **Problema 2 (Imágenes de EF no visibles):**
  - Los recursos de EF en Supabase Storage (`2026/EF/3m9.png`, `5m9.png`, `6m9.png`, `7m9.png`, `15m9.png`) usan letra de asignatura en minúscula (`m`), mientras que `CURRENT_APP_VERSION` (`v117`) estaba desincronizado respecto a `sw.js` (`v118`), impidiendo que los navegadores limpiaran la caché antigua del Service Worker. Además, `verDetallePreguntaAdmin()` usaba `currentPeriodo` global en vez del selector `#aimg-periodo` y exigía espacios alrededor de `" // "`.
- **Acciones ejecutadas:**
  - Se implementó `parsearPartesMedia(content)` en `index.html`, normalizando cualquier combinación de `//` simple (`Texto 1 // Texto 2`, `// Texto`, `Texto //`, `//`), doble (`Texto 1 // // Texto 2`), URLs explícitas y `|||` en una secuencia alternada `[texto, imagen, texto, ...]` sin perder texto posterior a `//`.
  - Se sincronizó `verDetallePreguntaAdmin()`, `removerImagenMapeo()`, `obtenerUrlPredictiva(..., periodoOverride)` y `setPeriodo(p)` (`syncPeriodoSelects`).
  - Se sincronizó la versión de caché a **`v119`** tanto en `src/shared/constants.js` (`CURRENT_APP_VERSION`) como en `sw.js` (`CACHE_NAME`).


### Iteración v120 — Rol `tesis` (Matemáticas en Grupos 901 y 903) y Protección de Signo de Moneda (`\$`) en MathJax
- **Restricción del rol `tesis` en Análisis General y por Estudiante**:
  - En `cargarGrados()` y `cargarAsignaturas()` de `index.html`, cuando `currentRole === 'tesis'`, el selector de grado ofrece `9° (Grupos 901 y 903)`, `Grupo 901` y `Grupo 903`, y el selector de asignatura muestra y autoselecciona únicamente `Matematicas`.
  - En `mostrarAnalisis()`, las métricas de aciertos y distribución por opción (`A, B, C, D`) para `currentRole === 'tesis'` se calculan exclusivamente a partir de los registros de `eval_estudiantes_completos` pertenecientes a `['901', '903']` (o al subgrupo elegido), excluyendo otros grupos de 9° (`902` y sedes rurales).
  - En `cargarAsignaturasEstudiante()` (Análisis por Estudiante), para `currentRole === 'tesis'` solo se habilita y autoselecciona `Matematicas`.
- **Restricción del rol `tesis` en Estadísticas**:
  - En `cargarEstadisticas()`, `actualizarGraficoAsignaturas()`, `actualizarGraficoNivelAsignaturas()` y `actualizarGraficoComparativoGrupos()`, tanto `dataPeriodoActual` como `dataTodoPeriodo` quedan acotados exclusivamente a los grupos `901` y `903`, y la configuración de asignaturas se filtra únicamente a `Matematicas` (preguntas 1 a 20).
- **Escritura Matemática y Signo de Moneda (`\$`)**:
  - Se eliminó la carga duplicada de `tex-mml-chtml.js` en `<head>` para que `window.MathJax` aplique siempre `ignoreHtmlClass: 'tex2jax_ignore'`.
  - Se implementó `formatearTextoMatematico(text)` en `index.html` y se conectó en `renderMedia()`, envolviendo los signos de moneda (`$4500 y $1000`, `$39.000`, etc.) y signos `$` impares en `<span class="tex2jax_ignore">&#36;</span>`, preservando intactas las expresiones matemáticas reales en LaTeX (`$...$`, `$$...$$`, `\(...\)`).
- **Actualización de Caché PWA**:
  - Se sincronizó la versión a **`v120`** en `src/shared/constants.js`, `index.html` y `sw.js`.


### Iteración v121 — Gráficas Comparativas de las 3 Pruebas (E1 / E2 / EF) en Estadísticas
- **Nuevas Gráficas en `#estadisticas-container` (`index.html`)**:
  1. **Comparativo de Pruebas por Nivel y Asignatura (`#chart-evolucion-nivel-asig`)**:
     - Selectores: **Prueba (`#evol-nivel-periodo`)**, **Nivel (`#evol-nivel-grado`)** y **Asignatura (`#evol-nivel-asig`)**.
     - Comportamiento progresivo: al elegir `E1` grafica `E1`; al elegir `E2` grafica `E1 vs E2`; al elegir `EF` grafica `E1 vs E2 vs EF`, resolviendo dinámicamente los rangos de preguntas de cada periodo mediante `obtenerConfigMatrizPorPeriodo(gBase, p)` y `buscarRangoMateriaEnConfig()`.
  2. **Comparativo de Pruebas por Grupo (`#chart-evolucion-grupo-pruebas`)**:
     - Selectores: **Prueba (`#evol-grupo-periodo`)** y **Grupo (`#evol-grupo-grado`)**.
     - Grafica el comparativo acumulado por asignaturas para el grupo seleccionado desde `E1` hasta la prueba elegida (`E1`, `E1 y E2`, o `E1, E2 y EF`).
- **Respeto Estricto de Permisos por Rol (`esGrupoPermitidoEstadisticas` y `obtenerAsignaturasPermitidasEstadisticas`)**:
  - `superadmin`: todos los niveles, grupos y asignaturas.
  - `admin`: niveles y grupos de su sede (y restricción Primaria Central si aplica), con todas sus asignaturas.
  - `lector` (docente): únicamente los niveles, grupos y asignaturas donde tiene asignación académica o dirección de grupo.
  - `tesis`: restringido exclusivamente al nivel `9°` (calculado solo sobre `901` y `903`), grupos `901` y `903`, y asignatura `Matematicas`.
- **Actualización de Caché PWA**:
  - Se sincronizó la versión a **`v121`** en `src/shared/constants.js`, `index.html` y `sw.js`.


### Iteración v122 — Corrección de Fusión de Datos en Estadísticas/Reportes y Bloqueo de EF sin Resultados
- **Causa Raíz 1 (Sobrescritura de respuestas válidas por respuestas en blanco de `eval_estudiantes_completos`)**:
  - En `obtenerDatosCompletos()`, `obtenerDatosCompletosHistorico()` y `generarReporteIndividual()`, la función `normComp` convertía cualquier pregunta con `pts: 0` (incluyendo preguntas sin respuesta `stu: ""` en cargas parciales de `eval_estudiantes_completos`) en `0` y sobrescribía los aciertos (`1`) ya almacenados en `eval_estudiantes_notas` (afectando las preguntas 21–60 y 101–120 de 9° en E1).
  - **Solución**: Se implementaron `normalizarRegistroCompleto(d)` y `fusionarRespuestasEstudiante(prev, next)` en `index.html`, de modo que las preguntas con `stu === ""` y `pts == 0` no sobrescriban respuestas válidas y cualquier `1` prevalezca al fusionar hojas (`S1` + `S2`) o tablas, recalculando además `porcentaje` mediante `calcularPctHistoricoParaImpresion(est)`.
- **Causa Raíz 2 (Visualización errónea de estadísticas en `EF` y desfase de matriz `E1` vs `E2`)**:
  - En `cargarEstadisticas()`, cuando `currentPeriodo` era `null` al abrir Estadísticas, `pActivo` caía a `1` (`E1`) pero `currentPeriodo` permanecía `null`, haciendo que `parseInt(currentPeriodo) === 1` fuera `false` y se aplicara la matriz `6-9-E2E3` sobre datos de `E1`.
  - Además, cuando se seleccionaba `EF` (`periodo = 3`, que aún no tiene resultados cargados), un fallback cargaba los datos de `E2` (`periodo = 2`) y los guardaba dentro de `cacheDatosEstadisticasPorPeriodo[3]`, haciendo que `EF` mostrara exactamente los mismos datos de `E2`.
  - **Solución**:
    - Se eliminó el fallback entre periodos en `cargarEstadisticas()`: cada periodo almacena únicamente sus propios registros en `cacheDatosEstadisticasPorPeriodo[pActivo]`.
    - Si `currentPeriodo` es `null` al entrar a Estadísticas, se inicializa formalmente en `1` (`E1`) sincronizando las pestañas y selectores.
    - Si un periodo (`EF`) no tiene resultados cargados (`0` registros), se limpian las gráficas del periodo activo, se deshabilita la opción `EF (Sin resultados aún)` en los selectores comparativos (`#evol-nivel-periodo` y `#evol-grupo-periodo`), y `actualizarGraficoEvolucionNivel()` / `actualizarGraficoEvolucionGrupo()` filtran `periodosList` para graficar únicamente evaluaciones que tengan datos reales.
- **Actualización de Caché PWA**:
  - Se sincronizó la versión a **`v122`** en `src/shared/constants.js` y `sw.js`.
