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
import eventStripe from "./routes/eventStripe.js";

import conexionDB from "./config/db.js";

//Variable contiene toda la informacion de express
const app = express();

//Conexion base de datos
await conexionDB();

// Habilitar CORS
const whitelist = [
  // "http://localhost:5173",
  "https://profound-kitsune-bac623.netlify.app",
  "https://dashboard.stripe.com",
  "https://dashboard.stripe",
  // "htpp://localhost:8800",
];

const corsOptions = {
  // origin: function (origin, callback) {
  //   if (whitelist.includes(origin)) {
  //     callback(null, true);
  //     console.log(origin);
  //   } else {
  //     console.log(`Hubo un error en CORS: ${origin}`);

  //     callback(new Error("Error de CORS"));
  //   }
  // },
  origin: true,
  // methods: "POST",
  credentials: true,
};

app.use(cors(corsOptions));

//Habilitar Cookies
app.use(cookieParser());

//Habilitar json en express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./uploads"));

//Routing
app.use("/auth", usuarioRoutes);
app.use("/productos", productoRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/api", stripeRoutes);
app.use("/", eventStripe);

const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Escuchando servidor desde el puerto ${PORT}`);
});
