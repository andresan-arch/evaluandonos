/**
 * Controlador de Administración
 * Conecta eventos HTML con AdminService para la subida de datos y gestión de privacidad
 */

import { AdminService } from '../../domain/services/index.js';
import { extraerGradoBase, detectarPeriodo, detectarSede, getCurrentYear } from '../../shared/utils/normalization.js';

export class AdminController {
  constructor() {
    this.docentes = [];
  }

  /**
   * Inicializa event listeners de la sección administrativa
   */
  init() {
    console.log('⚙️ AdminController inicializado');
    this.bindCargarDocentes();
    this.bindSubidaCSV();
  }

  /**
   * Carga y renderiza la lista de docentes y privilegios
   */
  async cargarDocentes() {
    try {
      this.docentes = await AdminService.cargarDocentesYPermisos();
      this.renderDocentesTable();
    } catch (err) {
      console.error('Error al cargar docentes:', err);
    }
  }

  /**
   * Vincula el botón de cargar docentes
   */
  bindCargarDocentes() {
    const btn = document.getElementById('btn-cargar-docentes');
    if (btn) {
      btn.addEventListener('click', () => this.cargarDocentes());
    }
  }

  /**
   * Vincula los elementos de carga de archivos CSV
   */
  bindSubidaCSV() {
    // 1. Subida de Notas/Estudiantes
    const fileEstudiantes = document.getElementById('file-upload-estudiantes');
    const btnEstudiantes = document.getElementById('btn-upload-estudiantes');

    if (fileEstudiantes && btnEstudiantes) {
      btnEstudiantes.addEventListener('click', () => {
        const file = fileEstudiantes.files[0];
        if (!file) {
          alert('Selecciona un archivo CSV/TSV de estudiantes primero');
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target.result;
          await this.procesarEstudiantesCSV(content, file.name);
        };
        reader.readAsText(file);
      });
    }

    // 2. Subida de Resultados
    const fileResultados = document.getElementById('file-upload-resultados');
    const btnResultados = document.getElementById('btn-upload-resultados');

    if (fileResultados && btnResultados) {
      btnResultados.addEventListener('click', () => {
        const file = fileResultados.files[0];
        if (!file) {
          alert('Selecciona un archivo CSV/TSV de resultados primero');
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target.result;
          await this.procesarResultadosCSV(content, file.name);
        };
        reader.readAsText(file);
      });
    }
  }

  /**
   * Procesa y parsea CSV de estudiantes
   */
  async procesarEstudiantesCSV(text, filename) {
    if (!window.Papa) {
      alert('Error: Librería PapaParse no encontrada.');
      return;
    }

    const config = {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const estudiantes = [];

        rows.forEach(row => {
          // Normalizar llaves
          const identificacion = row['identificacion'] || row['Identificacion'] || row['ID'];
          const nombre = row['nombre'] || row['Nombre'] || row['Estudiante'];
          const zipgradeId = row['zipgrade_id'] || row['ZipGradeID'] || row['Zipgrade ID'];
          const grupo = row['grupo'] || row['Grupo'] || row['Grado'];

          if (identificacion && nombre) {
            estudiantes.push({
              identificacion: identificacion.toString().trim(),
              nombre: nombre.toString().trim(),
              zipgrade_id: zipgradeId ? zipgradeId.toString().trim() : null,
              grupo: grupo ? grupo.toString().trim() : null,
              anio: getCurrentYear()
            });
          }
        });

        if (estudiantes.length === 0) {
          alert('No se encontraron registros de estudiantes válidos en el archivo.');
          return;
        }

        const res = await AdminService.subirEstudiantesNotas(estudiantes);
        if (res.success) {
          alert(`Sincronización exitosa: ${res.count} estudiantes cargados.`);
        } else {
          alert(`Error al guardar datos: ${res.error}`);
        }
      }
    };

    window.Papa.parse(text, config);
  }

  /**
   * Procesa y parsea CSV de resultados
   */
  async procesarResultadosCSV(text, filename) {
    if (!window.Papa) {
      alert('Error: Librería PapaParse no encontrada.');
      return;
    }

    // Detectar periodo a partir del nombre del archivo o quiz
    const periodo = detectarPeriodo(filename);

    const config = {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const resultados = [];

        rows.forEach(row => {
          const zipId = row['ZipGradeID'] || row['External ID'] || row['zipgrade_id'] || row['ID'];
          const nombre = row['First Name'] || row['Last Name'] || row['nombre'] || row['Student Name'];
          const correctas = parseInt(row['Percent Correct'] || row['Score'] || row['correctas'], 10);
          const total = parseInt(row['Total Questions'] || row['preguntas'] || row['total_preguntas'], 10);

          if (zipId && nombre && !isNaN(correctas)) {
            const respuestas = {};
            // Mapear respuestas correctas por número de pregunta
            Object.keys(row).forEach(key => {
              const match = key.match(/^Q(\d+)$/i);
              if (match) {
                const num = parseInt(match[1], 10);
                respuestas[num] = row[key] === '1' || row[key] === 'Correct' ? 1 : 0;
              }
            });

            const gradoStr = row['Grupo'] || row['Class'] || row['grado'] || '';
            const gBase = extraerGradoBase(gradoStr);

            resultados.push({
              zipgrade_id: zipId.toString().trim(),
              nombre: nombre.toString().trim(),
              respuestas,
              porcentaje: Math.round((correctas / (total || 1)) * 100),
              grado: gBase,
              periodo,
              anio: getCurrentYear()
            });
          }
        });

        if (resultados.length === 0) {
          alert('No se encontraron registros de resultados válidos en el archivo.');
          return;
        }

        const res = await AdminService.subirResultados(resultados);
        if (res.success) {
          alert(`Sincronización exitosa: ${res.count} resultados cargados para el periodo P${periodo}.`);
        } else {
          alert(`Error al guardar resultados: ${res.error}`);
        }
      }
    };

    window.Papa.parse(text, config);
  }

  /**
   * Renderiza la tabla de docentes en el DOM
   */
  renderDocentesTable() {
    const tableBody = document.getElementById('table-body-docentes');
    if (!tableBody) return;

    if (this.docentes.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay docentes registrados</td></tr>';
      return;
    }

    tableBody.innerHTML = this.docentes.map(doc => `
      <tr>
        <td>${doc.docente || 'Sin nombre'}</td>
        <td>${doc.sede || 'Todas'}</td>
        <td>${doc.asignaturas ? doc.asignaturas.join(', ') : 'Ninguna'}</td>
        <td style="display: flex; gap: 8px;">
          <button onclick="window.editarDocente('${doc.id}')" style="background:#4f46e5; color:white; border:none; padding:4px 8px; border-radius:5px; cursor:pointer;">✏️</button>
          <button onclick="window.eliminarDocente('${doc.id}')" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:5px; cursor:pointer;">🗑️</button>
        </td>
      </tr>
    `).join('');
  }
}

// Singleton instance
export const adminController = new AdminController();
