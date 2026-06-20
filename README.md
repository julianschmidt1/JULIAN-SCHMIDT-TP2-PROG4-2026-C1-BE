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
