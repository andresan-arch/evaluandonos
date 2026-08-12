const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://txnecdeccianklqqyrav.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const students = [{
    sede: "SEDE ALEJANDRO DE HUMBOLDT",
    nombre: "ELIQUITAN MUÑOZ HEYLIN ORIANA",
    identificacion: "1081412474",
    zipgrade_id: "90190"
  }];

  const { data, error } = await supabase.from('maestro_estudiantes').upsert(students, { onConflict: 'identificacion' });
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
