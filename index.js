import express from "express";
import cors from "cors";
//Variables de entorno
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";

//Rutas
import usuarioRoutes from "./routes/usuarioRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";

import conexionDB from "./config/db.js";

//Variable contiene toda la informacion de express
const app = express();

//Conexion base de datos
await conexionDB();

// Habilitar CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  // origin: function (origin, callback) {
  //   if (whitelist.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Error de CORS"));
  //   }
  // },
  credentials: true,
};

app.use(cors(corsOptions));

//Habilitar Cookies
app.use(cookieParser());

//Habilitar json en express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routing
app.use("/auth", usuarioRoutes);
app.use("/productos", productoRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/api", stripeRoutes);

const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Escuchando servidor desde el puerto ${PORT}`);
});
