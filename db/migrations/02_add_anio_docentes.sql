-- Migración: Añadir columna `anio` para manejo histórico de privilegios de docentes
-- Ejecutar esto en el SQL Editor de Supabase

-- 1. Añadir columna anio a docentes_privacidad
ALTER TABLE docentes_privacidad ADD COLUMN IF NOT EXISTS anio int2 DEFAULT 2026;

-- 2. Asignar el año 2026 a todos los registros existentes para que mantengan sus permisos actuales
UPDATE docentes_privacidad SET anio = 2026 WHERE anio IS NULL;

-- 3. IMPORTANTE: Si existe una restricción de unicidad (Unique Constraint) que solo tenga el nombre del docente,
-- debes eliminarla y crear una nueva que incluya el nombre del docente + anio.
-- Ejemplo (descomenta si aplica a tu esquema actual y reemplaza 'nombre_restriccion' con el nombre real de la llave):
-- ALTER TABLE docentes_privacidad DROP CONSTRAINT IF EXISTS nombre_restriccion;
-- ALTER TABLE docentes_privacidad ADD CONSTRAINT docentes_privacidad_nombre_anio_key UNIQUE (nombre, anio);
