# Sistema-Escolar

**Descripción**
- **Propósito**: `Sistema-Escolar` es una aplicación web simple de gestión académica. Permite registro y autenticación de usuarios con roles (`estudiante`, `profesor`, `admin`), creación y administración de cursos, inscripción a cursos y un panel de administración para gestionar usuarios y cursos.

**Características principales**
- **Autenticación**: Registro e inicio de sesión con gestión de sesiones.
- **Roles**: Control de acceso por rol (`estudiante`, `profesor`, `admin`).
- **Cursos**: CRUD de cursos (crear, listar, editar, eliminar). Profesores pueden gestionar sus cursos.
- **Inscripciones**: Estudiantes pueden inscribirse en cursos; duplicados prevenidos por índice único.
- **Panel de administración**: Ver/editar/ eliminar usuarios y cursos; ordenamiento de usuarios por rol.
- **Mensajes flash**: Mensajes de éxito/error mostrados en UI mediante `req.session.flash`.
- **Protección de datos**: `.env` se ignora en `.gitignore`.

**Tecnologías**
- **Node.js** + **Express** (ESM)
- **MongoDB** con **Mongoose**
- **EJS** templates (server-side rendering)
- **express-session** para sesiones
- Estructura de proyecto en `src/` con `controllers`, `models`, `routes`, y `views`.

**Estructura importante**
- `server.js`: punto de entrada de la app.
- `package.json`: dependencias y scripts.
- `src/models/`:
	- `User.js` — usuario (nombre, correo, contraseña, rol).
	- `Course.js` — curso (título, descripción, profesor, fecha).
	- `Enrollment.js` — inscripción (estudiante, curso) con índice único para evitar duplicados.
- `src/controllers/`: lógica para `authController`, `courseController`, `enrollmentController`, `adminController`.
- `src/routes/`: rutas agrupadas por responsabilidad (`authRoutes`, `courseRoutes`, `adminRoutes`, etc.).
- `src/views/`: plantillas EJS (incluye `auth/`, `courses/`, `admin/`, `partials/`).
- `public/css/styles.css`: estilos globales y utilidades (`.btn`, `.flash`, estilos admin).

**Instalación y ejecución local**
1. Clona el repositorio:

```powershell
git clone <repo-url>
cd Sistema-Escolar
```

2. Instala dependencias:

```powershell
npm install
```

3. Crea un archivo `.env` en la raíz con las variables necesarias (ejemplo mínimo):

```text
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sistema-escolar
SESSION_SECRET=tu_secreto_aqui
```

4. Asegúrate de que `.env` no esté en el repositorio (ya está en `.gitignore`).

5. Ejecuta la aplicación en modo desarrollo:

```powershell
npm run dev
```

6. Abre `http://localhost:3000` en el navegador.

**Rutas y comportamiento clave**
- `GET /login`, `POST /login`: inicio de sesión. En fallos redirige a `/login` con flash `Correo o Contraseña incorrectos`.
- `GET /register`, `POST /register`: registro. La vista solicita confirmación de contraseña y el servidor valida que ambas coincidan.
- `GET /admin`: panel de administración (solo `admin`) que muestra usuarios (ordenados por rol) y cursos.
- `POST /admin/delete-user/:id`: elimina usuario (solo `admin`).
- Rutas para cursos y inscripciones están definidas en `src/routes/courseRoutes.js` y `src/routes/enrollmentRoutes.js`.

**Notas de seguridad y comportamiento**
- Las contraseñas se almacenan hasheadas usando `bcrypt` (ver `src/models/User.js`).
- No se permite que un administrador edite otro administrador desde la UI; además, los controladores validan y rechazan intentos directos por seguridad.
- Para consistencia de datos, al eliminar un curso se eliminan primero las inscripciones relacionadas (`Enrollment.deleteMany`) para evitar documentos huérfanos.

**Desarrollo y pruebas manuales**
- Para probar fallos de login: intenta acceder con credenciales incorrectas y confirma que aparece el mensaje flash en `/login`.
- Para probar registro: completa el formulario en `/register` con `contraseña` y `contraseñaConfirm` distintos y confirma el mensaje de validación.

**Mejoras sugeridas**
- Implementar validación y sanitización más completa (p. ej. `express-validator`).
- Añadir pruebas automatizadas (Jest + Supertest).
- Mover la lógica de cascade-delete a middleware de Mongoose o usar transacciones para mayor atomicidad.

**Contribuir**
- Abre un issue o un PR para cualquier mejora o corrección.

**Licencia**
- Ver `LICENSE` en el repositorio.



