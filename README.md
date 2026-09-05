# Sistema de Reservaciones - Frontend (Cliente)

Interfaz de usuario tipo Single Page Application (SPA) para el Sistema de Reservaciones. Este módulo garantiza una experiencia fluida sin recargas de página y un diseño adaptable a dispositivos móviles (Responsive Web Design).

## 🚀 Características
* **Calendario Interactivo:** Integración gráfica de fechas y horarios mediante FullCalendar[cite: 2].
* **Navegación por Roles:** Paneles dedicados para administradores y usuarios con protección de rutas.
* **Diseño Responsive:** Maquetación adaptable desarrollada por Dev1 (Interfaz y Diseño)[cite: 1].

## 🛠️ Stack Tecnológico
* **Framework:** Angular[cite: 2].
* **Lenguaje:** TypeScript (tipado estricto)[cite: 2].
* **Componentes Visuales:** FullCalendar[cite: 2].
* **Despliegue:** Vercel / Netlify[cite: 2].

## ⚙️ Desarrollo Local
1. Clonar el repositorio.
2. Instalar dependencias con `npm install`.
3. Configurar las variables en `src/app/environment.ts` con la URL de la API de FastAPI.
4. Ejecutar el servidor de desarrollo con `ng serve`.

## 📁 Estructura de la aplicación

El código de la aplicación se organizará dentro de `src/app/` de acuerdo con la responsabilidad de cada elemento:

```text
src/app/
├── core/
│   ├── auth/             # Autenticación, sesión y gestión del token JWT
│   ├── guards/           # Protección de rutas según autenticación y roles
│   ├── interceptors/     # Inclusión del JWT y manejo común de peticiones HTTP
│   └── services/         # Servicios globales utilizados por toda la aplicación
├── features/
│   ├── calendario/       # Visualización y gestión de fechas disponibles
│   ├── espacios/         # Consulta y administración de espacios reservables
│   └── administracion/   # Funciones exclusivas para administradores
├── shared/
│   ├── components/       # Componentes visuales reutilizables
│   ├── directives/       # Directivas reutilizables para modificar el comportamiento de elementos
│   └── pipes/            # Transformación y presentación de datos
└── environment.ts        # URL de la API y configuración pública del cliente
```

### `core/`

Contiene la infraestructura central de la aplicación. Aquí se agregarán el servicio de autenticación, la administración de la sesión del usuario, los guards para restringir páginas y los interceptores HTTP para adjuntar el token JWT a las solicitudes. Estos elementos son globales y no deben duplicarse dentro de una funcionalidad específica.

### `features/`

Agrupa las funcionalidades del sistema por dominio. Cada módulo debe mantener cerca sus componentes, páginas, modelos y servicios relacionados. Por ejemplo, `calendario` se encargará de las fechas y horarios, `espacios` de los lugares disponibles y `administracion` de la gestión exclusiva para usuarios administradores.

### `shared/`

Incluye piezas que pueden utilizarse en varias funcionalidades sin pertenecer a un dominio concreto. Aquí vivirán componentes como botones, tablas o modales, además de pipes y directivas reutilizables. Los elementos de esta carpeta deben evitar depender de una funcionalidad específica.

### `environment.ts`

Centraliza la configuración pública que necesita el frontend para comunicarse con otros servicios. Actualmente contiene la URL base de la API y un espacio para llaves públicas. No se deben guardar contraseñas, tokens privados ni otros secretos, porque este archivo termina incluido en el código que recibe el navegador.
