# 🚀 Backend Test API

## 📌 Descripción
Este es un backend desarrollado con **NestJS**, **MongoDB** y **Docker**. Implementa autenticación con JWT, documentación con Swagger y envío de correos con **Resend**.

---

## 📦 Requisitos Previos
Asegúrate de tener instalados los siguientes programas:
- **Docker** ([Descargar aquí](https://www.docker.com/get-started))
- **Node.js** (versión 18 o superior) ([Descargar aquí](https://nodejs.org/))
- **Yarn** ([Descargar aquí](https://yarnpkg.com/))

---

## 🔧 Instalación y Configuración
### 1️⃣ **Clonar el Repositorio**
```bash
git clone <URL_DEL_REPOSITORIO>
cd backend-test
```
### 2️⃣ **Configurar Variables de Entorno**
Crea un archivo `.env` en la raíz del proyecto y copia el siguiente contenido:
```env
MONGO_URI=
JWT_SECRET=
JWT_EXPIRATION=
RESEND_API_KEY=
EMAIL_FROM=
```
📌 **Nota:** Este archivo `.env` y las variables completas se adjuntaron en el correo enviado para facilitar la configuración.

---

## 🐳 Ejecución con Docker
### 🚀 **Iniciar el Proyecto**
Ejecuta el siguiente comando para construir y levantar los contenedores:
```bash
docker-compose up --build -d
```
📌 Esto iniciará:
- Un contenedor de **MongoDB** en el puerto `27017`
- Un contenedor del backend en el puerto `3000`

### 🛑 **Detener los Contenedores**
```bash
docker-compose down
```

---

## 🌱 Semillas de Datos
Para poblar la base de datos con usuarios de prueba, ejecuta:
```bash
yarn seed
```
📌 Esto creará usuarios de prueba en la base de datos si no existen.

Si deseas **eliminar toda la base de datos**, ejecuta:
```bash
yarn clear-db
```

---

## 📖 Documentación con Swagger
Después de iniciar el servidor, accede a la documentación en:
```
http://localhost:3000/api
```
Aquí encontrarás todos los **endpoints disponibles**, con detalles sobre los parámetros esperados y ejemplos de respuesta.

---

## 🔐 Autenticación con JWT
Para realizar llamadas a los **endpoints protegidos**, es necesario autenticarse.
### 🏷 **1️⃣ Iniciar Sesión**
```http
POST http://localhost:3000/auth/login
```
📌 **Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
📌 **Respuesta:**
```json
{
  "access_token": "TOKEN_AQUI"
}
```
### 🔑 **2️⃣ Usar el Token en las Peticiones Protegidas**
En cada **petición protegida**, agrega el token en el **header**:
```
Authorization: Bearer TOKEN_AQUI
```

---

## 📬 Recuperación de Contraseña
### 1️⃣ **Solicitar Recuperación**
```http
POST http://localhost:3000/auth/forgot-password
```
📌 **Body:**
```json
{
  "email": "user@example.com"
}
```
📌 Se enviará un **correo con un enlace para restablecer la contraseña**.

### 2️⃣ **Restablecer Contraseña**
```http
POST http://localhost:3000/auth/reset-password
```
📌 **Body:**
```json
{
  "token": "TOKEN_RECIBIDO_EN_EL_CORREO",
  "newPassword": "nuevaPassword123"
}
```

---

## 📌 Endpoints Principales
### 👤 **Usuarios** (`/users`)
- `GET /users/AllUsers` → Obtener todos los usuarios
- `GET /users/UserDetails/:id` → Obtener detalles de un usuario
- `PUT /users/updateUser/:id` → **Modificar solo el nombre** de un usuario
- `DELETE /users/deleteUser/:id` → Eliminar usuario

### 🔑 **Autenticación** (`/auth`)
- `POST /auth/login` → Iniciar sesión
- `POST /auth/forgot-password` → Solicitar cambio de contraseña
- `POST /auth/reset-password` → Cambiar contraseña
- `POST /auth/refresh-token` → Refrescar token

---

## 📌 Enlace al Repositorio Público
🔗 [GitHub Repository](https://github.com/jbayron09/backend-test)

---

## 📌 Contacto
Si tienes dudas o necesitas soporte, puedes escribirme a **[j.bayron.b@gmail.com]**.

🚀 **¡Gracias por revisar el proyecto!**
