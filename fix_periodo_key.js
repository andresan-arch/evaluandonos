const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `            const gBase = extraerGradoBase(grado);\r\n            const key = (gBase >= 10) ? '10-11' : (gBase >= 6) ? '6-9' : (gBase >= 5) ? '5' : '3-4';\r\n            const rangos = MATRIZ_RANGOS[key] || [];`;

const newCode = `            const gBase = extraerGradoBase(grado);\r\n            const esE1 = parseInt(currentPeriodo) === 1;\r\n            let key;\r\n            if (gBase <= 4) key = '3-4';\r\n            else if (gBase === 5) key = '5';\r\n            else if (gBase >= 10) key = esE1 ? '10-11-E1' : '10-11-E2E3';\r\n            else key = esE1 ? '6-9-E1' : '6-9-E2E3';\r\n            const rangos = MATRIZ_RANGOS[key] || [];`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ Reemplazo exitoso en index.html');
} else {
  console.log('❌ No se encontró el texto objetivo');
  // Try without \r\n
  const oldCode2 = oldCode.replace(/\r\n/g, '\n');
  if (content.includes(oldCode2)) {
    content = content.replace(oldCode2, newCode.replace(/\r\n/g, '\n'));
    fs.writeFileSync(path, content, 'utf8');
    console.log('✅ Reemplazo exitoso (sin \\r)');
  } else {
    console.log('❌ Tampoco sin \\r');
  }
}
