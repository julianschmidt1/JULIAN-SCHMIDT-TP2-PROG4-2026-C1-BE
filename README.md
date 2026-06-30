# Red Social - Backend

Backend de la aplicación Red Social desarrollado con NestJS para la materia Programación 4.

## Stack

* NestJS
* TypeScript
* MongoDB Atlas
* Mongoose
* Cloudinary
* Multer
* Streamifier
* Bcrypt
* Swagger
* Render

## Sprint 1

En este sprint se implementó la base del servidor, autenticación y persistencia de usuarios.

### Funcionalidades incluidas

* Creación del proyecto NestJS.
* Configuración de MongoDB Atlas.
* Configuración de variables de entorno.
* Conexión con Mongoose.
* Creación de módulos:
  * Auth
  * Users
  * Posts
  * Uploads
* Schema de usuario.
* Registro de usuario.
* Login de usuario.
* Validación de datos con DTOs.
* ValidationPipe global.
* Hasheo de contraseña con bcrypt.
* Validación de email único.
* Validación de username único.
* Subida de imagen de perfil a Cloudinary.
* Guardado de URL de imagen en MongoDB.
* Respuestas HTTP con status correctos.
* Swagger disponible para documentación y pruebas.
* CORS configurado para permitir consumo desde el frontend.

---

## Sprint 2

En este sprint se incorporó el módulo de publicaciones y las funcionalidades principales de interacción de la red social.

### Funcionalidades incluidas

#### Publicaciones

* Creación de publicaciones asociadas a un usuario.
* Soporte para publicaciones con o sin imagen.
* Subida de imágenes de publicaciones a Cloudinary.
* Baja lógica de publicaciones.
* Restricción de eliminación únicamente al autor o administrador.
* Obtención de publicaciones activas.
* Obtención de una publicación por identificador.
* Filtro de publicaciones por usuario.
* Ordenamiento por fecha de creación.
* Ordenamiento por cantidad de me gusta.
* Paginación mediante parámetros `offset` y `limit`.
* Validación de ObjectId para todos los endpoints correspondientes.

#### Me gusta

* Dar me gusta a publicaciones.
* Quitar me gusta de publicaciones.
* Restricción para evitar múltiples me gusta del mismo usuario.
* Cálculo de `likedByCurrentUser` para simplificar la integración con el frontend.

---

## Sprint 3

En este sprint se incorporó la autenticación completa basada en JWT y el módulo de comentarios.

### Funcionalidades incluidas

#### Autenticación

* Implementación completa de autenticación mediante JWT.
* Generación de token durante login y registro.
* Inclusión del identificador y rol del usuario dentro del payload del token.
* Vencimiento automático del token a los 15 minutos.
* Guard personalizado para proteger endpoints privados.
* Endpoint para validar sesiones activas (`/auth/authorize`).
* Endpoint para renovar tokens (`/auth/refresh`).
* Eliminación del uso de headers personalizados para identificar usuarios.

#### Comentarios

* Creación de comentarios asociados a publicaciones.
* Obtención paginada de comentarios.
* Ordenamiento de comentarios por fecha de creación.
* Edición únicamente por parte del autor del comentario.

#### Seguridad

* Protección mediante JWT de todas las operaciones privadas.
* Asociación automática del usuario autenticado utilizando la información del token.
* Restricción de permisos para modificación de publicaciones y comentarios.


---

## Sprint 4

En este sprint se incorporaron las funcionalidades de administración y estadísticas del sistema.

### Usuarios

* Listado de usuarios.
* Alta de usuarios por parte de administradores.
* Soporte para creación de administradores y usuarios comunes.
* Baja lógica de usuarios.
* Alta lógica de usuarios previamente deshabilitados.
* Restricción de acceso mediante permisos de administrador.
* Validación de usuarios deshabilitados durante el inicio de sesión.

### Estadísticas

* Endpoint de cantidad de publicaciones por usuario.
* Endpoint de cantidad de comentarios por período.
* Endpoint de cantidad de comentarios por publicación.
* Filtro por rango de fechas para todas las estadísticas.

### Seguridad

* Implementación de AdminGuard para proteger funcionalidades administrativas.
* Restricción de acceso a endpoints de administración y estadísticas.

## Endpoints principales

### Auth

```http
POST /auth/register
```

Registra un usuario nuevo. Recibe datos del usuario e imagen de perfil mediante `multipart/form-data`.

```http
POST /auth/login
```

Permite iniciar sesión mediante correo electrónico o nombre de usuario y contraseña.

### Posts

```http
POST /posts
```

Crea una nueva publicación asociada al usuario.

```http
GET /posts
```

Obtiene publicaciones permitiendo ordenar, filtrar y paginar resultados.

```http
GET /posts/:id
```

Obtiene una publicación específica.

```http
DELETE /posts/:id
```

Realiza la baja lógica de una publicación.

```http
POST /posts/:id/like
```

Permite dar me gusta a una publicación.

```http
DELETE /posts/:id/like
```

Permite quitar el me gusta de una publicación.

## Swagger

La documentación de la API está disponible en:

```text
/api/docs
```

## Variables de entorno

El proyecto requiere las siguientes variables:

```env
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Ejecución local

```bash
npm install
npm run start:dev
```

El servidor corre por defecto en:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Producción

El backend fue preparado para deploy en Render utilizando:

```bash
npm run start:prod
```