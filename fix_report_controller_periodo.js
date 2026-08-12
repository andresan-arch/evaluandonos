const fs = require('fs');
const path = 'src/presentation/controllers/ReportController.js';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `      const { data: resData, error } = await client
        .from('eval_estudiantes_notas')
        .select('*')
        .eq('anio', getCurrentYear())
        .eq('zipgrade_id', zipId);

      if (error || !resData || resData.length === 0) {`;
const newCode = `      const periodo = parseInt(window.currentPeriodo) || 2;
      const { data: resData, error } = await client
        .from('eval_estudiantes_notas')
        .select('*')
        .eq('anio', getCurrentYear())
        .eq('periodo', periodo)
        .eq('zipgrade_id', zipId);

      if (error || !resData || resData.length === 0) {`;

const normalize = (str) => str.replace(/\r\n/g, '\n');

if (normalize(content).includes(normalize(oldCode))) {
  content = normalize(content).replace(normalize(oldCode), newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ Filtro de periodo agregado en ReportController exitosamente');
} else {
  console.log('❌ No se encontró el texto objetivo en ReportController');
}
