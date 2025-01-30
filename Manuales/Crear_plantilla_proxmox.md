### **📌 Cómo Crear una Plantilla de MongoDB en Proxmox con Docker**

Vas a crear una **máquina virtual (VM) en Proxmox** con Docker instalado y configurado para ejecutar MongoDB, Mongo Express y Nginx. Luego, la convertirás en una **plantilla** para que puedas desplegar nuevas instancias fácilmente.

---

## **1️⃣ Preparar la Máquina Virtual en Proxmox**

### **1.1 Crear una VM en Proxmox**

1. Accede a Proxmox y crea una nueva **Máquina Virtual (VM)**.
2. **Parámetros recomendados:**
   - **CPU:** 2 vCPU o más
   - **RAM:** 4 GB mínimo
   - **Disco:** 20 GB o más
   - **Red:** IP fija `192.168.50.78` (o asignada por DHCP)
   - **Sistema Operativo:** **Debian 12 o Ubuntu 22.04**

---

### **1.2 Instalar Docker en la VM**

En la terminal de la VM:

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
```

**Verifica que Docker funciona:**

```sh
docker --version
docker-compose --version
```

Si prefieres instalar Docker con su propio repositorio oficial:

```sh
curl -fsSL https://get.docker.com | sh
```

---

## **2️⃣ Subir los archivos de configuración a la VM**

Desde tu máquina local, usa `scp` para copiar la carpeta `docker-mongodb` a la VM:

```sh
scp -r docker-mongodb usuario@192.168.50.78:/home/usuario/
```

📌 **Reemplaza `usuario` por tu usuario en la VM.**

Luego, entra en la VM:

```sh
ssh usuario@192.168.50.78
```

Mueve la carpeta a `/opt`:

```sh
sudo mv /home/usuario/docker-mongodb /opt/
cd /opt/docker-mongodb
```

---

## **3️⃣ Configurar y Ejecutar MongoDB en Docker**

### **3.1 Crear y levantar los contenedores**

En `/opt/docker-mongodb`, ejecuta:

```sh
docker-compose up -d
```

Esto iniciará:
✅ **MongoDB en el puerto 27017**  
✅ **Mongo Express en el puerto 8081**  
✅ **Nginx en el puerto 80 (si lo configuras para frontend)**

Para verificar que MongoDB está corriendo:

```sh
docker ps
```

Si necesitas ver logs de MongoDB:

```sh
docker logs chat-mongodb
```

---

## **4️⃣ Convertir la VM en una Plantilla en Proxmox**

Cuando ya tengas Docker y MongoDB configurado, puedes convertir la VM en una **plantilla**.

1. **Apagar la VM** en Proxmox:
   ```sh
   shutdown -h now
   ```
2. **En Proxmox**, ve a la VM, selecciona **Convertir en plantilla**.
3. Ahora puedes **clonar** la plantilla para crear nuevas instancias rápidamente.

---

## **5️⃣ Permitir Acceso a MongoDB para los Alumnos**

Los alumnos podrán conectarse desde sus proyectos de **Node.js** o **MongoDB Compass**.

### **Conexión desde Node.js**

Los alumnos deben usar esta URI en su backend:

```js
const uri = "mongodb://chatapp:hlanz@192.168.50.78:27017/chat";
```

### **Conexión desde MongoDB Compass**

Deben ingresar la conexión:

```
mongodb://chatapp:hlanz@192.168.50.78:27017/chat
```

---

## **6️⃣ ¿Pueden 20 alumnos acceder a la vez?**

**Sí, pero debes considerar:**
✅ **Carga de la máquina virtual**: MongoDB maneja conexiones concurrentes, pero una VM con pocos recursos puede quedarse sin memoria.  
✅ **Uso de índices en MongoDB**: Ya tienes índices en `messages` y `users`, lo cual **mejora el rendimiento**.  
✅ **Aumentar RAM si es necesario**: Si la VM empieza a ralentizarse, asigna más RAM en Proxmox.

---

## **📌 Conclusión**

✔️ **Creaste una VM en Proxmox con Docker y MongoDB.**  
✔️ **Subiste los archivos y ejecutaste MongoDB en un contenedor.**  
✔️ **Convertiste la VM en una plantilla para clonar nuevas instancias.**  
✔️ **Tus alumnos podrán conectarse desde sus backends sin problemas.**

Si necesitas más escalabilidad, puedes **montar MongoDB en un servidor dedicado** o usar **MongoDB Atlas**. 🚀
