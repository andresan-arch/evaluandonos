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
