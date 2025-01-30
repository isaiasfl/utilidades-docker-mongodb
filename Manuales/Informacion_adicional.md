### **📌 ¿Pueden los alumnos añadir más usuarios a `chat` o crear más bases de datos?**

Depende de los **permisos del usuario con el que se conecten a MongoDB**. En tu configuración actual, tienes dos usuarios creados en `mongo-init.js`:

#### **1️⃣ Usuario `root` (Administrador)**

```js
db = db.getSiblingDB("admin");

db.createUser({
  user: "root",
  pwd: "hlanz",
  roles: [{ role: "root", db: "admin" }],
});
```

🔹 **Este usuario tiene control total sobre MongoDB** (puede crear bases de datos, modificar permisos, borrar datos, etc.).  
🔹 **Tus alumnos no deberían usarlo, porque podrían cambiar toda la configuración.**

---

#### **2️⃣ Usuario `chatapp` (Usuario de la base de datos `chat`)**

```js
db = db.getSiblingDB("chat");

db.createUser({
  user: "chatapp",
  pwd: "hlanz",
  roles: [
    {
      role: "readWrite",
      db: "chat",
    },
  ],
});
```

🔹 **Este usuario solo tiene permisos sobre la base de datos `chat`**.  
🔹 **Puede:**
✅ Crear y modificar documentos en `chat` (ej. agregar mensajes, usuarios, etc.).  
 ✅ Leer datos de `chat`.  
🔹 **No puede:**
❌ Crear nuevas bases de datos.  
 ❌ Modificar usuarios o permisos.

---

### **📌 ¿Qué necesitan los alumnos para acceder a MongoDB?**

Si los alumnos quieren acceder a MongoDB desde sus equipos, tienen **tres opciones**:

---

### **1️⃣ Acceder a MongoDB con `mongo-express` (Interfaz web)**

En `docker-compose.yml`, ya tienes **Mongo Express** corriendo en el puerto `8081`:

```yaml
mongo-express:
  image: mongo-express
  container_name: chat-mongo-express
  ports:
    - "8081:8081"
  environment:
    ME_CONFIG_MONGODB_ADMINUSERNAME: root
    ME_CONFIG_MONGODB_ADMINPASSWORD: hlanz
    ME_CONFIG_MONGODB_URL: mongodb://root:hlanz@chat-mongodb:27017/
    ME_CONFIG_BASICAUTH_USERNAME: admin
    ME_CONFIG_BASICAUTH_PASSWORD: hlanz
```

### **💻 Cómo acceder desde el navegador:**

1. Los alumnos deben abrir `http://192.168.50.78:8081/` en su navegador.
2. Iniciar sesión con:
   - **Usuario:** `admin`
   - **Contraseña:** `hlanz`
3. Pueden navegar por la base de datos `chat`, ver colecciones y modificar datos.

⚠️ **Problema:** Estás usando el usuario `root` en `mongo-express`, lo que significa que pueden hacer **cualquier cosa** en MongoDB (incluso borrar todo).  
✔️ **Solución recomendada:** Cambiar la URL de conexión en `docker-compose.yml` para que `mongo-express` use `chatapp`:

```yaml
ME_CONFIG_MONGODB_URL: mongodb://chatapp:hlanz@chat-mongodb:27017/chat
```

Después de hacer esto, reinicia el contenedor:

```sh
docker-compose down
docker-compose up -d
```

Así, `mongo-express` solo tendrá acceso a la base de datos `chat`.

---

### **2️⃣ Acceder a MongoDB con MongoDB Compass (Aplicación de escritorio)**

Los alumnos pueden usar **MongoDB Compass**, una aplicación de escritorio para explorar bases de datos MongoDB.

### **💻 Cómo conectarse con MongoDB Compass**

1. Descargar e instalar [MongoDB Compass](https://www.mongodb.com/try/download/compass).
2. Abrir MongoDB Compass e ingresar la URI de conexión:
   ```
   mongodb://chatapp:hlanz@192.168.50.78:27017/chat
   ```
3. Hacer clic en **Conectar**.
4. Ahora pueden explorar las colecciones de `chat`, añadir usuarios y mensajes.

✔️ **Ventaja:** MongoDB Compass es más cómodo que `mongo-express` para administrar bases de datos grandes.

---

### **3️⃣ Acceder a MongoDB desde el backend en Node.js**

Si los alumnos están programando en Node.js, pueden conectarse a MongoDB con esta URI:

```js
const { MongoClient } = require("mongodb");

const uri = "mongodb://chatapp:hlanz@192.168.50.78:27017/chat";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");
    const db = client.db("chat");
    return db;
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
}

module.exports = connectDB;
```

✔️ **Ventaja:** Esto les permite manipular la base de datos desde su aplicación de chat sin depender de herramientas externas.

---

## **📌 🚀 Conclusión**

1️⃣ **¿Pueden los alumnos añadir más usuarios a `chat`?**  
✅ Sí, con el usuario `chatapp`, pueden añadir usuarios dentro de la base de datos `chat`.  
❌ No pueden crear nuevos usuarios administradores ni bases de datos.

2️⃣ **¿Cómo pueden acceder a MongoDB?**  
✔️ **Opción 1 (Web):** `http://192.168.50.78:8081/` usando `mongo-express`.  
✔️ **Opción 2 (Aplicación de escritorio):** Conectar con **MongoDB Compass** usando `mongodb://chatapp:hlanz@192.168.50.78:27017/chat`.  
✔️ **Opción 3 (Backend Node.js):** Conectar con `mongodb://chatapp:hlanz@192.168.50.78:27017/chat`.

3️⃣ **¿Pueden 20 alumnos acceder a la vez?**  
✅ Sí, MongoDB puede manejar muchas conexiones simultáneas sin problemas, **pero** si la máquina virtual se queda sin recursos (RAM o CPU), puede volverse lenta.

✔️ **Si quieres más seguridad, puedo ayudarte a restringir el acceso solo a ciertas IPs o configurar un usuario específico para cada alumno. 🚀**
