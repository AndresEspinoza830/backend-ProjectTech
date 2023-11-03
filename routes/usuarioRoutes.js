import { Router } from "express";
import {
  registrarUsuario,
  confirmarCuentaRegistro,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  mostrarProductosCliente,
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

//Login usuario
router.post("/login", autenticar);

router.get("/user", verifyToken, (req, res) => {
  const { id, username, email, productos } = req.user;
  return res.status(200).json({ id, username, email, productos });
});

router.get("/mis-productos/:idCliente", mostrarProductosCliente);

export default router;
