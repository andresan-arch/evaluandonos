// ====================================================
// DIAGNÓSTICO GRADO 10 - Pega esto en la consola (F12)
// ====================================================
(async () => {
  const sb = supabaseClient; // Ya existe en la página

  console.log("🔍 Consultando todos los estudiantes del periodo 1...");
  const { data: todos, error: e1 } = await sb
    .from('eval_estudiantes_notas')
    .select('grado, zipgrade_id, quiz_name, periodo')
    .eq('periodo', 1);

  if (e1) { console.error("❌ Error en query:", e1); return; }

  console.log("✅ Total registros en periodo 1:", todos ? todos.length : 0);

  // Agrupar por grado
  const porGrado = {};
  (todos || []).forEach(d => {
    porGrado[d.grado] = (porGrado[d.grado] || 0) + 1;
  });
  console.log("📊 Distribución por grado:", porGrado);

  // Ver si hay algo con grado que empiece en 10
  const g10 = (todos || []).filter(d => String(d.grado).startsWith('10'));
  console.log("🎓 Registros de grado 10:", g10.length);
  if (g10.length > 0) console.log("  Primer registro:", g10[0]);

  // Ver todos los quiz_names
  const qnames = [...new Set((todos || []).map(d => d.quiz_name))];
  console.log("📋 Quiz names guardados:", qnames);

  // Ver también periodo 0 (por si se guardó mal el periodo)
  const { data: p0 } = await sb.from('eval_estudiantes_notas').select('grado, periodo, quiz_name').eq('periodo', 0);
  console.log("⚠️ Registros con periodo=0:", p0 ? p0.length : 0);

  // Buscar cualquier registro con zipgrade_id que empiece en 10
  const { data: zip10, error: e3 } = await sb
    .from('eval_estudiantes_notas')
    .select('zipgrade_id, grado, periodo, estudiante_nombre')
    .like('zipgrade_id', '10%')
    .limit(5);
  console.log("🔑 Registros con zipgrade_id empezando en 10:", zip10 ? zip10.length : 0, e3 ? "ERROR:"+e3.message : "");
  if (zip10 && zip10.length > 0) zip10.forEach(r => console.log("  ", r));
})();
