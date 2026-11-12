/**
 * Controlador de Autenticación
 * Vincula eventos HTML con AuthService
 * 
 * Responsabilidades:
 * - Capturar eventos de login
 * - Validar entrada de usuario
 * - Actualizar UI con resultado
 * - Manejar errores
 */

import { AuthService } from '../../domain/services/index.js';
import { supabaseDatasource } from '../../data/index.js';

export class AuthController {
  constructor() {
    this.currentUser = null;
    this.userType = null; // 'docente' | 'estudiante'
  }

  /**
   * Inicializa event listeners en el HTML
   * Se llama una sola vez al cargar la app
   */
  init() {
    console.log('🔐 AuthController inicializado');
    
    // Vincular botones de login
    this.bindLoginEstudiante();
    this.bindLoginDocente();
    this.bindLogout();
    
    // Validar sesión existente
    this.validarSesionExistente();
  }

  /**
   * Vincula evento de login de estudiante
   * HTML esperado: <button id="btn-login-estudiante">
   *                <input id="input-id-estudiante">
   */
  bindLoginEstudiante() {
    const btnLogin = document.getElementById('btn-login-estudiante') || document.getElementById('btn-login-est');
    const inputId = document.getElementById('input-id-estudiante') || document.getElementById('li-est-id');

    if (!btnLogin || !inputId) {
      console.warn('⚠️ Elementos de login estudiante no encontrados');
      return;
    }

    // Remover onclick legado para evitar doble ejecución
    btnLogin.removeAttribute('onclick');

    btnLogin.addEventListener('click', async () => {
      if (typeof window.estaEnMantenimientoEstudiantes === 'function' && window.estaEnMantenimientoEstudiantes()) {
        if (typeof window.actualizarEstadoMantenimientoEstudiantes === 'function') {
          window.actualizarEstadoMantenimientoEstudiantes();
        }
        return;
      }
      const identificacion = inputId.value.trim();

      if (!identificacion) {
        this.mostrarError('Ingresa tu identificación');
        return;
      }

      try {
        btnLogin.disabled = true;
        btnLogin.textContent = 'Autenticando...';

        const { success, student, error } = await AuthService.loginEstudiante(identificacion);

        if (success) {
          this.currentUser = student;
          this.userType = 'estudiante';
          this.mostrarExito('¡Bienvenido!');
          this.mostrarVistaPrincipal();
        } else {
          this.mostrarError(error || 'No se encontró el estudiante');
        }
      } catch (err) {
        this.mostrarError(err.message);
      } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = btnLogin.id === 'btn-login-est' ? 'Consultar Reporte' : 'Ingresar';
      }
    });
  }

  /**
   * Vincula evento de login de docente
   * HTML esperado: <form id="form-login-docente"> o <div id="form-docente">
   *                <input id="input-email-docente"> o <input id="li-user">
   *                <input id="input-password-docente"> o <input id="li-pass">
   *                <button type="submit"> o <button id="btn-login">
   */
  bindLoginDocente() {
    const form = document.getElementById('form-login-docente') || document.getElementById('form-docente');
    const btnLogin = document.getElementById('btn-login-docente') || document.getElementById('btn-login');

    if (!form && !btnLogin) {
      console.warn('⚠️ Elementos de login docente no encontrados');
      return;
    }

    // Remover onclick legado para evitar doble ejecución
    if (btnLogin) btnLogin.removeAttribute('onclick');

    const emailInput = document.getElementById('input-email-docente') || document.getElementById('li-user');
    const passwordInput = document.getElementById('input-password-docente') || document.getElementById('li-pass');

    const handleLogin = async (e) => {
      if (e) e.preventDefault();
      const email = emailInput?.value.trim();
      const password = passwordInput?.value;

      if (!email || !password) {
        this.mostrarError('Email y contraseña son requeridos');
        return;
      }

      try {
        const submitBtn = btnLogin || form?.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Autenticando...';
        }

        const { success, user, error } = await AuthService.loginDocente(email, password);

        if (success) {
          this.currentUser = user;
          this.userType = 'docente';
          this.mostrarExito('¡Bienvenido docente!');
          this.mostrarVistaPrincipal();
        } else {
          this.mostrarError(error || 'Email o contraseña incorrectos');
        }
      } catch (err) {
        this.mostrarError(err.message);
      } finally {
        const submitBtn = btnLogin || form?.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Ingresar como Docente';
        }
      }
    };

    if (form && form.tagName === 'FORM') {
      form.addEventListener('submit', handleLogin);
    } else if (btnLogin) {
      btnLogin.addEventListener('click', handleLogin);
    }
  }

  /**
   * Vincula evento de logout
   * HTML esperado: <button id="btn-logout">
   */
  bindLogout() {
    const logoutButtons = [];
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      logoutButtons.push(btnLogout);
    } else {
      const onclickButtons = document.querySelectorAll('button[onclick="logout()"]');
      onclickButtons.forEach(btn => logoutButtons.push(btn));
    }

    if (logoutButtons.length === 0) {
      console.warn('⚠️ Botón de logout no encontrado');
      return;
    }

    const handleLogout = async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      try {
        await AuthService.logout();
        this.currentUser = null;
        this.userType = null;
        this.mostrarExito('Sesión cerrada');
        this.mostrarVistaLogin();
      } catch (err) {
        this.mostrarError('Error al cerrar sesión');
      }
    };

    logoutButtons.forEach(btn => {
      btn.removeAttribute('onclick');
      btn.addEventListener('click', handleLogout);
    });
  }

  /**
   * Valida si ya hay sesión activa
   */
  async validarSesionExistente() {
    try {
      // 1. Prioridad a sesión de estudiante local
      const sId = localStorage.getItem('studentId');
      const sName = localStorage.getItem('studentName');
      if (sId && sName) {
        if (typeof window.estaEnMantenimientoEstudiantes === 'function' && window.estaEnMantenimientoEstudiantes()) {
          localStorage.removeItem('studentId');
          localStorage.removeItem('studentName');
          localStorage.removeItem('studentZipId');
          this.mostrarVistaLogin();
          if (typeof window.switchLoginMode === 'function') {
            window.switchLoginMode('estudiante');
          }
          return;
        }
        this.currentUser = { 
          estudiante_nombre: sName, 
          nombre: sName,
          student_id: sId, 
          identificacion: sId 
        };
        this.userType = 'estudiante';
        console.log('✅ Sesión activa de estudiante encontrada:', sName);
        this.mostrarVistaPrincipal();
        return;
      }

      // 2. Verificar docente con Supabase
      const client = supabaseDatasource.getClient();
      if (!client) {
        console.warn('Supabase client not initialized yet.');
        this.mostrarVistaLogin();
        return;
      }

      const { data: { session }, error } = await client.auth.getSession();

      if (error) throw error;

      if (session && session.user) {
        this.currentUser = session.user;
        this.userType = 'docente';
        console.log('✅ Sesión activa de docente encontrada:', session.user.email);
        this.mostrarVistaPrincipal();
      } else {
        this.mostrarVistaLogin();
      }
    } catch (err) {
      console.error('Error validando sesión:', err);
      this.mostrarVistaLogin();
    }
  }

  /**
   * Utilidades de UI
   */

  mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message') || document.getElementById('login-err');
    if (errorDiv) {
      errorDiv.textContent = `❌ ${mensaje}`;
      errorDiv.style.display = 'block';
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    } else {
      alert(`❌ ${mensaje}`);
    }
  }

  mostrarExito(mensaje) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
      successDiv.textContent = `✅ ${mensaje}`;
      successDiv.style.display = 'block';
      setTimeout(() => {
        successDiv.style.display = 'none';
      }, 3000);
    }
  }

  mostrarVistaLogin() {
    const loginSection = document.getElementById('section-login') || document.getElementById('login-mask');
    const mainSection = document.getElementById('section-main');

    if (loginSection) {
      loginSection.style.display = loginSection.id === 'login-mask' ? 'flex' : 'block';
    }
    if (mainSection) mainSection.style.display = 'none';
  }

  mostrarVistaPrincipal() {
    if (this.userType === 'estudiante') {
      if (typeof window.loguearExitosoEstudiante === 'function') {
        const nombre = this.currentUser.estudiante_nombre || this.currentUser.nombre || 'Estudiante';
        const id = this.currentUser.student_id || this.currentUser.identificacion || this.currentUser.zipgrade_id || '0000';
        window.loguearExitosoEstudiante(nombre, id);
      }
      return;
    }

    if (typeof window.loguearExitoso === 'function') {
      window.loguearExitoso(this.currentUser);
    } else {
      const loginSection = document.getElementById('section-login') || document.getElementById('login-mask');
      const mainSection = document.getElementById('section-main');

      if (loginSection) loginSection.style.display = 'none';
      if (mainSection) mainSection.style.display = 'block';
    }
  }

  /**
   * Getters públicos
   */

  getUsuarioActual() {
    return this.currentUser;
  }

  getTipodeUsuario() {
    return this.userType;
  }
}

// Singleton instance
export const authController = new AuthController();
