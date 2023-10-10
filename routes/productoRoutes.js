import Router from "express";
import expressFileupload from "express-fileupload";
import {
  crearProducto,
  listarProductosDestacados,
  listarProductos,
  consultarProducto,
} from "../controllers/productoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.use(
  expressFileupload({
    useTempFiles: true,
    tempFileDir: "./uploads/",
  })
);

router.post("/crear", crearProducto);

router.get("/listar", listarProductos);

router.get("/listar-destacados", listarProductosDestacados);

router.get("/:idProducto", consultarProducto);

export default router;
