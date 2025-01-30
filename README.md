# 🚀 Proyecto Docker-MongoDB

Este proyecto configura un entorno de base de datos MongoDB con Docker, permitiendo a múltiples usuarios conectarse a una base de datos compartida. Incluye:

✅ **MongoDB**: Base de datos NoSQL.
✅ **Mongo Express**: Interfaz web para gestionar MongoDB.
✅ **Nginx**: Servidor proxy opcional.

## 📌 1. Instalación y Configuración

### 🔹 **Requisitos Previos**
Antes de empezar, asegúrate de tener instalado:
- Docker y Docker Compose
- Acceso a una máquina virtual o servidor con IP fija (ej. `192.168.50.190` Recuerda, esta IP es un ejemplo. )

### 🔹 **Descargar el Proyecto**
Clona el repositorio en la máquina donde se ejecutará MongoDB:
```sh
git clone https://github.com/isaiasfl/utilidades-docker-mongodb.git
cd docker-mongodb
```

### 🔹 **Levantar los Contenedores**
Ejecuta el siguiente comando para iniciar MongoDB y Mongo Express:
```sh
docker-compose up -d
```

Esto iniciará los siguientes servicios:
- **MongoDB** en `192.168.50.190:27017`  He SUPUESTO que la ip de la máquina que contiene el contenedor es la 192.168.50.190. Obviamente se cambiará por la **REAL**
- **Mongo Express** en `http://192.168.50.190:8081/`

## 📌 2. Acceso a MongoDB

### 🔹 **Desde Mongo Express (Interfaz Web)**
Abre un navegador y accede a `http://192.168.50.78:8081/` con estas credenciales:
- **Usuario:** `admin`
- **Contraseña:** `hlanz`

📌 **El usuario `admin` tiene control total sobre todas las bases de datos y puede crear nuevas bases de datos, modificar permisos y gestionar el sistema MongoDB.**

### 🔹 **Desde MongoDB Compass (Aplicación de Escritorio)**
1. Descarga e instala [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Conéctate con la siguiente URI:
   ```
   mongodb://chatapp:hlanz@192.168.50.78:27017/chat
   ```
3. Explora las colecciones y añade datos de prueba.

Si necesitas acceso total, usa el perfil de administrador:
   ```
   mongodb://admin:hlanz@192.168.50.78:27017/
   ```

### 🔹 **Desde Node.js (Backend de los Alumnos)**
Los alumnos pueden conectarse desde su backend en Node.js con:
```js
const { MongoClient } = require("mongodb");
const uri = "mongodb://chatapp:hlanz@192.168.50.78:27017/chat";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");
    return client.db("chat");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
}
```

## 📌 3. Añadir Usuarios y Mensajes

### 🔹 **Añadir Usuarios a la Base de Datos**
```js
const db = await connectDB();
await db.collection("users").insertOne({ username: "alumno1", password: "clave123" });
```

### 🔹 **Enviar Mensajes en el Chat**
```js
const message = {
  username: "alumno1",
  text: "¡Hola mundo!",
  timestamp: new Date()
};
await db.collection("messages").insertOne(message);
```

## 📌 4. Administración y Solución de Problemas

### 🔹 **Reiniciar Contenedores**
```sh
docker-compose down && docker-compose up -d
```

### 🔹 **Ver Logs de MongoDB**
```sh
docker logs chat-mongodb
```

### 🔹 **Acceder a MongoDB desde la Terminal**
```sh
docker exec -it chat-mongodb mongosh -u admin -p hlanz --authenticationDatabase admin
```

## 📌 5. Mis Recomendaciones
✔️ **Restringir accesos externos** si solo alumnos internos deben conectarse.
✔️ **No usar el usuario `admin` de manera indiscriminada** para evitar cambios accidentales.
✔️ **Usar autenticación con `bcrypt` y JWT** para proteger credenciales de los usuarios.

---
