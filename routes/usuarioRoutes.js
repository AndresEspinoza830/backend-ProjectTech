import { Router } from "express";
import {
  registrarUsuario,
  confirmarCuentaRegistro,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

//Creacion del usuario
router.post("/registro", registrarUsuario);

//Confimracion de cuenta del usuario registrado
router.get("/confirmar/:token", confirmarCuentaRegistro);

//Recuperar Password, formulario con solo el cmapo email
router.post("/olvide-password", olvidePassword);

//Confirmar Token recuperaccion password
router.get("/recuperar-password/:token", comprobarToken);

router.post("/recuperar-password/:token", nuevoPassword);

//Login usuario
router.post("/login", autenticar);

router.get("/perfil", checkAuth, perfil);

export default router;
