const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `            // Refrescar automáticamente la vista activa
            if ($('individual-container').style.display === 'block') {
              if ($('rep-estudiante').value) generarReporteIndividual();
              else cargarGradosReporte();
            } else if ($('resultado-container').style.display === 'block') {
              if ($('sel-grado').value && $('sel-asig').value && $('sel-pregunta').value) mostrarAnalisis();
            } else if ($('estadisticas-container').style.display === 'block') {
              cargarEstadisticas();
            }`;

const newCode = `            // Refrescar automáticamente la vista activa
            if ($('individual-container').style.display === 'block') {
              if ($('rep-estudiante').value) generarReporteIndividual();
              else cargarGradosReporte();
            } else if ($('resultado-container').style.display === 'block') {
              if ($('sel-grado').value && $('sel-asig').value && $('sel-pregunta').value) mostrarAnalisis();
            } else if ($('estadisticas-container').style.display === 'block') {
              cargarEstadisticas();
            } else if ($('grupal-container').style.display === 'block') {
              if ($('gru-sel-grado').value) {
                if (window.reportController && typeof window.reportController.cargarReporteGrupal === 'function') {
                   window.reportController.cargarReporteGrupal($('gru-sel-grado').value);
                }
                generarInformeGrupal(); 
              } else cargarGruposInformeGrupal();
            } else if ($('asignatura-container').style.display === 'block') {
              if ($('asig-sel-grado').value && $('asig-sel-materia').value) {
                if (window.reportController && typeof window.reportController.cargarReporteAsignatura === 'function') {
                   window.reportController.cargarReporteAsignatura($('asig-sel-grado').value);
                }
                generarInformeAsignatura();
              } else cargarGruposInformeAsignatura();
            }`;

const normalize = (str) => str.replace(/\r\n/g, '\n');

if (normalize(content).includes(normalize(oldCode))) {
  content = normalize(content).replace(normalize(oldCode), newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ Reemplazo de setPeriodo exitoso');
} else {
  console.log('❌ No se encontró el texto objetivo para setPeriodo');
}
