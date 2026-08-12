const fs = require('fs');

const detailedCsvPath = 'estudiantes/DETALLADO 06 DE AGOSTO 2026.csv';
const csvPath = 'estudiantes/estudiantes_solo_en_E2.csv';
const outputPath = 'estudiantes/estudiantes_solo_en_E2_con_id.csv';

// Helper to normalize names: remove accents, special chars, and standardize s/z
const normalize = (str) => {
    if (!str) return '';
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/\ufffd/g, "n") // Fix weird character from ZipGrade for N
        .replace(/[^a-z0-9 ]/g, "") // Remove all non-alphanumeric except space
        .replace(/z/g, "s") // Treat z and s the same for names like elizabeth/elisabeth
        .trim();
};

console.log('Reading detailed CSV...');
const detailedLines = fs.readFileSync(detailedCsvPath, 'utf8').split(/\r?\n/).filter(r => r.trim());
const detailedHeaders = detailedLines[0].split(',');
const idMap = new Map();

for (let i = 1; i < detailedLines.length; i++) {
    const row = detailedLines[i].split(',');
    if (row.length < 4) continue;
    
    const doc = row[1]?.trim();
    const apellidos = normalize(row[2]);
    const nombres = normalize(row[3]);
    
    if (!doc) continue;
    
    const sede = row[0]?.trim() || '';
    const studentData = { doc, sede };
    
    const fullName = `${nombres} ${apellidos}`;
    idMap.set(fullName, studentData);
    
    const fNames = nombres.split(' ');
    const lNames = apellidos.split(' ');
    idMap.set(`${fNames[0]} ${lNames[0]}`, studentData);
    if (fNames.length > 1) idMap.set(`${fNames[0]} ${fNames[1]} ${lNames[0]}`, studentData);
    if (lNames.length > 1) idMap.set(`${fNames[0]} ${lNames[0]} ${lNames[1]}`, studentData);
    // Also reverse format
    idMap.set(`${apellidos} ${nombres}`, studentData);
}

console.log('Reading ZipGrade CSV...');
const csvData = fs.readFileSync(csvPath, 'utf8').split('\n');
const header = csvData[0];
const output = [header];

const evaluandonosPath = 'estudiantes/estudiantes_solo_en_E2_para_evaluandonos.csv';
const notFoundPath = 'estudiantes/estudiantes_no_encontrados.csv';
const outputEvaluandonos = ['SEDE;Estudiante;Identificación;ZipGrade_ID'];
const outputNotFound = [header];

let found = 0;
let notFound = 0;

for (let i = 1; i < csvData.length; i++) {
    const line = csvData[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length >= 4) {
        const zipId = parts[0];
        const firstName = normalize(parts[2]);
        const lastName = normalize(parts[3]);
        
        let match = idMap.get(`${firstName} ${lastName}`);
        if (!match) match = idMap.get(`${lastName} ${firstName}`);
        if (!match) match = idMap.get(`${firstName.split(' ')[0]} ${lastName.split(' ')[0]}`);
        
        if (match) {
            const { doc: id, sede } = match;
            parts[1] = id;
            
            // Format for Evaluandonos
            const capFirstName = parts[2].trim().toUpperCase();
            const capLastName = parts[3].trim().toUpperCase();
            
            // El usuario indicó que las sedes van SIN la palabra "SEDE"
            const formattedSede = sede.toUpperCase().replace('SEDE', '').trim();
            
            outputEvaluandonos.push(`${formattedSede};${capLastName} ${capFirstName};${id};${zipId}`);
            
            found++;
        } else {
            console.log(`Warning: Not found ID for ${firstName} ${lastName}`);
            outputNotFound.push(line);
            notFound++;
        }
        output.push(parts.join(','));
    } else {
        output.push(line);
    }
}

fs.writeFileSync(outputPath, output.join('\n'));
fs.writeFileSync(evaluandonosPath, outputEvaluandonos.join('\r\n'));
fs.writeFileSync(notFoundPath, outputNotFound.join('\n'));
console.log(`Done! Found: ${found}, Not Found: ${notFound}`);
console.log(`Saved to ${outputPath} (ZipGrade) y ${evaluandonosPath} (Evaluandonos) y ${notFoundPath} (No Encontrados)`);
