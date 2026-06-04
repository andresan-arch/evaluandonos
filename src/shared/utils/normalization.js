/**
 * Utilidades puras (sin efectos colaterales)
 * Funciones de normalización, transformación y cálculo
 * Fuente: index.html líneas 2530-2750
 */

/**
 * Normaliza texto: elimina acentos, espacios, convierte a minúsculas
 * @param {string} str - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export function normalizeText(str) {
  if (!str) return "";
  return str.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Calcula la valoración (nivel de desempeño) basado en porcentaje
 * @param {number} p - Porcentaje (0-100)
 * @returns {Object} Objeto con { label, initial, color, nivel }
 */
export function getValoration(p) {
  if (p >= 91) return { label: 'Superior', initial: 'S', color: '#a855f7', nivel: 'N4' };
  if (p >= 71) return { label: 'Alto', initial: 'A', color: '#22c55e', nivel: 'N3' };
  if (p >= 51) return { label: 'Básico', initial: 'Bs', color: '#facc15', nivel: 'N2' };
  return { label: 'Bajo', initial: 'Bj', color: '#ef4444', nivel: 'N1' };
}

/**
 * Detecta la sede basada en la cadena del grado
 * Utiliza coincidencia por palabra, código corto y último dígito
 * @param {string} gradoStr - String del grado (ej: "305", "3-YA", "Yanaconas")
 * @returns {string} Nombre de la sede
 */
export function detectarSede(gradoStr) {
  if (!gradoStr) return 'Central';
  const clean = gradoStr.toString().trim().toUpperCase();

  // 1. Detección por palabra completa (PRIORIDAD ALTA)
  if (clean.includes('YANACONA') || clean.includes('YANACONS')) return 'Yanaconas';
  if (clean.includes('PUEBLILLO')) return 'Pueblillo';
  if (clean.includes('SENDERO')) return 'Sendero';
  if (clean.includes('PISOJE')) return 'Pisoje Bajo';

  // 2. Detección por códigos cortos (Sufijos)
  if (clean.endsWith('PU')) return 'Pueblillo';
  if (clean.endsWith('PJ')) return 'Pisoje Bajo';
  if (clean.endsWith('YA') || clean.endsWith('Y')) return 'Yanaconas';
  if (clean.endsWith('SE') || (clean.endsWith('S') && clean.length <= 3)) return 'Sendero';

  // 3. Detección por el último dígito del grupo (ej. 305 -> 5 -> Yanaconas)
  const match = clean.match(/\d+$/);
  if (match) {
    const lastDigit = match[0].slice(-1);
    if (lastDigit === '4') return 'Pisoje Bajo';
    if (lastDigit === '5') return 'Yanaconas';
    if (lastDigit === '6') return 'Sendero';
    if (lastDigit === '7') return 'Pueblillo';
  }

  return 'Central';
}

/**
 * Detecta el periodo basado en el nombre del quiz/evaluación
 * @param {string} quizName - Nombre del quiz (ej: "Evaluandonos P1", "Quiz 2P")
 * @param {number} currentPeriodo - Periodo por defecto si no se detecta
 * @returns {number} Número del periodo (1, 2 o 3)
 */
export function detectarPeriodo(quizName, currentPeriodo = 1) {
  if (!quizName) return parseInt(currentPeriodo) || 1;
  const name = quizName.toString().toUpperCase();

  // Prioridad 1: Patrones claros como 1P, P1, Periodo 1
  if (/(?:1P|P1|PERIODO\s*1|[ _\-]1(?!\d))/i.test(name)) return 1;
  if (/(?:2P|P2|PERIODO\s*2|[ _\-]2(?!\d))/i.test(name)) return 2;
  if (/(?:3P|P3|PERIODO\s*3|[ _\-]3(?!\d)|FINAL|FIN)/i.test(name)) return 3;

  // Prioridad 2: Si tiene "Evaluandonos" y un número solo
  if (name.includes("EVALUANDONOS")) {
    if (/\b1\b/.test(name)) return 1;
    if (/\b2\b/.test(name)) return 2;
    if (/\b3\b/.test(name)) return 3;
  }

  return parseInt(currentPeriodo) || 1;
}

/**
 * Calcula el porcentaje entre acertadas y total
 * @param {number} acertadas - Número de respuestas correctas
 * @param {number} total - Total de preguntas
 * @returns {number} Porcentaje redondeado (0-100)
 */
export function calcularPorcentaje(acertadas, total) {
  if (!total || total === 0) return 0;
  return Math.round((acertadas / total) * 100);
}

/**
 * Valida si un correo es válido básicamente
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Extrae el grado base a partir del grupo o curso
 * @param {string|number} grupo - Grupo o curso (ej: "1101", "305", "primaria")
 * @returns {number} Grado base
 */
export function extraerGradoBase(grupo) {
  if (!grupo) return 0;
  const s = grupo.toString().trim();
  if (s.toLowerCase() === "primaria") return 1;
  if (s.length === 2 && !["10", "11"].includes(s)) return 0;
  if (s.startsWith("10") || s.startsWith("11")) return parseInt(s.substring(0, 2), 10);
  const firstDigit = parseInt(s.substring(0, 1), 10);
  return isNaN(firstDigit) ? 0 : firstDigit;
}

/**
 * Obtiene el año actual del sistema o la configuración global
 * @returns {number} Año actual
 */
export function getCurrentYear() {
  if (typeof window !== 'undefined' && window.currentYear) {
    return parseInt(window.currentYear, 10);
  }
  return new Date().getFullYear();
}
