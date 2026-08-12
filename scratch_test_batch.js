const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://txnecdeccianklqqyrav.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const text = fs.readFileSync('estudiantes/estudiantes_solo_en_E2_para_evaluandonos.csv', 'utf8');
  const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");
  
  const students = [];
  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(';');
    if (cols.length >= 3) {
      students.push({
        sede: cols[0].trim(),
        nombre: cols[1].trim(),
        identificacion: cols[2].trim(),
        zipgrade_id: (cols[3] || "").trim()
      });
    }
  }

  console.log(`Inserting ${students.length} students...`);
  const { data, error } = await supabase.from('maestro_estudiantes').upsert(students, { onConflict: 'identificacion' });
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
