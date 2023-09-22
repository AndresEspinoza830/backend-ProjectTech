import express from "express";
import cors from "cors";
//Variables de entorno
import dotenv from "dotenv";
dotenv.config();

//Rutas
import usuarioRoutes from "./routes/usuarioRoutes.js";
import conexionDB from "./config/db.js";

//Variable contiene toda la informacion de express
const app = express();

//Conexion base de datos
await conexionDB();

//Habilitar CORS
const whiteList = ["http://localhost:5173"];
app.use(cors());

//Habilitar json en express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routing
app.use("/auth", usuarioRoutes);

const PORT = 5006;
app.listen(PORT, () => {
  console.log(`Escuchando servidor desde el puerto ${PORT}`);
});
