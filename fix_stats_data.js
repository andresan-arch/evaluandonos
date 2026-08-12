const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `            try {
              const { data, error } = await supabaseClient.from('eval_estudiantes_notas')
                .select('*')
                .eq('periodo', currentPeriodo);

              if (error) throw error;
              let dataTemp = data || [];

              if (dataTemp.length === 0 && currentPeriodo === 2) {
                const { data: fallbackData } = await supabaseClient.from('eval_estudiantes_notas').select('*').eq('periodo', 1);
                if (fallbackData && fallbackData.length > 0) dataTemp = fallbackData;
              }`;

const newCode = `            try {
              let dataTemp = await obtenerDatosCompletos(currentPeriodo);

              if (dataTemp.length === 0 && currentPeriodo === 2) {
                const fallbackData = await obtenerDatosCompletos(1);
                if (fallbackData && fallbackData.length > 0) dataTemp = fallbackData;
              }`;

// Normalize line endings for replacement
const normalize = (str) => str.replace(/\r\n/g, '\n');

if (normalize(content).includes(normalize(oldCode))) {
  content = normalize(content).replace(normalize(oldCode), newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ Reemplazo de estadísticas exitoso');
} else {
  console.log('❌ No se encontró el texto objetivo para estadísticas');
}
