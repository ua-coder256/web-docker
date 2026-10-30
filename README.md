# CimientosPro - Consultoría & Ingeniería Civil
## Planificación, Arquitectura y Despliegue de Presencia Web (Módulo WEAP)

Este repositorio contiene la arquitectura completa, código fuente, recursos multimedia y configuración de servidores web para **CimientosPro**, consultora técnica especializada en ingeniería civil, cálculo de estructuras y geotecnia.

---

## 1. Arquitectura de Sitios y Virtual Hosts Basados en Nombre

La infraestructura web está dividida en dos portales independientes mediante **Virtual Hosts basados en nombre** sobre el puerto HTTP 80:

| Portal | Dominio FQDN | Directorio Raíz (`DocumentRoot`) | Acceso / Perfil |
| :--- | :--- | :--- | :--- |
| **Sitio Corporativo Público** | `http://www.cimientospro.com` | `/web/www/` | Público (Clientes, promotores, solicitud de presupuestos) |
| **Intranet Técnica Privada** | `http://intranet.cimientospro.com` | `/web/intranet/` | Protegido con login (Ingenieros, calculistas, personal interno) |
| **Portainer (Docker)** | `http://portainer.cimientospro.com` | Proxy Inverso :9000 | Gestión de contenedores y microservicios |
| **VSCode (code-server)** | `http://code.cimientospro.com` | Proxy Inverso :8443 | IDE remoto en nube para cálculo matricial y Python |
| **Duplicati Backup** | `http://backup.cimientospro.com` | Proxy Inverso :8200 | Copias de seguridad continuas y cifrado AES-256 |

---

## 2. Mapa y Organización de los Sitios

### A. Sitio Web Corporativo Público (`www.cimientospro.com`)
- **Cabecera (Header):**
  - Logotipo vectorial isométrico corporativo.
  - Menú de navegación rápida (Inicio, Servicios Técnicos, Proyectos, Normativa Técnica, Contacto).
  - Botón de interconexión directa hacia la Intranet (`http://intranet.cimientospro.com`).
  - Botón de llamada a la acción ("Solicitar presupuesto").
- **Bloque de Bienvenida (Hero Section):**
  - Imagen fotográfica realista de gran obra de infraestructura civil en construcción (viaducto y grúas).
  - Título de impacto visual: *"Solidez, Precisión y Vanguardia en Obra Civil e Infraestructura"*.
  - Llamada a la acción con scroll suave hacia el formulario.
  - Métricas corporativas (+280 proyectos, 100% cumplimiento normativo, 25 años de experiencia).
- **Servicios Técnicos Especializados:**
  1. *Cálculo de Estructuras:* Análisis por elementos finitos (MEF), estructuras de hormigón armado, pretensado y metálicas (fotografía de planos técnicos y análisis en tablet).
  2. *Estudios Geotécnicos:* Campañas de sondeos mecánicos, ensayos SPT y dimensionamiento de cimentaciones (fotografía de casco de seguridad, testigos de sondeos y maquinaria).
  3. *Dirección de Obras Civiles:* Supervisión técnica de trazas viarias, control de calidad y seguridad y salud (fotografía de maquinaria pesada de excavación y dirección de obra).
- **Proyectos de Referencia:**
  - Viaducto del Ebro (Tramo II).
  - Ampliación de Terminal Portuaria con pantalla de pilotes.
  - Variante Sur y Enlace Autovía A-66.
- **Normativa Técnica Vigente & Enlaces Oficiales:**
  - [Código Técnico de la Edificación (CTE)](https://codigotecnico.org)
  - [Código Estructural de Obras Civiles (MITMA)](https://transportes.gob.es)
  - [Repositorio Oficial del Proyecto en GitHub](https://CimientosGit.com)
- **Formulario de Contacto y Presupuesto:**
  - Recogida de datos obligatoria: Nombre/Razón Social, CIF/NIF, Email, Teléfono, Especialidad, Localización, Plazo y Descripción.
  - **Casilla interactiva para adjuntar planos:** Admite exclusivamente archivos en formato **PDF (.pdf)** o **Microsoft Word (.doc, .docx)** con drag-and-drop, validación de extensión y previsualización.
  - Modal interactivo con generación de número de expediente técnico (ej. `EXP-2026-CP-XXXX`).
- **Pie de Página (Footer):**
  - Información de contacto, sedes de Madrid, enlaces de interconexión y certificaciones ISO.

---

### B. Sitio Web de la Intranet Privada (`intranet.cimientospro.com`)
- **Pantalla de Login:**
  - Formulario seguro con autenticación de usuario, contraseña, departamento y opción de recordar sesión.
  - Credenciales preconfiguradas para pruebas/evaluación:
    - **Usuario:** `admin`
    - **Contraseña:** `cimientos2026`
  - Botón de retorno bidireccional hacia la web corporativa (`http://www.cimientospro.com`).
- **Panel de Aplicaciones (Dashboard):**
  - Barra superior con información de conexión local (LAN 192.168.1.100), reloj en tiempo real del servidor y usuario autenticado.
  - **Tarjetas dedicadas para cada herramienta con accesos directos:**
    1. **Portainer:** Acceso directo a `http://portainer.cimientospro.com` para gestión de contenedores Docker y microservicios.
    2. **VSCode (code-server):** Acceso directo a `http://code.cimientospro.com` para desarrollo y ejecución remota de scripts de cálculo en Python/C++.
    3. **Duplicati:** Acceso directo a `http://backup.cimientospro.com` para copias de seguridad continuas y cifradas en AES-256.
  - **Consola de Diagnóstico & Ping de Subdominios:**
    - Comprobación interactiva en tiempo real del estado de respuesta (HTTP 200 OK y latencia en ms) de cada subdominio.
  - **Enlaces Rápidos de Normativa y Repositorio Git:**
    - Accesos al CTE, Código Estructural y a `https://CimientosGit.com`.

---

## 3. Paleta de Colores y Estilo Corporativo

- **Tonos Grises Oscuros:** `#0c0f13`, `#12161c`, `#181d24` (Simulación de hormigón pulido, asfalto y acero estructural).
- **Azul Técnico:** `#0284c7`, `#38bdf8` (Delineación CAD, planos técnicos, menús de navegación y enlaces informáticos).
- **Naranja de Seguridad Vial:** `#ff6b00`, `#f97316` (Elementos de llamada a la acción, botones principales, avisos y resalte de alta visibilidad).
- **Verde Estado:** `#10b981` (Indicadores de servicio activo y estado en línea de los servidores).

---

## 4. Despliegue de los Virtual Hosts en Servidor Web

### Opción A: Probar Directamente en Navegador Local
Abra el archivo `index.html` situado en la raíz de este proyecto. Dispondrá de un **Hub Interactivo** con simulador en vivo que permite alternar entre el portal público y la intranet sin necesidad de configurar un servidor web.

### Opción B: Configuración en Servidor Apache 2.4 / XAMPP

1. Copie el contenido del archivo `vhosts/cimientospro-apache.conf` en la configuración de Virtual Hosts de Apache (por ejemplo, en `httpd-vhosts.conf` o `/etc/apache2/sites-available/cimientospro.conf`).
2. Habilite el sitio y los módulos requeridos (`proxy`, `proxy_http`):
   ```bash
   sudo a2ensite cimientospro.conf
   sudo a2enmod proxy proxy_http
   sudo systemctl restart apache2
   ```

### Opción C: Resolución de Nombres en el Archivo `hosts`

Para que el navegador resuelva los dominios localmente, añada las siguientes líneas en:
- **Windows:** `C:\Windows\System32\drivers\etc\hosts` (abrir Notepad como Administrador)
- **Linux:** `/etc/hosts` (`sudo nano /etc/hosts`)

```text
127.0.0.1   www.cimientospro.com
127.0.0.1   cimientospro.com
127.0.0.1   intranet.cimientospro.com
127.0.0.1   portainer.cimientospro.com
127.0.0.1   code.cimientospro.com
127.0.0.1   backup.cimientospro.com
```

---

## 5. Estructura de Directorios del Proyecto

```text
web/
├── index.html                     # Hub central interactivo y visor de ambos portales
├── README.md                      # Memoria técnica y documentación de planificación
├── www/                           # DocumentRoot para www.cimientospro.com
│   ├── index.html                 # Landing page pública corporativa
│   ├── css/
│   │   └── styles.css             # Estilos de ingeniería civil y diseño responsive
│   ├── js/
│   │   └── main.js                # Validación, subida de planos (PDF/DOC) y modal
│   └── assets/
│       ├── hero_civil_engineering.jpg   # Fotografía de gran obra civil
│       ├── service_estructuras.jpg       # Imagen de planos técnicos y análisis MEF
│       ├── service_geotecnia.jpg         # Imagen de sondeos geotécnicos y casco
│       └── service_obras.jpg             # Imagen de maquinaria pesada y dirección
├── intranet/                      # DocumentRoot para intranet.cimientospro.com
│   ├── index.html                 # Portal privado (Login + Dashboard de herramientas)
│   ├── css/
│   │   └── intranet.css           # Estilos de la consola técnica y tarjetas
│   ├── js/
│   │   └── intranet.js            # Lógica de login, sesión, ping y retorno
│   └── assets/                    # Recursos multimedia compartidos
└── vhosts/                        # Archivos de configuración de servidor web
    ├── cimientospro-apache.conf   # Configuración de Virtual Hosts para Apache
    └── hosts-config.txt           # Mapeo DNS para el archivo hosts
```
