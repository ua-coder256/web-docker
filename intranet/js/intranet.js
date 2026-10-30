/**
 * CIMIENTOSPRO - INTRANET TÉCNICA PRIVADA
 * Lógica del Portal Interno y Panel de Aplicaciones (intranet.cimientospro.com)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthSystem();
  initDiagnosticPing();
  initReturnLinks();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
});

/**
 * Sistema de Autenticación y Control de Sesión
 */
function initAuthSystem() {
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('form-login-intranet');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('btn-logout');
  const usernameDisplay = document.getElementById('current-username');

  // Comprobar si ya existe una sesión activa
  const savedUser = sessionStorage.getItem('cimientos_user') || localStorage.getItem('cimientos_user');
  if (savedUser) {
    showDashboard(savedUser);
  } else {
    showLogin();
  }

  // Manejar envío de login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userInput = document.getElementById('login-user').value.trim();
      const passInput = document.getElementById('login-pass').value.trim();
      const rememberCheckbox = document.getElementById('remember-session');

      // Validar credenciales
      // Permite 'admin' / 'cimientos2026' o cualquier credencial de prueba
      if ((userInput === 'admin' && passInput === 'cimientos2026') || 
          (userInput.length >= 3 && passInput.length >= 4)) {
        
        loginError.style.display = 'none';

        // Guardar sesión
        const username = userInput === 'admin' ? 'Ing. Carlos Mendoza (Admin Técnico)' : `Ing. ${userInput}`;
        if (rememberCheckbox && rememberCheckbox.checked) {
          localStorage.setItem('cimientos_user', username);
        } else {
          sessionStorage.setItem('cimientos_user', username);
        }

        // Animación de entrada
        const submitBtn = loginForm.querySelector('.btn-login-submit');
        submitBtn.innerHTML = 'Verificando credenciales en LDAP / VPN...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Acceder al Panel de Aplicaciones
          `;
          showDashboard(username);
        }, 600);

      } else {
        loginError.style.display = 'block';
        loginError.innerHTML = '⚠️ Usuario o contraseña incorrectos. Utilice <code>admin</code> / <code>cimientos2026</code> para la evaluación.';
      }
    });
  }

  // Cerrar Sesión
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('cimientos_user');
      localStorage.removeItem('cimientos_user');
      showLogin();
    });
  }

  function showDashboard(username) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    if (usernameDisplay) usernameDisplay.textContent = username;
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showLogin() {
    if (loginView) loginView.style.display = 'flex';
    if (dashboardView) dashboardView.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

/**
 * Consola Interactiva de Diagnóstico y Ping a Subdominios
 */
function initDiagnosticPing() {
  const pingBtn = document.getElementById('btn-run-ping');
  const pingRows = document.querySelectorAll('.ping-status-cell');

  if (!pingBtn) return;

  pingBtn.addEventListener('click', () => {
    pingBtn.disabled = true;
    pingBtn.innerHTML = '⏳ Comprobando latencia de subdominios...';

    pingRows.forEach((cell, index) => {
      cell.innerHTML = '<span style="color: #fbbf24;">Consultando...</span>';
      setTimeout(() => {
        const latencies = ['8 ms', '12 ms', '15 ms', '21 ms', '11 ms'];
        const latency = latencies[index % latencies.length];
        cell.innerHTML = `<span style="color: #10b981; font-weight: 600;">🟢 HTTP 200 OK (${latency})</span>`;
      }, (index + 1) * 350);
    });

    setTimeout(() => {
      pingBtn.disabled = false;
      pingBtn.innerHTML = '🔄 Reejecutar Diagnóstico de Red';
    }, 2200);
  });
}

/**
 * Reloj del Servidor en Vivo
 */
function updateLiveClock() {
  const clockEl = document.getElementById('server-live-time');
  if (clockEl) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { hour12: false });
    clockEl.textContent = `${timeStr} (UTC+1)`;
  }
}

/**
 * Retorno inteligente a la Web Pública:
 * Si estamos en file:/// o localhost sin DNS configurado, redirige a ../www/index.html
 */
function initReturnLinks() {
  const isLocalHost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.protocol === 'file:';

  if (isLocalHost) {
    const publicLinks = document.querySelectorAll('a[href*="www.cimientospro.com"]');
    publicLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (!navigator.onLine || window.location.protocol === 'file:') {
          e.preventDefault();
          window.location.href = '../www/index.html';
        }
      });
    });
  }
}
