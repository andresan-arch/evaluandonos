-- Migración: Actualizar restricciones de unicidad para permitir histórico por año
-- Ejecutar en el SQL Editor de Supabase

-- 1. MAESTRO ESTUDIANTES
-- Reemplazar 'maestro_estudiantes_identificacion_key' con el nombre de tu restricción actual
ALTER TABLE maestro_estudiantes DROP CONSTRAINT IF EXISTS maestro_estudiantes_identificacion_key;
ALTER TABLE maestro_estudiantes DROP CONSTRAINT IF EXISTS maestro_estudiantes_pkey;
-- Crear llave compuesta (identificacion + anio)
ALTER TABLE maestro_estudiantes ADD CONSTRAINT maestro_estudiantes_identificacion_anio_key UNIQUE (identificacion, anio);

-- 2. EVAL RESULTADOS
-- Reemplazar el nombre si tu restricción se llama distinto
ALTER TABLE eval_estudiantes_notas DROP CONSTRAINT IF EXISTS eval_estudiantes_notas_zipgrade_id_periodo_key;
-- Crear llave compuesta (zipgrade_id + periodo + anio)
ALTER TABLE eval_estudiantes_notas ADD CONSTRAINT eval_estudiantes_notas_zipgrade_id_periodo_anio_key UNIQUE (zipgrade_id, periodo, anio);

-- 3. EVAL PREGUNTAS (Si aplica)
ALTER TABLE eval_preguntas DROP CONSTRAINT IF EXISTS eval_preguntas_grado_periodo_asignatura_pregunta_num_key;
ALTER TABLE eval_preguntas ADD CONSTRAINT eval_preguntas_grado_periodo_anio_asignatura_pregunta_num_key UNIQUE (grado, periodo, anio, asignatura, pregunta_num);
