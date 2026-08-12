const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `const est = historico.find(t => t.periodo === parseInt(currentPeriodo)) || historico[historico.length - 1];`;
const newCode = `const est = historico.find(t => t.periodo === parseInt(currentPeriodo));`;

const normalize = (str) => str.replace(/\r\n/g, '\n');

if (normalize(content).includes(normalize(oldCode))) {
  content = normalize(content).replace(normalize(oldCode), newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ Fallback de periodo en reporte individual eliminado exitosamente');
} else {
  console.log('❌ No se encontró el texto objetivo para el fallback del reporte individual');
}
