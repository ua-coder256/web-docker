/**
 * CIMIENTOSPRO - CONSULTORÍA & INGENIERÍA CIVIL
 * Lógica de Interacción para el Portal Público (www.cimientospro.com)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFileUpload();
  initBudgetForm();
  initProjectFilters();
  initLocalFallbackLinks();
});

/**
 * Gestión de la barra de navegación y desplazamiento suave
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.main-nav');

  // Efecto de sombreado en scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(12, 15, 19, 0.96)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.background = 'rgba(18, 22, 28, 0.88)';
      header.style.boxShadow = 'none';
    }
  });

  // Toggle móvil
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '78px';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.background = '#12161c';
      navMenu.style.padding = '1.5rem';
      navMenu.style.borderBottom = '1px solid #2e3846';
    });
  }
}

/**
 * Gestión de la casilla de adjuntar planos (PDF y Word)
 */
function initFileUpload() {
  const uploadZone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('archivo-planos');
  const fileDisplay = document.getElementById('selected-file-display');
  const fileNameSpan = document.getElementById('selected-file-name');
  const removeFileBtn = document.getElementById('remove-file-btn');

  if (!uploadZone || !fileInput) return;

  // Drag and drop visual
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
    });
  });

  uploadZone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelected(fileInput.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
      handleFileSelected(fileInput.files[0]);
    }
  });

  function handleFileSelected(file) {
    const validExtensions = ['pdf', 'doc', 'docx'];
    const fileExt = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      alert(`⚠️ Formato no permitido. Solo se aceptan archivos técnicos en formato PDF, DOC o DOCX.`);
      fileInput.value = '';
      if (fileDisplay) fileDisplay.style.display = 'none';
      return;
    }

    // Tamaño máximo (50 MB)
    const maxSizeMB = 50;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`⚠️ El archivo seleccionado excede el límite de ${maxSizeMB} MB.`);
      fileInput.value = '';
      if (fileDisplay) fileDisplay.style.display = 'none';
      return;
    }

    const fileSizeKB = (file.size / 1024).toFixed(1);
    const sizeStr = fileSizeKB > 1024 ? `${(fileSizeKB / 1024).toFixed(2)} MB` : `${fileSizeKB} KB`;

    if (fileNameSpan) {
      fileNameSpan.textContent = `${file.name} (${sizeStr})`;
    }
    if (fileDisplay) {
      fileDisplay.style.display = 'flex';
    }
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.value = '';
      if (fileDisplay) {
        fileDisplay.style.display = 'none';
      }
    });
  }
}

/**
 * Envío y Validación del Formulario de Presupuesto
 */
function initBudgetForm() {
  const form = document.getElementById('form-presupuesto');
  const modal = document.getElementById('modal-confirmacion');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const expedienteSpan = document.getElementById('numero-expediente');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verificación de campos obligatorios
    const requiredInputs = form.querySelectorAll('[required]');
    let allValid = true;

    requiredInputs.forEach(input => {
      if (!input.value.trim() && input.type !== 'checkbox' && input.type !== 'file') {
        allValid = false;
        input.style.borderColor = '#ef4444';
      } else if (input.type === 'checkbox' && !input.checked) {
        allValid = false;
        input.style.outline = '2px solid #ef4444';
      } else {
        input.style.borderColor = '';
        input.style.outline = '';
      }
    });

    // Validar archivo de planos
    const fileInput = document.getElementById('archivo-planos');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('⚠️ Por favor adjunte los planos o croquis del proyecto en formato PDF o Word antes de enviar.');
      allValid = false;
      return;
    }

    if (!allValid) {
      alert('Por favor, complete todos los campos obligatorios marcados con asterisco (*).');
      return;
    }

    // Simulación de envío con animación de progreso
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
      </svg>
      Registrando Solicitud Técnica...
    `;

    setTimeout(() => {
      // Generar código de expediente aleatorio
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const code = `EXP-${year}-CP-${randomId}`;

      if (expedienteSpan) {
        expedienteSpan.textContent = code;
      }

      if (modal) {
        modal.classList.add('active');
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      const fileDisplay = document.getElementById('selected-file-display');
      if (fileDisplay) fileDisplay.style.display = 'none';
    }, 1200);
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/**
 * Filtros de proyectos
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-cat') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Interconexión Inteligente:
 * Si el usuario está probando directamente abriendo los archivos HTML locales (file:/// o localhost),
 * los enlaces a http://intranet.cimientospro.com ofrecen fallback automático local.
 */
function initLocalFallbackLinks() {
  const isLocalHost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.protocol === 'file:';

  if (isLocalHost) {
    const intranetLinks = document.querySelectorAll('a[href*="intranet.cimientospro.com"]');
    intranetLinks.forEach(link => {
      // Permite usar Ctrl+Click para ir al host real o enlace local directo si no hay DNS
      link.setAttribute('data-original-href', link.getAttribute('href'));
      link.addEventListener('click', (e) => {
        // Si no está configurado el archivo /etc/hosts, permitir navegación local directa
        if (!navigator.onLine || window.location.protocol === 'file:') {
          e.preventDefault();
          window.location.href = '../intranet/index.html';
        }
      });
    });
  }
}
