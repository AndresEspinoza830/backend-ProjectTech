import Router from "express";
import {
  crearProducto,
  listarProductosDestacados,
  listarProductos,
  crearCategoria,
  listarCategorias,
  consultarProducto,
} from "../controllers/productoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post("/crear", crearProducto);

router.get("/listar", verifyToken, listarProductos);

router.get("/listar-destacados", listarProductosDestacados);

router.get("/:idProducto", consultarProducto);

//Productos
router.post("/categoria", crearCategoria);
router.get("/categorias", listarCategorias);

//Listar Produtos destacados

export default router;
