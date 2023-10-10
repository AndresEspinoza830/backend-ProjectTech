import { Router } from "express";
import {
  crearCategoria,
  consultarCategoria,
  listarCategorias,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoriaController.js";

const router = Router();

router.post("/crear", crearCategoria);
router.get("/:idCategoria", consultarCategoria);
router.get("/listar", listarCategorias);
router.put("/editar/:idCategoria", actualizarCategoria);
router.delete("/eliminar/:idCategoria", eliminarCategoria);

export default router;
