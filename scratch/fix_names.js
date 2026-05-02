
const SB_URL = "https://txnecdeccianklqqyrav.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM";

async function fixNames() {
    console.log("🚀 Iniciando corrección de nombres...");
    
    // 1. Obtener todos los registros
    const response = await fetch(`${SB_URL}/rest/v1/eval_estudiantes_notas?select=zipgrade_id,estudiante_nombre,quiz_name,periodo,grado`, {
        headers: {
            "apikey": SB_KEY,
            "Authorization": `Bearer ${SB_KEY}`
        }
    });
    
    const data = await response.json();
    console.log(`📊 Se encontraron ${data.length} registros.`);
    
    let updatedCount = 0;
    
    for (const record of data) {
        const originalName = record.estudiante_nombre;
        if (!originalName) continue;
        
        const parts = originalName.trim().split(/\s+/);
        if (parts.length < 3) continue; // Ya podría estar bien o ser muy corto
        
        // Evitar doble proceso: si ya parece estar en formato APELLIDO NOMBRE (ej. el primero termina en vocal y el último no? No es fiable)
        // Pero el usuario dice que están todos mal.
        
        // Lógica: Las últimas 2 palabras pasan al principio
        const apellidos = parts.slice(-2).join(' ');
        const nombres = parts.slice(0, -2).join(' ');
        const newName = (apellidos + " " + nombres).toUpperCase();
        
        if (newName === originalName.toUpperCase()) continue;
        
        // 2. Actualizar el registro
        // Usamos zipgrade_id, quiz_name y periodo para identificar de forma única si no hay ID
        const updateRes = await fetch(`${SB_URL}/rest/v1/eval_estudiantes_notas?zipgrade_id=eq.${record.zipgrade_id}&quiz_name=eq.${encodeURIComponent(record.quiz_name)}&periodo=eq.${record.periodo}&grado=eq.${record.grado}`, {
            method: "PATCH",
            headers: {
                "apikey": SB_KEY,
                "Authorization": `Bearer ${SB_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({ estudiante_nombre: newName })
        });
        
        if (updateRes.ok) {
            updatedCount++;
            if (updatedCount % 50 === 0) console.log(`✅ Actualizados ${updatedCount}...`);
        } else {
            console.error(`❌ Error actualizando a ${originalName}:`, await updateRes.text());
        }
    }
    
    console.log(`🎉 ¡Hecho! Se actualizaron ${updatedCount} registros.`);
}

fixNames();
