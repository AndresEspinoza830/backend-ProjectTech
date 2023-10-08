import { Router } from "express";
import {
  registrarUsuario,
  confirmarCuentaRegistro,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
} from "../controllers/usuarioController.js";
import { verifyToken } from "../middleware/verifyToken.js";

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

router.get("/user", verifyToken, (req, res) => {
  const { _id, username, email } = req.user;
  return res.status(200).json({ _id, username, email });
});

//Login usuario
router.post("/login", autenticar);

export default router;
