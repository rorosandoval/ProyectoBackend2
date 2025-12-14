# 🛒 Proyecto E-commerce Backend

## 📋 Descripción
Servidor backend de e-commerce desarrollado con Node.js, Express y MongoDB, implementando patrones de diseño profesionales (Repository, DTO), autenticación JWT, recuperación de contraseña y sistema de compras con generación de tickets.

## 🚀 Características Principales
- ✅ Patrón Repository y DAO
- ✅ Autenticación y autorización con JWT
- ✅ Sistema de recuperación de contraseña por email
- ✅ Carrito de compras con verificación de stock
- ✅ Generación de tickets de compra
- ✅ Envío de emails de confirmación
- ✅ Roles de usuario (user, admin, premium)

## 🔧 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env con tus credenciales:
# - MongoDB URI (desde MongoDB Atlas)
# - Credenciales de Gmail para envío de emails
# - Secretos JWT y de sesión
```

### 4. Ejecutar el proyecto
```bash
npm start
```

El servidor estará disponible en `http://localhost:8080`

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/sessions`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/register` | Registrar nuevo usuario | No | - |
| POST | `/login` | Iniciar sesión | No | - |
| GET | `/current` | Obtener usuario actual | JWT | - |
| POST | `/logout` | Cerrar sesión | JWT | - |
| POST | `/forgot-password` | Solicitar reset de contraseña | No | - |
| POST | `/reset-password/:token` | Restablecer contraseña | No | - |

### 👥 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Listar todos los usuarios | JWT | - |
| PUT | `/:uid` | Actualizar usuario | JWT | - |
| DELETE | `/:uid` | Eliminar usuario | JWT | - |

### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Listar productos (con filtros) | No | - |
| GET | `/:pid` | Obtener producto por ID | No | - |
| POST | `/` | Crear producto | JWT | Admin |
| PUT | `/:pid` | Actualizar producto | JWT | Admin |
| DELETE | `/:pid` | Eliminar producto | JWT | Admin |

**Query params para GET `/api/products`:**
- `page` - Número de página (default: 1)
- `limit` - Productos por página (default: 10)
- `sort` - Ordenar por precio: `asc` o `desc`
- `category` - Filtrar por categoría
- `status` - Filtrar por estado: `true` o `false`

### 🛒 Carritos (`/api/carts`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/` | Crear nuevo carrito | No | - |
| GET | `/:cid` | Obtener carrito por ID | JWT | - |
| POST | `/:cid/products/:pid` | Agregar producto al carrito | JWT | User |
| PUT | `/:cid/products/:pid` | Actualizar cantidad de producto | JWT | - |
| DELETE | `/:cid/products/:pid` | Eliminar producto del carrito | JWT | - |
| DELETE | `/:cid` | Vaciar carrito | JWT | - |
| POST | `/:cid/purchase` | Finalizar compra | JWT | - |

## 🔐 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **user** | Agregar productos al carrito, realizar compras |
| **admin** | Crear, editar y eliminar productos |


## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime
- **Express** - Framework web
- **MongoDB + Mongoose** - Base de datos
- **Passport.js** - Autenticación
- **JWT** - Tokens de sesión
- **Bcrypt** - Hash de contraseñas
- **Nodemailer** - Envío de emails
- **Handlebars** - Motor de plantillas

## 🛡️ Nota de Seguridad

Por razones de seguridad, el archivo `.env` con credenciales reales **NO** está incluido en este repositorio. 

Para ejecutar el proyecto:
1. Copia `.env.example` a `.env`
2. Configura tus propias credenciales (MongoDB, Gmail)
3. Ejecuta `npm start`

## 👨‍💻 Autor

**Rodrigo Sandoval**  
Proyecto Final - Backend CoderHouse

## 📄 Licencia

ISC