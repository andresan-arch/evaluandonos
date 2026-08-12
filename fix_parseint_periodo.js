const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `const est = historico.find(t => t.periodo === parseInt(currentPeriodo));`;
const newCode = `const est = historico.find(t => parseInt(t.periodo) === parseInt(currentPeriodo));`;

const normalize = (str) => str.replace(/\r\n/g, '\n');

if (normalize(content).includes(normalize(oldCode))) {
  content = normalize(content).replace(normalize(oldCode), newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ Corrección de parseInt en reporte individual exitosa');
} else {
  console.log('❌ No se encontró el texto objetivo en reporte individual');
}
