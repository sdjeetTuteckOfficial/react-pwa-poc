// src/db.js
import Dexie from "dexie";

export const db = new Dexie("UserDataDB");
db.version(1).stores({
  users: "++id, name, surname, photo", // Auto-incremented ID and fields for name, surname, photo
});
