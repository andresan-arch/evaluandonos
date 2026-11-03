// --- HELPERS PARA IDENTIFICACIÓN POR ZIPGRADE ID Y LÓGICA DE NEGOCIO ---

function normalizeText(str) {
  if (!str) return "";
  return str.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getValoration(p) {
  if (p >= 91) return { label: 'Superior', initial: 'S', color: '#a855f7', nivel: 'N4' };
  if (p >= 71) return { label: 'Alto', initial: 'A', color: '#22c55e', nivel: 'N3' };
  if (p >= 51) return { label: 'Básico', initial: 'Bs', color: '#facc15', nivel: 'N2' };
  return { label: 'Bajo', initial: 'Bj', color: '#ef4444', nivel: 'N1' };
}

function extraerGrupo(zipId) {
  if (!zipId) return "";
  let s = zipId.toString().trim();

  // 1. Manejo de formatos con guión (ej. "11-01", "5-YA")
  if (s.includes("-")) {
    const parts = s.split("-");
    const suffix = parts[1] ? parts[1].toUpperCase() : "";
    if (/^\d+$/.test(suffix)) {
      return parts[0] + parseInt(suffix, 10).toString().padStart(2, '0');
    }
    return s;
  }

  // Quitar ceros a la izquierda accidentales
  if (s.startsWith("0") && s.length > 1) {
    s = s.replace(/^0+/, '');
  }

  const len = s.length;

  // 2. Lógica Unificada para ID Institucional de 5 dígitos (ZipGrade/Quizizz)
  // Estándar: G(G) + Selector + ...
  // Selector (índice 2): 1/2/3=Central(Grupo), 4=PJ, 5=YA, 6=SE, 7=PU
  if (len === 5) {
    const isHighGrade = s.startsWith("10") || s.startsWith("11");
    const grado = isHighGrade ? s.substring(0, 2) : s.substring(0, 1);
    const selector = s.substring(2, 3);

    // 2.1 Mapeo por selector para SEDES (4=PJ, 5=YA, 6=SE, 7=PU)
    if (selector === "4") return grado + "-PJ";
    if (selector === "5") return grado + "-YA";
    if (selector === "6") return grado + "-SE";
    if (selector === "7") return grado + "-PU";

    // 2.2 Mapeo para CENTRAL (1, 2, 3)
    if (selector === "1" || selector === "2" || selector === "3") {
      if (isHighGrade) {
        // Formato 10121 -> 1001, 11334 -> 1103
        return grado + "0" + selector;
      } else {
        // Formato 60212 -> 602, 40212 -> 402, 90315 -> 903
        // Usamos los primeros 3 dígitos directamente para capturar el grupo Ggg
        return s.substring(0, 3);
      }
    }
  }

  // 3. Fallbacks para otros longitudes
  if (len === 6) return s.substring(0, 3);
  if (len === 4) return s.substring(0, 3);
  if (s.toLowerCase() === "primaria") return s;

  return s;
}

function esGrupoValido(g) {
  if (!g) return false;
  const s = g.toString().trim().toUpperCase();
  if (s === "PRIMARIA") return true;

  // Lista cerrada y estricta de grupos legítimos de la Sede Central
  const centralPermitidos = [
    "301", "401", "501",
    "601", "602", "603",
    "701", "702", "703",
    "801", "802",
    "901", "902", "903",
    "1001", "1002", "1003",
    "1101", "1102", "1103"
  ];
  if (centralPermitidos.includes(s)) return true;

  // Para las sedes rurales (las que detectarSede clasifica como diferentes de 'Central')
  const sede = detectarSede(s);
  if (sede !== 'Central') {
    // Validamos que el grado base extraído tenga sentido institucional (1 a 11)
    const base = extraerGradoBase(s);
    if (base >= 1 && base <= 11) return true;
  }

  return false;
}

function extraerGradoBase(grupo) {
  if (!grupo) return 0;
  const s = grupo.toString().trim();
  if (s.toLowerCase() === "primaria") return 1;
  if (s.length === 2 && !["10", "11"].includes(s)) return 0;
  if (s.startsWith("10") || s.startsWith("11")) return parseInt(s.substring(0, 2));
  const firstDigit = parseInt(s.substring(0, 1));
  return isNaN(firstDigit) ? 0 : firstDigit;
}

function detectarSede(gradoStr) {
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

  return 'Central';
}

function detectarPeriodo(quizName) {
  if (!quizName) return (typeof currentPeriodo !== 'undefined' ? parseInt(currentPeriodo) : 1) || 1;
  const name = quizName.toString().toUpperCase();

  // Prioridad 1: Tokens explícitos de prueba/periodo (1P/P1/E1, 2P/P2/E2, 3P/P3/E3/EF/FINAL)
  // Se evalúan antes de cualquier número suelto para no confundir el grado (ej. "EVALUÁNDONOS 3 2P") con el periodo
  if (/(?:^|[\s_\-/\\])(?:1P|P1|E1|PERIODO\s*1)(?=$|[\s_\-/\\.])/i.test(name)) return 1;
  if (/(?:^|[\s_\-/\\])(?:2P|P2|E2|PERIODO\s*2)(?=$|[\s_\-/\\.])/i.test(name)) return 2;
  if (/(?:^|[\s_\-/\\])(?:3P|P3|E3|EF|PERIODO\s*3|FINAL|FIN)(?=$|[\s_\-/\\.])/i.test(name)) return 3;

  return (typeof currentPeriodo !== 'undefined' ? parseInt(currentPeriodo) : 1) || 1;
}

/**
 * Determina si un archivo/quiz CSV corresponde a la Segunda Sesión (S2, preguntas 1 a 60 -> 61 a 120).
 * Regla de negocio:
 * - E1 (periodo 1): 1 sola sesión de 1 a 120 preguntas -> SIEMPRE retorna false (offset 0).
 * - E2 y EF (periodo 2 y 3): 2 sesiones de 1 a 60 preguntas en Bachillerato (S1: 1-60, S2: 1-60 con offset +60 -> 61-120).
 */
function esSegundaSesionCSV(quizName, fileName, periodoDetectado) {
  const p = parseInt(periodoDetectado) || detectarPeriodo((quizName || '') + ' ' + (fileName || ''));
  if (p === 1) return false;
  const combined = ((quizName || '') + ' ' + (fileName || '')).toString();
  return /(?:^|[\s_\-/\\])(?:s2|sec(?:ci[oó]n)?\s*2|ses(?:i[oó]n)?\s*2|parte\s*2|hoja\s*2)(?=$|[\s_\-/\\.]|\b)/i.test(combined);
}

/**
 * Extrae el grado (3 a 11) desde el nombre del quiz o nombre del archivo CSV sin confundirse
 * con tokens de periodo (1P, 2P, 3P, E1, E2, EF), sesión (S1, S2) ni año (2026).
 */
function extraerGradoDeQuizCSV(quizName, fileName) {
  const sources = [quizName || '', fileName || ''];
  for (const src of sources) {
    if (!src) continue;
    const cleaned = src.toString()
      .replace(/\b20\d{2}\d*\b/g, ' ')
      .replace(/(?:^|[\s_\-/\\])(?:[123]P|P[123]|E[123F]|PERIODO\s*[123])(?=$|[\s_\-/\\.])/gi, ' ')
      .replace(/(?:^|[\s_\-/\\])(?:S[12]|SEC(?:CI[OÓ]N)?\s*[12]|SES(?:I[OÓ]N)?\s*[12]|PARTE\s*[12]|HOJA\s*[12])(?=$|[\s_\-/\\.])/gi, ' ');
    const match1011 = cleaned.match(/(?:^|[^\d])(10|11)(?!\d)/);
    if (match1011) return match1011[1];
    const match39 = cleaned.match(/(?:^|[^\d])([3-9])(?!\d)/);
    if (match39) return match39[1];
  }
  return "0";
}

function isSubjectEvaluated(subject, grade) {
  if (!subject) return false;
  const gNum = extraerGradoBase(grade);

  // Caso especial: Física/Química en secundaria se consideran parte de Naturales si no están explícitas
  const normTarget = normalizeText(subject);
  if (gNum >= 6 && (normTarget.includes("fisica") || normTarget.includes("quimica"))) {
    return true;
  }

  // Soporte para Matemáticas (Calculo/Trigonometria)
  const isMath = normTarget.includes("matematica") || normTarget.includes("calculo") || normTarget.includes("trigono");

  let mKey = '6-9';
  if (gNum <= 4) mKey = '3-4';
  else if (gNum === 5) mKey = '5';
  else if (gNum >= 10) mKey = '10-11';

  const config = MATRIZ_RANGOS[mKey];
  return config.some(c => {
    const normLabel = normalizeText(c.label);
    
    // Mapping Matemáticas
    if (isMath && (normLabel.includes("matematica") || normLabel.includes("calculo") || normLabel.includes("trigono"))) return true;

    // Mapping Naturales/Biologia/Fisica/Quimica
    if ((normTarget.includes("naturales") || normTarget.includes("biologia") || normTarget.includes("fisica") || normTarget.includes("quimica") || normTarget.includes("ciencia") || normTarget.includes("bio")) &&
      (normLabel.includes("naturales") || normLabel.includes("biologia") || normLabel.includes("fisica") || normLabel.includes("quimica") || normLabel.includes("ciencia") || normLabel.includes("bio"))) return true;

    return normLabel.includes(normTarget) || normTarget.includes(normLabel);
  });
}

function checkSubjectPermission(allowedAsigs, targetAsig, gBase) {
  if (!allowedAsigs || allowedAsigs.length === 0) return false;
  const normTarget = normalizeText(targetAsig);
  const isBio = normTarget.includes("biologia") || normTarget.includes("naturales") || (normTarget.includes("ciencia") && !normTarget.includes("social")) || normTarget.includes("bio");
  const isPhys = normTarget.includes("fisica") || normTarget.includes("fis");
  const isChem = normTarget.includes("quimica") || normTarget.includes("qui");

  const isMath = normTarget.includes("matematica") || normTarget.includes("calculo") || normTarget.includes("trigono");

  return allowedAsigs.some(perm => {
    const p = normalizeText(perm);
    if (!p) return false;

    const hasBio = p.includes("biologia") || p.includes("naturales") || (p.includes("ciencia") && !p.includes("social")) || p.includes("bio");
    const hasPhys = p.includes("fisica") || p.includes("fis");
    const hasChem = p.includes("quimica") || p.includes("qui");
    const hasMath = p.includes("matematica") || p.includes("calculo") || p.includes("trigono");

    // Regla de Vinculación de Matemáticas
    if (isMath && hasMath) return true;

    // Regla de Vinculación de Naturales (Generalizada para todas las sedes)
    if (gBase >= 6 && gBase <= 9) {
      // En 6-9: Biología y Física están vinculadas
      if ((isBio || isPhys) && (hasBio || hasPhys)) return true;
    } else if (gBase >= 10) {
      // En 10-11: Biología, Física y Química están vinculadas
      if ((isBio || isPhys || isChem) && (hasBio || hasPhys || hasChem)) return true;
    }

    // Primaria (1-5): Se agrupan bajo términos de Naturales/Biología
    if (gBase < 6 && isBio && hasBio) return true;

    // Regla 1: Coincidencia estándar
    return normTarget.includes(p) || p.includes(normTarget);
  });
}
