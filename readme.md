# 👤 Sistema de Autenticación de Usuarios - Class Zero Hands-On Labs

Una aplicación web full-stack construida con **Express.js**, **MongoDB** y **Passport.js** que implementa un sistema completo de autenticación y gestión de usuarios.

## 📋 Descripción General

Este proyecto es una plataforma de autenticación y gestión de perfiles de usuario que integra:
- **Backend REST API** con Node.js y Express
- **Base de datos** MongoDB con Mongoose
- **Autenticación** con Passport.js (Local y JWT)
- **Frontend interactivo** con Handlebars y HTML/CSS
- **Sesiones seguras** con express-session y MongoDB Store

## 🎯 Características Principales

- ✅ Registro e inicio de sesión de usuarios
- ✅ Hash seguro de contraseñas con bcrypt
- ✅ Gestión de sesiones con almacenamiento MongoDB
- ✅ Autenticación local y basada en JWT
- ✅ CRUD completo de usuarios via API REST
- ✅ Interfaz web responsive con Handlebars
- ✅ Validación de datos y manejo de errores

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js
- **Framework Web**: Express.js (v4.21.2)
- **Base de Datos**: MongoDB con Mongoose (v7.8.7)
- **Autenticación**: Passport.js (v0.7.0)
  - Passport Local (v1.0.0)
  - Passport JWT (v4.0.1)
- **Seguridad**: 
  - bcrypt (v6.0.0) - Hashing de contraseñas
  - cookie-parser (v1.4.7)
  - express-session (v1.18.2)
  - connect-mongo (v5.1.0)
- **Otros**: 
  - dotenv (v17.2.3) - Variables de entorno
  - jsonwebtoken (v9.0.2)

### Frontend
- **Template Engine**: Express Handlebars (v8.0.3)
- **Lenguajes**: HTML, CSS, JavaScript
- **Almacenamiento Cliente**: Cookies

### Desarrollo
- **Task Runner**: nodemon (v3.1.10) - Auto-reload

## 📁 Estructura del Proyecto

```
hands-on-labs/
├── src/
│   ├── app.js                    # Configuración principal de Express
│   ├── config/
│   │   └── passport.config.js    # Estrategias de autenticación Passport
│   ├── middlewares/
│   │   └── auth.js               # Middlewares de autenticación
│   ├── models/
│   │   └── userModel.js          # Schema de usuarios MongoDB
│   ├── routes/
│   │   ├── userRouter.js         # Endpoints CRUD /api/users
│   │   ├── sessionsRouter.js     # Endpoints de sesión /api/sessions
│   │   └── viewsRouter.js        # Rutas de vistas y páginas
│   ├── views/
│   │   ├── login.handlebars      # Página de inicio de sesión
│   │   ├── register.handlebars   # Página de registro
│   │   ├── home.handlebars       # Página principal
│   │   └── layouts/
│   │       └── main.handlebars   # Layout base
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css         # Estilos
│   │   └── js/
│   │       ├── login.js          # Lógica frontend login
│   │       └── register.js       # Lógica frontend registro
│   └── utils.js                  # Funciones utilitarias
├── package.json                  # Dependencias y scripts
└── .env                          # Variables de entorno (no incluir en repo)
```

## 🚀 Instalación y Setup

### Requisitos Previos
- **Node.js** (v16 o superior)
- **MongoDB** (local o Atlas)
- **npm** o **yarn**

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd hands-on-labs
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   # MongoDB
   MONGO_URI=mongodb://localhost:27017/class-zero
   # O si usas MongoDB Atlas:
   # MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/class-zero
   
   # Sesiones
   SESSION_SECRET=tu_secreto_super_seguro_aqui
   
   # Servidor
   PORT=8080
   ```

4. **Iniciar la aplicación**
   ```bash
   npm start
   ```

5. **Acceder a la aplicación**
   ```
   http://localhost:8080
   ```

## 📡 API REST Endpoints

### Usuarios (`/api/users`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/users` | Obtener todos los usuarios |
| `GET` | `/api/users/:id` | Obtener usuario por ID |
| `POST` | `/api/users` | Crear nuevo usuario |
| `PUT` | `/api/users/:id` | Actualizar usuario |
| `DELETE` | `/api/users/:id` | Eliminar usuario |

### Sesiones (`/api/sessions`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/sessions/login` | Iniciar sesión |
| `POST` | `/api/sessions/logout` | Cerrar sesión |
| `GET` | `/api/sessions/current` | Obtener sesión actual |

### Vistas (`/`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Página principal |
| `GET` | `/login` | Formulario de inicio de sesión |
| `GET` | `/register` | Formulario de registro |

## 📊 Modelo de Datos - Usuario

```javascript
{
  name: String,        // Nombre del usuario (requerido)
  age: Number,         // Edad (requerido)
  email: String,       // Email (requerido, único)
  password: String,    // Contraseña hasheada (requerido)
  createdAt: Date,     // Fecha de creación
  updatedAt: Date      // Fecha de última actualización
}
```

## 🔐 Autenticación

### Flujo de Autenticación
1. Usuario completa formulario de registro
2. Contraseña se hashea con bcrypt
3. Usuario se crea en MongoDB
4. En login, Passport valida credenciales
5. Se crea sesión en MongoDB Store
6. Cookie de sesión se envía al cliente

### Estrategias Soportadas
- **Local**: Usuario y contraseña
- **JWT**: Token basado en JWT para APIs

## 🧪 Testing con Postman

Ejemplos de requests:

### Registrar Usuario
```bash
POST http://localhost:8080/api/sessions/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "age": 25,
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

### Iniciar Sesión
```bash
POST http://localhost:8080/api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

### Obtener Usuarios
```bash
GET http://localhost:8080/api/users
```

## 📝 Variables de Entorno

Ejemplo de archivo `.env`:
```env
# Base de Datos
MONGO_URI=mongodb://localhost:27017/class-zero

# Sesiones
SESSION_SECRET=tu_secreto_unico_y_seguro_2024

# Servidor
PORT=8080
NODE_ENV=development
```

## 🔧 Scripts Disponibles

```bash
# Iniciar servidor con hot-reload (desarrollo)
npm start

# Ejecutar tests (no configurados aún)
npm test
```

## 📚 Librerías Principales

- **express**: Framework web minimalista
- **mongoose**: ODM para MongoDB
- **passport**: Middleware de autenticación flexible
- **bcrypt**: Hashing criptográfico de contraseñas
- **express-session**: Gestión de sesiones
- **express-handlebars**: Motor de plantillas
- **dotenv**: Gestión de variables de entorno

## 🚨 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sesiones almacenadas en MongoDB
- ✅ Variables sensibles en `.env` (no en el repo)
- ✅ CORS y validación de entrada
- ✅ Cookies seguras y HttpOnly

---

**Rodrigo Sandoval | Noviembre 2025**
