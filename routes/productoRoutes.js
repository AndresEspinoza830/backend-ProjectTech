import Router from "express";
import expressFileupload from "express-fileupload";
import {
  crearProducto,
  listarProductosDestacados,
  listarProductos,
  consultarProducto,
  eliminarProducto,
  actualizarProducto,
  subirArchivos,
} from "../controllers/productoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post("/crear", subirArchivos, crearProducto);

router.get("/listar", listarProductos);

router.get("/listar-destacados", listarProductosDestacados);

router.get("/:idProducto", consultarProducto);

router.delete("/eliminar/:idProducto", eliminarProducto);

router.put("/editar/:idProducto", subirArchivos, actualizarProducto);

export default router;
