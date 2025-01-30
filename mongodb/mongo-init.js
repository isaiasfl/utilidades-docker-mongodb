/*
db = db.getSiblingDB("admin");

db.createUser({
  user: "root",
  pwd: "hlanz",
  roles: [{ role: "root", db: "admin" }],
});
*/
db = db.getSiblingDB("chat");

// Crear usuario para la aplicación
db.createUser(
  {
    user: "chatapp",
    pwd: "hlanz",
    roles: [
      {
        role: "readWrite",
        db: "chat",
      },
    ],
  }
);

// Crear colecciones
db.createCollection("messages");
db.createCollection("users");

// Crear índices
db.messages.createIndex({ timestamp: -1 });
db.messages.createIndex({ userId: 1 });
db.users.createIndex({ username: 1 }, { unique: true });
